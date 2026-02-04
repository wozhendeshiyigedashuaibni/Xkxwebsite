import {
  ArrowRight,
  Package,
  Clock,
  Users,
  FileText,
  Send,
  Download,
  CheckCircle,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigation } from "@/hooks/useNavigation";
import { useSEO } from "@/hooks/useSEO";
import { CONTACT_CONFIG } from "@/config/contact";
import { HOME_IMAGES } from "@/config/images";

export function HomePage() {
  const { t } = useTranslation();
  const onNavigate = useNavigation();
  
  // 自动设置SEO
  useSEO();

  const categories = [
    {
      title: t("category.dresses"),
      slug: "dresses",
      categoryName: "Dresses",
      tags: [
        t("home.categories.dresses.tag1"),
        t("home.categories.dresses.tag2"),
      ],
      image: HOME_IMAGES.categoryDress,
    },
    {
      title: t("category.womensets"),
      slug: "womensets",
      categoryName: "Women Sets",
      tags: [
        t("home.categories.sets.tag1"),
        t("home.categories.sets.tag2"),
      ],
      image: HOME_IMAGES.categoryCoordSet,
    },
    {
      title: t("category.skirts"),
      slug: "skirts",
      categoryName: "Skirts",
      tags: [
        t("home.categories.skirts.tag1"),
        t("home.categories.skirts.tag2"),
      ],
      image: HOME_IMAGES.categorySkirt,
    },
    {
      title: t("category.hoodies"),
      slug: "hoodies",
      categoryName: "Hoodies",
      tags: [
        t("home.categories.hoodies.tag1"),
        t("home.categories.hoodies.tag2"),
      ],
      image: HOME_IMAGES.categoryHoodie,
    },
    {
      title: t("category.tshirts"),
      slug: "tshirts",
      categoryName: "T-Shirts",
      tags: [
        t("home.categories.tshirts.tag1"),
        t("home.categories.tshirts.tag2"),
      ],
      image: HOME_IMAGES.categoryTshirt,
    },
    {
      title: t("category.denim"),
      slug: "denim",
      categoryName: "Denim & Bottoms",
      tags: [
        t("home.categories.denim.tag1"),
        t("home.categories.denim.tag2"),
      ],
      image: HOME_IMAGES.categoryJeans,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-gray-100">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={HOME_IMAGES.heroModel}
            alt="Fashion model"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl mb-6">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t("home.hero.subtitle")}
            </p>

            {/* Hard Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Package className="w-6 h-6 mb-2 opacity-60" />
                <div className="text-sm text-gray-600">
                  {t("home.hero.moq")}
                </div>
                <div>{t("home.hero.moq.value")}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Clock className="w-6 h-6 mb-2 opacity-60" />
                <div className="text-sm text-gray-600">
                  {t("home.hero.samples")}
                </div>
                <div>{t("home.hero.samples.value")}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <Users className="w-6 h-6 mb-2 opacity-60" />
                <div className="text-sm text-gray-600">
                  {t("home.hero.bulk")}
                </div>
                <div>{t("home.hero.bulk.value")}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Primary CTA: Request a Quote */}
              <button
                onClick={() => onNavigate("contact")}
                className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {t("home.hero.cta.quote")}
              </button>
              
              {/* Secondary CTA: Send Tech Pack via WhatsApp */}
              <a
                href={`${CONTACT_CONFIG.whatsapp.url}?text=Hi, I'd like to send you a tech pack for quotation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border border-black rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t("home.hero.cta.techpack")}
              </a>
              
              {/* Tertiary CTA: Download Tech Pack Template */}
              <a
                href="/assets/tech-pack-template.pdf"
                download
                className="px-8 py-3 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t("home.hero.cta.template")}
              </a>
            </div>

            {/* B2B Notice */}
            <p className="text-sm text-gray-600 italic">
              {t("home.hero.b2b")}
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl mb-6">
              {t("home.whoweare.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-3">
                {t("home.whoweare.sampling")}
              </h3>
              <p className="text-gray-600">
                {t("home.whoweare.sampling.desc")}
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-3">
                {t("home.whoweare.production")}
              </h3>
              <p className="text-gray-600">
                {t("home.whoweare.production.desc")}
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="mb-3">
                {t("home.whoweare.quality")}
              </h3>
              <p className="text-gray-600">
                {t("home.whoweare.quality.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">
            {t("home.categories.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  onNavigate("collections", {
                    category: category.categoryName,
                  })
                }
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2">{category.title}</h3>
                  <div className="flex gap-2 mb-3">
                    {category.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-2 py-1 bg-gray-100 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    {t("home.categories.viewstyles")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">
            {t("home.process.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-10">
            {[
              {
                step: "01",
                title: t("home.process.step1"),
                description: t("home.process.step1.desc"),
              },
              {
                step: "02",
                title: t("home.process.step2"),
                description: t("home.process.step2.desc"),
              },
              {
                step: "03",
                title: t("home.process.step3"),
                description: t("home.process.step3.desc"),
              },
              {
                step: "04",
                title: t("home.process.step4"),
                description: t("home.process.step4.desc"),
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-gray-200 mb-4">
                  {step.step}
                </div>
                <h3 className="mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => onNavigate("oem-odm")}
              className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              {t("home.process.cta")}
            </button>
          </div>
        </div>
      </section>

      {/* Proof Strip Section */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {[
              {
                label: t("home.proof.area"),
                value: t("home.proof.area.value"),
              },
              {
                label: t("home.proof.lines"),
                value: t("home.proof.lines.value"),
              },
              {
                label: t("home.proof.capacity"),
                value: t("home.proof.capacity.value"),
              },
              {
                label: t("home.proof.countries"),
                value: t("home.proof.countries.value"),
              },
              {
                label: t("home.proof.qc"),
                value: t("home.proof.qc.value"),
              },
              {
                label: t("home.proof.delivery"),
                value: t("home.proof.delivery.value"),
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl font-bold mb-1">
                  {item.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality System Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">
            {t("home.quality.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: t("home.quality.sampling"),
                subtitle: t("home.quality.sampling.subtitle"),
                image: HOME_IMAGES.qualitySampling,
              },
              {
                title: t("home.quality.production"),
                subtitle: t("home.quality.production.subtitle"),
                image: HOME_IMAGES.qualityProduction,
              },
              {
                title: t("home.quality.qc"),
                subtitle: t("home.quality.qc.subtitle"),
                image: HOME_IMAGES.qualityQC,
              },
              {
                title: t("home.quality.packing"),
                subtitle: t("home.quality.packing.subtitle"),
                image: HOME_IMAGES.qualityPacking,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-8">
            {t("home.trust.title")}
          </h2>
          <div className="max-w-2xl mx-auto text-center space-y-4 text-gray-600">
            <p>{t("home.trust.point1")}</p>
            <p>{t("home.trust.point2")}</p>
            <p>{t("home.trust.point3")}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12">
            {t("home.faq.title")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: t("home.faq.q1"),
                a: t("home.faq.a1"),
              },
              {
                q: t("home.faq.q2"),
                a: t("home.faq.a2"),
              },
              {
                q: t("home.faq.q3"),
                a: t("home.faq.a3"),
              },
              {
                q: t("home.faq.q4"),
                a: t("home.faq.a4"),
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg"
              >
                <h3 className="mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={CONTACT_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-black rounded-md hover:bg-gray-50 transition-colors"
            >
              {t("home.faq.whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => onNavigate("contact")}
              className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors"
            >
              {t("home.cta.quote")}
            </button>
            <a
              href={CONTACT_CONFIG.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-white rounded-md hover:bg-white hover:text-black transition-colors"
            >
              {t("home.cta.whatsapp")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}