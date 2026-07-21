import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

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

export const Route = createFileRoute("/")({
  loader: () => getBusinessName(),
  component: Home,
});

const STRIPE = {
  starterSetup: "https://buy.stripe.com/28E8wP7uNbx62p74QG8EM0a",
  starterMonthly: "https://buy.stripe.com/3cI8wP16p58I1l3gzo8EM0c",
  proSetup: "https://buy.stripe.com/fZufZh4iB44E6Fnbf48EM0b",
  proMonthly: "https://buy.stripe.com/eVq7sL2atbx69Rz5UK8EM0d",
} as const;

const DEMO_SITES = [
  { slug: "pike-place-barbers", name: "Pike Place Barbers", category: "Barber Shop" },
  { slug: "pure-green-landscaping", name: "Pure Green Landscaping", category: "Landscaping" },
  { slug: "rocky-mountain-roofing", name: "Rocky Mountain Roofing", category: "Roofing" },
  { slug: "south-beach-nails", name: "South Beach Nails", category: "Nail Salon" },
  { slug: "summit-fitness-studio", name: "Summit Fitness Studio", category: "Fitness" },
  { slug: "preston-royal-cleaners", name: "Preston Royal Cleaners", category: "Dry Cleaning" },
];

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <div className="min-h-dvh">
      {/* ─── Hero ─── */}
      <section className="relative isolate overflow-hidden bg-white px-6 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.08), transparent), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(139,92,246,0.05), transparent)",
          }}
        />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            <span className="text-sm font-medium text-indigo-700">Done-For-You Websites</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            A professional website
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              without lifting a finger.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
            {businessName} builds stunning, mobile-ready websites for local businesses — while you stay focused
            on your customers. One flat fee, then a simple monthly subscription. No freelancer headaches, no DIY tools.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={STRIPE.starterSetup}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started — $299 Setup
              <ArrowRightIcon />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
            >
              See Plans &amp; Pricing
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">No hidden fees. Cancel anytime.</p>
        </div>
      </section>

      {/* ─── How We Help Your Business ─── */}
      <section className="border-t border-gray-100 bg-gray-50/50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How We Help Your Business</h2>
            <p className="mt-4 text-lg text-gray-500">A complete online presence — designed, built, and maintained for you.</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: SearchIcon, title: "1. We Design for You", desc: "Tell us about your business and we craft a modern, on-brand site that looks like it cost thousands — no design skills needed." },
              { icon: BuildIcon, title: "2. We Launch Fast", desc: "Our platform builds your mobile-ready, SEO-optimized site in days — not weeks. You review, we refine, then it goes live." },
              { icon: RefreshIcon, title: "3. We Keep It Fresh", desc: "Hosting, security, updates, and maintenance are all included. Your site evolves while you run your business." },
            ].map((step, i) => (
              <div key={i} className="group relative rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <step.icon />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recent Work ─── */}
      <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Recent Work</h2>
            <p className="mt-4 text-lg text-gray-500">Live demo sites we've built for businesses like yours.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_SITES.map((demo) => (
              <a
                key={demo.slug}
                href={`/demos/${demo.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <GlobeIcon />
                    </div>
                    <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{demo.name}</p>
                    <p className="mt-1 text-sm text-gray-400">{demo.category}</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/0 transition-all group-hover:bg-indigo-600/10">
                  <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-indigo-700 opacity-0 shadow transition-all group-hover:opacity-100">
                    View Demo →
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://2e6e588e181dcca99948db7f5e867ea0.ctonew.app/demos/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all demo sites
              <ArrowRightIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="border-t border-gray-100 bg-gray-50/50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-500">One-time setup fee. Flat monthly subscription. No surprises.</p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Starter */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                <p className="mt-2 text-gray-500">Perfect for getting online quickly.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">$99</span>
                  <span className="ml-1 text-lg text-gray-500">/mo</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">+ $299 one-time setup</p>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {["Landing page or simple multi-page site", "Mobile-ready & responsive", "Contact form", "Basic SEO"].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 space-y-3">
                <a href={STRIPE.starterSetup} className="block rounded-xl bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5">
                  Pay Setup — $299
                </a>
                <a href={STRIPE.starterMonthly} className="block rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50">
                  Subscribe Monthly — $99/mo
                </a>
              </div>
            </div>
            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">Most Popular</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <p className="mt-2 text-gray-500">For businesses that want more reach.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">$199</span>
                  <span className="ml-1 text-lg text-gray-500">/mo</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">+ $299 one-time setup</p>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                {["Everything in Starter", "Multi-page site with blog", "Booking / quote integration", "Advanced SEO"].map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 space-y-3">
                <a href={STRIPE.proSetup} className="block rounded-xl bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5">
                  Pay Setup — $299
                </a>
                <a href={STRIPE.proMonthly} className="block rounded-xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50">
                  Subscribe Monthly — $199/mo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Us ─── */}
      <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Why {businessName}?</h2>
          <p className="mt-4 text-lg text-gray-500">We beat hiring a freelancer on price, quality, and speed — with zero effort on your part.</p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: "$", title: "Better Price", desc: "A freelancer costs $3,000–$10,000 upfront. We start at $99/mo with a fraction of the setup cost." },
              { icon: "★", title: "Better Quality", desc: "Modern designs, mobile-first, SEO-optimized — built with the latest tools and maintained continuously." },
              { icon: "⚡", title: "Faster Delivery", desc: "Freelancers take weeks. We deliver a live, polished site in days — no back-and-forth, no delays." },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-indigo-50/60 p-8 transition-all hover:bg-indigo-50">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Ready to Get Online? ─── */}
      <section className="border-t border-gray-100 bg-gray-900 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to Get Online?</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            Your customers are searching for you right now. Give them a website that makes you proud — built and maintained
            by {businessName}. Choose your plan and get started in under two minutes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href={STRIPE.starterSetup} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-indigo-400 hover:shadow-lg hover:-translate-y-0.5">
              Starter — $299 Setup <ArrowRightIcon />
            </a>
            <a href={STRIPE.proSetup} className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-md transition-all hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5">
              Pro — $299 Setup <ArrowRightIcon />
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Questions?{" "}
            <a href="mailto:hello@sitepilot.dev" className="underline hover:text-gray-300 transition-colors">Email us</a>{" "}
            — we respond within hours.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-800 bg-gray-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
          <p className="text-sm text-gray-500">
            Built with{" "}
            <a href="https://cto.new" className="underline hover:text-gray-300 transition-colors">cto.new</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Inline Icons ─── */

function ArrowRightIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 15.75l1.5 1.5-1.5 1.5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
