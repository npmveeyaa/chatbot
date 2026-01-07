import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    url({
      include: ['**/*.svg'],
      limit: 0,
      emitFiles: true,
      publicPath: './'
    }),
    resolve({
      extensions: ['.js', '.jsx', '.json']
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { modules: false }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ],
      extensions: ['.js', '.jsx'],
      babelHelpers: 'bundled'
    }),
    postcss({
      extract: 'VeeyaaChatbot.css',
      minimize: true
    }),
    commonjs()
  ]
};

