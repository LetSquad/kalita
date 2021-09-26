declare module "electron-connect" {
    import { BrowserWindow } from "electron";

    function create(browserWindow: BrowserWindow, options?: any, cb?: any): any;

    export const client: { create: typeof create };
}
