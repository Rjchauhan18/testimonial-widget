import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Testimonial Widget</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Collect Beautiful Testimonials
          <span className="text-blue-600"> on Autopilot</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The simplest way to collect video and text testimonials from your customers.
          Embed them on your website with one line of code.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Collecting Testimonials
          </Link>
          <Link
            href="/demo"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📹"
            title="Video & Text"
            description="Collect both video and text testimonials with our simple form."
          />
          <FeatureCard
            icon="🎨"
            title="Customizable Widgets"
            description="Display testimonials in grid, carousel, masonry, or wall layouts."
          />
          <FeatureCard
            icon="⚡"
            title="One-Line Embed"
            description="Add testimonials to any website with a single line of code."
          />
          <FeatureCard
            icon="🔗"
            title="Shareable Links"
            description="Send customers a link to submit their testimonial."
          />
          <FeatureCard
            icon="✅"
            title="Moderation"
            description="Review and approve testimonials before they go live."
          />
          <FeatureCard
            icon="📊"
            title="Analytics"
            description="Track views and engagement on your testimonials."
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              features={[
                '10 testimonials/month',
                'Basic widgets',
                'Email support',
              ]}
              cta="Get Started"
              href="/signup"
            />
            <PricingCard
              name="Pro"
              price="$19"
              period="/month"
              features={[
                'Unlimited testimonials',
                'All widget types',
                'Custom branding',
                'Priority support',
              ]}
              cta="Start Free Trial"
              href="/signup?plan=pro"
              popular
            />
            <PricingCard
              name="Business"
              price="$49"
              period="/month"
              features={[
                'Everything in Pro',
                'Multiple users',
                'API access',
                'Dedicated support',
              ]}
              cta="Contact Sales"
              href="/signup?plan=business"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Built with ❤️ using Next.js, Supabase, and Cloudinary
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period = '',
  features,
  cta,
  href,
  popular = false,
}: {
  name: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-8 ${
        popular
          ? 'bg-blue-600 text-white ring-4 ring-blue-200'
          : 'bg-white text-gray-900 border border-gray-200'
      }`}
    >
      <h4 className="text-2xl font-bold mb-2">{name}</h4>
      <div className="mb-6">
        <span className="text-5xl font-bold">{price}</span>
        {period && <span className="text-gray-500">{period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block text-center py-3 px-6 rounded-lg font-bold ${
          popular
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
