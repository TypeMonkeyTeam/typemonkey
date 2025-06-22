import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

  // Запретить DevTools:
  win.webContents.on("devtools-opened", () => {
    win.webContents.closeDevTools();
  });

  // Перехват хоткеев, чтобы не открыть DevTools через клавиатуру:
  win.webContents.on("before-input-event", (event, input) => {
    // Ctrl+Shift+I или Cmd+Option+I или F12
    if (
      (input.control || input.meta) &&
      (input.shift && (input.key.toLowerCase() === "i" || input.key.toLowerCase() === "j")) ||
      input.key === "F12"
    ) {
      event.preventDefault();
    }
  });
}

app.setName("TypeMonkey");

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("window-close", () => {
  if (win) win.close();
});

ipcMain.on("window-minimize", () => {
  if (win) win.minimize();
});
