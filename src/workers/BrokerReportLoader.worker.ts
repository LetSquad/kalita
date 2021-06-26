import * as fs from "fs";
import * as xml2js from "xml2js";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

ctx.addEventListener("message", (event: MessageEvent<string>) => {
    fs.readFile(event.data, (_, file) => {
        xml2js.parseStringPromise(file)
            .then((data) => ctx.postMessage(data));
    });
});

export default null as any;
