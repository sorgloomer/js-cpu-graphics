import { Matrix } from "../math/matrices";
import { Vector, Bulk, ArrayView } from "../math/vertices";
import { sort } from "../utils/sorting";
import { zip, view_zip, ViewMap, view_forEach } from "../utils/arrays";
import * as objects from "../math/objects";

import { FaceRenderer } from "./renderer";

const Matrix4 = Matrix(4);
const Vector4 = Vector(4);

const Matrix5 = Matrix(5);
const Vector5 = Vector(5);

function vec3_cross_to(a, b, to) {
  var ax = a.get_item(0), ay = a.get_item(1), az = a.get_item(2);
  var bx = b.get_item(0), by = b.get_item(1), bz = b.get_item(2);
  var tx = ay * bz - az * by;
  var ty = az * bx - ax * bz;
  var tz = ax * by - ay * bx;
  to.set_item(0, tx);
  to.set_item(1, ty);
  to.set_item(2, tz);
  return to;
}

export class IndexedIndexable {
  constructor(buffer, indices) {
    this.buffer = buffer;
    this.indices = indices;
  }

  get length() {
    return this.indices.length;
  }

  index(i) {
    return this.buffer.index(this.indices.index(i));
  }
}

export class View {
  constructor(canvas) {

    this.centerx = canvas.width / 2;
    this.centery = canvas.height / 2;
    this.mx = 0;
    this.my = 0;

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    canvas.addEventListener("mousemove", evt => {
      this.mx = (evt.clientX - this.centerx) / this.centerx;
      this.my = (evt.clientY - this.centery) / this.centery;
    });

    this.N = 4;
    this.cuboids = new objects.ExplodedCuboid(this.N, 3, 6.0, 0.3);

    const bufferSize = this.cuboids.pieces[0].sides[0].vertices.length;
    this.verticesMV = new ArrayView(
      Vector4, bufferSize
    );
    this.verticesM = new ArrayView(
      Vector4, bufferSize
    );
    this.verticesMVPn = new ArrayView(
      Vector4, bufferSize
    );

    this.light_dir = Vector4.from(1, 1, 0, 0).normalized();

    this.temp_vec4s = new Bulk(Vector4).allocate(10);
    this.temp_vec5s = new Bulk(Vector5).allocate(10);
    this.indexer = new IndexedIndexable(null, null);

    this.face_renderer = new FaceRenderer();
  }
  

  render(t) {

    const common_rotation = Matrix5.rotation(0, this.N - 1, 0.276 * t)
      // .multiply(Matrix5.rotation(0, 2, 0.178 * t))
      //.multiply(Matrix5.rotation(1, 3, 0.134 * t))
    ;

    /*
    const mx4V = Matrix5.identity();
    const mx4P = Matrix5.identity();
    */


    const mx4V = Matrix5.translation_from(0, 0, 0, 25);
    const mx4P = Matrix5.projection(0.3);


    // const mx3V = Matrix4.rotation(1, 2, -0.4).multiply(Matrix4.translation_from(0, 0, 15))
    const mx3V = Matrix4.rotation(0, 2, this.mx * 3)
      .multiply(Matrix4.rotation(1, 2, this.my * 3))
      .multiply(Matrix4.translation_from(0, 0, 12))
    ;
    const mx3P = Matrix4.projection(0.2).multiply(
      Matrix4.scaling_from(200, -200, 1, 1)
    ).multiply(
      Matrix4.translation_from(250, 250, 0)
    );

    function draw_cube(cuboid) {

      const mx4M = common_rotation;
      const mx4MV = mx4M.multiply(mx4V);
      const mx4MVP = mx4MV.multiply(mx4P);

      const { abs, pow } = Math;


      view_zip(
        (src, v3M, vMV, vMVPn) => {
          const v4 = this.temp_vec5s[0];
          const v4MVP = this.temp_vec5s[1];
          const v4MVPn = this.temp_vec5s[2];
          const vMVP = this.temp_vec4s[1];


          src.clone_to(v4);
          for (let i = this.N; i < 4; i++) {
            v4.set_item(i, 0);
          }
          v4.last = 1;
          mx4MVP.multiply_vector_to(v4, v4MVP);
          v4MVP.normal_by_last_to(v4MVPn);
          v3M.assign(v4MVPn);
          v3M.last = 1;

          mx3V.multiply_vector_to(v3M, vMV);
          mx3P.multiply_vector_to(vMV, vMVP);
          vMVP.normal_by_last_to(vMVPn);
        },
        cuboid.vertices, this.verticesM, this.verticesMV, this.verticesMVPn
      );

      cuboid.faces.forEach(face => {
        const worldnormal = this.temp_vec4s[0];
        const center = this.temp_vec4s[1];
        const temp1 = this.temp_vec4s[2];
        const temp2 = this.temp_vec4s[3];
        const temp3 = this.temp_vec4s[4];


        this.indexer.indices = face;
        this.indexer.buffer = this.verticesM;

        temp3.assign(this.indexer.index(0));
        temp1.assign(this.indexer.index(1));
        temp2.assign(this.indexer.index(2));

        temp1.sub_to(temp3, temp1);
        temp2.sub_to(temp3, temp2);
        vec3_cross_to(temp1, temp2, temp3);
        temp3.set_item(3, 0);
        temp3.normalized_to(worldnormal);

        this.indexer.buffer = this.verticesMV;
        Vector4.average_to(this.indexer, center);

        const cosa = worldnormal.dot(this.light_dir);
        const diffuse = abs(cosa);

        temp1.assign(center).normalized_to(temp1).scale_to(-1, temp1);
        temp1.add_to(this.light_dir, temp1).normalized_to(temp1);
        var coss = temp1.dot(worldnormal);
        var specular = pow(abs(coss), 5);

        const intensity = Math.max(0, diffuse) * 0.2 + 0.5;

        const primitive = this.face_renderer.add_face(this.verticesMVPn, face);

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

    this.cuboids.pieces.forEach(cuboidSides => {
      cuboidSides.sides.forEach(cuboid => {
        this::draw_cube(cuboid)
      });
    });

    this.face_renderer.render(this.context, this.canvas);
  }
}