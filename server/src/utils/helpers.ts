export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const normalizeUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    // Ensure https
    if (url.protocol === 'http:') {
      url.protocol = 'https:';
    }
    // Remove trailing slash
    return url.href.replace(/\/$/, '');
  } catch {
    return urlString;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const cleanText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/[\r\n]+/g, ' ') // Replace newlines with space
    .trim();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
