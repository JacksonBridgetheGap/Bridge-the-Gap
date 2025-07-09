import { dotProduct, magnitude, cosineSimilarity } from "../math/math";

test("dotProduct", () => {
  expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32);
});

test("magnitude", () => {
  expect(magnitude([1, 2, 3])).toBe(Math.sqrt(14));
});

test("cosineSimilarity: same", () => {
  expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBe(1);
});

test("cosineSimilarity: zero vector", () => {
  expect(cosineSimilarity([1, 2, 3], [0, 0, 0])).toBe(NaN);
});

test("cosineSimilarity: zero", () => {
  expect(cosineSimilarity([0, 1], [1, 0])).toBe(0);
});
