/**
 * Data formatting utilities
 * Centralized JSON parsing for database records
 */

/**
 * Format a product record by parsing JSON fields
 * @param {Object} product - Raw product from database
 * @returns {Object} Formatted product with parsed arrays
 */
export function formatProduct(product) {
  if (!product) return null;
  return {
    ...product,
    images: JSON.parse(product.images || '[]'),
    customOptions: JSON.parse(product.customOptions || '[]'),
    tags: JSON.parse(product.tags || '[]')
  };
}

/**
 * Format multiple product records
 * @param {Array} products - Array of raw products
 * @returns {Array} Array of formatted products
 */
export function formatProducts(products) {
  return products.map(formatProduct);
}

/**
 * Format a lead record by parsing JSON fields
 * @param {Object} lead - Raw lead from database
 * @returns {Object} Formatted lead with parsed arrays
 */
export function formatLead(lead) {
  if (!lead) return null;
  return {
    ...lead,
    files: JSON.parse(lead.files || '[]')
  };
}

/**
 * Format multiple lead records
 * @param {Array} leads - Array of raw leads
 * @returns {Array} Array of formatted leads
 */
export function formatLeads(leads) {
  return leads.map(formatLead);
}

/**
 * Format a content record by parsing JSON value
 * @param {Object} content - Raw content from database
 * @returns {Object} Formatted content with parsed value
 */
export function formatContent(content) {
  if (!content) return null;
  return {
    ...content,
    value: JSON.parse(content.value)
  };
}

/**
 * Format multiple content records
 * @param {Array} contents - Array of raw contents
 * @returns {Array} Array of formatted contents
 */
export function formatContents(contents) {
  return contents.map(formatContent);
}
