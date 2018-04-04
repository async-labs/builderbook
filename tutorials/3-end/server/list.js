export default function list() {
  const n = 20000;
  const array = [];

  for (let i = 0; i < n; i += 1) {
    array.push({ name: `Item ${i + 1} of ${n}` });
  }

  // console.log(array);

  return array;
}
