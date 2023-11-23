export const http_to_ws = (url: string) => {
  if (url.substring(0, 2) === "ws") return url;

  const parts = url.split("http");

  if (parts.length === 1) {
    throw new Error(
      `actual: ${url} expected: WebSocket connection url (should start with "ws" or "http" (if "http" it will auto-replaced to "ws"))`,
    );
  }

  return `ws${parts[1]}`;
};
