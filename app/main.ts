import electron from "electron";
import isElectronDev from "electron-is-dev";
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { client } from "electron-connect";
import { initialize as remoteInitialize } from "@electron/remote/main";

const {
    app,
    BrowserWindow,
    Menu
} = electron;

if (!isElectronDev) {
    app.on("browser-window-created", (e, window) => {
        if (process.platform === "darwin") {
            window.setMenu(Menu.buildFromTemplate([{ // иначе не работает CmdC, CmdV, CmdX
                label: "Edit",
                submenu: [
                    {
                        label: "Cut",
                        accelerator: "CmdOrCtrl+X"
                    },
                    {
                        label: "Copy",
                        accelerator: "CmdOrCtrl+C"
                    },
                    {
                        label: "Paste",
                        accelerator: "CmdOrCtrl+V"
                    }
                ]
            }]));
        } else {
            window.setMenu(null);
        }
    });
}

function loadMain() {
    const screenWidth = electron.screen.getPrimaryDisplay().size.width;
    const screenHeight = electron.screen.getPrimaryDisplay().size.height;

    remoteInitialize();

    const mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        minWidth: 1366,
        minHeight: 768,
        show: false,
        webPreferences: {
            devTools: isElectronDev,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });
    mainWindow.loadURL(isElectronDev ? "http://localhost:8085" : `file://${__dirname}/index.html`);
    mainWindow.once("ready-to-show", () => {
        if (isElectronDev) {
            client.create(mainWindow);
        }
        mainWindow.show();
    });
    if (screenWidth === 1366 && screenHeight === 768) {
        mainWindow.maximize();
        mainWindow.setResizable(false);
    } else {
        mainWindow.setResizable(true);
    }

    mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

    function close() {
        app.quit();
    }

    mainWindow.once("close", close);
}

app.on("window-all-closed", () => {
    app.quit();
});

app.on("quit", () => {
    app.quit();
});

app.whenReady()
    .then(() => {
        if (isElectronDev) {
            installExtension(REACT_DEVELOPER_TOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((error) => console.log("An error occurred:", error));
            installExtension(REDUX_DEVTOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((error) => console.log("An error occurred:", error));
        }

        loadMain();
    });
