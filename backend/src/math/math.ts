export function dotProduct(a: number[], b: number[]) {
  if (a.length !== b.length) {
    throw new Error("Vectors must be of equal length");
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }
  return result;
}

export function magnitude(a: number[]) {
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result += a[i] * a[i];
  }
  return Math.sqrt(result);
}

export function cosineSimilarity(a: number[], b: number[]) {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}
