# FrontTopicsEditPluginDemo

[English](README.md)

FrontTopicsEditPluginDemo のフロントエンドコードです。

## Prerequisites

まず、必要なものをインストールしてください。

1. Node (<https://nodejs.org/>)

## Prettier

Prettier を使ってコードフォーマットを統一しています。

Lint で Prettier に関するエラーが出たら、`npm run lint:fix` を実行するか、エディタで保存する度に Prettier を実行するように設定してください。

## ESLint

ESLint を使って静的検証を行っています。
静的検証が失敗する場合はビルドできないようになっています。

_(開発時に ESLint にエラー出ていてもビルドを失敗させないようにしたい場合は環境変数 `RCMS_ESLINT_NO_FAIL_DEV=1` を設定してください。)_

ESLint によるエラーが発生した場合、まずは `npm run lint:fix` を実行してみてください。

## Test frameworks

[Jest](https://facebook.github.io/jest/)、[Vue Test Utils](https://vue-test-utils.vuejs.org/) などを利用してテストを実装しています。

## Project structure

プロジェクト構造は以下のようになっています。

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

開発を始める前に、 `npm install` で依存関係をインストールする必要があります。

`test` を起動してから編集すれば、ソースが変わると自動的にテストが実行される。

`watch` を起動してから編集すれば、ソースが変わると自動的にビルドされる。

`serve` を起動してから編集すれば、ソースが変わると自動的にビルドされ、[HMR](https://webpack.js.org/concepts/hot-module-replacement/) を通じてリロードされる。

```sh
npm run test
# Test/edit as needed
npm run serve
# Edit as needed
```

## Testing

_必ずテストが成功してからビルド、コミットするようにしてください。_

```sh
npm run test
# Fix until tests pass
```

## Building

_Note: watch や serve が走っていれば先に `Ctrl+C` で止めておいてください。_

```sh
npm run build
```

## Deploying

ファイルマネージャで `dist/` の中身を `/files/user/js/front-topics-edit-plugin-demo/` にあげてください。

## Using

対象テンプレートに以下の Smarty plugin を使ってください。

HomePage:

```
{rcms_vue_component name="home-page" url="/files/user/js/front-topics-edit-plugin-demo/" keys="vendors.*;HomePage.*"}
```

HelloPage:

```
{rcms_vue_component name="hello-page" url="/files/user/js/front-topics-edit-plugin-demo/" keys="vendors.*;HelloPage.*"}
```
