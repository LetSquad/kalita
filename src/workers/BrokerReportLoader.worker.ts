import * as fs from "fs-extra";
import * as xml2js from "xml2js";
import * as XLSXL from "xlsx";
import { BrokerReportEncoding, BrokerReportFormat } from "../models/portfolios/enums";
import { BrokerReportPath } from "../models/portfolios/types";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;

const decoder = new TextDecoder("windows-1251");

ctx.addEventListener("message", (event: MessageEvent<BrokerReportPath>) => {
    fs.readFile(event.data.path)
        .then((file) => {
            switch (event.data.format) {
                case BrokerReportFormat.XML: {
                    const decodedFile = event.data.encoding === BrokerReportEncoding.WIN1251 ? decoder.decode(file) : file;
                    return xml2js.parseStringPromise(decodedFile);
                }
                case BrokerReportFormat.XLSX: {
                    const workBook: XLSXL.WorkBook = XLSXL.read(file);
                    return XLSXL.utils.sheet_to_json(workBook.Sheets[workBook.SheetNames[0]]);
                }
            }
        })
        .then((data) => ctx.postMessage(data));
});

export default null as any;
