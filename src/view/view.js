import { Matrix } from "../math/matrices";
import { Vector, Bulk, ArrayView } from "../math/vertices";
import { sort } from "../utils/sorting";
import { zip, view_zip, ViewMap, view_forEach } from "../utils/arrays";
import * as objects from "../math/objects";

import { FaceRenderer } from "./renderer";

const Matrix4 = Matrix(4);
const Vector4 = Vector(4);

export class View {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.cuboid = new objects.Cuboid(3);
    this.transformed = new ArrayView(
      Vector(4), this.cuboid.vertices.length
    );
    this.projected = new ArrayView(
      Vector(4), this.cuboid.vertices.length
    );

    this.light_dir = Vector4.from(1, 1, 0, 0).normalized();

    this.temp_vec4s = new Bulk(Vector4).allocate(5);
    this.temp_viewmapper = new ViewMap(null, i => this.transformed.index(i));

    this.face_renderer = new FaceRenderer();
  }
  

  render(t) {

    function draw_cube(tx, ty, tz) {

      const model = Matrix4.translation_from(tx, ty, tz)
        .multiply(Matrix4.rotation(1, 2, -0.079 * t))
        .multiply(Matrix4.rotation(0, 2, 0.2 * t));
      const view = Matrix4.translation_from(0, 0, 10);
      const projection = Matrix4.projection(1).multiply(
        Matrix4.scaling_from(200, -200, 1, 1)
      ).multiply(
        Matrix4.translation_from(250, 250, 0)
      );
      const mv = model.multiply(view);
      const mvp = mv.multiply(projection);


      view_zip(
        (src, tran, proj) => {
          const position = this.temp_vec4s[0];
          const temp = this.temp_vec4s[1];
          src.expand_to(1, position);
          mv.multiply_vector_to(position, tran);
          mvp.multiply_vector_to(position, temp);
          temp.normal_by_last_to(proj);
        },
        this.cuboid.vertices, this.transformed, this.projected
      );

      this.cuboid.faces.forEach(face => {
        const normal = this.temp_vec4s[0];
        const worldnormal = this.temp_vec4s[1];
        const center = this.temp_vec4s[2];
        face.normal.expand_to(0, normal);

        model.multiply_vector_to(normal, worldnormal);

        const mapper = this.temp_viewmapper;
        mapper.proxied = face;
        Vector4.average_to(mapper, center);

        const cosa = worldnormal.dot(this.light_dir);
        const diffuse = Math.max(cosa, 0);

        const specular = Math.pow(diffuse, 5);

        const intensity = Math.max(0, diffuse) * 0.5 + 0.5;

        const primitive = this.face_renderer.add_face(this.projected, face);

        primitive.fr = intensity * 0.50;
        primitive.fg = intensity * 0.85;
        primitive.fb = intensity * 0.95;

        primitive.fr += specular * (1 - primitive.fr);
        primitive.fg += specular * (1 - primitive.fg);
        primitive.fb += specular * (1 - primitive.fb);

        primitive.fa = 0.70 + specular * 0.15;

        center.w = 0;
        primitive.dist = center.abs();
      });
    }

    this.face_renderer.reset();


    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        for (var dz = -1; dz <= 1; dz++) {
          this::draw_cube(dx * 2.5, dy * 2.5, dz * 2.5);
        }
      }
    }

    this.face_renderer.render(this.context, this.canvas);
  }
}