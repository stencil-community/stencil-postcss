import pkg from './package.json';


export default {
  input: 'dist/index.js',

  external: [
    'path',
    'postcss'
  ],

  output: [{
      format: 'cjs',
      file: pkg.main
    },
    {
      format: 'es',
      file: pkg.module
    }
  ]
};
