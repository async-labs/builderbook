export default function list() {
  const array = [];
  const n = 50000;

  for (let i = 0; i < n; i += 1) {
    array.push({ name: `Item ${i + 1}` });
  }
  // console.log(array);

  return array;
}
