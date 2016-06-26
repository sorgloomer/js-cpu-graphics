export function map_to(source, dest, fn) {
  dest.length = source.length;
  for (var i = 0; i < source.length; i++) {
    dest[i] = fn(source[i], i, source);
  }
  return dest;
}

export class ViewMap {
  constructor(proxied, fn) {
    this.proxied = proxied;
    this.fn = fn;
  }
  get length() {
    return this.proxied.length;
  }
  index(i) {
    return this.fn(this.proxied.index(i), i);
  }
}

export class ViewArray {
  constructor(array) {
    this.array = array;
  }
  index(i) {
    return this.array[i];
  }
  get length() {
    return this.array.length;
  }
}

export function zip(fn, ...args) {
  const length = args[0].length;
  const temp = new Array(length);
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < args.length; j++) {
      temp[j] = args[j][i];
    }
    fn(...temp);
  }
}

export function view_forEach(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    fn(arr.index(i), i, arr);
  }
}

export function view_zip(fn, ...args) {
  const length = args[0].length;
  const temp = new Array(length);
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < args.length; j++) {
      temp[j] = args[j].index(i);
    }
    fn(...temp);
  }
}