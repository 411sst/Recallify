/**
 * Utilities for working with rich text HTML content
 */

/**
 * Strip HTML tags and return plain text for previews
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  // Create a temporary div to parse HTML
  const tmp = document.createElement("div");
  tmp.innerHTML = html;

  // Get text content
  return tmp.textContent || tmp.innerText || "";
}

/**
 * Get a preview excerpt from HTML content
 */
export function getPreviewText(html: string, maxLength: number = 200): string {
  const text = stripHtml(html);
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Check if content is plain text or HTML
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false;

  // Check for common HTML tags
  const htmlPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlPattern.test(content);
}

/**
 * Migrate plain text to HTML format (for backwards compatibility)
 */
export function migrateToHtml(content: string): string {
  if (!content) return "";

  // If already HTML, return as is
  if (isHtmlContent(content)) return content;

  // Convert plain text to HTML paragraphs
  return `<p>${content.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}
