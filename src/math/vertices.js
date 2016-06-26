import { template, invalidTemplate } from "../utils/template";

function _set_item(v, i, x) {
  return v.buffer[i + v.offset] = x;
}
function _get_item(v, i) {
  return v.buffer[i + v.offset];
}

export const Vector = template(n => {
  if (n < 1) {
    return invalidTemplate("Vector", n);
  }

  const item_count = n;
  function allocate_single() {
    return new Float64Array(n);
  }

  function new_vector() {
    return new VectorTemplate();
  }

  class VectorTemplate {
    static get N() {
      return n;
    }

    static get SIZE() {
      return item_count;
    }

    static from(...args) {
      return new VectorTemplate().set_arr(args);
    }

    set_to(...args) {
      return this.set_arr(args);
    }

    set_arr(args) {
      for (var i = 0; i < n; i++) {
        _set_item(this, i, args[i]);
      }
      return this;
    }

    clone_to(to) {
      for (var i = 0; i < n; i++) {
        _set_item(to, i, _get_item(this, i));
      }
      return to;
    }

    clone() {
      return this.clone_to(new_vector());
    }

    expand_to(e, to) {
      for (var i = 0; i < n; i++) {
        _set_item(to, i, _get_item(this, i));
      }
      _set_item(to, n, e);
      return to;
    }

    static uniform(x) {
      return new VectorTemplate().set_to_uniform(x);
    }

    set_to_uniform(x) {
      for (var i = 0; i < n; i++) {
        _set_item(this, i, x);
      }
      return this;
    }

    static zero() {
      return new VectorTemplate().set_to_zero();
    }
    set_to_zero() {
      return this.set_to_uniform(0);
    }

    static axis(i, s = undefined) {
      return new VectorTemplate().set_to_axis(i, s);
    }

    set_to_axis(i, s = 1) {
      this.set_to_uniform(0);
      _set_item(this, i, s);
      return this;
    }


    constructor(buffer = allocate_single(), offset = 0) {
      this.buffer = buffer;
      this.offset = offset;
    }

    get_item(i) {
      return _get_item(this, i);
    }
    set_item(i, v) {
      return _set_item(this, i, v);
    }

    add_to(b, to) {
      for (var i = 0; i < n; i++) {
        _set_item(to, i, _get_item(this, i) + _get_item(b, i));
      }
      return to;
    }
    add(b) {
      return this.add_to(b, new_vector());
    }

    sub_to(b, to) {
      for (var i = 0; i < n; i++) {
        _set_item(to, i, _get_item(this, i) - _get_item(b, i));
      }
      return to;
    }
    sub(b) {
      this.sub_to(b, new_vector());
    }

    dot(b) {
      var acc = 0;
      for (var i = 0; i < n; i++) {
        acc += _get_item(this, i) * _get_item(b, i);
      }
      return acc;
    }

    scale(s) {
      return this.scale_to(s, new_vector());
    }
    scale_to(s, to) {
      for (var i = 0; i < n; i++) {
        _set_item(to, i, _get_item(this, i) * s);
      }
      return to;
    }

    divide_to(s, to) {
      return this.scale_to(1 / s, to);
    }
    divide(s) {
      return this.divide_to(s, new_vector());
    }

    normal_by_w_to(to) {
      return this.divide_to(this.w, to);
    }
    normal_by_w() {
      return this.normal_by_w_to(new_vector());
    }

    static sum_to(vectors, acc) {
      acc.set_to_zero();
      for (var i = 0; i < vectors.length; i++) {
        vectors.index(i).add_to(acc, acc);
      }
      return acc;
    }

    static sum(vectors) {
      return VectorTemplate.sum_to(vectors, new_vector());
    }

    static average(vectors) {
      return VectorTemplate.average_to(vectors, new_vector());
    }
    static average_to(vectors, to) {
      return VectorTemplate.sum_to(vectors, to).divide_to(vectors.length, to);
    }

    get x() {
      return _get_item(this, 0);
    }
    get y() {
      return _get_item(this, 1);
    }
    get z() {
      return _get_item(this, 2);
    }
    get w() {
      return _get_item(this, n - 1);
    }
  }

  return VectorTemplate;
});

export class ArrayView {
  constructor(VectorType, length = 0, buffer = null, offset = 0, stride = VectorType.SIZE) {
    if (!buffer) {
      buffer = new Float64Array(length * stride);
    }
    this.VectorType = VectorType;
    this.buffer = buffer;
    this.offset = offset;
    this.stride = stride;
    this.length = length;
    this.temp = new VectorType(buffer);
  }

  index(i) {
    this.temp.offset = this.offset + i * this.stride;
    return this.temp;
  }

  index_ref_to(i, to) {
    to.buffer = this.buffer;
    to.offset = this.offset + i * this.stride;
    return to;
  }

  index_ref(i) {
    return this.index_ref_to(i, new this.VectorType(null));
  }

  forEach(fn) {
    for (var i = 0; i < this.length; i++) {
      fn(this.index(i), i, this);
    }
  }
}

export class Bulk {
  constructor(VectorType) {
    this.VectorType = VectorType;
    this.SIZE = VectorType.SIZE;
    this.temp = new VectorType(null);
  }

  allocate(count, buffer = null, offset = 0) {
    const buff_len = this.SIZE * count;
    if (!buffer) buffer = new Float64Array(buff_len);
    const result = new Array(count);
    for (var i = 0; i < count; i++) {
      result[i] = new this.VectorType(buffer, offset);
      offset += this.SIZE;
    }
    return result;
  }

  generate(count, fn, buffer = null, offset = 0) {
    const buff_len = this.SIZE * count;
    if (!buffer) buffer = new Float64Array(buff_len);
    const vec = this.temp;
    vec.buffer = buffer;
    for (var i = 0; i < count; i++) {
      vec.offset = offset;
      offset += this.SIZE;
      fn(vec, i);
    }
    return buffer;
  }
}

