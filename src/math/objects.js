import { Vector, ArrayView } from "./vertices";

function gray_code(i) {
  return i ^ (i >>> 1);
}

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
  constructor(cuboid, i, k, normal) {
    this.cuboid = cuboid;
    this.length = cuboid._face_index_count;
    this.i = i;
    this.k = k;
    this.normal = normal;
    this._mask = (~0) << i;
  }

  index(j) {
    const g = gray_code(j);
    const mask = this._mask;
    const top = ((g & mask) << 1) | (g & (~mask));
    const swapped = this.k ? this.cuboid._all_bits : 0;
    return top ^ swapped;
  }
}
export class Cuboid {
  constructor(n, array = undefined) {
    this.N = n;
    this.VectorN = Vector(n);
    this.vertices = cuboid_vertices(n, array);
    this._all_bits = ~((~0) << n);
    this._face_index_count = 1 << (n - 1);

    this.normals = this._generate_normals();
    this.faces = this._generate_faces();
  }

  _generate_normals() {
    const normals = new ArrayView(this.VectorN, 2 * this.N);
    for (var i = 0, p = 0; i < this.N; i++) {
      normals.index(p++).set_to_axis(i, -1);
      normals.index(p++).set_to_axis(i, +1);
    }
    return normals;
  }
  _generate_faces() {
    var result = [];
    const normals = this.normals;
    for (var i = 0, p = 0; i < this.N; i++) {
      result.push(new CuboidFace(this, i, 0, normals.index_ref(p++)));
      result.push(new CuboidFace(this, i, 1, normals.index_ref(p++)));
    }
    return result;
  }
}
