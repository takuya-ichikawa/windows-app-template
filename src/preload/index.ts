import { contextBridge } from "electron";

// メインプロセスの API をレンダラーに安全に公開する場所
// 例: contextBridge.exposeInMainWorld("api", { ... })
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  electron: () => process.versions.electron,
});
