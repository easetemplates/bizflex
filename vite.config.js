import fs from 'fs';
import { resolve } from 'path';

// Function to dynamically generate entry points for a given directory
function generateEntryPoints(dir) {
	return fs
		.readdirSync(dir)
		.filter((file) => file.endsWith('.html'))
		.reduce((acc, file) => {
			const entryName = file.replace('.html', '');
			acc[entryName] = resolve(__dirname, `${dir}/${file}`);
			return acc;
		}, {});
}

// Dynamically generate entry points for a single directory
const allEntryPoints = generateEntryPoints('./src');

export default {
	base: './',
	root: resolve(__dirname, './src'),
	server: {
		host: true,
		port: 3000,
		hot: true,
		open: true,
		force: true,
		hmr: true,
	},
	plugins: [],
	build: {
		assetsInlineLimit: 0, // 1MB
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		rollupOptions: {
			input: allEntryPoints,
			output: {
				chunkFileNames: 'assets/js/[name].min.js',
				entryFileNames: 'assets/js/[name].min.js',
				assetFileNames: ({ name }) => {
					if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
						return 'assets/images/[name][extname]';
					}
					if (/\.(woff|woff2|eot|ttf|otf)$/.test(name ?? '')) {
						return 'assets/fonts/[name][extname]';
					}
					if (/\.css$/.test(name ?? '')) {
						return 'assets/css/theme.min.css';
					}
					return 'assets/[name][extname]';
				},
			},
		},
	},
	publicDir: '../public',
};
