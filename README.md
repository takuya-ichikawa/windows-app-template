<p align="center">
  <h1 align="center">windows-app-template</h1>
  <p align="center">
    Electron + React + Mantine で作る Windows デスクトップアプリのテンプレート<br>
    Dev Container 対応でクリーンな開発環境をすぐに立ち上げられます
  </p>
</p>

<p align="center">
  <a href="https://github.com/takuya-ichikawa/windows-app-template/actions/workflows/release.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/takuya-ichikawa/windows-app-template/release.yml?label=Release&logo=github&style=flat-square" alt="Release">
  </a>
  <img src="https://img.shields.io/badge/Electron-26-47848F?logo=electron&logoColor=white&style=flat-square" alt="Electron">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/Mantine-8-339AF0?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xNiAyQzguMjY4IDIgMiA4LjI2OCAyIDE2czYuMjY4IDE0IDE0IDE0IDE0LTYuMjY4IDE0LTE0UzIzLjczMiAyIDE2IDJ6bS0xLjk2NCAxOS44ODRIMTF2LTExaDMuMDM2djQuNDU2bDMuNDkzLTQuNDU2SDIxbC00LjIxMyA1LjAzNEwyMSAyMS44ODRIOS40MzZsLTIuNC0zLjc1N3YzLjc1N3oiLz48L3N2Zz4=&logoColor=white&style=flat-square" alt="Mantine">
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white&style=flat-square" alt="Node.js">
  <img src="https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white&style=flat-square" alt="pnpm">
</p>

---

## 技術スタック

| 技術 | バージョン | 役割 |
|------|-----------|------|
| [Electron](https://www.electronjs.org/) | ^26.0.0 | デスクトップアプリフレームワーク |
| [electron-vite](https://electron-vite.org/) | ^5.0.0 | Electron 向け Vite ラッパー（ビルド・開発サーバー） |
| [React](https://react.dev/) | ^19.0.0 | UI ライブラリ |
| [TypeScript](https://www.typescriptlang.org/) | ^5.2.0 | 型安全な JavaScript |
| [Mantine](https://mantine.dev/) | ^8.0.0 | UI コンポーネントライブラリ |
| [PostCSS](https://postcss.org/) + postcss-preset-mantine | — | Mantine CSS 変数・テーマカスタマイズ |

---

## Getting Started

### 前提条件

- [VS Code](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)（Dev Container 利用の場合）
- [Dev Containers 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### セットアップ

**1. リポジトリをクローン**

```bash
git clone https://github.com/takuya-ichikawa/windows-app-template.git
cd windows-app-template
```

**2. Dev Container を起動**

VS Code のコマンドパレット（`Ctrl+Shift+P`）から **「Reopen in Container」** を実行します。

**3. 依存関係をインストール**

```bash
pnpm install
```

---

## 開発コマンド

```bash
# 開発サーバー起動（Dev Container / Linux 環境）
pnpm dev

# プロダクションビルド
pnpm build

# ビルド済みアプリのプレビュー
pnpm start

# Windows 向けインストーラ生成 + GitHub Releases へ公開（CI のみ）
pnpm release
```

---

## リリース手順

注釈付きタグを push するだけで、GitHub Actions が自動でインストーラをビルドして Releases に添付します。

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

> **タグ命名規則**: `v{major}.{minor}.{patch}`（例: `v0.1.0`、`v1.0.0`）  
> `v*` パターンにマッチするタグのみワークフローがトリガーされます。

### CI の流れ

```
タグ push
  └─▶ GitHub Actions (windows-latest)
        ├─ pnpm install
        ├─ pnpm release  →  .exe をビルド
        └─ GitHub Releases へ自動アップロード
```

---

## Auto Update の仕組み

`electron-updater` を使ってこのリポジトリの GitHub Releases から自動更新を行います。  
リポジトリはパブリックのため認証不要です。

> **テンプレート利用時の注意**: `app.setAppUserModelId()` の引数と `build.appId` は必ず一致させてください。  
> 不一致の場合、Windows 通知センターへの登録が失敗し更新通知が表示されません。
