import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseStringPromise } from "xml2js";
import axios from "axios";
import { Quote } from "../models/apis/types";

interface MoexData {
    document: {
        data: {
            id: string,
            rows: {
                row: MoexQuote[] | MoexQuote;
            }
        }
    }
}

interface MoexQuote {
    SECID: string;
    PREVADMITTEDQUOTE: string;
    SHORTNAME: string;
    ISIN: string;
}

const BOARD_STOCKS = "TQBR";
const BOARD_ETFS = "TQTF";
const BOARD_FUNDS = "TQIF";

const QUOTES_FILTER_LIMIT = 10;

const moexHttpClient = axios.create({
    baseURL: "https://iss.moex.com",
    responseType: "text"
});

function getUrl(board: string) {
    const filters = "iss.meta=off&iss.only=securities&securities.columns=SECID,PREVADMITTEDQUOTE,SHORTNAME,ISIN";
    return `/iss/engines/stock/markets/shares/boards/${board}/securities.xml?${filters}`;
}

function getQuotesByBoard(board: string, tickers?: string[]): Promise<Quote[]> {
    return moexHttpClient.get(
        getUrl(board),
        tickers && tickers.length <= QUOTES_FILTER_LIMIT ? { params: { securities: tickers.join(",") } } : undefined
    ).then((response) => convertResponseToQuotes(response.data));
}

function getMoexQuotes(tickers?: string[]): Promise<Quote[]> {
    return Promise.all([
        getQuotesByBoard(BOARD_STOCKS, tickers),
        getQuotesByBoard(BOARD_ETFS, tickers),
        getQuotesByBoard(BOARD_FUNDS, tickers)
    ]).then((quotes) => quotes.flat());
}

function convertResponseToQuotes(xmlStr: string): Promise<Quote[]> {
    return parseStringPromise(xmlStr, { ignoreAttrs: false, mergeAttrs: true, explicitArray: false })
        .then((moexData) => parseQuotes(moexData));
}

function parseQuotes(json: MoexData): Quote[] {
    if (json.document.data.rows.row) {
        const { row } = json.document.data.rows;
        if (Array.isArray(row)) {
            return row.map((el: MoexQuote) => ({
                ticker: el.SECID,
                price: Number.parseFloat(Number.parseFloat(el.PREVADMITTEDQUOTE).toFixed(5)),
                isin: el.ISIN,
                name: el.SHORTNAME
            }));
        }
        return [{
            ticker: row.SECID,
            price: Number.parseFloat(Number.parseFloat(row.PREVADMITTEDQUOTE).toFixed(5)),
            isin: row.ISIN,
            name: row.SHORTNAME
        }];
    }

    return [];
}

export const loadMoexQuotesByTickers = createAsyncThunk<Map<string, Quote>, string[]>(
    "loadMoexQuotesByTickers",
    async (tickers: string[]) => getMoexQuotesByTickers(tickers)
);

export function getMoexQuotesByTickers(tickers: string[]): Promise<Map<string, Quote>> {
    return getMoexQuotes(tickers).then((quotes) => {
        const quotesByTickers = new Map<string, Quote>();
        for (const quote of quotes) {
            quotesByTickers.set(quote.ticker, quote);
        }
        return quotesByTickers;
    });
}

export function getMoexQuotesByIsinCodes(): Promise<Map<string, Quote>> {
    return getMoexQuotes().then((quotes) => {
        const quotesByIsinCodes = new Map<string, Quote>();
        for (const quote of quotes) {
            quotesByIsinCodes.set(quote.isin, quote);
        }
        return quotesByIsinCodes;
    });
}
