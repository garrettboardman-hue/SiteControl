import crypto from "crypto";
import { db } from "../db/connection";
import { webhooks } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Webhook event types.
 */
export type WebhookEvent =
  | "document.processed"
  | "document.failed"
  | "document.flagged"
  | "extraction.verified"
  | "validation.resolved";

/**
 * Webhook payload sent to registered endpoints.
 */
export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  organizationId: string;
  data: Record<string, unknown>;
}

/**
 * Notify registered webhooks about document processing events.
 */
export async function notifyWebhooks(
  organizationId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const hooks = db
      .select()
      .from(webhooks)
      .where(eq(webhooks.organizationId, organizationId))
      .all();

    const activeHooks = hooks.filter((h) => h.isActive);

    const eventStr = event;
    const matchingHooks = activeHooks.filter((h) => {
      const events: string[] = JSON.parse(h.events);
      return events.includes("*") || events.includes(eventStr);
    });

    if (matchingHooks.length === 0) return;

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      organizationId,
      data,
    };

    const payloadStr = JSON.stringify(payload);

    for (const hook of matchingHooks) {
      const signature = crypto
        .createHmac("sha256", hook.secret)
        .update(payloadStr)
        .digest("hex");

      // Fire and forget — don't block the pipeline on webhook delivery
      sendWebhook(hook.url, payloadStr, signature).catch((err) => {
        console.error(`Webhook delivery failed for ${hook.id}:`, err.message);
      });

      // Update last triggered timestamp
      db.update(webhooks)
        .set({ lastTriggeredAt: new Date().toISOString() })
        .where(eq(webhooks.id, hook.id))
        .run();
    }
  } catch (err) {
    console.error("Webhook notification error:", err);
  }
}

async function sendWebhook(
  url: string,
  payload: string,
  signature: string
): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-DockFlow-Signature": signature,
      "X-DockFlow-Event": JSON.parse(payload).event,
    },
    body: payload,
  });

  if (!response.ok) {
    throw new Error(
      `Webhook returned ${response.status}: ${response.statusText}`
    );
  }
}