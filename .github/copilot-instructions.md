# 開発ガイド: windows-app-template

> このファイルは開発を進める中で随時更新します。環境・構成に変更があった場合は内容を同期してください。

---

## 開発環境

| 項目 | 内容 |
|------|------|
| 実行環境 | VS Code Dev Container (Debian ベース) |
| ベースイメージ | `mcr.microsoft.com/vscode/devcontainers/typescript-node:20` |
| パッケージマネージャ | `pnpm` |
| Node.js | 20 |

### Dev Container 起動手順

1. VS Code で「Reopen in Container」を実行
2. コンテナ起動後、`pnpm install` で依存関係をインストール

### インストール済み VS Code 拡張機能

| 拡張機能 ID | 用途 |
|-------------|------|
| `GitHub.copilot-chat` | AI コーディング支援 |
| `dbaeumer.vscode-eslint` | 静的解析 |
| `esbenp.prettier-vscode` | フォーマッタ |
| `eamodio.gitlens` | Git 履歴の可視化 |
| `Gruntfuggly.todo-tree` | TODO 一覧 |
| `yoavbls.pretty-ts-errors` | TypeScript エラーの見やすい表示 |
| `ms-vscode.vscode-typescript-next` | TypeScript 最新機能サポート |
| `ms-azuretools.vscode-docker` | Docker 操作 |

---

## 技術スタック

| 技術 | バージョン | 役割 |
|------|-----------|------|
| [Electron](https://www.electronjs.org/) | ^26.0.0 | デスクトップアプリフレームワーク |
| [electron-vite](https://electron-vite.org/) | ^5.0.0 | Electron 向け Vite ラッパー（ビルド・開発サーバー） |
| [React](https://react.dev/) | ^19.0.0 | UI ライブラリ |
| [TypeScript](https://www.typescriptlang.org/) | ^5.2.0 | 型安全な JavaScript |
| [Mantine](https://mantine.dev/) | ^8.0.0 | UI コンポーネントライブラリ |
| [PostCSS](https://postcss.org/) + postcss-preset-mantine | - | Mantine CSS 変数・テーマカスタマイズ |

---

## ディレクトリ構成

```
windows-app-template/
├── .devcontainer/
│   ├── Dockerfile                   # Dev Container のベースイメージと依存設定
│   └── devcontainer.json            # VS Code 拡張機能・ポート転送などの設定
├── .github/
│   ├── workflows/
│   │   └── release.yml              # リリース用 GitHub Actions ワークフロー
│   └── copilot-instructions.md      # このファイル（開発ガイド）
├── src/
│   ├── main/
│   │   ├── index.ts                 # Electron メインプロセス
│   │   └── ipc/                     # IPC ハンドラ（機能ごとに分割）
│   ├── preload/
│   │   └── index.ts                 # Preload スクリプト（contextBridge）
│   └── renderer/
│       ├── assets/                  # 画像・フォントなど静的リソース
│       ├── components/              # 再利用可能な UI コンポーネント
│       ├── hooks/                   # カスタム React フック
│       ├── pages/                   # ページ単位のコンポーネント
│       ├── styles/                  # Mantine テーマ・グローバル CSS
│       ├── App.tsx                  # ルートコンポーネント
│       ├── index.html               # HTML エントリポイント
│       └── index.tsx                # React エントリポイント
├── out/                             # electron-vite ビルド出力先（git 管理外）
├── electron.vite.config.ts          # electron-vite 設定
├── postcss.config.cjs               # PostCSS 設定（Mantine CSS 変数対応）
├── tsconfig.json                    # TypeScript 設定（ルート）
├── tsconfig.node.json               # main / preload 用 TypeScript 設定
├── tsconfig.web.json                # renderer 用 TypeScript 設定
├── package.json                     # プロジェクト設定・スクリプト
└── pnpm-lock.yaml                   # 依存関係のロックファイル
```

---

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# 開発モード（Dev Container / Linux 環境）
pnpm dev

# プロダクションビルド（動作確認用）
pnpm build
pnpm start

# Windows 向けインストーラ生成（CI のみ / windows-latest 上で実行）
pnpm dist
```

---

## リリース手順

1. 注釈付きタグを作成して push する

```bash
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

3. GitHub Actions の `Release` ワークフローが自動起動し、`windows-latest` 上で `.exe` をビルド
4. ビルド完了後、GitHub Releases にインストーラ（`.exe`）が自動添付される

> **タグ命名規則**: `v{major}.{minor}.{patch}`（例: `v0.1.0`、`v1.0.0`）  
> `v*` パターンにマッチするタグのみワークフローがトリガーされる。

---

## 現在の構成メモ

- レンダラーは React (TSX) ベース。`src/renderer/App.tsx` がルートコンポーネント
- `contextIsolation: true` / `nodeIntegration: false` のセキュアな設定を採用
- メインプロセスとレンダラー間の通信は `src/preload/index.ts` の `contextBridge` 経由で行う
- UI ライブラリは **Mantine v8**。`MantineProvider` でルートをラップ済み、`defaultColorScheme="dark"` を設定
- テーマカスタマイズは `src/renderer/styles/` に theme ファイルを追加し、`MantineProvider` の `theme` prop に渡す
- IPC ハンドラは `src/main/ipc/` に機能ごとに分割して配置する

---
