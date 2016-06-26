import { Matrix } from "../math/matrices";
import { Vector, Bulk, ArrayView } from "../math/vertices";
import { sort } from "../utils/sorting";
import { zip, view_zip, ViewMap, view_forEach } from "../utils/arrays";
import * as objects from "../math/objects";


const Matrix4 = Matrix(4);
const Vector4 = Vector(4);


class FaceData {
  constructor() {
    this.face = null;
    this.intensity = 0;
    this.depth = 0;
    this.color = 0;
  }
}
export class View {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.cuboid =  new objects.Cuboid(3);
    this.transformed = new ArrayView(
      Vector(4), this.cuboid.vertices.length
    );
    this.projected = new ArrayView(
      Vector(4), this.cuboid.vertices.length
    );
    this.faces = this.cuboid.faces.map(() => new FaceData());

    this.light_dir = Vector4.from(1, 1, 0, 0);

    this.temp_vec4s = new Bulk(Vector4).allocate(5);
    this.temp_array = [];
    this.temp_viewmapper = new ViewMap(null, i => this.transformed.index(i));
  }
  

  render(t) {

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


    view_zip(
      (src, tran, proj) => {
        const position = this.temp_vec4s[0];
        src.expand_to(1, position);
        mvp.multiply_vector_to(position, tran);
        tran.normal_by_w_to(proj);
      },
      this.cuboid.vertices, this.transformed, this.projected
    );

    zip((face, data) => {
      data.face = face;

      const normal = this.temp_vec4s[0];
      const worldnormal = this.temp_vec4s[1];
      const center = this.temp_vec4s[2];
      face.normal.expand_to(0, normal);

      model.multiply_vector_to(normal, worldnormal);

      const mapper = this.temp_viewmapper;
      mapper.proxied = face;
      Vector4.average_to(mapper, center);

      const diffuse = worldnormal.dot(this.light_dir);
      data.intensity = Math.max(0, diffuse) * 0.5 + 0.5;
      data.depth = center.z;
    }, this.cuboid.faces, this.faces);

    sort(this.faces, i => -i.depth);
    
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.strokeStyle = "black";
    this.context.lineWidth = 2;
    this.context.lineJoin = "round";

    function css_color(r,g,b) {
      const { round } = Math;
      return `rgb(${round(255*r)},${round(255*g)},${round(255*b)})`;
    }

    for (let face of this.faces) {
      this.context.fillStyle = css_color(
        face.intensity,
        face.intensity * 0.2,
        face.intensity * 0.1);
      this.context.beginPath();

      view_forEach(face.face, i => {
        const fragcoord = this.projected.index(i);
        this.context.lineTo(fragcoord.x, fragcoord.y);
      });
      this.context.closePath();
      this.context.fill();
      this.context.stroke();
    }
  }
}