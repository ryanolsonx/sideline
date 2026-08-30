export interface Match {
  id: string;
  name: string;
  createdAt: Date;
}

export function normalizeMatchName(name: string): string {
  const normalizedName = name.trim().replace(/\s+/g, ' ');

  if (!normalizedName) {
    throw new Error('A match name is required.');
  }

  return normalizedName;
}
