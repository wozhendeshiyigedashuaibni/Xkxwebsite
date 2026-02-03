interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl mb-6">The Manufacturing Team Behind Reliable Collections</h1>
        </div>
      </section>

      {/* Opening Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-2xl mb-8">
              We built this factory on one belief:{' '}
              <strong>manufacturing should be driven by responsibility, not promises.</strong>
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our team has worked closely with brand buyers and production timelines, and we
              understand how quality and delivery affect a brand's season.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Our Operating Principles</h2>
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl mb-3">
                Realistic timelines over optimistic promises
              </h3>
              <p className="text-gray-600">
                We give you accurate lead times based on our actual capacity and workload. If
                there's a delay, you'll know immediately — not on delivery day.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl mb-3">Consistent quality over fast shortcuts</h3>
              <p className="text-gray-600">
                We don't skip QC checkpoints to save a day. Quality is built into the process, not
                inspected in at the end.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-2xl mb-3">Clear communication over vague updates</h3>
              <p className="text-gray-600">
                No "everything is fine" when it's not. You get real updates with specific
                information you can act on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Implementation */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-6">How We Implement These Principles</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Philosophy means nothing without execution. Here's how we turn values into practice.
          </p>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="mb-3">In-house Sampling Team</h3>
              <p className="text-sm text-gray-600">
                Pattern makers and sample sewers work directly with your tech packs and feedback.
                No outsourcing = no communication gaps.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="mb-3">Production Managers Tracking Each Order</h3>
              <p className="text-sm text-gray-600">
                Each order has a designated production manager who monitors progress, coordinates
                between departments, and reports to you.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="mb-3">Quality Checkpoints from Fabric to Packing</h3>
              <p className="text-sm text-gray-600">
                IQC, IPQC, FQC, OQC — four checkpoints where we catch and fix issues before they
                become bulk problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Focus */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">What We Focus On</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="mb-1">Women's Apparel Manufacturing</h3>
                <p className="text-gray-600">
                  Dresses, sets, skirts, hoodies, tees, and bottoms. We don't try to be everything
                  to everyone.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="mb-1">Brand Partnerships, Not One-Time Orders</h3>
                <p className="text-gray-600">
                  We invest time in understanding your fit standards, quality expectations, and
                  brand positioning.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="mb-1">Small to Medium Production Runs</h3>
                <p className="text-gray-600">
                  MOQ from 100–300 pcs per style. We work with growing brands, not mass-market
                  retailers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="mb-1">Export Experience</h3>
                <p className="text-gray-600">
                  North America and Europe are our main markets. We understand export documentation
                  and shipping coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Background */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl mb-8 text-center">Our Background</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Our core team has over 15 years of experience in garment manufacturing, working
                with both domestic and international brands.
              </p>
              <p>
                We've seen what works and what doesn't. We know the difference between a factory
                that promises everything and a factory that delivers consistently.
              </p>
              <p>
                That's why we focus on clear processes, realistic timelines, and building
                relationships based on trust and performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl mb-6">We Prefer Steady, Long-Term Partnerships.</h2>
            <p className="text-xl text-gray-600 mb-10">
              Because consistency is the most valuable thing in production.
            </p>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Start a Conversation
            </button>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">To Be Clear: What We Don't Do</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
            <p>
              ✗ <strong>Retail or personal customization</strong> — We work with brands and bulk
              orders only.
            </p>
            <p>
              ✗ <strong>Promise unrealistic timelines</strong> — If we say 30 days, we mean 30
              days. We don't say 20 to win the order.
            </p>
            <p>
              ✗ <strong>Accept unclear requirements</strong> — We need proper tech packs or
              detailed references. "Make it similar to this photo" without specs leads to
              misunderstandings.
            </p>
            <p>
              ✗ <strong>Skip QC to save costs</strong> — Quality control is non-negotiable. It's
              built into our process.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
