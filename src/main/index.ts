import { app, BrowserWindow, Menu, shell } from "electron";
import { join } from "path";
import { autoUpdater } from "electron-updater";
import log from "electron-log";

const APP_ID = "com.example.my-electron-app";

// ログ設定
// ファイル出力先 (Windows): %APPDATA%\MyElectronApp\logs\main.log
//   レベル "info" = info / warn / error をファイルに書き込む（verbose / debug / silly は除外）
log.transports.file.level = "info";
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB でローテーション
// コンソール出力:
//   開発中 → "silly"（全レベルをターミナルに表示）
//   パッケージ済み → "warn"（warn / error のみ DevTools に表示）
log.transports.console.level = app.isPackaged ? "warn" : "silly";
// Node.js / Electron の未捕捉例外もログに記録
log.errorHandler.startCatching();

function createWindow(): void {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  log.info(`App starting. version=${app.getVersion()} isPackaged=${app.isPackaged}`);

  // Windows Toast 通知の AppUserModelId を登録（package.json の appId と合わせる）
  app.setAppUserModelId(APP_ID);

  // バージョン情報パネルの設定（ヘルプメニューから表示）
  app.setAboutPanelOptions({
    applicationName: app.getName(),
    applicationVersion: app.getVersion(),
  });

  createWindow();

  // パッケージ済みアプリのみ自動更新チェックを実行
  if (app.isPackaged) {
    autoUpdater.logger = log;
    autoUpdater.on("error", (err) => {
      log.error("[AutoUpdater] error:", err.message ?? err);
    });
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      log.error("[AutoUpdater] checkForUpdatesAndNotify failed:", err.message ?? err);
    });
  }

  const menu = Menu.buildFromTemplate([
    {
      label: "ファイル",
      submenu: [{ role: "quit", label: "終了" }],
    },
    {
      label: "編集",
      submenu: [
        { role: "undo", label: "元に戻す" },
        { role: "redo", label: "やり直す" },
        { type: "separator" },
        { role: "cut", label: "切り取り" },
        { role: "copy", label: "コピー" },
        { role: "paste", label: "貼り付け" },
        { role: "selectAll", label: "すべて選択" },
      ],
    },
    {
      label: "表示",
      submenu: [
        { role: "reload", label: "再読み込み" },
        { role: "forceReload", label: "強制再読み込み" },
        { role: "toggleDevTools", label: "開発者ツール" },
        { type: "separator" },
        { role: "resetZoom", label: "ズームをリセット" },
        { role: "zoomIn", label: "拡大" },
        { role: "zoomOut", label: "縮小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "フルスクリーン" },
      ],
    },
    {
      label: "ウィンドウ",
      submenu: [
        { role: "minimize", label: "最小化" },
        { role: "close", label: "閉じる" },
      ],
    },
    {
      label: "ヘルプ",
      submenu: [
        {
          label: "バージョン情報",
          click: () => app.showAboutPanel(),
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  log.info("App window-all-closed.");
  if (process.platform !== "darwin") app.quit();
});
