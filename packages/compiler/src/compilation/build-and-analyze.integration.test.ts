import { beforeEach, describe, expect, it } from 'vitest';
import { buildAndAnalyzeWithParallelCompilation } from './build-and-analyze'; // Adjust path accordingly
import { ParallelCompilation } from '@angular/build/src/tools/angular/compilation/parallel-compilation';
import { JavaScriptTransformer } from '@angular/build/src/tools/esbuild/javascript-transformer';
import * as path from 'node:path';

describe('buildAndAnalyzeWithParallelCompilation execution', () => {
  let parallelCompilation: ParallelCompilation;
  let javascriptTransformer: JavaScriptTransformer;
  let typescriptFileCache: Map<string, string | Uint8Array>;

  beforeEach(async () => {
    typescriptFileCache = new Map();

    parallelCompilation = new ParallelCompilation(false, false);
    const tsConfigPath =
      './mocks/fixtures/integration/tsconfig-variations/tsconfig.minimal.json';

    await parallelCompilation.initialize(tsConfigPath, {
      transformStylesheet(_: string, __: string): Promise<string | null> {
        return Promise.resolve('MOCK_TRANSFORMED_STYLESHEET');
      },
      processWebWorker: (_: string, __: string) => 'PROCESS_WEB_WORKER',
    });

    javascriptTransformer = new JavaScriptTransformer(
      {
        jit: false,
        sourcemap: false,
      },
      3
    );
  });

  it('should compile and cache transformed TypeScript files', async () => {
    const transformDataSpy = vi.spyOn(javascriptTransformer, 'transformData');
    await expect(
      buildAndAnalyzeWithParallelCompilation(
        parallelCompilation,
        typescriptFileCache,
        javascriptTransformer
      )
    ).resolves.not.toThrow();
    expect(typescriptFileCache.size).toBe(2);
    expect(transformDataSpy).toHaveBeenCalledTimes(2);

    const constTransformedContent = typescriptFileCache.get(
      path.join(
        process.cwd(),
        'mocks/fixtures/integration/tsconfig-variations/const-export.ts'
      )
    );
    expect(constTransformedContent).toMatchInlineSnapshot(`
      ""use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.num42 = void 0;
      exports.num42 = 42;
      "
    `);
    const compTransformedContent = typescriptFileCache.get(
      path.join(
        process.cwd(),
        'mocks/fixtures/integration/tsconfig-variations/component-export.ts'
      )
    );
    expect(compTransformedContent).toMatchInlineSnapshot(`
      ""use strict";
      var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          var desc = Object.getOwnPropertyDescriptor(m, k);
          if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
          }
          Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
          if (k2 === undefined) k2 = k;
          o[k2] = m[k];
      }));
      var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
          Object.defineProperty(o, "default", { enumerable: true, value: v });
      }) : function(o, v) {
          o["default"] = v;
      });
      var __importStar = (this && this.__importStar) || function (mod) {
          if (mod && mod.__esModule) return mod;
          var result = {};
          if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
          __setModuleDefault(result, mod);
          return result;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ComponentExport = void 0;
      const core_1 = require("@angular/core");
      const i0 = __importStar(require("@angular/core"));
      class ComponentExport {
          static ɵfac = function ComponentExport_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ComponentExport)(); };
          static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ComponentExport, selectors: [["ng-component"]], decls: 1, vars: 0, template: function ComponentExport_Template(rf, ctx) { if (rf & 1) {
                  i0.ɵɵtext(0, "Component Export");
              } }, styles: ["MOCK_TRANSFORMED_STYLESHEET"] });
      }
      exports.ComponentExport = ComponentExport;
      (() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ComponentExport, { className: "ComponentExport", filePath: "mocks/fixtures/integration/tsconfig-variations/component-export.ts", lineNumber: 7 }); })();
      "
    `);
  });
});
