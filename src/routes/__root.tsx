import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "SitePilot";
  } catch {
    return "SitePilot";
  }
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SitePilot — We Build Your Website. You Run Your Business." },
      {
        name: "description",
        content:
          "Done-for-you websites for businesses that have no online presence. We build, you run your business.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => <div>Page not found</div>,
  loader: () => getBusinessName(),
  component: RootComponent,
});

function RootComponent() {
  const businessName = Route.useLoaderData();
  return (
    <RootDocument businessName={businessName}>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
  businessName,
}: {
  children: ReactNode;
  businessName: string;
}) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
