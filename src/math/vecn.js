export function vec_nx(n, allocator) {
  function allocate() {
    return allocator(n);
  }

  function fill(v, x) {
    for (var i = 0; i < n; i++) {
      v[i] = x;
    }
    return v;
  }

  function create() {
    return fill(allocate(), 0);
  }

  function dot(a, b) {
    for (var i = 0, r = 0; i < n; i++) {
      r += a[i] * b[i];
    }
    return r;
  }

  function add_to(to, a, b) {
    for (var i = 0; i < n; i++) {
      to[i] = a[i] + b[i];
    }
    return to;
  }

  function add(a, b) {
    return add_to(allocate(), a, b);
  }

  function sub_to(to, a, b) {
    for (var i = 0; i < n; i++) {
      to[i] = a[i] - b[i];
    }
    return to;
  }

  function sub(a, b) {
    return sub_to(allocate(), a, b);
  }


  function scale_to(to, a, t) {
    for (var i = 0; i < n; i++) {
      to[i] = a[i] * t;
    }
    return to;
  }

  function scale(a, t) {
    return scale_to(allocate(), a, t);
  }

  return {
    allocate,
    create,
    fill,
    dot,

    add_to,
    sub_to,
    scale_to,
    add,
    sub,
    scale
  };

}

export function vec_n(n) {
  return vec_nx(n, n => new Int32Array(n));
}