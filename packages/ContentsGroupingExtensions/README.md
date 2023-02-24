# ContentsGroupingExtension

[日本語](README.ja.md)

Frontend code for ContentsGroupingExtension.

---

## Usecase

A plugin that customes contents edit screen for grouping/select child extensions through parent extension.

To begin with,  
Kuroco dashboard does not handle show/hide in each child component,  
renders every of them.  
This plugin will render just only one parent component as a dropdown list element which hides non-selected child extensions.

Note we will hold every values even those inactive child extensions are there.

## Define parent-childrens extension

-   Parent extension has to be **dropdown list**.
-   Child extensions need to apply the parent extension as the parent.
-   Need to input child extension's ID in parent config to link child extensions with parent extension.
    -   See parernt extension configuration in below image as an example.
    -   Child extension's ID can be multiple, identify them with using `,` as a splitting anchor in that case.

[![Image from Gyazo](https://t.gyazo.com/teams/diverta/4c26f1fb1841b6742fe0eae4354265bb.png)](https://diverta.gyazo.com/4c26f1fb1841b6742fe0eae4354265bb)

The result image is like below.

[![Image from Gyazo](https://t.gyazo.com/teams/diverta/89d2906511a6fb1dd1ed034c4d72e16e.png)](https://diverta.gyazo.com/89d2906511a6fb1dd1ed034c4d72e16e)

---

## :construction: Support extensions

Currently, we still be in progress to develop existing extensions, some are not implemented.  
If you want it other than ones done, please raise an issue or give us a PR.

Check the available extensions below.

| extension name   | note |
| ---------------- | ---- |
| Text             |      |
| Textarea         |      |
| Selectbox        |      |
| Image            |      |
| MultipleCheckbox |      |
| Wysiwyg          |      |
| Link             |      |
| FileManager      |      |
| Map              |      |

---

## Prerequisites

First, install the prerequisites.

1. Node (<https://nodejs.org/>)

## Testing

[Jest](https://facebook.github.io/jest/), [Vue Test Utils](https://vue-test-utils.vuejs.org/), etc.

## Project structure

The project structure is as shown below.

```
.
|-- *  # Configuration files, etc.
|-- dist
|   `-- *  # Built code
|-- src
|   |-- index.js  # Index
|   |-- common  # etcs
|   |-- components
|       |-- *.test.js  # Unit tests
|       `-- *.vue  # Vue single file components
`-- __test__  # for general tests using with Jest
```

## Developing

Before beginning development, the dependencies have to be installed by running `npm install`.

`test` runs the automated tests every time the source files change.

`serve` runs the build (for development) with [HMR](https://webpack.js.org/concepts/hot-module-replacement/) every time the source files change.

```sh
npm run test
# Test/edit as needed
npm run serve
# Edit as needed
```

## Storybook

To confirm pattern in a component that could have mutable state,
add Storybook story in `src/stories` when you add a new component.

```sh
# Open Storybook dashboard
npm run storybook
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

Copy the contents of `dist/` to `/files/user/mng_vue_components/`。
