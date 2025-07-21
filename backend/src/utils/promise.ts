export const timeoutPromise = (ms: number, promise: Promise<any>) => {
  const timedPromise = new Promise((_, reject) =>
    setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, ms),
  );

  return Promise.race([promise, timedPromise]);
};
