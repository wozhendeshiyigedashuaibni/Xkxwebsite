import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSEO } from '@/hooks/useSEO';
import { CONTACT_CONFIG } from '@/config/contact';
import { api } from '@/lib/api';

export function ContactPage() {
  const { t } = useTranslation();
  useSEO();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await api.submitLead({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        phone: formData.phone || undefined,
        message: formData.message,
        files: files.length > 0 ? files : undefined,
      });

      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
      setFiles([]);

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-neutral-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm uppercase tracking-[0.3em] mb-4 opacity-80">
            {t('nav.contact')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('contact.hero.title')}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('contact.info.title')}</h2>
                <p className="text-neutral-600 mb-8">
                  {t('contact.info.description')}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{t('contact.info.email')}</div>
                    <a
                      href={`mailto:${CONTACT_CONFIG.email}`}
                      className="text-neutral-600 hover:text-black transition-colors"
                    >
                      {CONTACT_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{t('contact.info.phone')}</div>
                    <a
                      href={`tel:${CONTACT_CONFIG.phone}`}
                      className="text-neutral-600 hover:text-black transition-colors block"
                    >
                      {CONTACT_CONFIG.phone}
                    </a>
                    <a
                      href={CONTACT_CONFIG.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 hover:text-black transition-colors block mt-1"
                    >
                      {t('contact.info.whatsapp')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">{t('contact.info.address')}</div>
                    <p className="text-neutral-600">
                      {CONTACT_CONFIG.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-neutral-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4">{t('contact.hours.title')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">{t('contact.hours.mon_fri')}</span>
                    <span className="font-medium">{t('contact.hours.mon_fri_time')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">{t('contact.hours.saturday')}</span>
                    <span className="font-medium">{t('contact.hours.saturday_time')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">{t('contact.hours.sunday')}</span>
                    <span className="font-medium">{t('contact.hours.sunday_closed')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{t('contact.form.success_title')}</div>
                      <div className="text-sm">{t('contact.form.success_message')}</div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
                    <div className="font-medium">{t('contact.form.error_title')}</div>
                    <div className="text-sm">{errorMessage}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.name_placeholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.email_placeholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.company_placeholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                      placeholder={t('contact.form.phone_placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                    placeholder={t('contact.form.message_placeholder')}
                  />
                </div>

                <div>
                  <label htmlFor="files" className="block text-sm font-medium mb-2">
                    {t('contact.form.files')}
                  </label>
                  <input
                    type="file"
                    id="files"
                    name="files"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-sm text-neutral-500 mt-2">
                    {t('contact.form.files_hint')}
                  </p>
                  {files.length > 0 && (
                    <div className="mt-2 text-sm text-neutral-600">
                      {files.length} {t('contact.form.files_selected')}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>{t('contact.form.submitting')}</>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('contact.form.submit')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('contact.faq.title')}
          </h2>
          <div className="space-y-6">
            <details className="bg-white p-6 rounded-lg">
              <summary className="font-medium cursor-pointer">
                {t('contact.faq.moq_q')}
              </summary>
              <p className="mt-4 text-neutral-600">
                {t('contact.faq.moq_a')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg">
              <summary className="font-medium cursor-pointer">
                {t('contact.faq.sampling_q')}
              </summary>
              <p className="mt-4 text-neutral-600">
                {t('contact.faq.sampling_a')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg">
              <summary className="font-medium cursor-pointer">
                {t('contact.faq.quote_q')}
              </summary>
              <p className="mt-4 text-neutral-600">
                {t('contact.faq.quote_a')}
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg">
              <summary className="font-medium cursor-pointer">
                {t('contact.faq.packaging_q')}
              </summary>
              <p className="mt-4 text-neutral-600">
                {t('contact.faq.packaging_a')}
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
