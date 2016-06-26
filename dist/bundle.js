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

  function invalidTemplate(name) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var shown_name = name + JSON.stringify(args);
    return function InvalidTemplate() {
      throw new Error("InvalidTemplate: " + shown_name);
    };
  }

  function _set_item(v, i, x) {
    return v.buffer[i + v.offset] = x;
  }
  function _get_item(v, i) {
    return v.buffer[i + v.offset];
  }

  var Vector = template(function (n) {
    if (n < 1) {
      return invalidTemplate("Vector", n);
    }

    var item_count = n;
    function allocate_single() {
      return new Float64Array(n);
    }

    function new_vector() {
      return new VectorTemplate();
    }

    var VectorTemplate = function () {
      createClass(VectorTemplate, [{
        key: "set_to",
        value: function set_to() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return this.set_arr(args);
        }
      }, {
        key: "set_arr",
        value: function set_arr(args) {
          for (var i = 0; i < n; i++) {
            _set_item(this, i, args[i]);
          }
          return this;
        }
      }, {
        key: "clone_to",
        value: function clone_to(to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i));
          }
          return to;
        }
      }, {
        key: "clone",
        value: function clone() {
          return this.clone_to(new_vector());
        }
      }, {
        key: "expand_to",
        value: function expand_to(e, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i));
          }
          _set_item(to, n, e);
          return to;
        }
      }, {
        key: "set_to_uniform",
        value: function set_to_uniform(x) {
          for (var i = 0; i < n; i++) {
            _set_item(this, i, x);
          }
          return this;
        }
      }, {
        key: "set_to_zero",
        value: function set_to_zero() {
          return this.set_to_uniform(0);
        }
      }, {
        key: "set_to_axis",
        value: function set_to_axis(i) {
          var s = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

          this.set_to_uniform(0);
          _set_item(this, i, s);
          return this;
        }
      }], [{
        key: "from",
        value: function from() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return new VectorTemplate().set_arr(args);
        }
      }, {
        key: "uniform",
        value: function uniform(x) {
          return new VectorTemplate().set_to_uniform(x);
        }
      }, {
        key: "zero",
        value: function zero() {
          return new VectorTemplate().set_to_zero();
        }
      }, {
        key: "axis",
        value: function axis(i) {
          var s = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

          return new VectorTemplate().set_to_axis(i, s);
        }
      }, {
        key: "N",
        get: function get() {
          return n;
        }
      }, {
        key: "SIZE",
        get: function get() {
          return item_count;
        }
      }]);

      function VectorTemplate() {
        var buffer = arguments.length <= 0 || arguments[0] === undefined ? allocate_single() : arguments[0];
        var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        classCallCheck(this, VectorTemplate);

        this.buffer = buffer;
        this.offset = offset;
      }

      createClass(VectorTemplate, [{
        key: "get_item",
        value: function get_item(i) {
          return _get_item(this, i);
        }
      }, {
        key: "set_item",
        value: function set_item(i, v) {
          return _set_item(this, i, v);
        }
      }, {
        key: "add_to",
        value: function add_to(b, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i) + _get_item(b, i));
          }
          return to;
        }
      }, {
        key: "add",
        value: function add(b) {
          return this.add_to(b, new_vector());
        }
      }, {
        key: "sub_to",
        value: function sub_to(b, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i) - _get_item(b, i));
          }
          return to;
        }
      }, {
        key: "sub",
        value: function sub(b) {
          this.sub_to(b, new_vector());
        }
      }, {
        key: "dot",
        value: function dot(b) {
          var acc = 0;
          for (var i = 0; i < n; i++) {
            acc += _get_item(this, i) * _get_item(b, i);
          }
          return acc;
        }
      }, {
        key: "scale",
        value: function scale(s) {
          return this.scale_to(s, new_vector());
        }
      }, {
        key: "scale_to",
        value: function scale_to(s, to) {
          for (var i = 0; i < n; i++) {
            _set_item(to, i, _get_item(this, i) * s);
          }
          return to;
        }
      }, {
        key: "divide_to",
        value: function divide_to(s, to) {
          return this.scale_to(1 / s, to);
        }
      }, {
        key: "divide",
        value: function divide(s) {
          return this.divide_to(s, new_vector());
        }
      }, {
        key: "normal_by_w_to",
        value: function normal_by_w_to(to) {
          return this.divide_to(this.w, to);
        }
      }, {
        key: "normal_by_w",
        value: function normal_by_w() {
          return this.normal_by_w_to(new_vector());
        }
      }, {
        key: "x",
        get: function get() {
          return _get_item(this, 0);
        }
      }, {
        key: "y",
        get: function get() {
          return _get_item(this, 1);
        }
      }, {
        key: "z",
        get: function get() {
          return _get_item(this, 2);
        }
      }, {
        key: "w",
        get: function get() {
          return _get_item(this, n - 1);
        }
      }], [{
        key: "sum_to",
        value: function sum_to(vectors, acc) {
          acc.set_to_zero();
          for (var i = 0; i < vectors.length; i++) {
            vectors.index(i).add_to(acc, acc);
          }
          return acc;
        }
      }, {
        key: "sum",
        value: function sum(vectors) {
          return VectorTemplate.sum_to(vectors, new_vector());
        }
      }, {
        key: "average",
        value: function average(vectors) {
          return VectorTemplate.average_to(vectors, new_vector());
        }
      }, {
        key: "average_to",
        value: function average_to(vectors, to) {
          return VectorTemplate.sum_to(vectors, to).divide_to(vectors.length, to);
        }
      }]);
      return VectorTemplate;
    }();

    return VectorTemplate;
  });

  var ArrayView = function () {
    function ArrayView(VectorType) {
      var length = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var buffer = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var stride = arguments.length <= 4 || arguments[4] === undefined ? VectorType.SIZE : arguments[4];
      classCallCheck(this, ArrayView);

      if (!buffer) {
        buffer = new Float64Array(length * stride);
      }
      this.VectorType = VectorType;
      this.buffer = buffer;
      this.offset = offset;
      this.stride = stride;
      this.length = length;
      this.temp = new VectorType(buffer);
    }

    createClass(ArrayView, [{
      key: "index",
      value: function index(i) {
        this.temp.offset = this.offset + i * this.stride;
        return this.temp;
      }
    }, {
      key: "index_ref_to",
      value: function index_ref_to(i, to) {
        to.buffer = this.buffer;
        to.offset = this.offset + i * this.stride;
        return to;
      }
    }, {
      key: "index_ref",
      value: function index_ref(i) {
        return this.index_ref_to(i, new this.VectorType(null));
      }
    }, {
      key: "forEach",
      value: function forEach(fn) {
        for (var i = 0; i < this.length; i++) {
          fn(this.index(i), i, this);
        }
      }
    }]);
    return ArrayView;
  }();

  var Bulk = function () {
    function Bulk(VectorType) {
      classCallCheck(this, Bulk);

      this.VectorType = VectorType;
      this.SIZE = VectorType.SIZE;
      this.temp = new VectorType(null);
    }

    createClass(Bulk, [{
      key: "allocate",
      value: function allocate(count) {
        var buffer = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
        var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var buff_len = this.SIZE * count;
        if (!buffer) buffer = new Float64Array(buff_len);
        var result = new Array(count);
        for (var i = 0; i < count; i++) {
          result[i] = new this.VectorType(buffer, offset);
          offset += this.SIZE;
        }
        return result;
      }
    }, {
      key: "generate",
      value: function generate(count, fn) {
        var buffer = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
        var offset = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

        var buff_len = this.SIZE * count;
        if (!buffer) buffer = new Float64Array(buff_len);
        var vec = this.temp;
        vec.buffer = buffer;
        for (var i = 0; i < count; i++) {
          vec.offset = offset;
          offset += this.SIZE;
          fn(vec, i);
        }
        return buffer;
      }
    }]);
    return Bulk;
  }();

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

  var Matrix = template(function (n) {
    if (n < 1) {
      return invalidTemplate("Matrix", n);
    }

    var _vector = Vector(n);
    var item_count = n * n;

    function new_vector() {
      return new _vector();
    }

    function allocate_buffer() {
      return new Float64Array(item_count);
    }

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
      }, {
        key: "SIZE",
        get: function get() {
          return item_count;
        }
      }]);

      function MatrixTemplate() {
        var buffer = arguments.length <= 0 || arguments[0] === undefined ? allocate_buffer() : arguments[0];
        var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
        classCallCheck(this, MatrixTemplate);

        this.buffer = buffer;
        this.offset = offset;
      }

      createClass(MatrixTemplate, [{
        key: "get_item",
        value: function get_item(i, j) {
          return this.buffer[this.offset + i * n + j];
        }
      }, {
        key: "set_item",
        value: function set_item(i, j, v) {
          return this.buffer[this.offset + i * n + j] = v;
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
        key: "multiply_vector_to",
        value: function multiply_vector_to(v, to) {
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
        key: "multiply_vector",
        value: function multiply_vector(v) {
          return this.multiply_vector_to(v, new_vector());
        }
      }, {
        key: "multiply_vector_left_to",
        value: function multiply_vector_left_to(v, to) {
          var _context;

          return (_context = new TransposedView(this), this.multiply_vector_to).call(_context, v, to);
        }
      }, {
        key: "multiply_vector_left",
        value: function multiply_vector_left(v) {
          return this.multiply_vector_left_to(v, new_vector());
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

  var ViewMap = function () {
    function ViewMap(proxied, fn) {
      classCallCheck(this, ViewMap);

      this.proxied = proxied;
      this.fn = fn;
    }

    createClass(ViewMap, [{
      key: "index",
      value: function index(i) {
        return this.fn(this.proxied.index(i), i);
      }
    }, {
      key: "length",
      get: function get() {
        return this.proxied.length;
      }
    }]);
    return ViewMap;
  }();

  var ViewArray = function () {
    function ViewArray(array) {
      classCallCheck(this, ViewArray);

      this.array = array;
    }

    createClass(ViewArray, [{
      key: "index",
      value: function index(i) {
        return this.array[i];
      }
    }, {
      key: "length",
      get: function get() {
        return this.array.length;
      }
    }]);
    return ViewArray;
  }();

  function zip(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var length = args[0].length;
    var temp = new Array(length);
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < args.length; j++) {
        temp[j] = args[j][i];
      }
      fn.apply(undefined, temp);
    }
  }

  function view_forEach(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
      fn(arr.index(i), i, arr);
    }
  }

  function view_zip(fn) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var length = args[0].length;
    var temp = new Array(length);
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < args.length; j++) {
        temp[j] = args[j].index(i);
      }
      fn.apply(undefined, temp);
    }
  }

  function gray_code(i) {
    return i ^ i >>> 1;
  }

  function cuboid_vertices(n) {
    var array = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var round = Math.round;

    n = round(n);
    var count = 1 << n;
    if (!array) {
      array = new ArrayView(Vector(n), count);
    }

    for (var i = 0; i < count; i++) {
      var vec = array.index(i);
      for (var j = 0; j < n; j++) {
        vec.set_item(j, round(nthbit(i, j) * 2 - 1));
      }
    }
    return array;

    function nthbit(i, n) {
      return i >>> n & 1;
    }
  }

  var CuboidFace = function () {
    function CuboidFace(cuboid, i, k, normal) {
      classCallCheck(this, CuboidFace);

      this.cuboid = cuboid;
      this.length = cuboid._face_index_count;
      this.i = i;
      this.k = k;
      this.normal = normal;
      this._mask = ~0 << i;
    }

    createClass(CuboidFace, [{
      key: "index",
      value: function index(j) {
        var g = gray_code(j);
        var mask = this._mask;
        var top = (g & mask) << 1 | g & ~mask;
        var swapped = this.k ? this.cuboid._all_bits : 0;
        return top ^ swapped;
      }
    }]);
    return CuboidFace;
  }();

  var Cuboid = function () {
    function Cuboid(n) {
      var array = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
      classCallCheck(this, Cuboid);

      this.N = n;
      this.VectorN = Vector(n);
      this.vertices = cuboid_vertices(n, array);
      this._all_bits = ~(~0 << n);
      this._face_index_count = 1 << n - 1;

      this.normals = this._generate_normals();
      this.faces = this._generate_faces();
    }

    createClass(Cuboid, [{
      key: "_generate_normals",
      value: function _generate_normals() {
        var normals = new ArrayView(this.VectorN, 2 * this.N);
        for (var i = 0, p = 0; i < this.N; i++) {
          normals.index(p++).set_to_axis(i, -1);
          normals.index(p++).set_to_axis(i, +1);
        }
        return normals;
      }
    }, {
      key: "_generate_faces",
      value: function _generate_faces() {
        var result = [];
        var normals = this.normals;
        for (var i = 0, p = 0; i < this.N; i++) {
          result.push(new CuboidFace(this, i, 0, normals.index_ref(p++)));
          result.push(new CuboidFace(this, i, 1, normals.index_ref(p++)));
        }
        return result;
      }
    }]);
    return Cuboid;
  }();

  var Matrix4 = Matrix(4);
  var Vector4 = Vector(4);

  var FaceData = function FaceData() {
    classCallCheck(this, FaceData);

    this.face = null;
    this.intensity = 0;
    this.depth = 0;
    this.color = 0;
  };

  var View = function () {
    function View(canvas) {
      var _this = this;

      classCallCheck(this, View);

      this.canvas = canvas;
      this.context = canvas.getContext("2d");

      this.cuboid = new Cuboid(3);
      this.transformed = new ArrayView(Vector(4), this.cuboid.vertices.length);
      this.projected = new ArrayView(Vector(4), this.cuboid.vertices.length);
      this.faces = this.cuboid.faces.map(function () {
        return new FaceData();
      });

      this.light_dir = Vector4.from(1, 1, 0, 0);

      this.temp_vec4s = new Bulk(Vector4).allocate(5);
      this.temp_array = [];
      this.temp_viewmapper = new ViewMap(null, function (i) {
        return _this.transformed.index(i);
      });
    }

    createClass(View, [{
      key: "render",
      value: function render(t) {
        var _this2 = this;

        var model = Matrix4.rotation(1, 2, -0.13 * t).multiply(Matrix4.rotation(0, 2, 0.6 * t));
        var view = Matrix4.translation_from(0, 0, 5);
        var projection = Matrix4.projection().multiply(Matrix4.scaling_from(200, -200, 1, 1)).multiply(Matrix4.translation_from(250, 250, 0));
        var mvp = model.multiply(view).multiply(projection);

        view_zip(function (src, tran, proj) {
          var position = _this2.temp_vec4s[0];
          src.expand_to(1, position);
          mvp.multiply_vector_to(position, tran);
          tran.normal_by_w_to(proj);
        }, this.cuboid.vertices, this.transformed, this.projected);

        zip(function (face, data) {
          data.face = face;

          var normal = _this2.temp_vec4s[0];
          var worldnormal = _this2.temp_vec4s[1];
          var center = _this2.temp_vec4s[2];
          face.normal.expand_to(0, normal);

          model.multiply_vector_to(normal, worldnormal);

          var mapper = _this2.temp_viewmapper;
          mapper.proxied = face;
          Vector4.average_to(mapper, center);

          var diffuse = worldnormal.dot(_this2.light_dir);
          data.intensity = Math.max(0, diffuse) * 0.5 + 0.5;
          data.depth = center.z;
        }, this.cuboid.faces, this.faces);

        sort(this.faces, function (i) {
          return -i.depth;
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
          for (var _iterator = this.faces[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var face = _step.value;

            this.context.fillStyle = css_color(face.intensity, face.intensity * 0.2, face.intensity * 0.1);
            this.context.beginPath();

            view_forEach(face.face, function (i) {
              var fragcoord = _this2.projected.index(i);
              _this2.context.lineTo(fragcoord.x, fragcoord.y);
            });
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