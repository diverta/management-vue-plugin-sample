# ContentsEditSample

[日本語](README.ja.md)

Frontend code for ContentsEditSample.

## Prerequisites

First, install the prerequisites.

1. Node (<https://nodejs.org/>)

## Prettier

Prettier is used for code formatting.

If a Prettier-related error occurs when linting, run `npm run lint:fix` to fix it automatically.
Alternatively, configure your editor to format your code with Prettier on save.

## ESLint

ESLint is used for code linting.
The build process is configures to fail if ESLint fails.

_(To disable failing build on ESLint error, set the environment variable `RCMS_ESLINT_NO_FAIL_DEV=1`.)_

If an ESLint-related error occurs when building, try running `npm run lint:fix` to fix it automatically.

## Testing

[Jest](https://facebook.github.io/jest/), [Vue Test Utils](https://vue-test-utils.vuejs.org/), etc. are used to implement automated tests.

## Project structure

The project structure is as shown below.

```
.
|-- *  # Configuration files, etc.
|-- dist
|   `-- *  # Built code
|-- src
|   |-- index.js  # Index
|   |-- common
|   |   |-- *.test.js  # Unit tests
|   |   `-- *.js  # Common scripts
|   |-- components
|   |   |-- *.test.js  # Unit tests
|   |   `-- *.vue  # Vue single file components
`-- tests
    `-- e2e
        `-- *.test.js  # End-to-end tests
```

## Developing

Before beginning development, the dependencies have to be installed by running `npm install`.

`test` runs the automated tests every time the source files change.

`watch` runs the build (for development) every time the source files change.

`serve` runs the build (for development) with [HMR](https://webpack.js.org/concepts/hot-module-replacement/) every time the source files change.

```sh
npm run test
# Test/edit as needed
npm run serve
# Edit as needed
```

## Testing

_Make sure all tests are passing before building and committing._

```sh
npm run test
# Fix until tests pass
```

## Building

_Note: If watch or serve are running, stop them (by pressing `Ctrl+C`) before building._

```sh
npm run build
```

## Deploying

Copy the contents of `dist/` to `/files/user/management-vue-plugin-sample/`。

