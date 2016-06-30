import { Vector, ArrayView } from "./vertices";

export function cuboid_vertices(n, array = null) {
  const { round } = Math;
  n = round(n);
  const count = 1 << n;
  if (!array) {
    array = new ArrayView(Vector(n), count);
  }

  for (var i = 0; i < count; i++) {
    const vec = array.index(i);
    for (let j = 0; j < n; j++) {
      vec.set_item(j, round(nthbit(i, j) * 2 - 1));
    }
  }
  return array;

  function nthbit(i, n) {
    return (i >>> n) & 1;
  }
}

class CuboidFace {
  constructor(vi, vj, rest, parity) {
    this.length = 4;
    this.vi = vi;
    this.vj = vj;
    this.rest = rest;
    this.parity = parity;
    this.rest_shift = insert_zero_at(insert_zero_at(rest, vi), vj);

    function insert_zero_at(x, i) {
      var mask = (~0) << i;
      return ((x & mask) << 1) | (x & ~mask);
    }
  }

  index(i) {
    if (this.parity) {
      i = 3 - i;
    }
    const g = gray_code(i);
    return this.rest_shift | ((g & 1) << this.vi) | (((g >>> 1) & 1) << this.vj);

    function gray_code(i) {
      return i ^ (i >>> 1);
    }
  }
}

export class Cuboid {
  constructor(n, vertex_buffer_array = undefined) {
    this.N = n;
    this.VectorN = Vector(n);
    this.vertices = cuboid_vertices(n, vertex_buffer_array);
    this.faces = this._generate_faces();
  }

  _generate_faces() {
    var result = [], max_rest = 1 << (this.N - 2);
    var parity1 = 0;
    for (var i = 0; i < this.N; i++) {
      for (var j = i + 1; j < this.N; j++) {
        for (var r = 0; r < max_rest; r++) {
          result.push(new CuboidFace(i, j, r, parity1));
        }
        parity1 = parity1 ^ 1;
      }
    }
    return result;
  }
}

class ExplodedCuboidPiece {
  constructor(name, sides) {
    this.name = name;
    this.sides = sides;
  }
}

export class ExplodedCuboid {
  constructor(n, dimension, explosion, gap) {
    this.N = n;
    this.dimension = dimension;
    this.explosion = explosion;
    this.gap = gap;
    this.VectorN = Vector(n);
    this.pieces = this._generatePieces();
  }

  _generatePieces() {
    const _this = this;
    const indices = [];
    const xmin = (1 - this.dimension) / 2;
    const pieces = [];
    const N = this.N, Nm1 = this.N - 1, Dm1 = this.dimension - 1;

    recurse();
    return pieces;

    function recurse() {
      if (indices.length >= N) {
        const sides = [];
        for (let i = 0; i < N; i++) {
          const index = indices[i];
          if (index <= 0) {
            const side = new Cuboid(Nm1);
            modifySide(side, i, -1 - _this.explosion);
            sides.push(side);
          }
          if (index >= Dm1) {
            const side = new Cuboid(Nm1);
            modifySide(side, i, 1 + _this.explosion);
            sides.push(side);
          }
        }
        if (sides.length > 0) {
          const name = JSON.stringify(indices);
          pieces.push(new ExplodedCuboidPiece(name, sides));
        }
      } else {
        indices.push(0);
        for (let i = 0; i < _this.dimension; i++) {
          indices[indices.length - 1] = i;
          recurse();
        }
        indices.pop();
      }
    }
    function modifySide(side, dim, x) {
      const vertices = side.vertices;
      const newVertices = new ArrayView(_this.VectorN, vertices.length);
      for (var i = 0, maxi = vertices.length; i < maxi; i++) {
        const vertex = vertices.index(i);
        const newVertex = newVertices.index(i);

        for (let j = 0; j < dim; j++) {
          newVertex.set_item(j, vertex.get_item(j));
        }
        newVertex.set_item(dim, 0);
        for (let j = dim; j < N; j++) {
          newVertex.set_item(j + 1, vertex.get_item(j));
        }
        for (let j = 0; j < N; j++) {
          newVertex.set_item(j, newVertex.get_item(j) + (indices[j] + xmin) * (2 + _this.gap));
        }
        newVertex.set_item(dim, newVertex.get_item(dim) + x);
      }
      side.vertices = newVertices;
    }
  }
}










