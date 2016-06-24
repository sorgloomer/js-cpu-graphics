(function () {
  'use strict';

  function assert(value) {
    if (!value) {
      throw new Error("Assertation error");
    }
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  var TemplateNode = function TemplateNode() {
    classCallCheck(this, TemplateNode);

    this.value = null;
    this.hasValue = false;
    this.links = new Map();
  };

  var Template = function () {
    function Template(factory) {
      classCallCheck(this, Template);

      this.factory = factory;
      this.root = new TemplateNode();
    }

    createClass(Template, [{
      key: "get_item",
      value: function get_item() {
        var node = this.root;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;

            var next_node = node.links.get(arg);
            if (!next_node) {
              next_node = new TemplateNode();
              node.links.set(arg, next_node);
            }
            node = next_node;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!node.hasValue) {
          var _context;

          node.value = (_context = null, this.factory).bind(_context).apply(undefined, args);
          node.hasValue = true;
        }
        return node.value;
      }
    }]);
    return Template;
  }();

  function template(factory) {
    var cache = new Template(factory);
    return function () {
      return cache.get_item.apply(cache, arguments);
    };
  }

  function doubles(n) {
    return new Float64Array(n);
  }

  function Vector(n) {
    var allocator = arguments.length <= 1 || arguments[1] === undefined ? doubles : arguments[1];

    return _vector_template(n, allocator);
  }

  var _vector_template = template(function (n, allocator) {
    var VectorTemplate = function () {
      createClass(VectorTemplate, null, [{
        key: "from",
        value: function from() {
          var to = new VectorTemplate();

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          for (var i = 0; i < n; i++) {
            to.set_item(i, args[i]);
          }
          return to;
        }
      }, {
        key: "uniform",
        value: function uniform(x) {
          var to = new VectorTemplate();
          for (var i = 0; i < n; i++) {
            to.items[i] = x;
          }
          return to;
        }
      }, {
        key: "nullvec",
        value: function nullvec() {
          return VectorTemplate.uniform(0);
        }
      }, {
        key: "N",
        get: function get() {
          return n;
        }
      }]);

      function VectorTemplate() {
        classCallCheck(this, VectorTemplate);

        this.items = allocator(n);
      }

      createClass(VectorTemplate, [{
        key: "get_item",
        value: function get_item(i) {
          return this.items[i];
        }
      }, {
        key: "set_item",
        value: function set_item(i, v) {
          return this.items[i] = v;
        }
      }, {
        key: "add",
        value: function add(b) {
          var res = new VectorTemplate();
          for (var i = 0; i < n; i++) {
            res.items[i] = this.items[i] + b.items[i];
          }
          return res;
        }
      }, {
        key: "sub",
        value: function sub(b) {
          var res = new VectorTemplate();
          for (var i = 0; i < n; i++) {
            res.items[i] = this.items[i] - b.items[i];
          }
          return res;
        }
      }, {
        key: "dot",
        value: function dot(b) {
          var acc = 0;
          for (var i = 0; i < n; i++) {
            acc += this.items[i] * b.items[i];
          }
          return acc;
        }
      }, {
        key: "scale",
        value: function scale(s) {
          var to = new VectorTemplate();
          for (var i = 0; i < n; i++) {
            to.items[i] = this.items[i] * s;
          }
          return to;
        }
      }, {
        key: "divide",
        value: function divide(s) {
          return this.scale(1 / s);
        }
      }, {
        key: "normal_by_w",
        value: function normal_by_w() {
          return this.divide(this.w);
        }
      }, {
        key: "x",
        get: function get() {
          return this.items[0];
        }
      }, {
        key: "y",
        get: function get() {
          return this.items[1];
        }
      }, {
        key: "z",
        get: function get() {
          return this.items[2];
        }
      }, {
        key: "w",
        get: function get() {
          return this.items[n - 1];
        }
      }], [{
        key: "sum",
        value: function sum(vectors) {
          var acc = VectorTemplate.nullvec();
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = vectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              acc = acc.add(v);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return acc;
        }
      }, {
        key: "average",
        value: function average(vectors) {
          return VectorTemplate.sum(vectors).divide(vectors.length);
        }
      }]);
      return VectorTemplate;
    }();

    return VectorTemplate;
  });

  function Matrix(n) {
    var allocator = arguments.length <= 1 || arguments[1] === undefined ? doubles : arguments[1];

    return _matrix_template(n, allocator);
  }

  var TransposedView = function () {
    function TransposedView(matrix) {
      classCallCheck(this, TransposedView);

      this.matrix = matrix;
    }

    createClass(TransposedView, [{
      key: "get_item",
      value: function get_item(i, j) {
        return this.matrix.get_item(j, i);
      }
    }, {
      key: "set_item",
      value: function set_item(i, j, v) {
        return this.matrix.set_item(j, i, v);
      }
    }]);
    return TransposedView;
  }();

  var _matrix_template = template(function (n, allocator) {
    var _vector = Vector(n, allocator);
    var item_count = n * n;

    var MatrixTemplate = function () {
      createClass(MatrixTemplate, null, [{
        key: "N",
        get: function get() {
          return n;
        }
      }, {
        key: "Vector",
        get: function get() {
          return _vector;
        }
      }]);

      function MatrixTemplate() {
        classCallCheck(this, MatrixTemplate);

        this.items = allocator(item_count);
      }

      createClass(MatrixTemplate, [{
        key: "get_item",
        value: function get_item(i, j) {
          return this.items[i * n + j];
        }
      }, {
        key: "set_item",
        value: function set_item(i, j, v) {
          return this.items[i * n + j] = v;
        }
      }, {
        key: "multiply",
        value: function multiply(b) {
          var to = new MatrixTemplate();
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
      }, {
        key: "multiply_vector",
        value: function multiply_vector(v) {
          var to = new _vector();
          for (var i = 0; i < n; i++) {
            var acc = 0;
            for (var j = 0; j < n; j++) {
              acc += this.get_item(j, i) * v.get_item(j);
            }
            to.set_item(i, acc);
          }
          return to;
        }
      }, {
        key: "multiply_vector_left",
        value: function multiply_vector_left(v) {
          var _context;

          return (_context = new TransposedView(this), this.multiply_vector).call(_context, v);
        }
      }, {
        key: "clone",
        value: function clone() {
          var to = new MatrixTemplate();
          for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
              to.set_item(i, j, this.get_item(i, j));
            }
          }
          return to;
        }
      }, {
        key: "transpose",
        value: function transpose() {
          var _context2;

          return (_context2 = new TransposedView(this), this.clone).call(_context2);
        }
      }], [{
        key: "identity",
        value: function identity() {
          var to = new MatrixTemplate();
          for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
              to.set_item(i, j, i === j ? 1 : 0);
            }
          }
          return to;
        }
      }, {
        key: "rotation",
        value: function rotation(x1, x2, a) {
          assert(x1 !== x2);
          var sina = Math.sin(a);
          var cosa = Math.cos(a);
          var to = MatrixTemplate.identity();
          to.set_item(x1, x1, cosa);
          to.set_item(x1, x2, sina);
          to.set_item(x2, x1, -sina);
          to.set_item(x2, x2, cosa);
          return to;
        }
      }, {
        key: "projection",
        value: function projection() {
          var to = MatrixTemplate.identity();
          to.set_item(n - 1, n - 1, 0);
          to.set_item(n - 2, n - 1, 1);
          return to;
        }
      }, {
        key: "translation",
        value: function translation(t) {
          return MatrixTemplate.translation_from.apply(MatrixTemplate, toConsumableArray(t.items));
        }
      }, {
        key: "translation_from",
        value: function translation_from() {
          var to = MatrixTemplate.identity();

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          for (var i = 0; i < n - 1; i++) {
            to.set_item(n - 1, i, args[i]);
          }
          return to;
        }
      }, {
        key: "scaling",
        value: function scaling(t) {
          return MatrixTemplate.scaling_from.apply(MatrixTemplate, toConsumableArray(t.items));
        }
      }, {
        key: "scaling_from",
        value: function scaling_from() {
          var to = MatrixTemplate.identity();

          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          for (var i = 0; i < n; i++) {
            to.set_item(i, i, args[i]);
          }
          return to;
        }
      }]);
      return MatrixTemplate;
    }();

    return MatrixTemplate;
  });

  function identity(x) {
    return x;
  }

  function compare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }

  function comparison_by(fn) {
    var next_comparison = arguments.length <= 1 || arguments[1] === undefined ? compare : arguments[1];

    return function (a, b) {
      return next_comparison(fn(a), fn(b));
    };
  }

  function sort(arr) {
    var key = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

    return arr.sort(comparison_by(key));
  }

  function array_copy(arr) {
    return arr.slice(0);
  }

  function sorted(arr) {
    var key = arguments.length <= 1 || arguments[1] === undefined ? identity : arguments[1];

    return sort(array_copy(arr), key);
  }

  var Matrix4 = Matrix(4);
  var Vector4 = Vector(4);

  var View = function () {
    function View(canvas) {
      classCallCheck(this, View);

      this.canvas = canvas;
      this.context = canvas.getContext("2d");
    }

    createClass(View, [{
      key: "render",
      value: function render(t) {
        var vertices = [];
        for (var i = 0; i < 2; i++) {
          for (var j = 0; j < 2; j++) {
            for (var k = 0; k < 2; k++) {
              vertices.push(Vector(4).from(2 * i - 1, 2 * j - 1, 2 * k - 1, 1));
            }
          }
        }

        /*
        3       7
         2       6
        
        1       5
         0       4
        */
        var face_meta = [[[0, 1, 3, 2], Vector4.from(-1, 0, 0, 0)], [[1, 5, 7, 3], Vector4.from(0, 0, 1, 0)], [[4, 6, 7, 5], Vector4.from(1, 0, 0, 0)], [[0, 2, 6, 4], Vector4.from(0, 0, -1, 0)],
        //[[2,3,7,6], Vector4.from(0, 1, 0, 0)],
        [[0, 4, 5, 1], Vector4.from(0, -1, 0, 0)]];

        var model = Matrix4.rotation(1, 2, -0.13 * t).multiply(Matrix4.rotation(0, 2, 0.6 * t));
        var view = Matrix4.translation_from(0, 0, 5);
        var projection = Matrix4.projection().multiply(Matrix4.scaling_from(200, -200, 1, 1)).multiply(Matrix4.translation_from(250, 250, 0));
        var mvp = model.multiply(view).multiply(projection);

        var projected = vertices.map(function (v) {
          var position = mvp.multiply_vector(v);
          return { position: position, fragcoord: position.normal_by_w() };
        });

        var light_dir = Vector4.from(1, 1, 0, 0);

        var faces = sorted(face_meta.map(function (face) {
          var vertices = face[0].map(function (i) {
            return projected[i];
          });
          var worldnormal = model.multiply_vector(face[1]);
          var diffuse = worldnormal.dot(light_dir);
          var intensity = Math.max(0, diffuse) * 0.5 + 0.5;
          var center = Vector(4).average(vertices.map(function (v) {
            return v.position;
          }));
          return { vertices: vertices, center: center, diffuse: diffuse, intensity: intensity };
        }), function (i) {
          return -i.center.z;
        });

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.strokeStyle = "black";
        this.context.lineWidth = 2;
        this.context.lineJoin = "round";

        function css_color(r, g, b) {
          var round = Math.round;

          return "rgb(" + round(255 * r) + "," + round(255 * g) + "," + round(255 * b) + ")";
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = faces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var face = _step.value;

            this.context.fillStyle = css_color(face.intensity, face.intensity * 0.2, face.intensity * 0.1);
            this.context.beginPath();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = face.vertices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var v = _step2.value;

                this.context.lineTo(v.fragcoord.x, v.fragcoord.y);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            this.context.closePath();
            this.context.fill();
            this.context.stroke();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }]);
    return View;
  }();

  var view;
  var time;
  function main() {
    view = new View(document.getElementById("main-canvas"));
    time = Date.now();
    schedule_draw();
  }

  window.addEventListener("load", function () {
    main();
  });

  function draw(t) {
    view.render(t);
  }

  function draw_loop() {
    var t = (Date.now() - time) * 0.001;
    draw(t);
    schedule_draw();
  }
  function schedule_draw() {
    window.requestAnimationFrame(draw_loop);
  }

}());