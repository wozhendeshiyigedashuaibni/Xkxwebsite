import { useNavigation } from '@/hooks/useNavigation';

export function AboutPage() {
  const onNavigate = useNavigation();

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl mb-6">{t('about.hero.title')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Section 1 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl">{t('about.section1.title')}</h2>
          <p className="text-gray-600">{t('about.section1.p1')}</p>
          <p className="text-gray-600">{t('about.section1.p2')}</p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl">{t('about.section2.title')}</h2>
          <p className="text-gray-600">{t('about.section2.p1')}</p>
          <p className="text-gray-600">{t('about.section2.p2')}</p>
        </div>
      </section>

      {/* Section 3 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl">{t('about.section3.title')}</h2>
          <p className="text-gray-600">{t('about.section3.p1')}</p>
          <p className="text-gray-600">{t('about.section3.p2')}</p>
        </div>
      </section>

    </div>
  );
}