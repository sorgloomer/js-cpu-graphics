import { Matrix } from "../math/matrices";
import { Vector } from "../math/vertices";
import { sorted } from "../utils/sorting";


const Matrix4 = Matrix(4);
const Vector4 = Vector(4);

export class View {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  render(t) {
    const vertices = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          vertices.push(Vector(4).from(2*i-1,2*j-1,2*k-1,1));
        }
      }
    }
    
    /*
    3       7
     2       6
    
    1       5
     0       4
    */
    const face_meta = [
      [[0,1,3,2], Vector4.from(-1, 0, 0, 0)],
      [[1,5,7,3], Vector4.from(0, 0, 1, 0)],
      [[4,6,7,5], Vector4.from(1, 0, 0, 0)],
      [[0,2,6,4], Vector4.from(0, 0, -1, 0)],
      //[[2,3,7,6], Vector4.from(0, 1, 0, 0)],
      [[0,4,5,1], Vector4.from(0, -1, 0, 0)]
    ];
    

    const model = Matrix4.rotation(1, 2, -0.13 * t).multiply(
      Matrix4.rotation(0, 2, 0.6 * t)
    );
    const view = Matrix4.translation_from(0, 0, 5);
    const projection = Matrix4.projection().multiply(
      Matrix4.scaling_from(200, -200, 1, 1)
    ).multiply(
      Matrix4.translation_from(250, 250, 0)
    );
    const mvp = model.multiply(view).multiply(projection);
    
    const projected = vertices.map(v => {
      const position = mvp.multiply_vector(v);
      return { position, fragcoord: position.normal_by_w() };
    });

    const light_dir = Vector4.from(1, 1, 0, 0);

    const faces = sorted(face_meta.map(face => {
      const vertices = face[0].map(i => projected[i]);
      const worldnormal = model.multiply_vector(face[1]);
      const diffuse = worldnormal.dot(light_dir);
      const intensity = Math.max(0, diffuse) * 0.5 + 0.5;
      const center = Vector(4).average(vertices.map(v => v.position));
      return { vertices, center, diffuse, intensity };
    }), i => -i.center.z);

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.strokeStyle = "black";
    this.context.lineWidth = 2;
    this.context.lineJoin = "round";

    function css_color(r,g,b) {
      const { round } = Math;
      return `rgb(${round(255*r)},${round(255*g)},${round(255*b)})`;
    }

    for (let face of faces) {
      this.context.fillStyle = css_color(
        face.intensity,
        face.intensity * 0.2,
        face.intensity * 0.1);
      this.context.beginPath();
      for (let v of face.vertices) {
        this.context.lineTo(v.fragcoord.x, v.fragcoord.y);
      }
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    }
  }
}