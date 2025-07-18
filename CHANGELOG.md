## 21.2.0 (2025-07-16)

### 🚀 Features

- **angular-rspack:** support index transformer ([#118](https://github.com/nrwl/angular-rspack/pull/118))
- **angular-rspack:** include js-based postcss config ([#120](https://github.com/nrwl/angular-rspack/pull/120))
- **angular-rspack:** support pkg scheme importer ([#124](https://github.com/nrwl/angular-rspack/pull/124))
- **angular-rspack,angular-rspack-compiler:** update to angular 20.1.0 ([12d221f](https://github.com/nrwl/angular-rspack/commit/12d221f))

### 🩹 Fixes

- **angular-rspack:** exclude assets from being copied into server build ([#117](https://github.com/nrwl/angular-rspack/pull/117))
- **angular-rspack:** apply SASS deprecation for global stylesheets ([#119](https://github.com/nrwl/angular-rspack/pull/119))
- **angular-rspack:** fix ignore glob for .gitkeep ([#121](https://github.com/nrwl/angular-rspack/pull/121))
- **angular-rspack:** add node_modules to includePaths if populated ([#126](https://github.com/nrwl/angular-rspack/pull/126))
- **angular-rspack:** delete build outputPath only once ([#127](https://github.com/nrwl/angular-rspack/pull/127))
- **angular-rspack:** remove failing node importer ([2870822](https://github.com/nrwl/angular-rspack/commit/2870822))

### ❤️ Thank You

- Colum Ferry @Coly010
- Tobias Lampert @vz-tl
- Zack Yang @zack9433

## 21.1.0 (2025-05-30)

### 🚀 Features

- **angular-rspack,angular-rspack-compiler:** support angular 20 ([#99](https://github.com/nrwl/angular-rspack/pull/99))

### ❤️ Thank You

- Colum Ferry @Coly010

## 21.0.4 (2025-05-21)

### 🩹 Fixes

- **angular-rspack:** ensure mode is set based on optimization settings ([ee5e76b](https://github.com/nrwl/angular-rspack/commit/ee5e76b))

### ❤️ Thank You

- Colum Ferry @Coly010

## 21.0.3 (2025-05-21)

### 🩹 Fixes

- **angular-rspack:** do not generate sourceMaps when disabled ([0ddc1ad](https://github.com/nrwl/angular-rspack/commit/0ddc1ad))

### ❤️ Thank You

- Colum Ferry @Coly010

## 21.0.2 (2025-05-16)

### 🩹 Fixes

- **angular-rspack:** ensure cjs for serve ([#98](https://github.com/nrwl/angular-rspack/pull/98))

### ❤️ Thank You

- Colum Ferry @Coly010

## 21.0.1 (2025-05-14)

### 🚀 Features

- **angular-rspack:** add hmr support ([#78](https://github.com/nrwl/angular-rspack/pull/78))
- **angular-rspack:** add statsJson plugin ([#79](https://github.com/nrwl/angular-rspack/pull/79))
- **angular-rspack:** add poll option ([#80](https://github.com/nrwl/angular-rspack/pull/80))
- **angular-rspack:** add verbose option ([#82](https://github.com/nrwl/angular-rspack/pull/82))
- **angular-rspack:** add progress option ([#83](https://github.com/nrwl/angular-rspack/pull/83))
- **angular-rspack:** add watch option ([#84](https://github.com/nrwl/angular-rspack/pull/84))
- **angular-rspack:** add open option ([#85](https://github.com/nrwl/angular-rspack/pull/85))
- **angular-rspack:** finalize devServer options ([#86](https://github.com/nrwl/angular-rspack/pull/86))
- **angular-rspack:** add granular optimization support ([#89](https://github.com/nrwl/angular-rspack/pull/89))
- **angular-rspack:** add budgets support ([#92](https://github.com/nrwl/angular-rspack/pull/92))
- **angular-rspack:** add appShell option ([#93](https://github.com/nrwl/angular-rspack/pull/93))
- **angular-rspack,angular-rspack-compiler:** reuse existing compilation if exists ([#77](https://github.com/nrwl/angular-rspack/pull/77))

### 🩹 Fixes

- **angular-rspack:** remove options that do not exist in Angular Webpack ([#81](https://github.com/nrwl/angular-rspack/pull/81))
- **angular-rspack:** type warning on budgets ([565b484](https://github.com/nrwl/angular-rspack/commit/565b484))
- **angular-rspack,angular-rspack-compiler:** surface errors from ComponentStylesheetResult ensuring sass andincludePaths are passed ([#87](https://github.com/nrwl/angular-rspack/pull/87))

### ❤️ Thank You

- Colum Ferry @Coly010
- Marvin Scharle @marvinscharle

## 20.9.0 (2025-05-06)

### 🚀 Features

- **angular-rspack:** use development config for serve ([#61](https://github.com/nrwl/angular-rspack/pull/61))
- **angular-rspack:** support static site generation ([#65](https://github.com/nrwl/angular-rspack/pull/65))
- **angular-rspack:** improve styles processing and support tailwindcss v4 ([#70](https://github.com/nrwl/angular-rspack/pull/70))
- **angular-rspack:** add support for more devServer options ([#71](https://github.com/nrwl/angular-rspack/pull/71))

### 🩹 Fixes

- **angular-rspack:** ensure `stylePreprocessorOptions` is correctly used ([#72](https://github.com/nrwl/angular-rspack/pull/72))
- **angular-rspack:** update `@rspack/core` dependency ([#73](https://github.com/nrwl/angular-rspack/pull/73))
- **angular-rspack:** ssg should not run on serve ([#75](https://github.com/nrwl/angular-rspack/pull/75))

### ❤️ Thank You

- Colum Ferry @Coly010
- Leosvel Pérez Espinosa @leosvelperez

## 20.8.2 (2025-04-28)

### 🩹 Fixes

- **angular-rspack:** handle windows disk drive in loader #53 ([#64](https://github.com/nrwl/angular-rspack/pull/64), [#53](https://github.com/nrwl/angular-rspack/issues/53))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.8.1 (2025-04-28)

### 🩹 Fixes

- **angular-rspack:** do not rely on nx workspace ([#62](https://github.com/nrwl/angular-rspack/pull/62))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.8.0 (2025-04-25)

### 🩹 Fixes

- **angular-rspack:** mark @angular/localize as optional peer dep ([#60](https://github.com/nrwl/angular-rspack/pull/60))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.8.0-beta.0 (2025-04-25)

### 🚀 Features

- **angular-rspack:** add service-worker support ([#55](https://github.com/nrwl/angular-rspack/pull/55))
- **angular-rspack:** improve entry files handling and index.html generation ([#56](https://github.com/nrwl/angular-rspack/pull/56))
- **angular-rspack,angular-rsbuild:** support web workers ([#58](https://github.com/nrwl/angular-rspack/pull/58))

### 🩹 Fixes

- **angular-rspack:** multiple configurations ([#54](https://github.com/nrwl/angular-rspack/pull/54))
- **angular-rspack:** ensure ngDevMode set correctly by DefinePlugin ([#57](https://github.com/nrwl/angular-rspack/pull/57))

### ❤️ Thank You

- Colum Ferry @Coly010
- Leosvel Pérez Espinosa @leosvelperez

## 20.7.0 (2025-04-15)

This was a version bump only, there were no code changes.

## 20.7.0-beta.0 (2025-04-15)

### 🚀 Features

- **angular-rspack:** add allowedHosts option ([#47](https://github.com/nrwl/angular-rspack/pull/47))
- **angular-rspack:** add support for i18n ([#51](https://github.com/nrwl/angular-rspack/pull/51))
- **angular-rspack,angular-rsbuild:** add define option ([#45](https://github.com/nrwl/angular-rspack/pull/45))
- **angular-rspack,angular-rsbuild:** add preserveSymlinks option ([#48](https://github.com/nrwl/angular-rspack/pull/48))
- **angular-rspack,angular-rsbuild:** add deleteOutputPath option ([#49](https://github.com/nrwl/angular-rspack/pull/49))
- **angular-rspack,angular-rsbuild:** add externalDependencies option ([#50](https://github.com/nrwl/angular-rspack/pull/50))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.6.2 (2025-03-14)

This was a version bump only, there were no code changes.

## 20.6.2-beta.0 (2025-03-14)

### 🩹 Fixes

- **angular-rspack-compiler:** depend directly on @angular/build ([82b8713](https://github.com/nrwl/angular-rspack/commit/82b8713))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.6.1 (2025-03-14)

### 🩹 Fixes

- **angular-rspack:** publicPath for server should not be auto ([110cf85](https://github.com/nrwl/angular-rspack/commit/110cf85))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.6.0 (2025-03-14)

This was a version bump only, there were no code changes.

## 20.6.0-beta.1 (2025-03-14)

### 🩹 Fixes

- **angular-rspack:** stylesheet should be attached to html ([#41](https://github.com/nrwl/angular-rspack/pull/41))

### ❤️ Thank You

- Colum Ferry @Coly010

## 20.6.0-beta.0 (2025-03-14)

### 🚀 Features

- **angular-rspack:** support `host` option for the dev server ([#38](https://github.com/nrwl/angular-rspack/pull/38))

### 🩹 Fixes

- **angular-rspack:** fix assets normalization ([#39](https://github.com/nrwl/angular-rspack/pull/39))
- **angular-rspack:** process styles correctly handling urls ([#40](https://github.com/nrwl/angular-rspack/pull/40))

### ❤️ Thank You

- Colum Ferry @Coly010
- Leosvel Pérez Espinosa @leosvelperez

## 20.5.0-beta.3 (2025-03-12)

This was a version bump only, there were no code changes.

## 19.0.0-alpha.29 (2025-03-03)

### 🚀 Features

- **build,rsbuild-plugin-angular:** add support for incremental hydration ([#124](https://github.com/nrwl/angular-rspack/pull/124))
- **compiler:** add support for stylePreprocessorOptions ([#108](https://github.com/nrwl/angular-rspack/pull/108))

### 🩹 Fixes

- improve code quality ([#115](https://github.com/nrwl/angular-rspack/pull/115))

### ❤️ Thank You

- Colum Ferry @Coly010
- Michael Hladky @BioPhoton

## 19.0.0-alpha.28 (2025-02-21)

### 🚀 Features

- **build:** add type checking ([#83](https://github.com/nrwl/angular-rspack/pull/83))
- **compiler:** support Angular 19.1 ([#97](https://github.com/nrwl/angular-rspack/pull/97))
- **compiler:** use ComponentStylesheetBundler to handle stylesheets ([#98](https://github.com/nrwl/angular-rspack/pull/98))
- **docs:** add migration from webpack docs ([#91](https://github.com/nrwl/angular-rspack/pull/91))

### ❤️ Thank You

- Colum Ferry @Coly010

## 19.0.0-alpha.27 (2025-02-18)

### 🚀 Features

- **build:** add type checking ([#83](https://github.com/nrwl/angular-rspack/pull/83))
- **compiler:** support Angular 19.1 ([#97](https://github.com/nrwl/angular-rspack/pull/97))
- **docs:** add migration from webpack docs ([#91](https://github.com/nrwl/angular-rspack/pull/91))

### ❤️ Thank You

- Colum Ferry @Coly010

## 19.0.0-alpha.26 (2025-02-02)

### 🚀 Features

- **build:** add type checking ([#83](https://github.com/nrwl/angular-rspack/pull/83))

### ❤️ Thank You

- Colum Ferry @Coly010

## 19.0.0-alpha.25 (2025-02-01)

### 🚀 Features

- **compiler:** remove unused non-parallel compilation ([#81](https://github.com/nrwl/angular-rspack/pull/81))
- **compiler:** add ts proj ref flag ([#82](https://github.com/nrwl/angular-rspack/pull/82))
- **rsbuild-plugin-angular:** remove non parallel build ([#80](https://github.com/nrwl/angular-rspack/pull/80))

### ❤️ Thank You

- Colum Ferry @Coly010

## 19.0.0-alpha.24 (2025-01-24)

### 🩹 Fixes

- **build:** ensure advancedOptimizations are run ([ca5bdcf](https://github.com/nrwl/angular-rspack/commit/ca5bdcf))

### ❤️ Thank You

- Colum Ferry @Coly010

## 19.0.0-alpha.23 (2025-01-24)

### 🩹 Fixes

- **build:** rspack plugin double processing transpiled files ([0baf7dd](https://github.com/nrwl/angular-rspack/commit/0baf7dd))
- **compiler:** ensure all ts files are processed correctly ([94180f8](https://github.com/nrwl/angular-rspack/commit/94180f8))
- **rsbuild-plugin-angular:** close parallel compilation workers ([#76](https://github.com/nrwl/angular-rspack/pull/76))

### ❤️ Thank You

- Colum Ferry @Coly010
- Edouard Bozon

## 19.0.0-alpha.22 (2025-01-23)

This was a version bump only, there were no code changes.

## 19.0.0-alpha.21 (2025-01-23)

### 🩹 Fixes

- **build:** do not use advanccedOptimizations ([88d17b5](https://github.com/nrwl/angular-rspack/commit/88d17b5))
- **compiler:** use sass-embedded compileString ([8077778](https://github.com/nrwl/angular-rspack/commit/8077778))

### ❤️ Thank You

- Colum Ferry @Coly010

## 19.0.0-alpha.20 (2025-01-22)

### 🚀 Features

- **build:** allow creating server config via util ([19205fb](https://github.com/nrwl/angular-rspack/commit/19205fb))
- **compiler:** add compiler package to house compiler logic ([#63](https://github.com/nrwl/angular-rspack/pull/63))
- **docs:** add docs site ([#42](https://github.com/nrwl/angular-rspack/pull/42))
- **nx:** fix compiler options for rspack ([b677061](https://github.com/nrwl/angular-rspack/commit/b677061))
- **rsbuild-plugin-angular:** add initial package ([#30](https://github.com/nrwl/angular-rspack/pull/30))
- **rsbuild-plugin-angular:** add createServer util ([39840fd](https://github.com/nrwl/angular-rspack/commit/39840fd))
- **rsbuild-plugin-angular:** correctly set ng env vars ([b81c6d8](https://github.com/nrwl/angular-rspack/commit/b81c6d8))
- **rsbuild-plugin-angular:** expose express app from createServer for modification ([002d602](https://github.com/nrwl/angular-rspack/commit/002d602))
- **rsbuild-plugin-angular:** update dev server config ([efde6fc](https://github.com/nrwl/angular-rspack/commit/efde6fc))
- **rsbuild-plugin-angular:** setup rsbuild environments correctly ([8265f96](https://github.com/nrwl/angular-rspack/commit/8265f96))
- **rsbuild-plugin-angular:** handle ssr dev server changes ([7475540](https://github.com/nrwl/angular-rspack/commit/7475540))
- **rsbuild-plugin-angular:** improve build speed using parallel compilation ([becac29](https://github.com/nrwl/angular-rspack/commit/becac29))
- **rsbuild-plugin-angular:** allow overriding paths to static assets ([2c6f318](https://github.com/nrwl/angular-rspack/commit/2c6f318))
- **rsbuild-plugin-angular:** add withConfigurations and fileReplacement support #43 ([#46](https://github.com/nrwl/angular-rspack/pull/46), [#43](https://github.com/nrwl/angular-rspack/issues/43))
- **rsbuild-plugin-angular:** use compileStringAsync for faster sass compilation #61 ([#62](https://github.com/nrwl/angular-rspack/pull/62), [#61](https://github.com/nrwl/angular-rspack/issues/61))
- **rsbuild-plugin-nx:** add nx plugin ([9d9dcc1](https://github.com/nrwl/angular-rspack/commit/9d9dcc1))
- **rsbuild-plugin-nx:** ensure style is set in createConfig ([d90bee5](https://github.com/nrwl/angular-rspack/commit/d90bee5))

### 🩹 Fixes

- **docs:** deploy ([5cec56e](https://github.com/nrwl/angular-rspack/commit/5cec56e))
- **docs:** content should be below navbar ([137b7c9](https://github.com/nrwl/angular-rspack/commit/137b7c9))
- **docs:** hero container should be full size ([1932873](https://github.com/nrwl/angular-rspack/commit/1932873))
- **docs:** mobile ui tidy up ([d883ace](https://github.com/nrwl/angular-rspack/commit/d883ace))
- **docs:** mobile styling ([89f6c8e](https://github.com/nrwl/angular-rspack/commit/89f6c8e))
- **docs:** add seo emta ([2928bda](https://github.com/nrwl/angular-rspack/commit/2928bda))
- **docs:** plugin package name in get started guide ([#47](https://github.com/nrwl/angular-rspack/pull/47))
- **nx:** fix lint ([#48](https://github.com/nrwl/angular-rspack/pull/48))
- **rsbuild-plugin-angular:** only set isServer when running in server env ([48332d1](https://github.com/nrwl/angular-rspack/commit/48332d1))
- **rsbuild-plugin-angular:** handle ssr dev server live reloads ([481dfcb](https://github.com/nrwl/angular-rspack/commit/481dfcb))
- **rsbuild-plugin-angular:** ensure package patch is resolved correctly ([b11ae63](https://github.com/nrwl/angular-rspack/commit/b11ae63))
- **rsbuild-plugin-angular:** process all npm packages in build ([0361bc7](https://github.com/nrwl/angular-rspack/commit/0361bc7))
- **rsbuild-plugin-angular:** force rsbuild to use node.js module resolution ([34b6b80](https://github.com/nrwl/angular-rspack/commit/34b6b80))
- **rsbuild-plugin-angular:** ensure ssr server serves assets correctly ([0a69b55](https://github.com/nrwl/angular-rspack/commit/0a69b55))
- **rsbuild-plugin-angular:** allow tsconfig sourcemap pass through ([#56](https://github.com/nrwl/angular-rspack/pull/56))
- **rsbuild-plugin-nx:** ensure plugin-angular is installed ([0d60730](https://github.com/nrwl/angular-rspack/commit/0d60730))

### ❤️ Thank You

- Colum Ferry @Coly010
- Michael Hladky @BioPhoton
- Muhammad Faisal @mfa-leanix

## 0.0.35 (2024-12-29)

### 🚀 Features

- **build:** add ssr support ([#29](https://github.com/nrwl/angular-rspack/pull/29))
- **repo:** add playground apps for testing ([#28](https://github.com/nrwl/angular-rspack/pull/28))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.34 (2024-12-27)

This was a version bump only, there were no code changes.

## 0.0.32 (2024-12-27)

### 🩹 Fixes

- **build:** dependencies ([69fbb4a](https://github.com/nrwl/angular-rspack/commit/69fbb4a))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.31 (2024-12-26)

This was a version bump only, there were no code changes.

## 0.0.30 (2024-12-26)

This was a version bump only, there were no code changes.

## 0.0.29 (2024-12-26)

This was a version bump only, there were no code changes.

## 0.0.28 (2024-12-26)

### 🚀 Features

- **build:** refactor package to prepare for rsbuild ([6f52e19](https://github.com/nrwl/angular-rspack/commit/6f52e19))
- **build:** add rsbuild plugin ([f212c42](https://github.com/nrwl/angular-rspack/commit/f212c42))
- **build:** add rsbuild plugin ([59daf98](https://github.com/nrwl/angular-rspack/commit/59daf98))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.27 (2024-12-19)

### 🩹 Fixes

- **build:** renamed option key to \_option ([#26](https://github.com/nrwl/angular-rspack/pull/26))

### ❤️ Thank You

- Shane Walker @swalker326

## 0.0.26 (2024-11-03)

### 🩹 Fixes

- **build:** plugin should normalize paths for windows ([#24](https://github.com/nrwl/angular-rspack/pull/24))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.25 (2024-10-25)

### 🩹 Fixes

- **repo:** update nx version ([a5f9012](https://github.com/nrwl/angular-rspack/commit/a5f9012))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.24 (2024-10-25)

### 🚀 Features

- **build:** add support for module federation ([#21](https://github.com/nrwl/angular-rspack/pull/21))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.23 (2024-09-28)

### 🩹 Fixes

- **nx:** ensure posix paths in project.json and deps are installed ([#12](https://github.com/nrwl/angular-rspack/pull/12))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.22 (2024-09-27)

### 🚀 Features

- **nx:** add app alias for application generator ([c027319](https://github.com/nrwl/angular-rspack/commit/c027319))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.21 (2024-09-27)

### 🚀 Features

- **nx:** add application generator ([#6](https://github.com/nrwl/angular-rspack/pull/6))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.20 (2024-09-26)

### 🚀 Features

- **build:** support hmr for TS component changes and global styles ([#5](https://github.com/nrwl/angular-rspack/pull/5))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.19 (2024-09-25)

### 🩹 Fixes

- **build:** ensure patch file is included in build ([571c3b8](https://github.com/nrwl/angular-rspack/commit/571c3b8))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.18 (2024-09-25)

### 🚀 Features

- **nx:** add serve executor ([#4](https://github.com/nrwl/angular-rspack/pull/4))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.17 (2024-09-23)

### 🩹 Fixes

- **nx:** add dependency on rspack ([0308d32](https://github.com/nrwl/angular-rspack/commit/0308d32))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.16 (2024-09-23)

### 🩹 Fixes

- **nx:** schema and root option for config ([439cd98](https://github.com/nrwl/angular-rspack/commit/439cd98))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.15 (2024-09-23)

### 🩹 Fixes

- **nx:** update @ng-rspack/build dep ([0facad7](https://github.com/nrwl/angular-rspack/commit/0facad7))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.14 (2024-09-23)

This was a version bump only, there were no code changes.

## 0.0.13 (2024-09-23)

This was a version bump only, there were no code changes.

## 0.0.12 (2024-09-23)

### 🩹 Fixes

- **build:** ensure createConfig has type ([738101d](https://github.com/nrwl/angular-rspack/commit/738101d))
- **nx:** ensure type for createRspackConfig ([ccb0f5c](https://github.com/nrwl/angular-rspack/commit/ccb0f5c))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.11 (2024-09-23)

This was a version bump only, there were no code changes.

## 0.0.10 (2024-09-23)

This was a version bump only, there were no code changes.

## 0.0.9 (2024-09-23)

This was a version bump only, there were no code changes.

## 0.0.8 (2024-09-23)

### 🚀 Features

- **nx:** add nx plugin ([23aacfa](https://github.com/nrwl/angular-rspack/commit/23aacfa))

### 🩹 Fixes

- **build:** use resourcePath for loaders ([5ed803d](https://github.com/nrwl/angular-rspack/commit/5ed803d))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.7 (2024-09-23)

### 🚀 Features

- **build:** add dev server config ([cb734b7](https://github.com/nrwl/angular-rspack/commit/cb734b7))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.6 (2024-09-22)

### 🚀 Features

- **build:** add rxjs esm resolution plugin ([719a85f](https://github.com/nrwl/angular-rspack/commit/719a85f))
- **build:** expose createConfig util ([ce867e1](https://github.com/nrwl/angular-rspack/commit/ce867e1))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.5 (2024-09-21)

### 🩹 Fixes

- **build:** js-loader should not falsy return existing content that needs ast parsing ([fe06d4c](https://github.com/nrwl/angular-rspack/commit/fe06d4c))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.4 (2024-09-21)

### 🩹 Fixes

- **build:** postinstall patch should correctly update exports ([a1539ad](https://github.com/nrwl/angular-rspack/commit/a1539ad))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.3 (2024-09-21)

### 🩹 Fixes

- **build:** postinstall patch should be included ([55fde7d](https://github.com/nrwl/angular-rspack/commit/55fde7d))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.1.0 (2024-09-21)

### 🩹 Fixes

- **build:** postinstall patch should be included ([55fde7d](https://github.com/nrwl/angular-rspack/commit/55fde7d))

### ❤️ Thank You

- Colum Ferry @Coly010

## 0.0.2 (2024-09-21)

This was a version bump only, there were no code changes.

## 0.0.2-alpha.2 (2024-09-21)

This was a version bump only, there were no code changes.

## 0.0.2-alpha.1 (2024-09-21)

This was a version bump only, there were no code changes.
