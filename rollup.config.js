import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import json from '@rollup/plugin-json';
import preserveDirectives from 'rollup-preserve-directives';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

// 自定义插件：复制JSON文件和CSS变量文件到共享的dist目录（只执行一次）
const copyAssetsPlugin = () => {
  let hasCopied = false;
  
  return {
    name: 'copy-assets',
    async writeBundle() {
      // 确保只复制一次，避免重复执行
      if (hasCopied) return;
      hasCopied = true;
      
      try {
        // 1. 复制国际化JSON文件
        const localesDir = path.join(process.cwd(), 'src', 'i18n', 'locales');
        const sharedLocalesDir = path.join(process.cwd(), 'dist', 'i18n', 'locales');
        
        await fsPromises.mkdir(sharedLocalesDir, { recursive: true });
        
        const files = await fsPromises.readdir(localesDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        for (const file of jsonFiles) {
          const sourcePath = path.join(localesDir, file);
          const destPath = path.join(sharedLocalesDir, file);
          
          const content = await fsPromises.readFile(sourcePath, 'utf8');
          await fsPromises.writeFile(destPath, content);
          console.log(`Copied ${file} to shared dist/i18n/locales directory`);
        }
        
        // 2. 复制CSS变量文件
         const variablesCssSourcePath = path.join(process.cwd(), 'src', 'components', 'variables.css');
         const variablesCssDestPath = path.join(process.cwd(), 'dist', 'variables.css');
         
         if (fs.existsSync(variablesCssSourcePath)) {
           const variablesContent = await fsPromises.readFile(variablesCssSourcePath, 'utf8');
           await fsPromises.writeFile(variablesCssDestPath, variablesContent);
           console.log('Copied variables.css to dist directory');
         }
         
         // 3. 复制Less变量文件
         const variablesLessSourcePath = path.join(process.cwd(), 'src', 'components', 'variables.less');
         const variablesLessDestPath = path.join(process.cwd(), 'dist', 'variables.less');
         
         if (fs.existsSync(variablesLessSourcePath)) {
           const variablesLessContent = await fsPromises.readFile(variablesLessSourcePath, 'utf8');
           await fsPromises.writeFile(variablesLessDestPath, variablesLessContent);
           console.log('Copied variables.less to dist directory');
         }
        
        console.log('All assets copied to dist directory successfully');
      } catch (error) {
        console.error('Error copying assets:', error);
      }
    }
  };
};
export default {
  input: 'src/components/index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: false,
      interop: 'auto',
    },
    {
      dir: 'dist/es',
      format: 'es',
      sourcemap: false,
      // Enable tree-shaking for ES modules
      preserveModules: true,
      preserveModulesRoot: 'src/components',
    },
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  treeshake: {
    // Enable aggressive tree-shaking
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      dedupe: ['react', 'react-dom'],
      preferBuiltins: false,
    }),
    json(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json', // 使用标准tsconfig，类型声明通过其他方式处理
      compilerOptions: {
        module: 'ESNext',
        target: 'ES5',
        // Ensure ES modules are output for tree-shaking
        isolatedModules: true,
      },
    }),
    preserveDirectives(),
    postcss({
      plugins: [autoprefixer()],
      extract: true,
      minimize: false,
      sourceMap: false,
      // 确保CSS导入和变量被正确处理
      inject: false,
      modules: false,
    }),
    terser({
      format: {
        comments: false,
      },
      // Optimize for tree-shaking
      mangle: {
        keep_classnames: false,
        keep_fnames: false,
      },
      compress: {
        // Preserve directives like "use client" and "use server"
        directives: false,
      },
    }),
    copyAssetsPlugin(),
  ],
};
