const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');

const DESTINATION_FOLDER = 'dist';

const LIBRARY_FILE_NAME = 'log-data-renderer';
const LIBRARY_VAR_NAME = 'LogDataRenderer';

const plugins = [
  resolve(),
  //flow(),
  babel({
    plugins: [
      '@babel/plugin-external-helpers',
      '@babel/plugin-transform-flow-strip-types',
      '@babel/plugin-syntax-object-rest-spread',
      'babel-plugin-transform-class-properties',
    ],
    exclude: 'node_modules/**',
    externalHelpers: true,
    babelrc: false,
  }),
  commonjs(),
  json(),
];

module.exports.cjsConfig = {
  input: 'source/index.js',
  output: [
    {
      file: 'index.js',
      sourcemap: true,
      exports: 'named',
      format: 'cjs',
    },
  ],
  plugins,
  external: ['@actualwave/closure-value', '@actualwave/get-class'],
};
