
import { sort } from "../utils/sorting";

export class PointBuffer {
  constructor() {
    this.buffer = new Float32Array(256);
    this.offset = 0;
  }

  add(a) {
    if (this.offset + 1 >= this.buffer.length) {
      this._expand();
    }
    this.buffer[this.offset++] = a;
  }

  add2(a, b) {
    if (this.offset + 2 >= this.buffer.length) {
      this._expand();
    }
    this.buffer[this.offset++] = a;
    this.buffer[this.offset++] = b;
  }
  add3(a, b, c) {
    if (this.offset + 3 >= this.buffer.length) {
      this._expand();
    }
    this.buffer[this.offset++] = a;
    this.buffer[this.offset++] = b;
    this.buffer[this.offset++] = c;
  }
  reset() {
    this.offset = 0;
  }
  _expand() {
    const temp = new Float32Array(Math.round(this.buffer.length * 1.5));
    temp.set(this.buffer);
    this.buffer = temp;
  }
}

export function FacePrimitive() {
  this._offset = 0;
  this._count = 0;
  this.dist = 0;

  this.fill = true;
  this.stroke = true;
  this.close_path = true;
  this.blended = true;

  this.fr = 0;
  this.fg = 1;
  this.fb = 0;
  this.fa = 1;
  this.sr = 0;
  this.sg = 0;
  this.sb = 0;
  this.sa = 1;
  this.lw = 1;
}


export class FaceRenderer {
  constructor() {
    this.point_buffer = new PointBuffer();
    this.primitive_buffer = [];
  }

  _next() {
    const result = new FacePrimitive();
    this.primitive_buffer.push(result);
    return result;
  }
  add_face(buffer, indices) {
    const offset = this.point_buffer.offset;
    const length = indices.length;
    for (var i = 0; i < length; i++) {
      const vec = buffer.index(indices.index(i));
      this.point_buffer.add2(vec.x, vec.y);
    }
    const result = this._next();
    result._offset = offset;
    result._count = length;
    return result;
  }

  prepare() {
    sort(this.primitive_buffer, p => -p.dist);
  }

  draw(context) {
    context.lineJoin = "round";
    const fragcoords = this.point_buffer.buffer;

    this.primitive_buffer.forEach(prim => {
      if (prim.fill) {
        context.fillStyle = css_color(prim.fr, prim.fg, prim.fb, prim.fa, prim.blended);
      }
      if (prim.stroke) {
        context.lineWidth = prim.lw;
        context.strokeStyle = css_color(prim.sr, prim.sg, prim.sb, prim.sa, prim.blended);
      }
      context.beginPath();

      for (var p = prim._offset, i = 0; i < prim._count; i++) {
        const px = fragcoords[p++];
        const py = fragcoords[p++];
        if (i) {
          context.lineTo(px, py);
        } else {
          context.moveTo(px, py);
        }
      }

      if (prim.close_path) {
        context.closePath();
      }
      if (prim.fill) {
        context.fill();
      }
      if (prim.stroke) {
        context.stroke();
      }
    });
  }

  clear(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  reset() {
    this.point_buffer.reset();
    this.primitive_buffer.length = 0;
  }

  render(context, canvas) {
    this.prepare();
    this.clear(context, canvas);
    this.draw(context, canvas);
  }
}

function css_color(r,g,b,a, blended) {
  const { round } = Math;
  return blended ? `rgba(${round(255*r)},${round(255*g)},${round(255*b)},${a})`
    : `rgb(${round(255*r)},${round(255*g)},${round(255*b)})`;
}

