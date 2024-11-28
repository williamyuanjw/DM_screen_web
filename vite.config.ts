import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
// import postcsspxtoviewport from 'postcss-px-to-viewport';
import postCssPxToRem from 'postcss-pxtorem';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Components({
			resolvers: [AntDesignVueResolver()]
		}),
		viteCompression({
			threshold: 10240 // // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
		}),
		visualizer()
	],
	server: {
		proxy: {
			'/api': {
				// target: 'http://127.0.0.1:8081',
				target: 'http://124.221.177.11',
				// ws: true,
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '')
			}
		}
	},
	resolve: {
		alias: {
			// 键必须以斜线开始和结束
			'@': path.resolve(__dirname, 'src')
		}
		// 忽略后缀名的配置选项,vue不建议这样做，因为会影响IDE和类型支持
		//extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"]
	},
	css: {
		preprocessorOptions: {
			less: {} // less相关配置
		},
		postcss: {
			plugins: [
				// postcsspxtoviewport({
				// 	unitToConvert: 'px', // 要转化的单位
				// 	viewportWidth: 1920, // UI设计稿的宽度
				// 	unitPrecision: 6, // 转换后的精度，即小数点位数
				// 	propList: ['!min-height', '!min-width', '*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
				// 	viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
				// 	fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
				// 	selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
				// 	minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
				// 	mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
				// 	replace: true, // 是否转换后直接更换属性值
				// 	exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
				// 	landscape: false // 是否处理横屏情况
				// })
				postCssPxToRem({
					rootValue: 16, // 1rem的大小
					propList: ['!min-height', '!min-width', '*'], // 需要转换的属性，最小高度和最小宽度不进行转换
					unitPrecision: 5, //保留rem小数点多少位
					selectorBlackList: ['ignore'], //则是一个对css选择器进行过滤的数组，比如你设置为['fs']，那例如fs-xl类名，里面有关px的样式将不被转换，这里也支持正则写法。
					mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
					minPixelValue: 1 //px小于12的不会被转换
				})
			]
		}
	},
	build: {
		// minify: false,
		rollupOptions: {
			output: {
				chunkFileNames: 'js/[name]-[hash].js',
				entryFileNames: 'js/[name]-[hash].js',
				assetFileNames: '[ext]/[name]-[hash].[ext]',
				manualChunks(id) {
					// 简单分割一下 达到优化目的即可
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString();
					}
				}
			}
		}
	}
});
