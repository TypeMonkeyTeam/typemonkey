import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { autoUpdater } from "electron-updater";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let win;

function createWindow() {
  win = new BrowserWindow({
    title: "TypeMonkey",
    width: 1200,
    height: 700,
    resizable: false,
    frame: false,
    icon: path.join(__dirname, "..", "..", "public", "icons", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile(path.join(__dirname, "../../dist/index.html"));

  // 🔒 Запретить DevTools
  win.webContents.on("devtools-opened", () => {
    win.webContents.closeDevTools();
  });

  win.webContents.on("before-input-event", (event, input) => {
    if (
      (input.control || input.meta) &&
      input.shift &&
      (input.key.toLowerCase() === "i" || input.key.toLowerCase() === "j") ||
      input.key === "F12"
    ) {
      event.preventDefault();
    }
  });
}

app.setName("TypeMonkey");

app.whenReady().then(() => {
  createWindow();

  // 🔄 Проверка обновлений
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-available", () => {
    console.log("🔄 Доступно обновление...");
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("✅ Обновление загружено.");

    const choice = dialog.showMessageBoxSync({
      type: "question",
      buttons: ["Перезапустить", "Позже"],
      defaultId: 0,
      title: "Обновление",
      message: "Обновление загружено. Перезапустить приложение сейчас?",
    });

    if (choice === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 📦 Управление окном
ipcMain.on("window-close", () => {
  if (win) win.close();
});

ipcMain.on("window-minimize", () => {
  if (win) win.minimize();
});
