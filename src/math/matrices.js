import { assert } from "../utils/assert";
import { template, invalidTemplate } from "../utils/template";
import { Vector } from "./vertices";

class TransposedView {
  constructor(matrix) {
    this.matrix = matrix;
  }
  get_item(i, j) {
    return this.matrix.get_item(j, i);
  }
  set_item(i, j, v) {
    return this.matrix.set_item(j, i, v);
  }
}

export const Matrix = template(n => {
  if (n < 1) {
    return invalidTemplate("Matrix", n);
  }

  const _vector = Vector(n);
  const item_count = n * n;

  function new_vector() {
    return new _vector();
  }

  function allocate_buffer() {
    return new Float64Array(item_count);
  }

  class MatrixTemplate {
    static get N() {
      return n;
    }

    static get Vector() {
      return _vector;
    }

    static get SIZE() {
      return item_count;
    }

    constructor(buffer = allocate_buffer(), offset = 0) {
      this.buffer = buffer;
      this.offset = offset;
    }

    get_item(i, j) {
      return this.buffer[this.offset + i * n + j];
    }

    set_item(i, j, v) {
      return this.buffer[this.offset + i * n + j] = v;
    }

    multiply(b) {
      const to = new MatrixTemplate();
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          var acc = 0;
          for (var k = 0; k < n; k++) {
            acc += this.get_item(i, k) * b.get_item(k, j);
          }
          to.set_item(i, j, acc);
        }
      }
      return to;
    }

    multiply_vector_to(v, to) {
      for (var i = 0; i < n; i++) {
        var acc = 0;
        for (var j = 0; j < n; j++) {
          acc += this.get_item(j, i) * v.get_item(j);
        }
        to.set_item(i, acc);
      }
      return to;
    }

    multiply_vector(v) {
      return this.multiply_vector_to(v, new_vector());
    }

    multiply_vector_left_to(v, to) {
      return new TransposedView(this)::this.multiply_vector_to(v, to);
    }

    multiply_vector_left(v) {
      return this.multiply_vector_left_to(v, new_vector());
    }

    clone() {
      const to = new MatrixTemplate();
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          to.set_item(i, j, this.get_item(i, j));
        }
      }
      return to;
    }

    transpose() {
      return new TransposedView(this)::this.clone();
    }

    static identity() {
      const to = new MatrixTemplate();
      for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
          to.set_item(i, j, i === j ? 1 : 0);
        }
      }
      return to;
    }
    
    static rotation(x1, x2, a) {
      assert(x1 !== x2);
      const sina = Math.sin(a);
      const cosa = Math.cos(a);
      const to = MatrixTemplate.identity();
      to.set_item(x1, x1, cosa);
      to.set_item(x1, x2, sina);
      to.set_item(x2, x1, -sina);
      to.set_item(x2, x2, cosa);
      return to;
    }

    static projection(hdst) {
      const to = MatrixTemplate.identity();
      to.set_item(n - 1, n - 1, 0);
      to.set_item(n - 2, n - 1, hdst);
      return to;
    }

    static translation(t) {
      return MatrixTemplate.translation_from(...t.items);
    }

    static translation_from(...args) {
      const to = MatrixTemplate.identity();
      for (var i = 0; i < n - 1; i++) {
        to.set_item(n - 1, i, args[i]);
      }
      return to;
    }

    static scaling(t) {
      return MatrixTemplate.scaling_from(...t.items);
    }

    static scaling_from(...args) {
      const to = MatrixTemplate.identity();
      for (var i = 0; i < n; i++) {
        to.set_item(i, i, args[i]);
      }
      return to;
    }
  }
  return MatrixTemplate;
});


