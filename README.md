<div style="text-align: center; margin: 0 auto;">

<img src="./rsbuild-plugin-angular.png" alt="Rsbuild Plugin Angular" />

# Angular Rspack and Rsbuild Tools

[![GitHub Actions](https://github.com/nrwl/angular-rspack/actions/workflows/ci.yml/badge.svg)](https://github.com/nrwl/angular-rspack/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/License-MIT-blue)

[![NPM Version](https://img.shields.io/npm/v/%40ng-rspack%2Fbuild?label=%40ng-rspack%2Fbuild)](https://www.npmjs.com/package/@ng-rspack/build)
[![NPM Version](https://img.shields.io/npm/v/%40ng-rsbuild%2Fplugin-angular?label=%40ng-rsbuild%2Fpluigin-angular)](https://www.npmjs.com/package/@ng-rsbuild/plugin-angular)

</div>

<hr>

# Build Angular with Rspack and Rsbuild

The goal of `@nx/angular-rspack` and `@nx/angular-rsbuild` is to make it easy and straightforward to build Angular applications with [Rspack](https://rspack.dev) and [Rsbuild](https://rsbuild.dev).

## Configuration

Configuration is **controlled entirely** via the **Rspack/Rsbuild config**.  
Both tools offer a `createConfig` function to **aid in the creation of the configuration**.

- [Rspack Configuration Guide](https://www.rspack.dev/docs/config/)
- [Rsbuild Configuration Guide](https://modern-js.dev/en/rsbuild/docs/config/)

## Documentation

The documentation for this project can be found at [angular-rspack.dev](https://angular-rspack.dev).

---

## Feature Parity

The following aims to compare features of **Rspack** and **Rsbuild**, and it's Angular wrapper with **[Angular's standards](https://angular.dev/)** ([Angular CLI](https://github.com/angular/angular-cli) and [Webpack](https://webpack.js.org/)/[esbuild](https://esbuild.github.io/)).

Rspack and Rsbuild are modern, high-performance JavaScript build tools designed as alternatives to Webpack and other traditional bundlers.

### 📌 Mapping @nx/angular-rspack & @nx/angular-rsbuild Packages to Angular CLI Components

This table maps the key `angular-rspack` and `angular-rsbuild` packages to their equivalent Angular CLI components to show how Rspack and Rsbuild replace or mirror Angular CLI's system.

#### Package Comparison

| angular-rspack / angular-rsbuild Package                                                              | New Equivalent in Angular CLI / DevKit                                                      | Old Equivalent in Angular CLI / DevKit                                                                    | Description                                                                                    |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [@nx/angular-rspack](https://github.com/nrwl/angular-rspack/tree/main/packages/build)                 | [@angular/build](https://github.com/angular/angular/tree/main/packages/build)               | [@angular-devkit/build-angular](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit) | Core build system for ng-rspack, replacing Angular CLI's Webpack-based builder.                |
| [@nx/angular-rspack-compiler](https://github.com/nrwl/angular-rspack/tree/main/packages/compiler)     | [@angular/build](https://github.com/angular/angular/tree/main/packages/build)               | [@angular/build](https://github.com/angular/angular/tree/main/packages/compiler)                          | Compiler for Angular applications using Rspack, leveraging abstractions from `@angular/build`. |
| [@nx/angular-rsbuild](https://github.com/nrwl/angular-rspack/tree/main/packages/build-plugin-angular) | [@angular/build](https://github.com/angular/angular/tree/main/packages/build) (Builder API) | [@angular-devkit/build-angular](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit) | Rsbuild plugin for Angular projects, similar to Angular CLI's Webpack-based builder API.       |

### Feature Comparisons

_Legend:_

- ✅ Fully Supported
- ⚠️ Partial Support
- ❌ Not Supported
- 🔘 Not Applicable
- 🌟 Best-in-Class

| Feature                                       | State | angular-rspack / angular-rsbuild Package                                                                                                                                                      | State | New Equivalent (@angular/build)                                               | State | Old Equivalent (@angular-devkit)                                                                          | Notes                                                                                                                       |
| --------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Builder / Build Performance**               | ✅🌟  | [1] [Rspack](https://rspack.dev/) / [Rsbuild](https://github.com/web-infra-dev/rsbuild)                                                                                                       | ✅    | [Angular Esbuild](https://angular.dev/guide/build#esbuild)                    | ⚠️    | [Webpack](https://webpack.js.org/)                                                                        | Rspack & Rsbuild (Rust-based) are optimized for performance. New Angular uses Esbuild, replacing Webpack for faster builds. |
| **Plugins & Loaders**                         | ✅    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         |                                                                                                                             |
| - CSS Loader                                  | ✅    | [CSS Loader](https://rspack.dev/plugin/css/)                                                                                                                                                  | ✅    | [CSS Loader](https://webpack.js.org/loaders/css-loader/)                      | ✅    | [CSS Loader](https://webpack.js.org/loaders/css-loader/)                                                  |                                                                                                                             |
| - SCSS/SASS Loader                            | ✅    | [SCSS Loader](https://rspack.dev/plugin/sass/)                                                                                                                                                | ✅    | [SCSS Loader](https://webpack.js.org/loaders/sass-loader/)                    | ✅    | [SCSS Loader](https://webpack.js.org/loaders/sass-loader/)                                                |                                                                                                                             |
| - LESS Loader                                 | ✅    | [LESS Loader](https://rspack.dev/plugin/less/)                                                                                                                                                | ✅    | [LESS Loader](https://webpack.js.org/loaders/less-loader/)                    | ✅    | [LESS Loader](https://webpack.js.org/loaders/less-loader/)                                                |                                                                                                                             |
| - Style Loader                                | 🚧    | [Style Loader](https://rspack.dev/plugin/style/)                                                                                                                                              | ✅    | [Style Loader](https://webpack.js.org/loaders/style-loader/)                  | ✅    | [Style Loader](https://webpack.js.org/loaders/style-loader/)                                              |                                                                                                                             |
| **Configuration File (Bundler)**              | ✅    | [Rspack Config (`rspack.config.js`)](https://rspack.dev/config/)                                                                                                                              | ✅    | [Angular JSON (`angular.json`)](https://angular.dev/guide/workspace-config)   | ✅    | [Webpack Config (`webpack.config.js`)](https://webpack.js.org/configuration/)                             | Angular combines bundler and builder configs in one file (`angular.json`)                                                   |
| **Configuration File (Builder)**              | ✅    | [Rsbuild Config (`rsbuild.config.ts`)](https://github.com/web-infra-dev/rsbuild)                                                                                                              | ✅    | [Angular JSON (`angular.json`)](https://angular.dev/guide/workspace-config)   | ✅    | [Webpack Config (`webpack.config.js`)](https://webpack.js.org/configuration/)                             |                                                                                                                             |
| **Compiler**                                  | ✅    | [@nx/angular-rspack-compiler](https://github.com/nrwl/angular-rspack/tree/main/packages/compiler)                                                                                             | ✅    | [@angular/build](https://github.com/angular/angular/tree/main/packages/build) | ✅    | [@angular/compiler](https://github.com/angular/angular/tree/main/packages/compiler)                       |                                                                                                                             |
| **Automatic Downleveling via `browserslist`** | ❌    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         | Can be supported via [Rspack Target](https://rspack.dev/config/target#browserslist)                                         |
| **Build Flags (`NG_BUILD_MANGLE=0`, etc.)**   | ❌    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         | No method to override SWC options                                                                                           |
| **HMR (Hot Module Replacement)**              | ⚠️    | [@nx/angular-rspack](https://github.com/nrwl/angular-rspack/tree/main/packages/build) [@nx/angular-rsbuild](https://github.com/nrwl/angular-rspack/tree/main/packages/rsbuild-plugin-angular) | ✅    | [@angular/build](https://github.com/angular/angular/tree/main/packages/build) | ✅    | [@angular-devkit/build-angular](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit) |                                                                                                                             |
| **TypeScript Handling**                       | ✅    | [Rspack SWC](https://rspack.dev/config/module#using-swc)                                                                                                                                      | ✅    | [Angular Esbuild](https://angular.dev/guide/build#esbuild)                    | ✅    | [Webpack TypeScript](https://webpack.js.org/guides/typescript/)                                           | Rspack uses SWC, Angular uses Esbuild                                                                                       |
| **Tree Shaking**                              | ✅    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         |                                                                                                                             |
| **Asset Management**                          | ✅    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         |                                                                                                                             |
| **Development Server**                        | ✅    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         |                                                                                                                             |
| **Schematics**                                | ⚠️    | -                                                                                                                                                                                             | ✅    | -                                                                             | ✅    | -                                                                                                         |                                                                                                                             |
| - Generate Application                        | ⚠️    | -                                                                                                                                                                                             | ✅    | `ng generate app`                                                             | ✅    | `ng generate app`                                                                                         |                                                                                                                             |
| - Serve Application                           | ✅    | -                                                                                                                                                                                             | ✅    | `ng serve`                                                                    | ✅    | `ng serve`                                                                                                |                                                                                                                             |
| - Build Application                           | ✅    | -                                                                                                                                                                                             | ✅    | `ng build`                                                                    | ✅    | `ng build`                                                                                                |                                                                                                                             |
| **Migration from Webpack**                    | ✅    | -                                                                                                                                                                                             | ⚠️    | -                                                                             | ⚠️    | -                                                                                                         | Rspack serves as a drop-in replacement for Webpack; Angular is transitioning to Esbuild                                     |

- [1] For build speed comparison see [benchmarks](https://github.com/Coly010/ng-bundler-benchmark)

---
