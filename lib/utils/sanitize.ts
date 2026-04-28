"use client";

import DOMPurify from "dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Only allows safe HTML tags typically produced by TipTap editor.
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "del",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li",
      "blockquote", "pre", "code",
      "a", "span", "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "style", "data-text-align"],
    ALLOW_DATA_ATTR: false,
  });
}
