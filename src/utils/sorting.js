export function identity(x) {
  return x;
}

export function compare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function comparison_by(fn, next_comparison = compare) {
  return (a, b) => next_comparison(fn(a), fn(b));
}

export function sort(arr, key = identity) {
  return arr.sort(comparison_by(key));
}

export function array_copy(arr) {
  return arr.slice(0);
}

export function sorted(arr, key = identity) {
  return sort(array_copy(arr), key);
}
