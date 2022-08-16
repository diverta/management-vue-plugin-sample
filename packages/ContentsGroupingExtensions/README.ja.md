# ContentsGroupingExtension

[English](README.md)

ContentsGroupingExtension のフロントエンドコードです。

---

## Usecase

コンテンツ編集画面にて、親子の拡張項目をグループ化をするプラグインです。

通常、Kuroco のコンテンツ定義で親子の拡張項目を定義した場合は、子項目を全て表示します。
このプラグインでは親項目を子項目のドロップダウンリストとして表示し、  
そこで指定されたアイテム以外は非表示にします。

あくまで表示/非表示の機能ですので、未指定となり非表示となった子項目でも、その項目が保持する値は消去されないことにご注意ください。

## Define parent-childrens extension

-   親拡張項目は **選択項目** で定義してください。
-   子拡張項目は親に上記親項目を設定してください。
-   親拡張の設定では、子項目の ID を key として指定してください。
    -   一例として、下の画像の親項目の設定をご確認ください。
    -   子項目は一度に複数を選択することが可能です。この場合は`,`で区切ってください。

[![Image from Gyazo](https://t.gyazo.com/teams/diverta/4c26f1fb1841b6742fe0eae4354265bb.png)](https://diverta.gyazo.com/4c26f1fb1841b6742fe0eae4354265bb)

設定すると、コンテンツ編集画面は下の画像のようになります。

[![Image from Gyazo](https://t.gyazo.com/teams/diverta/89d2906511a6fb1dd1ed034c4d72e16e.png)](https://diverta.gyazo.com/89d2906511a6fb1dd1ed034c4d72e16e)

---

## :construction: 対応拡張項目

現状では, 既存のいくつかの種類の拡張項目は未作成で、順次対応中です。  
下記対応済みの拡張項目以外のものについては, Issue をされるかプルリクエストをお願いします.

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

---

## Prerequisites

まず、必要なものをインストールしてください。

1. Node (<https://nodejs.org/>)

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
|   |-- common  # etcs
|   |-- components
|       |-- *.test.js  # Unit tests
|       `-- *.vue  # Vue single file components
`-- __test__  # for general tests using with Jest
```

## Developing

開発を始める前に、 `npm install` で依存関係をインストールする必要があります。

`test` を起動してから編集すれば、ソースが変わると自動的にテストが実行される。

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

ファイルマネージャで `dist/` の中身を `/files/user/mng_vue_components/` にあげてください。
