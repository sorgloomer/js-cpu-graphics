module.exports = grunt => {

  grunt.loadNpmTasks("grunt-rollup");

  const babel_preset = [
    require("babel-plugin-transform-es2015-template-literals"),
    require("babel-plugin-transform-es2015-literals"),
    require("babel-plugin-transform-es2015-function-name"),
    require("babel-plugin-transform-es2015-arrow-functions"),
    require("babel-plugin-transform-es2015-block-scoped-functions"),
    require("babel-plugin-transform-es2015-classes"),
    require("babel-plugin-transform-es2015-object-super"),
    require("babel-plugin-transform-es2015-shorthand-properties"),
    require("babel-plugin-transform-es2015-duplicate-keys"),
    require("babel-plugin-transform-es2015-computed-properties"),
    require("babel-plugin-transform-es2015-for-of"),
    require("babel-plugin-transform-es2015-sticky-regex"),
    require("babel-plugin-transform-es2015-unicode-regex"),
    require("babel-plugin-check-es2015-constants"),
    require("babel-plugin-transform-es2015-spread"),
    require("babel-plugin-transform-es2015-parameters"),
    require("babel-plugin-transform-es2015-destructuring"),
    require("babel-plugin-transform-es2015-block-scoping"),
    require("babel-plugin-transform-es2015-typeof-symbol"),
    [require("babel-plugin-transform-regenerator"), { async: false, asyncGenerators: false }],

    require("babel-plugin-transform-function-bind"),
    require("babel-plugin-external-helpers")
  ];

  grunt.initConfig({
    "rollup": {
      "dist": {
        "options": {
          "format": "iife",
          "plugins": [require("rollup-plugin-babel")({
            "plugins": babel_preset
          })]
        },
        "files": {
          "./dist/bundle.js": "./src/index.js"
        }
      }
    }
  });

  grunt.registerTask("default", "rollup:dist");
};