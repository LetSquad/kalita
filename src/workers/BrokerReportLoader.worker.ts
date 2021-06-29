import * as fs from "fs-extra";
import * as xml2js from "xml2js";
import { BrokerReportPath } from "../models/table/types";
import { BrokerReportFormat } from "../models/table/enums";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

const decoder = new TextDecoder("windows-1251");

ctx.addEventListener("message", (event: MessageEvent<BrokerReportPath>) => {
    fs.readFile(event.data.path)
        .then((file) => {
            const decodedFile = event.data.format === BrokerReportFormat.XML_WIN1251 ? decoder.decode(file) : file;
            return xml2js.parseStringPromise(decodedFile, { explicitArray: false });
        })
        .then((data) => ctx.postMessage(data));
});

export default null as any;
