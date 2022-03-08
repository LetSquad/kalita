import * as fs from "fs-extra";
import * as XLSXL from "xlsx";
import * as xml2js from "xml2js";

import { getMoexQuotesByIsinCodes, getMoexQuotesByTickers } from "../apis/moexApi";
import {
    BrokerCode,
    BrokerReportEncoding,
    BrokerReportFormat,
    BrokerReportPositionCodeFormat
} from "../models/portfolios/enums";
import { BrokerReportPath } from "../models/portfolios/types";
import { parseOpenBrokerReport } from "../utils/report/openBrokerReoprtUtils";
import { parseTinkoffReport } from "../utils/report/tinkoffBrokerReportUtils";
import { parseVtbReport } from "../utils/report/vtbBrokerReportUtils";

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
        .then((rawReport) => {
            switch (event.data.brokerCode) {
                case BrokerCode.VTB: return parseVtbReport(event.data.brokerName, rawReport);
                case BrokerCode.OPEN_BROKER: return parseOpenBrokerReport(event.data.brokerName, rawReport);
                case BrokerCode.TINKOFF: return parseTinkoffReport(event.data.brokerName, rawReport);
            }
        })
        .then((brokerReport) => {
            switch (event.data.positionCodeFormat) {
                case BrokerReportPositionCodeFormat.ISIN: {
                    return getMoexQuotesByIsinCodes().then((quotes) => ({
                        accountName: brokerReport.accountName,
                        positions: brokerReport.positions.map((position) => {
                            const quote = quotes[position.code];
                            if (quote) {
                                return {
                                    ...position,
                                    code: quote.ticker,
                                    name: quote.name,
                                    currentPrice: quote.price
                                };
                            }
                            return position;
                        })
                    }));
                }
                case BrokerReportPositionCodeFormat.TICKER: {
                    const tickers: string[] = brokerReport.positions.map((positions) => positions.code);
                    return getMoexQuotesByTickers(tickers).then((quotes) => ({
                        accountName: brokerReport.accountName,
                        positions: brokerReport.positions.map((position) => {
                            const quote = quotes[position.code];
                            if (quote) {
                                return {
                                    ...position,
                                    name: quote.name,
                                    currentPrice: quote.price
                                };
                            }
                            return position;
                        })
                    }));
                }
            }
        })
        .then((reportData) => ctx.postMessage({ reportData }))
        .catch((error) => ctx.postMessage({ error }));
});

export default null as any;
