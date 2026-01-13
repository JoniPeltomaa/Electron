const { app, BrowserWindow } = require("electron");
const path = require("path");

console.log("Electron start");


function createWindow() {
 try {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    win.loadFile(path.join(__dirname, "build", "index.html"));
  } catch (err) {
    console.error("Window creation failed:", err);
  }



}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


