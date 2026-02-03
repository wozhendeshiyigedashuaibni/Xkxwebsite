import { useState } from 'react';
import { Mail, MessageCircle, MapPin, Upload, X } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    inquiryType: 'oem-techpack',
    name: '',
    company: '',
    country: '',
    email: '',
    whatsapp: '',
    category: '',
    quantity: '',
    deliveryDate: '',
    message: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Thanks for your inquiry! We'll respond within 24 hours with MOQ, timeline, and next steps."
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl mb-6">Let's Talk About Your Collection</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your requirements and we'll respond within 24 hours with MOQ, timeline, and a
            clear plan.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inquiry Type */}
                <div>
                  <label htmlFor="inquiryType" className="block mb-2">
                    I want to: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="oem-techpack">OEM production (have tech pack)</option>
                    <option value="odm-support">ODM development (need support)</option>
                    <option value="samples">Request samples</option>
                    <option value="moq-leadtime">Ask about MOQ & lead time</option>
                    <option value="lookbook">Get lookbook/catalog</option>
                  </select>
                </div>

                {/* Name & Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block mb-2">
                      Company / Brand Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Email & WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="whatsapp" className="block mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+1234567890"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Category Interested In */}
                <div>
                  <label htmlFor="category" className="block mb-2">
                    Category interested in <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select a category</option>
                    <option value="dresses">Dresses</option>
                    <option value="sets">Women Sets</option>
                    <option value="skirts">Skirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="tshirts">T-Shirts & Tops</option>
                    <option value="denim">Denim & Bottoms</option>
                    <option value="mixed">Mixed Categories</option>
                  </select>
                </div>

                {/* Quantity & Delivery Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block mb-2">
                      Expected quantity per style
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 200 pcs"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label htmlFor="deliveryDate" className="block mb-2">
                      Target delivery date
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project, requirements, or questions..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block mb-2">Upload tech pack / reference photos (optional)</label>
                  <input
                    type="file"
                    id="fileUpload"
                    name="files"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div 
                    onClick={() => document.getElementById('fileUpload')?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold mb-2">Uploaded Files:</h4>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              ({formatFileSize(file.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Submit Inquiry
                </button>

                {/* Confirmation Message */}
                <p className="text-sm text-gray-600 text-center">
                  Thanks. We'll reply within 24 hours with MOQ, timeline, and next steps.
                </p>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Direct Contact */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Email</div>
                      <a
                        href="mailto:garment1@xikaixijenny.com"
                        className="hover:underline"
                      >
                        garment1@xikaixijenny.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">WhatsApp</div>
                      <a
                        href="https://wa.me/8618692498415"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        +86 186 9249 8415 (Jenny)
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Address</div>
                      <p className="text-sm">
                        Dongguan Xikaixi Garment Co.,Ltd.
                        <br />
                        3rd Floor, No. 5 Pedestrian Street
                        <br />
                        Second Industrial Zone, Humen Town
                        <br />
                        Dongguan, Guangdong, China
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="mb-4">Business Hours</h3>
                <p className="text-sm text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM (GMT+8)
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  We typically respond within 24 hours on business days.
                </p>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="mb-4">Quick Links</h3>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => onNavigate('oem-odm')}
                    className="block hover:underline text-left"
                  >
                    Download Tech Pack Template
                  </button>
                  <button
                    onClick={() => onNavigate('oem-odm')}
                    className="block hover:underline text-left"
                  >
                    Download Lookbook
                  </button>
                  <button
                    onClick={() => onNavigate('factory')}
                    className="block hover:underline text-left"
                  >
                    View Factory & Quality
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Reference */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">Before You Contact Us</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="mb-2">What information should I prepare?</h3>
              <p className="text-sm text-gray-600">
                Tech pack (if available), reference photos, quantity per style, target delivery
                date, and your quality expectations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="mb-2">Do you work with startup brands?</h3>
              <p className="text-sm text-gray-600">
                Yes. Our MOQ starts from 100-300 pcs per style, suitable for emerging brands.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="mb-2">Can you develop from photos?</h3>
              <p className="text-sm text-gray-600">
                Yes, through our ODM service. Reference photos are acceptable, though tech packs
                are more precise.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="mb-2">What's your response time?</h3>
              <p className="text-sm text-gray-600">
                We respond within 24 hours with initial MOQ, timeline, and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}