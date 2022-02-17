import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import { viteMockServe } from 'vite-plugin-mock';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';
// https://vitejs.dev/config/
export default defineConfig({
	// 公共路径测试是绝对路径，生产是相对路径
	base: process.env.NODE_ENV === 'production' ? process.env.VITE_PUBLIC_PATH : './',
	css: {
		postcss: {
			plugins: [autoprefixer],
		},
	},
	plugins: [
		vue(),
		ElementPlus({
			//elementui的样式插件
			importStyle: 'sass',
			useSource: true,
		}),
		Components({
			//elementui 组件的自动导入插件
			resolvers: [ElementPlusResolver()],
		}),
		//todo 配置mockjs模拟请求数据的
		viteMockServe({ supportTs: false }),
	],
	resolve: {
		//todo 配置别名
		alias: {
			'/@': resolve(__dirname, './src/components'),
		},
	},
	server: {
		proxy: {
			//代理（解决跨域问题）
			'/api': {
				target: 'https://test.okall.com.cn/mall/api',
				ws: true,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
	// build: {
	// 	outDir: 'dist',
	// 	minify: 'esbuild',
	// 	sourcemap: false,//打包后不生成sourcemap文件
	// 	chunkSizeWarningLimit: 1500,
	// },
});
