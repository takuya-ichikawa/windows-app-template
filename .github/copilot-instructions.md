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

---

## ディレクトリ構成

```
windows-app-template/
├── .devcontainer/
│   ├── Dockerfile                   # Dev Container のベースイメージと依存設定
│   └── devcontainer.json            # VS Code 拡張機能・ポート転送などの設定
├── .github/
│   └── copilot-instructions.md      # このファイル（開発ガイド）
├── src/
│   ├── main/
│   │   └── index.ts                 # Electron メインプロセス
│   ├── preload/
│   │   └── index.ts                 # Preload スクリプト（contextBridge）
│   └── renderer/
│       ├── index.html               # HTML エントリポイント
│       ├── index.tsx                # React エントリポイント
│       └── App.tsx                  # ルートコンポーネント
├── out/                             # electron-vite ビルド出力先（git 管理外）
├── electron.vite.config.ts          # electron-vite 設定
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

# 開発モード
pnpm dev           # Dev Container (Linux) ※ WSLg 経由でウィンドウ表示
pnpm dev:win       # Windows 実機

# プロダクションビルド
pnpm build

# ビルド済みを起動
pnpm start         # Dev Container (Linux) ※ WSLg 経由でウィンドウ表示
pnpm start:win     # Windows 実機
```

> Dev Container 内では `DISPLAY` 環境変数が自動設定される（`devcontainer.json` の `remoteEnv` で設定済み）。  
> 初回または Rebuild 前は `DISPLAY=:1 pnpm start` のように手動で付ける。

---

## 現在の構成メモ

- レンダラーは React (TSX) ベース。`src/renderer/App.tsx` がルートコンポーネント
- `contextIsolation: true` / `nodeIntegration: false` のセキュアな設定を採用
- メインプロセスとレンダラー間の通信は `src/preload/index.ts` の `contextBridge` 経由で行う

---
