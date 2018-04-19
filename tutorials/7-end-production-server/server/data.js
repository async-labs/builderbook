export default function getDataOnServer() {
  const n = 10000;
  const array = [];

  for (let i = 0; i < n; i += 1) {
    array.push({ name: `Item ${i + 1} of ${n}` });
  }

  // console.log(array);

  return array;
}
