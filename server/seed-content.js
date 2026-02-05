/**
 * Content Seed Script
 * 初始化网站内容数据（首页、关于我们等页面的文案）
 * 运行: node server/seed-content.js
 */

import { prisma } from './prisma.js';

const contentData = [
  // ========== 首页内容 ==========
  {
    key: 'home.hero.title',
    value: {
      text: 'Professional B2B Women\'s Fashion OEM/ODM Manufacturer',
      description: '首页 Hero 区标题'
    }
  },
  {
    key: 'home.hero.subtitle',
    value: {
      text: 'Your trusted partner for high-quality women\'s clothing manufacturing with 15+ years of expertise',
      description: '首页 Hero 区副标题'
    }
  },
  {
    key: 'home.stats',
    value: {
      items: [
        { label: 'Years Experience', value: '15+' },
        { label: 'Production Capacity', value: '500K pcs/month' },
        { label: 'Global Partners', value: '200+' },
        { label: 'Product Categories', value: '6' }
      ],
      description: '首页数据统计'
    }
  },
  {
    key: 'home.services.title',
    value: {
      text: 'Comprehensive OEM/ODM Services',
      description: '首页服务标题'
    }
  },
  {
    key: 'home.services.items',
    value: {
      items: [
        {
          title: 'Custom Design',
          description: 'Professional design team to bring your ideas to life'
        },
        {
          title: 'Quality Control',
          description: 'Strict QC process ensuring every piece meets standards'
        },
        {
          title: 'Fast Turnaround',
          description: 'Sample ready in 7-10 days, bulk production in 30-45 days'
        },
        {
          title: 'Flexible MOQ',
          description: 'Starting from 100 pieces per style'
        }
      ],
      description: '首页服务列表'
    }
  },

  // ========== 关于我们 ==========
  {
    key: 'about.company.title',
    value: {
      text: 'About Our Company',
      description: '关于我们 - 公司标题'
    }
  },
  {
    key: 'about.company.description',
    value: {
      text: 'Established in 2009, we are a leading women\'s fashion manufacturer specializing in OEM/ODM services. With state-of-the-art facilities and a team of 500+ skilled workers, we serve clients worldwide with dedication to quality and innovation.',
      description: '关于我们 - 公司简介'
    }
  },
  {
    key: 'about.mission',
    value: {
      text: 'To be the most reliable partner for fashion brands worldwide, delivering exceptional quality and service.',
      description: '关于我们 - 使命'
    }
  },
  {
    key: 'about.values',
    value: {
      items: [
        'Quality First',
        'Customer Satisfaction',
        'Innovation',
        'Sustainability',
        'Integrity'
      ],
      description: '关于我们 - 价值观'
    }
  },

  // ========== 工厂介绍 ==========
  {
    key: 'factory.title',
    value: {
      text: 'Our Manufacturing Facility',
      description: '工厂页 - 标题'
    }
  },
  {
    key: 'factory.overview',
    value: {
      text: 'Our 30,000 sqm facility features modern production lines equipped with advanced machinery and technology. We maintain strict quality standards throughout the manufacturing process.',
      description: '工厂页 - 概述'
    }
  },
  {
    key: 'factory.capabilities',
    value: {
      items: [
        {
          title: 'Production Capacity',
          value: '500,000 pieces/month'
        },
        {
          title: 'Factory Size',
          value: '30,000 sqm'
        },
        {
          title: 'Production Lines',
          value: '12 lines'
        },
        {
          title: 'Workers',
          value: '500+ skilled'
        },
        {
          title: 'Machines',
          value: '300+ units'
        },
        {
          title: 'Certifications',
          value: 'ISO9001, BSCI, WRAP'
        }
      ],
      description: '工厂页 - 生产能力'
    }
  },

  // ========== OEM/ODM 服务 ==========
  {
    key: 'oem-odm.hero.title',
    value: {
      text: 'Professional OEM/ODM Services',
      description: 'OEM/ODM 页 - 主标题'
    }
  },
  {
    key: 'oem-odm.hero.description',
    value: {
      text: 'From concept to completion, we provide comprehensive manufacturing solutions tailored to your brand needs.',
      description: 'OEM/ODM 页 - 描述'
    }
  },
  {
    key: 'oem-odm.process',
    value: {
      steps: [
        {
          step: 1,
          title: 'Inquiry & Requirements',
          description: 'Share your design ideas, reference samples, or tech packs'
        },
        {
          step: 2,
          title: 'Quotation & Sampling',
          description: 'Receive detailed quote and sample development (7-10 days)'
        },
        {
          step: 3,
          title: 'Order Confirmation',
          description: 'Approve samples and confirm bulk order details'
        },
        {
          step: 4,
          title: 'Production & QC',
          description: 'Manufacturing with strict quality control checkpoints'
        },
        {
          step: 5,
          title: 'Shipping & Delivery',
          description: 'Timely delivery to your specified destination'
        }
      ],
      description: 'OEM/ODM 页 - 流程'
    }
  },

  // ========== 案例展示 ==========
  {
    key: 'cases.title',
    value: {
      text: 'Success Stories',
      description: '案例页 - 标题'
    }
  },
  {
    key: 'cases.description',
    value: {
      text: 'We\'ve partnered with numerous brands across the globe, delivering quality products that exceed expectations.',
      description: '案例页 - 描述'
    }
  },

  // ========== 联系我们 ==========
  {
    key: 'contact.title',
    value: {
      text: 'Get In Touch',
      description: '联系页 - 标题'
    }
  },
  {
    key: 'contact.description',
    value: {
      text: 'Ready to start your project? Contact us for a free consultation and quotation.',
      description: '联系页 - 描述'
    }
  },
  {
    key: 'contact.info',
    value: {
      email: 'sales@xikaixi.com',
      phone: '+86 138 1234 5678',
      whatsapp: '+86 138 1234 5678',
      address: 'Guangzhou, Guangdong, China',
      workingHours: 'Monday - Saturday: 9:00 AM - 6:00 PM (GMT+8)',
      description: '联系页 - 联系信息'
    }
  },

  // ========== 页脚 ==========
  {
    key: 'footer.company.description',
    value: {
      text: 'Professional B2B women\'s fashion OEM/ODM manufacturer with 15+ years of expertise.',
      description: '页脚 - 公司简介'
    }
  },
  {
    key: 'footer.copyright',
    value: {
      text: '© 2024 XIKAIXI. All rights reserved.',
      description: '页脚 - 版权信息'
    }
  }
];

async function seedContent() {
  console.log('🌱 开始初始化网站内容...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const item of contentData) {
    try {
      await prisma.content.upsert({
        where: { key: item.key },
        update: { value: JSON.stringify(item.value) },
        create: { key: item.key, value: JSON.stringify(item.value) }
      });
      
      console.log(`✓ ${item.key}`);
      successCount++;
    } catch (error) {
      console.error(`✗ ${item.key}: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ 完成！成功: ${successCount}, 失败: ${errorCount}`);
  console.log('='.repeat(60) + '\n');
}

seedContent()
  .catch((error) => {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
