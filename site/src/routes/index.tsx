import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

// ─── Components ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-navy-200/30 bg-white/80 shadow-xs shadow-navy-900/5 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
              <path d="M12 12v4" />
              <path d="M8 12v4" />
              <path d="M16 12v4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-navy-900">
            DockFlow
          </span>
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          <a href="#how-it-works" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900">
            Features
          </a>
          <a href="#pricing" className="text-sm font-medium text-navy-600 transition-colors hover:text-navy-900">
            Pricing
          </a>
          <a
            href="#cta"
            className="rounded-lg bg-ship-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-ship-700 hover:shadow-md active:scale-[0.97]"
          >
            Get early access
          </a>
        </div>
        {/* Mobile menu button */}
        <a
          href="#cta"
          className="rounded-lg bg-ship-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-ship-700 sm:hidden"
        >
          Get early access
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-ship-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-navy-100/50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ship-50/40 blur-3xl" />
        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e3a5f" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-navy-200/50 bg-navy-50/80 px-4 py-1.5 text-sm font-medium text-navy-700 shadow-xs backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            AI-powered logistics document processing
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="gradient-heading">
              From 15–45 minutes to{" "}
              <span className="text-navy-900">under 2 minutes</span> per shipment
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-600 sm:text-xl">
            DockFlow's AI agents autonomously extract, validate, and push logistics
            document data into your TMS or ERP. Eliminate customs fines, demurrage
            fees, and manual rework.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#cta"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-navy-900/20 transition-all duration-200 hover:bg-navy-800 hover:shadow-xl hover:shadow-navy-900/25 active:scale-[0.97] sm:w-auto"
            >
              Request early access
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-navy-300 bg-white px-8 py-4 text-base font-semibold text-navy-700 shadow-xs transition-all duration-200 hover:bg-navy-50 hover:shadow-md active:scale-[0.97] sm:w-auto"
            >
              See how it works
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 14l-7 7-7-7M19 5l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col items-center gap-6 border-t border-navy-100 pt-10">
            <p className="text-sm font-medium uppercase tracking-widest text-navy-400">
              Trusted by logistics teams processing
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-navy-900">500+</p>
                <p className="text-sm text-navy-500">shipments/month</p>
              </div>
              <div className="h-10 w-px bg-navy-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-navy-900">95%+</p>
                <p className="text-sm text-navy-500">accuracy rate</p>
              </div>
              <div className="h-10 w-px bg-navy-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-navy-900">$50–$200+</p>
                <p className="text-sm text-navy-500">saved per error</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LogosSection() {
  return (
    <section className="border-y border-navy-100 bg-navy-50/50 py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-navy-400">
          Process documents from every major logistics platform
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50 grayscale">
          {/* SVG logos representing logistics/document types */}
          <div className="flex items-center gap-2 text-navy-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6M9 16h6M9 8h6M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
            <span className="text-lg font-semibold">Bills of Lading</span>
          </div>
          <div className="flex items-center gap-2 text-navy-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6M9 16h6M9 8h6M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
            <span className="text-lg font-semibold">Customs Declarations</span>
          </div>
          <div className="flex items-center gap-2 text-navy-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6M9 16h6M9 8h6M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
            <span className="text-lg font-semibold">Commercial Invoices</span>
          </div>
          <div className="flex items-center gap-2 text-navy-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6M9 16h6M9 8h6M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
            </svg>
            <span className="text-lg font-semibold">Certificates of Origin</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload or forward documents",
      description:
        "Your team emails PDFs, uploads scans, or forwards documents from your TMS. DockFlow ingests them instantly — no new workflows to learn.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "AI agents extract & validate",
      description:
        "Our agents parse unstructured data, validate against trade regulations and HS codes, and flag any discrepancies for human review.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Review flagged items only",
      description:
        "The agent handles 95%+ of documents autonomously. Only discrepancies and edge cases get routed to your team — cutting review time to minutes.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Clean data pushed to your systems",
      description:
        "Validated data flows directly into your TMS, ERP, or customs filing system — no manual entry, no double-handling, no errors.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ship-600">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Your existing workflow,{" "}
            <span className="text-ship-600">supercharged by AI</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            No new tools to learn. No complex migrations. Just dramatically faster
            document processing.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute top-1/2 left-0 right-0 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-navy-300 to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white shadow-lg shadow-navy-900/15">
                  {step.icon}
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-ship-600">
                  Step {step.number}
                </p>
                <h3 className="mt-2 text-lg font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Multi-document support",
      description:
        "Process bills of lading, customs declarations, commercial invoices, certificates of origin, and more — all from a single ingestion point.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      title: "HS code validation",
      description:
        "Automatically validate HS codes against trade regulations. Flag mismatches before they become costly customs holds or fines.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: "Discrepancy flagging",
      description:
        "The agent intelligently flags inconsistencies — mismatched weights, incorrect values, missing fields — and routes them for human review.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: "Human-in-the-loop review",
      description:
        "Only flagged items need your attention. Review discrepancies in a clean UI, approve or correct, and the agent learns from your feedback.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      title: "TMS & ERP integration",
      description:
        "Push clean data directly into your existing systems. Native integrations with major TMS and ERP platforms, plus a REST API for custom setups.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
      ),
    },
    {
      title: "Compliance reporting",
      description:
        "Generate audit-ready compliance reports for every shipment. Full traceability from original document through extraction to final filing.",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="bg-navy-50/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ship-600">
            Features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Everything you need to eliminate{" "}
            <span className="text-ship-600">manual document processing</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            A complete platform for logistics document automation — from ingestion to
            compliance.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ship-50 text-ship-700">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "93%", label: "faster document processing", sub: "15-45 min → under 2 min" },
    { value: "95%+", label: "extraction accuracy", sub: "Validated against ground truth" },
    { value: "$50-200+", label: "saved per error avoided", sub: "Customs fines, demurrage, rework" },
    { value: "99.9%", label: "data integrity", sub: "End-to-end validation" },
  ];

  return (
    <section className="gradient-bg py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The numbers speak for themselves
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            Mid-market freight forwarders and customs brokers cut costs and errors
            dramatically with DockFlow.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <p className="text-4xl font-extrabold text-white sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-base font-semibold text-blue-200">{stat.label}</p>
              <p className="mt-1 text-sm text-blue-300/70">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$499",
      period: "/mo",
      description: "For teams processing up to 500 shipments per month.",
      shipments: "Up to 500 shipments/mo",
      features: [
        "All standard document types",
        "AI extraction & validation",
        "HS code validation",
        "Discrepancy flagging",
        "Human-in-the-loop review",
        "Email & chat support",
      ],
      cta: "Start free trial",
      popular: false,
    },
    {
      name: "Growth",
      price: "$999",
      period: "/mo",
      description: "For growing teams processing up to 2,000 shipments per month.",
      shipments: "Up to 2,000 shipments/mo",
      features: [
        "Everything in Starter",
        "Custom document types",
        "TMS/ERP integration",
        "Compliance reporting",
        "Priority support",
        "API access",
      ],
      cta: "Start free trial",
      popular: true,
    },
    {
      name: "Scale",
      price: "$1,999+",
      period: "/mo",
      description: "For high-volume operations processing 5,000+ shipments per month.",
      shipments: "5,000+ shipments/mo",
      features: [
        "Everything in Growth",
        "Unlimited document types",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "24/7 phone & email support",
        "On-premise deployment option",
      ],
      cta: "Contact sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-ship-600">
            Pricing
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Transparent pricing,{" "}
            <span className="text-ship-600">predictable costs</span>
          </h2>
          <p className="mt-4 text-lg text-navy-600">
            Tiered plans that scale with your shipment volume. Annual contracts save
            15%.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-ship-500 bg-white shadow-ship-900/10 hover:shadow-ship-900/20"
                  : "border-navy-100 bg-white hover:border-navy-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-ship-600 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
                    Most popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-bold text-navy-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-navy-500">{plan.shipments}</p>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-navy-900">{plan.price}</span>
                  <span className="text-sm font-medium text-navy-500">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-navy-500">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-navy-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`mt-8 flex w-full items-center justify-center rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                  plan.popular
                    ? "bg-navy-900 text-white shadow-md shadow-navy-900/20 hover:bg-navy-800 hover:shadow-lg"
                    : "border border-navy-300 bg-white text-navy-700 hover:bg-navy-50 hover:shadow-md"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-navy-500">
          All plans include a one-time onboarding fee of $2,500 for custom document types
          and system integration setup.{" "}
          <span className="font-semibold text-navy-700">
            Save 15% with annual billing.
          </span>
        </p>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section id="cta" className="gradient-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to cut document processing time{" "}
            <span className="text-blue-300">by 93%?</span>
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            Join the waitlist for early access. We'll onboard the first 50 customers
            personally — with dedicated setup and priority support.
          </p>

          <div className="mx-auto mt-10 max-w-lg">
            <form
              className="flex flex-col gap-4 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-blue-300/60 shadow-inner backdrop-blur-sm focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-navy-900 shadow-lg shadow-navy-900/20 transition-all duration-200 hover:bg-blue-50 hover:shadow-xl active:scale-[0.97]"
              >
                Get early access
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            <p className="mt-3 text-xs text-blue-300/60">
              No spam. We'll only send updates about your early access status.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-navy-50/50 py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7h18" />
                <path d="M12 12v4" />
                <path d="M8 12v4" />
                <path d="M16 12v4" />
              </svg>
            </div>
            <span className="text-lg font-bold text-navy-900">DockFlow</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-navy-500 transition-colors hover:text-navy-700">
              How it works
            </a>
            <a href="#features" className="text-sm text-navy-500 transition-colors hover:text-navy-700">
              Features
            </a>
            <a href="#pricing" className="text-sm text-navy-500 transition-colors hover:text-navy-700">
              Pricing
            </a>
            <a href="#cta" className="text-sm text-navy-500 transition-colors hover:text-navy-700">
              Contact
            </a>
          </div>

          <p className="text-sm text-navy-400">
            &copy; {new Date().getFullYear()} DockFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────────

function Home() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main>
        <HeroSection />
        <LogosSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}