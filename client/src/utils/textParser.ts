export function parseRichText(str?: string, stripHtml = false): { __html: string } {
  if (!str) return { __html: "" };
  
  let parsed = str;
  
  // XSS / DOM Break Protection
  parsed = parsed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
    
  // Markdown Bold
  parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Markdown Italic
  parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Primary Farbe
  parsed = parsed.replace(/\+\+(.*?)\+\+/g, '<span class="text-primary">$1</span>');
  // Secondary Farbe
  parsed = parsed.replace(/--(.*?)--/g, '<span class="text-secondary">$1</span>');
  // Linebreaks
  parsed = parsed.replace(/\n/g, '<br/>');

  return { __html: parsed };
}
