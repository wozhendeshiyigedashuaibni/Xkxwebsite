import { useNavigation } from '@/hooks/useNavigation';
import { ArrowRight } from 'lucide-react';

export function CasesPage() {
  const onNavigate = useNavigation();

  const cases = [
    {
      number: '01',
      title: 'Boutique Brand Seasonal Production',
      category: 'Dresses + Skirts',
      challenge: 'Tight seasonal timeline with multiple styles',
      solution:
        'We created a detailed sampling schedule with parallel development, production planning with milestone checkpoints, and inline QC to catch issues early.',
      result:
        'On-time shipment with stable sizing consistency across all styles. Brand placed repeat orders for next season.',
      tags: ['Woven', 'Fast Timeline', 'Multi-Style'],
    },
    {
      number: '02',
      title: 'Streetwear Brand Hoodie Program',
      category: 'Hoodies',
      challenge: 'Fabric stability & print quality consistency',
      solution:
        'Worked closely with brand on fabric pre-shrinking, print vendor selection, and QC checkpoints for print alignment and color fastness.',
      result:
        'Reduced defect rate from 5% to under 1%. Repeat orders continue quarterly.',
      tags: ['Fleece', 'Print Quality', 'Long-term'],
    },
    {
      number: '03',
      title: 'Online Brand Co-ord Sets Launch',
      category: 'Women Sets (Two-piece)',
      challenge: 'Color matching between top & bottom pieces',
      solution:
        'Lab dip approval process for both fabrics, same dye lot tracking, and inline QC comparing pieces during production.',
      result:
        'Zero color mismatch complaints. Brand expanded to 8 colorways in next collection.',
      tags: ['Knit', 'Color Matching', 'ODM Support'],
    },
    {
      number: '04',
      title: 'Contemporary Brand Dress Collection',
      category: 'Dresses',
      challenge: 'Complex construction with fit requirements',
      solution:
        'Three fitting sample iterations with pattern adjustments, dedicated production line training, and critical measurement checkpoints.',
      result:
        'Fit consistency across production run. Customer return rate under industry average.',
      tags: ['Woven', 'Fit Focus', 'Premium'],
    },
    {
      number: '05',
      title: 'Emerging Brand Startup Collection',
      category: 'Mixed Categories',
      challenge: 'Small MOQ with limited budget',
      solution:
        'ODM development from reference photos, fabric recommendations within budget, flexible MOQ of 100pcs per style.',
      result:
        'Brand successfully launched first collection. Now ordering 300+ pcs per style.',
      tags: ['ODM', 'Small MOQ', 'Growth Partner'],
    },
    {
      number: '06',
      title: 'Fashion Brand Denim Launch',
      category: 'Denim & Bottoms',
      challenge: 'Wash development and consistency',
      solution:
        'Sample wash development, wash recipe documentation, and batch-by-batch wash QC with reference garment comparison.',
      result:
        'Consistent wash results across production. Brand adding jeans to core collection.',
      tags: ['Denim', 'Wash Development', 'Technical'],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl mb-6">Manufacturing Case Studies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real projects, real challenges, real solutions. Here's how we've helped brands succeed.
          </p>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {cases.map((caseStudy, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-6">
                  {/* Number */}
                  <div className="w-20 h-20 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0 text-3xl">
                    {caseStudy.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-3xl mb-2">{caseStudy.title}</h2>
                    <div className="mb-4">
                      <span className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                        {caseStudy.category}
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-sm mb-1">Challenge:</h3>
                        <p className="text-gray-600">{caseStudy.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-sm mb-1">Our Solution:</h3>
                        <p className="text-gray-600">{caseStudy.solution}</p>
                      </div>
                      <div>
                        <h3 className="text-sm mb-1">Result:</h3>
                        <p className="text-gray-600">{caseStudy.result}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Message */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl mb-6">Why Brands Choose to Work With Us</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                ✓ <strong>Realistic timelines</strong> — We don't over-promise. We communicate
                clearly and deliver on schedule.
              </p>
              <p>
                ✓ <strong>Consistent quality</strong> — Our checkpoint-based QC system catches
                issues early, not at final inspection.
              </p>
              <p>
                ✓ <strong>Long-term thinking</strong> — We prefer steady partnerships over
                one-time orders. Your success is our success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl mb-6">Start Your Project</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Every successful project starts with a conversation. Share your requirements and let's
            discuss how we can help.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Get a Quote
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}