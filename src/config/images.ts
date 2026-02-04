/**
 * 统一图片资源配置
 * ⚠️ 所有外链图片集中管理，便于后期替换为真实产品图
 * 
 * 使用说明：
 * 1. 所有图片URL从此文件引用，不要硬编码
 * 2. 后期替换真实图片时，只需修改此文件
 * 3. 使用 ImageWithFallback 组件渲染图片
 */

// ==================== 产品类别图片 ====================
export const CATEGORY_IMAGES = {
  // 连衣裙系列
  dress1: 'https://images.unsplash.com/photo-1720005398225-4ea01c9d2b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZWxlZ2FudCUyMGZhc2hpb258ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  dress2: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2FzdWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
  dress3: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZm9ybWFsfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
  dress4: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwa25pdHxlbnwxfHx8fDE3NzAxMDE4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  dress5: 'https://images.unsplash.com/photo-1513804742077-e1f5a4b8d51d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZvcm1hbCUyMGRyZXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzAxMDE5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',

  // 卫衣系列
  hoodie1: 'https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwaG9vZGllJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  hoodie2: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNyb3BwZWQlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  hoodie3: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjBob29kaWV8ZW58MXx8fHwxNzcwMTAxODc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  hoodie4: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHppcCUyMGhvb2RpZXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',

  // T恤系列
  tshirt1: 'https://images.unsplash.com/photo-1511550521256-8526928a8af5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  tshirt2: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGdyYXBoaWMlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  tshirt3: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRhbmslMjB0b3B8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  tshirt4: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxvbmclMjBzbGVldmUlMjB0c2hpcnR8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',

  // 裤装系列
  pants1: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  pants2: 'https://images.unsplash.com/photo-1624623278313-a930126a11c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNhcmdvJTIwcGFudHN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  pants3: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHN0cmFpZ2h0JTIwamVhbnN8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',

  // 半裙系列
  skirt1: 'https://images.unsplash.com/photo-1592423777039-7be9f340582b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwb3V0Zml0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
  skirt2: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwbWlkaXxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  skirt3: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBlbmNpbCUyMHNraXJ0fGVufDF8fHx8MTc3MDEwMTg3NXww&ixlib=rb-4.1.0&q=80&w=1080',
  skirt4: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMG1heGklMjBza2lydHxlbnwxfHx8fDE3NzAxMDE4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',

  // 套装系列
  suit1: 'https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3VpdCUyMGJsYXplciUyMHdvbWVufGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  suit2: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvb3JkJTIwc2V0fGVufDF8fHx8MTc3MDEwMTk0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  suit3: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxvdW5nZXdlYXJ8ZW58MXx8fHwxNzcwMTAxOTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
} as const;

// ==================== 首页展示图片 ====================
export const HOME_IMAGES = {
  // Hero区域
  heroModel: 'https://images.unsplash.com/photo-1768460608433-d3af5148832c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjB3b21lbiUyMGFwcGFyZWwlMjBzdHVkaW98ZW58MXx8fHwxNzcwMTAxODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',

  // 产品分类卡片
  categoryDress: 'https://images.unsplash.com/photo-1762834923135-f125e65b88eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwY2xvdGhpbmclMjBoYW5nZXIlMjByZXRhaWx8ZW58MXx8fHwxNzcwMTcxOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  categoryCoordSet: 'https://images.unsplash.com/photo-1651335794520-fb1066d93a84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNsb3RoaW5nJTIwc2V0JTIwYXBwYXJlbCUyMGRpc3BsYXl8ZW58MXx8fHwxNzcwMTcxOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  categorySkirt: 'https://images.unsplash.com/photo-1765872551254-5e7c7a9bcd1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2lydCUyMGZhc2hpb24lMjBhcHBhcmVsJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzAxNzE5NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  categoryHoodie: 'https://images.unsplash.com/photo-1588932250351-36235af5c0f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzd2VhdHNoaXJ0JTIwY2xvdGhpbmclMjBmbGF0fGVufDF8fHx8MTc3MDE3MTk1NHww&ixlib=rb-4.1.0&q=80&w=1080',
  categoryTshirt: 'https://images.unsplash.com/photo-1730952875153-c5c052698508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHRzaGlydCUyMGJhc2ljJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzAxNzE5NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  categoryJeans: 'https://images.unsplash.com/photo-1601278085511-992ec3000c8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGplYW5zJTIwZGVuaW0lMjBwYW50cyUyMHByb2R1Y3R8ZW58MXx8fHwxNzcwMTcxOTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',

  // 品质控制流程图片
  qualitySampling: 'https://images.unsplash.com/photo-1761682719790-4e0b38ed5beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWJyaWMlMjByb2xscyUyMHRleHRpbGUlMjBtYXRlcmlhbHxlbnwxfHx8fDE3NzAxNzE5MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  qualityProduction: 'https://images.unsplash.com/photo-1768745888568-b3ef7c7ba366?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXdpbmclMjBtYWNoaW5lJTIwaW5kdXN0cmlhbCUyMGdhcm1lbnR8ZW58MXx8fHwxNzcwMTcxOTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  qualityQC: 'https://images.unsplash.com/photo-1684259499086-93cb3e555803?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHF1YWxpdHklMjBpbnNwZWN0aW9uJTIwY2hlY2tpbmd8ZW58MXx8fHwxNzcwMTcxOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  qualityPacking: 'https://images.unsplash.com/photo-1685119166946-d4050647b0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBwYWNraW5nJTIwYm94ZXMlMjBnYXJtZW50JTIwc2hpcHBpbmd8ZW58MXx8fHwxNzcwMTcxOTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
} as const;

// ==================== 工厂页面图片 ====================
export const FACTORY_IMAGES = {
  productionLine: 'https://images.unsplash.com/photo-1758269445774-61a540a290a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0aWxlJTIwZmFjdG9yeSUyMHByb2R1Y3Rpb24lMjBsaW5lfGVufDF8fHx8MTc3MDEwMTg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
  samplingRoom: 'https://images.unsplash.com/photo-1566543287897-35108aef906f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXdpbmclMjBwYXR0ZXJuJTIwZmFicmljJTIwc2FtcGxlc3xlbnwxfHx8fDE3NzAxMDE5NDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
} as const;

// ==================== 视频缩略图 ====================
export const VIDEO_THUMBNAILS = {
  productDemo: CATEGORY_IMAGES.hoodie1, // 复用hoodie1作为视频缩略图
} as const;

// ==================== 导出所有图片配置 ====================
export const IMAGES = {
  ...CATEGORY_IMAGES,
  ...HOME_IMAGES,
  ...FACTORY_IMAGES,
  ...VIDEO_THUMBNAILS,
} as const;

// ==================== 类型定义 ====================
export type ImageKey = keyof typeof IMAGES;
