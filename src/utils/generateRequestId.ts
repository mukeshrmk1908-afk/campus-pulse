/**
 * Generates a clean, unique campus ticket ID like CMP-2026-4891
 */
export function generateRequestId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${year}-${randomNum}`;
}
