export class TemplateNode {
  constructor() {
    this.value = null;
    this.hasValue = false;
    this.links = new Map();
  }
}

export class Template {
  constructor(factory) {
    this.factory = factory;
    this.root = new TemplateNode();
  }

  get_item(...args) {
    var node = this.root;
    for (var arg of args) {
      var next_node = node.links.get(arg);
      if (!next_node) {
        next_node = new TemplateNode();
        node.links.set(arg, next_node);
      }
      node = next_node;
    }

    if (!node.hasValue) {
      node.value = null::this.factory(...args);
      node.hasValue = true;
    }
    return node.value;
  }
}

export function template(factory) {
  const cache = new Template(factory);
  return (...args) => cache.get_item(...args);
}
