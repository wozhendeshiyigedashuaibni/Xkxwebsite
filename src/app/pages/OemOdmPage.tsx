import { useNavigation } from '@/hooks/useNavigation';

export function OemOdmPage() {
  const onNavigate = useNavigation();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl mb-6">Full-Service OEM & ODM Apparel Manufacturing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We help brands turn concepts into bulk-ready collections with stable quality control.
          </p>
        </div>
      </section>

      {/* OEM vs ODM */}
      <section id="services" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 border-2 border-gray-200 rounded-lg transition-colors hover:border-black">
              <h2 className="text-3xl mb-4">OEM</h2>
              <h3 className="mb-4">Original Equipment Manufacturing</h3>
              <p className="text-gray-600 mb-4">
                Produce based on your tech pack / sample
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>You provide complete tech pack</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>We source materials per your specs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Sample approval before bulk</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Quality control throughout production</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border-2 border-gray-200 rounded-lg transition-colors hover:border-black">
              <h2 className="text-3xl mb-4">ODM</h2>
              <h3 className="mb-4">Original Design Manufacturing</h3>
              <p className="text-gray-600 mb-4">
                Develop styles with our support (design + sourcing + sampling)
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>You provide concept/reference photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>We develop tech pack & patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Fabric & trim recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Sampling & fitting iterations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sampling */}
      <section id="sampling" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Sampling Capabilities</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl">
                  01
                </div>
              </div>
              <h3 className="mb-2">Proto Sample</h3>
              <p className="text-sm text-gray-600">
                Initial development sample to check construction & design
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl">
                  02
                </div>
              </div>
              <h3 className="mb-2">Fit Sample</h3>
              <p className="text-sm text-gray-600">
                Pattern refinement & grading verification
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto text-2xl">
                  03
                </div>
              </div>
              <h3 className="mb-2">Support Services</h3>
              <p className="text-sm text-gray-600">
                Pattern making, grading, fabric/trim suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MOQ & Lead Time */}
      <section id="moq" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">MOQ & Lead Time</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="mb-2">Minimum Order Quantity (MOQ)</h3>
              <p className="text-gray-600">
                From 100–300 pcs/style (depends on fabric & workmanship complexity)
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="mb-2">Sample Timeline</h3>
              <p className="text-gray-600">7–10 working days</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="mb-2">Bulk Production</h3>
              <p className="text-gray-600">25–35 days after sample approval</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Factors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Pricing Factors</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-gray-600 mb-8">
              Price depends on multiple factors. We provide detailed quotes after reviewing your
              requirements.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Fabric type & cost',
                'Workmanship complexity',
                'Order quantity',
                'Printing/Embroidery',
                'Trims & accessories',
                'Packaging requirements',
                'Sizing range',
                'Delivery terms',
              ].map((factor, index) => (
                <div key={index} className="p-4 bg-white rounded-lg text-center text-sm">
                  {factor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cooperation Process */}
      <section id="process" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Cooperation Process</h2>
          <div className="max-w-5xl mx-auto">
            <div className="space-y-4">
              {[
                { step: 'Inquiry', description: 'Share your requirements or reference photos' },
                {
                  step: 'Design Review',
                  description: 'We analyze tech pack/samples and provide feedback',
                },
                { step: 'Sampling', description: 'Proto & fit samples with iterations if needed' },
                {
                  step: 'Approval',
                  description: 'Final sample approval & bulk production planning',
                },
                {
                  step: 'Production',
                  description: 'Pre-production sample + inline QC during bulk',
                },
                { step: 'QC', description: 'Final inspection before packing' },
                { step: 'Packing', description: 'Custom labels, hangtags, carton packing' },
                { step: 'Shipment', description: 'Delivery support & documentation' },
              ].map((process, index) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1">{process.step}</h3>
                    <p className="text-sm text-gray-600">{process.description}</p>
                  </div>
                  {index < 7 && <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Tools */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Resources & Templates</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white rounded-lg text-center">
              <Download className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-2">Tech Pack Template</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download our standardized tech pack template to ensure clear communication
              </p>
              <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                Download Template
              </button>
              <p className="text-xs text-gray-500 mt-2">Email required</p>
            </div>
            <div className="p-8 bg-white rounded-lg text-center">
              <Download className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-2">Lookbook</h3>
              <p className="text-sm text-gray-600 mb-4">
                View our manufacturing capabilities and representative styles
              </p>
              <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
                Download Lookbook
              </button>
              <p className="text-xs text-gray-500 mt-2">Email required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl mb-6">Ready to Start Your OEM/ODM Project?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Send your tech pack or reference photos. We'll respond within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              Get a Quote
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3 border border-white rounded-md hover:bg-white hover:text-black transition-colors"
            >
              Ask MOQ
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3 border border-white rounded-md hover:bg-white hover:text-black transition-colors"
            >
              Send Reference Photo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}