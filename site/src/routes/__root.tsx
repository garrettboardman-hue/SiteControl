import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "DockFlow — AI Agents for Logistics Document Processing",
      },
      {
        name: "description",
        content:
          "DockFlow builds specialized AI agents that autonomously process logistics documents — bills of lading, customs declarations, and more. From 15–45 minutes to under 2 minutes per shipment.",
      },
      { name: "theme-color", content: "#0f172a" },
      { property: "og:title", content: "DockFlow — AI Agents for Logistics Document Processing" },
      {
        property: "og:description",
        content:
          "Autonomous AI agents that process logistics documents in under 2 minutes. Eliminate customs errors, demurrage fees, and manual data entry.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231e3a5f'/><text x='16' y='23' text-anchor='middle' font-size='20' font-weight='bold' fill='%2360a5fa'>D</text></svg>",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <p className="text-navy-600">Page not found</p>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}