import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook to replace the old onNavigate pattern with react-router-dom navigation
 * Maintains backward compatibility with the old API
 */
export function useNavigation() {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (page: string, options?: { category?: string; anchor?: string; productId?: string }) => {
      let path = '';

      // Map old page names to routes
      switch (page) {
        case 'home':
          path = '/';
          break;
        case 'collections':
          path = options?.category ? `/collections/${options.category}` : '/collections';
          break;
        case 'product-detail':
          path = options?.productId ? `/product/${options.productId}` : '/collections';
          break;
        case 'oem-odm':
          path = '/oem-odm';
          if (options?.anchor) {
            path += `#${options.anchor}`;
          }
          break;
        case 'factory':
          path = '/factory';
          break;
        case 'cases':
          path = '/cases';
          break;
        case 'about':
          path = '/about';
          break;
        case 'contact':
          path = '/contact';
          break;
        default:
          path = `/${page}`;
      }

      navigate(path);
    },
    [navigate]
  );

  return navigateTo;
}
