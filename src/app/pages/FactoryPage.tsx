import { useNavigation } from '@/hooks/useNavigation';
import { Factory, Package, Layers, ClipboardCheck, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export function FactoryPage() {
  const onNavigate = useNavigation();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl mb-6">Factory & Quality Control</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modern manufacturing facilities with systematic quality control at every checkpoint.
          </p>
        </div>
      </section>

      {/* Factory Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Factory Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <Factory className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-2">Production Lines</h3>
              <p className="text-gray-600">
                Multiple dedicated lines for different categories
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-2">Monthly Capacity</h3>
              <p className="text-gray-600">50,000+ pieces across all categories</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <Layers className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-2">Main Categories</h3>
              <p className="text-gray-600">
                Women's dresses, sets, skirts, hoodies, tees & bottoms
              </p>
            </div>
          </div>

          <div className="aspect-video max-w-5xl mx-auto overflow-hidden rounded-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758269445774-61a540a290a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHByb2R1Y3Rpb24lMjBsaW5lfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Production facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quality Control System */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-6">Quality Control System</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We use checkpoint-based quality control, not just final inspection. Quality is built
            into the process.
          </p>

          <div className="max-w-5xl mx-auto space-y-8">
            {[
              {
                title: 'Fabric Inspection (IQC)',
                subtitle: 'Incoming Quality Control',
                points: [
                  'Color matching verification',
                  'Width, weight & composition check',
                  'Surface defect inspection',
                  'Shrinkage testing if required',
                ],
              },
              {
                title: 'Inline Inspection (IPQC)',
                subtitle: 'In-Process Quality Control',
                points: [
                  'Measurement check during sewing',
                  'Stitching quality verification',
                  'Component alignment check',
                  'Random inspection by supervisors',
                ],
              },
              {
                title: 'Final Inspection (FQC)',
                subtitle: 'Final Quality Control',
                points: [
                  'Complete measurement verification',
                  'Thread trimming & cleaning',
                  'Stain & defect check',
                  'Accessories & labeling verification',
                ],
              },
              {
                title: 'Packing Check (OQC)',
                subtitle: 'Outgoing Quality Control',
                points: [
                  'Poly bag & hangtag attachment',
                  'Folding & presentation check',
                  'Carton count verification',
                  'Shipping mark accuracy',
                ],
              },
            ].map((qc, index) => (
              <div key={index} className="bg-white p-8 rounded-lg">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl mb-1">{qc.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{qc.subtitle}</p>
                    <ul className="space-y-2">
                      {qc.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-2 text-gray-600">
                          <ClipboardCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-gray-600">
              Inspection standards: Random inspection + critical points / AQL 2.5 available upon
              request
            </p>
          </div>
        </div>
      </section>

      {/* Materials & Sourcing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Materials & Sourcing</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="mb-3">Fabric Supplier Network</h3>
              <p className="text-sm text-gray-600">
                Established relationships with reliable fabric suppliers for woven, knit, and
                specialty materials
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="mb-3">Color Matching & Lab Dips</h3>
              <p className="text-sm text-gray-600">
                Color development and approval process to ensure consistency across production
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="mb-3">Trim Sourcing</h3>
              <p className="text-sm text-gray-600">
                Zippers, buttons, threads, elastic, and specialty trims sourced and quality-checked
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sampling Room */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Sampling Room & Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            <div>
              <h3 className="text-2xl mb-4">In-house Development Team</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <ClipboardCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Pattern making:</strong> From tech pack or reference garment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ClipboardCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Fit adjustment:</strong> Iterative fitting and pattern correction
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ClipboardCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Grading support:</strong> Size range development and verification
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ClipboardCheck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Sample timeline:</strong> 7-10 working days standard turnaround
                  </span>
                </li>
              </ul>
            </div>
            <div className="aspect-square overflow-hidden rounded-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1566543287897-35108aef906f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXdpbmclMjBwYXR0ZXJuJTIwZmFicmljJTIwc2FtcGxlc3xlbnwxfHx8fDE3NzAxMDE5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sampling room"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Packing & Export */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">Packing & Export</h2>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="mb-3">Custom Labels & Hangtags</h3>
                <p className="text-sm text-gray-600 mb-3">
                  We attach your brand labels, care labels, and hangtags per your specifications
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Woven/printed main labels</li>
                  <li>• Care instruction labels</li>
                  <li>• Size labels</li>
                  <li>• Custom hangtags & barcode stickers</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="mb-3">Carton Packing</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Professional packing for shipment protection and easy warehouse handling
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Individual poly bags</li>
                  <li>• Solid or ratio packing</li>
                  <li>• Carton size optimization</li>
                  <li>• Shipping marks & labels</li>
                </ul>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="mb-2">Export Documents Support</h3>
              <p className="text-sm text-gray-600">
                Commercial invoice, packing list, and other required documentation for international
                shipments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl mb-6">Experience Our Manufacturing Quality</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Request samples to evaluate our construction quality and attention to detail.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            Request Sample Information
          </button>
        </div>
      </section>
    </div>
  );
}