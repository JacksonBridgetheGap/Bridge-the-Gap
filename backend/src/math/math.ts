export function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must be of equal length");
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }
  return result;
}

export function magnitude(a: number[]): number {
  const result = a.reduce((total, value) => total + value * value, 0);
  return Math.sqrt(result);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const a_mag = magnitude(a);
  const b_mag = magnitude(b);
  if (a_mag === 0 || b_mag === 0) return 0;
  return dotProduct(a, b) / (a_mag * b_mag);
}
