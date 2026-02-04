import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getSEOForPath, type SEOConfig } from '@/config/seo';

/**
 * useSEO Hook
 * 自动根据当前路由设置页面title和meta标签
 * 
 * 使用方法：
 * 1. 在每个页面组件顶部调用：useSEO()
 * 2. 或手动指定SEO配置：useSEO({ title: 'Custom Title', ... })
 */
export function useSEO(customSEO?: Partial<SEOConfig>) {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    // 获取当前路径的SEO配置
    const seoConfig = customSEO 
      ? { ...getSEOForPath(location.pathname, params), ...customSEO }
      : getSEOForPath(location.pathname, params);

    // 设置页面标题
    document.title = seoConfig.title;

    // 设置或更新meta标签
    setMetaTag('description', seoConfig.description);
    setMetaTag('keywords', seoConfig.keywords);
    
    // Open Graph标签
    setMetaTag('og:title', seoConfig.ogTitle || seoConfig.title, 'property');
    setMetaTag('og:description', seoConfig.ogDescription || seoConfig.description, 'property');
    if (seoConfig.ogImage) {
      setMetaTag('og:image', seoConfig.ogImage, 'property');
    }
    setMetaTag('og:type', 'website', 'property');
    setMetaTag('og:url', window.location.href, 'property');

    // Twitter Card标签
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', seoConfig.ogTitle || seoConfig.title);
    setMetaTag('twitter:description', seoConfig.ogDescription || seoConfig.description);
    if (seoConfig.ogImage) {
      setMetaTag('twitter:image', seoConfig.ogImage);
    }
  }, [location.pathname, params, customSEO]);
}

/**
 * 设置或更新meta标签
 */
function setMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

/**
 * 移除meta标签
 */
function removeMetaTag(name: string, attribute: 'name' | 'property' = 'name') {
  const element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (element) {
    element.remove();
  }
}
