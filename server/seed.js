import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword
    }
  });
  console.log('✅ Admin created:', admin.username);

  // Create default content
  const defaultContent = {
    'home.hero': {
      title: 'Professional Women\'s Apparel OEM/ODM Manufacturer',
      subtitle: 'Quality Manufacturing | Low MOQ | Fast Sampling',
      cta: 'Get Quote'
    },
    'home.features': {
      moq: { value: '50', unit: 'pcs/style', label: 'Low MOQ' },
      sampling: { value: '7-10', unit: 'days', label: 'Fast Sampling' },
      production: { value: '4-6', unit: 'weeks', label: 'Lead Time' },
      quality: { value: 'ISO', unit: 'Certified', label: 'Quality Control' }
    },
    'about.title': 'About Xikaixi Garment',
    'about.description': '15+ years of professional manufacturing experience serving 200+ brands worldwide.',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get your quote within 24 hours'
  };

  for (const [key, value] of Object.entries(defaultContent)) {
    await prisma.content.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });
  }
  console.log('✅ Default content created');

  // Create sample products
  const sampleProducts = [
    {
      slug: 'elegant-midi-dress',
      title: 'Elegant Midi Dress',
      category: 'Dresses',
      subcategory: 'Evening',
      mainImage: '/uploads/sample-dress-1.jpg',
      images: JSON.stringify(['/uploads/sample-dress-1.jpg', '/uploads/sample-dress-2.jpg']),
      description: 'Professional midi dress with elegant design, suitable for business and casual occasions.',
      moq: '50 pcs/style',
      sampleLeadTime: '7-10 days',
      bulkLeadTime: '4-6 weeks',
      material: 'Polyester, Cotton blend',
      process: 'Cut and sew, Custom printing available',
      capacity: '10,000 pcs/month',
      packaging: 'Individual polybag, custom packaging available',
      customOptions: JSON.stringify(['Size', 'Color', 'Label', 'Packaging']),
      tags: JSON.stringify(['Elegant', 'Business', 'Casual']),
      price: '$25.00',
      featured: true,
      active: true
    },
    {
      slug: 'oversized-hoodie',
      title: 'Oversized Hoodie',
      category: 'Hoodies',
      subcategory: 'Streetwear',
      mainImage: '/uploads/sample-hoodie-1.jpg',
      images: JSON.stringify(['/uploads/sample-hoodie-1.jpg']),
      description: 'Comfortable oversized hoodie with premium fabric, perfect for streetwear brands.',
      moq: '50 pcs/style',
      sampleLeadTime: '7-10 days',
      bulkLeadTime: '4-6 weeks',
      material: 'Cotton fleece, 280gsm',
      process: 'Screen printing, Embroidery',
      capacity: '15,000 pcs/month',
      packaging: 'Individual polybag',
      customOptions: JSON.stringify(['Size', 'Color', 'Print', 'Embroidery']),
      tags: JSON.stringify(['Streetwear', 'Comfortable', 'Trendy']),
      price: '$18.00',
      featured: true,
      active: true
    }
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
  console.log('✅ Sample products created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
