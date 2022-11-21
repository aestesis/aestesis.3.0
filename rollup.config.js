import resolve from '@rollup/plugin-node-resolve'; // locate and bundle dependencies in node_modules (mandatory)
import { terser } from "rollup-plugin-terser"; // code minification (optional)
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
	input: 'src/main.js',
	output: [
		{
			name: 'aestesis 3.0',
			file: 'app/bundle.js',
			sourcemap: 'inline'
		}
	],
	plugins: [
		resolve(),
		terser(),
//		serve('app'),
//		livereload('app'),
	]
};
