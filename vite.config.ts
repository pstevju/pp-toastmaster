import { defineConfig } from 'vite';
import path from 'node:path';
import { version } from './package.json';

export default defineConfig(({ mode }) => ({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/ToastMaster.ts'),
			name: 'ToastMaster',
			fileName: 'pp-toastmaster',
		},
		sourcemap: mode === 'development',
		minify: mode === 'production' ? 'esbuild' : false,
		rollupOptions: {
			// external: ['react', 'react-dom', 'bootstrap', 'feather-icons'],
			output: {
				globals: {
					// 'react': 'React',
					// 'react-dom': 'ReactDOM',
					// 'bootstrap': 'bootstrap',
					// 'feather-icons': 'feather',
				},
			},
		},
	},
	define: {
		__APP_VERSION__: JSON.stringify(`v${version}`),
	}
}));
