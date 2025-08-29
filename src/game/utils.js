export const rand = (n) => Math.floor(Math.random() * n);
export const clone = (x) => JSON.parse(JSON.stringify(x));
export const roll = (sides = 20) => 1 + Math.floor(Math.random() * sides);
export const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
