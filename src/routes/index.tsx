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

function Home() {
  const businessName = Route.useLoaderData();

  return (
    <div className="min-h-dvh">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-6 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            Done-For-You Websites
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            We Build Your Website.
            <br />
            <span className="text-indigo-200">You Run Your Business.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-indigo-100 sm:text-xl">
            {businessName} creates stunning, professional websites for
            businesses that don't have an online presence — so you can stay
            focused on what you do best.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl"
            >
              Get Your Free Demo Site
              <ArrowRightIcon />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              See Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Three simple steps to your new website — you do nothing.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <SearchIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                1. We Find Leads
              </h3>
              <p className="mt-3 leading-relaxed text-gray-500">
                We identify businesses like yours that need a professional
                online presence — no effort required from you.
              </p>
            </div>
            {/* Step 2 */}
            <div className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <BuildIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                2. We Build a Custom Site
              </h3>
              <p className="mt-3 leading-relaxed text-gray-500">
                Our AI-powered platform crafts a mobile-ready, SEO-optimized
                website tailored to your business — fast.
              </p>
            </div>
            {/* Step 3 */}
            <div className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <RefreshIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                3. We Keep It Running
              </h3>
              <p className="mt-3 leading-relaxed text-gray-500">
                Hosting, updates, and maintenance are all included. Your site
                stays fresh while you focus on your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="bg-gray-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              One-time setup fee. Flat monthly subscription. No surprises.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {/* Starter */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                <p className="mt-2 text-gray-500">
                  Perfect for getting online quickly.
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">
                    $99
                  </span>
                  <span className="ml-1 text-lg text-gray-500">/mo</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  + $299 one-time setup
                </p>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">
                    Landing page or simple multi-page site
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">Mobile-ready & responsive</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">Contact form</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">Basic SEO</span>
                </li>
              </ul>
              <a
                href="#cta"
                className="mt-8 block rounded-xl bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-indigo-700"
              >
                Get Started
              </a>
            </div>
            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                Most Popular
              </span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <p className="mt-2 text-gray-500">
                  For businesses that want more reach.
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">
                    $199
                  </span>
                  <span className="ml-1 text-lg text-gray-500">/mo</span>
                </div>
                <p className="mt-1 text-sm text-gray-400">
                  + $299 one-time setup
                </p>
              </div>
              <ul className="mt-8 flex-1 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">
                    Everything in Starter
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">Multi-page site with blog</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">
                    Booking / quote integration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 shrink-0 text-indigo-500" />
                  <span className="text-gray-600">Advanced SEO</span>
                </li>
              </ul>
              <a
                href="#cta"
                className="mt-8 block rounded-xl bg-indigo-600 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-indigo-700"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Us ─── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why {businessName}?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We beat hiring a freelancer on price, quality, and speed — with
            zero effort on your part.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-2xl bg-indigo-50 p-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">
                $
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Better Price
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                A freelancer costs $3,000–$10,000 upfront. We start at
                $99/mo with a fraction of the setup cost.
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">
                ★
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Better Quality
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Modern designs, mobile-first, SEO-optimized — built with the
                latest tools and maintained continuously.
              </p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Faster Delivery
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Freelancers take weeks. We deliver a live, polished site in
                days — no back-and-forth, no delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        id="cta"
        className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 px-6 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Get Your Free Demo Site
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            See what {businessName} can build for your business — completely
            free, no commitment. Enter your email and we'll send you a custom
            demo within 24 hours.
          </p>
          <form
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const email = (
                form.elements.namedItem("email") as HTMLInputElement
              ).value;
              if (email) {
                window.location.href = `mailto:hello@sitepilot.dev?subject=Demo%20Site%20Request&body=Please%20send%20me%20a%20free%20demo%20site.%0A%0AEmail:%20${encodeURIComponent(email)}`;
              }
            }}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@yourbusiness.com"
              className="min-w-0 flex-1 rounded-xl border-0 bg-white/15 px-5 py-3.5 text-base text-white placeholder:text-indigo-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl"
            >
              Send Me a Demo
              <ArrowRightIcon />
            </button>
          </form>
          <p className="mt-4 text-sm text-indigo-200">
            No spam. No credit card. Just a free demo site.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {businessName}. All rights
            reserved.
          </p>
          <p className="text-sm text-gray-400">
            Built with{" "}
            <a
              href="https://cto.new"
              className="underline hover:text-gray-600"
            >
              cto.new
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Inline Icons ─── */

function ArrowRightIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 15.75l1.5 1.5-1.5 1.5"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}
