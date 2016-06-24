import { template } from "../utils/template";
import { doubles } from "../utils/allocators";

export function Vector(n, allocator = doubles) {
  return _vector_template(n, allocator);
}

const _vector_template = template((n, allocator) => {
  class VectorTemplate {
    static get N() {
      return n;
    }

    static from(...args) {
      const to = new VectorTemplate();
      for (var i = 0; i < n; i++) {
        to.set_item(i, args[i]);
      }
      return to;
    }

    static uniform(x) {
      const to = new VectorTemplate();
      for (var i = 0; i < n; i++) {
        to.items[i] = x;
      }
      return to;
    }

    static nullvec() {
      return VectorTemplate.uniform(0);
    }

    constructor() {
      this.items = allocator(n);
    }

    get_item(i) {
      return this.items[i];
    }
    set_item(i, v) {
      return this.items[i] = v;
    }

    add(b) {
      const res = new VectorTemplate();
      for (var i = 0; i < n; i++) {
        res.items[i] = this.items[i] + b.items[i];
      }
      return res;
    }

    sub(b) {
      const res = new VectorTemplate();
      for (var i = 0; i < n; i++) {
        res.items[i] = this.items[i] - b.items[i];
      }
      return res;
    }

    dot(b) {
      var acc = 0;
      for (var i = 0; i < n; i++) {
        acc += this.items[i] * b.items[i];
      }
      return acc;
    }

    scale(s) {
      const to = new VectorTemplate();
      for (var i = 0; i < n; i++) {
        to.items[i] = this.items[i] * s;
      }
      return to;
    }

    divide(s) {
      return this.scale(1 / s);
    }

    normal_by_w() {
      return this.divide(this.w);
    }

    static sum(vectors) {
      var acc = VectorTemplate.nullvec();
      for (var v of vectors) {
        acc = acc.add(v);
      }
      return acc;
    }

    static average(vectors) {
      return VectorTemplate.sum(vectors).divide(vectors.length);
    }

    get x() {
      return this.items[0];
    }
    get y() {
      return this.items[1];
    }
    get z() {
      return this.items[2];
    }
    get w() {
      return this.items[n - 1];
    }
  }

  return VectorTemplate;
});
