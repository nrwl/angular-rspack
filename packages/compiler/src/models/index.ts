import { JavaScriptTransformer } from '@angular/build/src/tools/esbuild/javascript-transformer';
import { ParallelCompilation } from '@angular/build/src/tools/angular/compilation/parallel-compilation';

export { ParallelCompilation, JavaScriptTransformer };
export * from './inline-style-extension';
export * from './file-replacement';
export * from './style-preprocessor-options';
export * from './nodes';
