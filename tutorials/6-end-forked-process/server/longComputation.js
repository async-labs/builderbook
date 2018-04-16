export default function longComputation(limit) {
  let sum = 0;
  for (let i = 0; i < limit; i += 1) {
    sum += i;
  }
  return sum;
}
