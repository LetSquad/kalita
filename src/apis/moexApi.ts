import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseStringPromise } from "xml2js";
import axios from "axios";
import { Quote, QuotesMap } from "../models/apis/types";
import { Currency } from "../models/apis/enums";

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
    CURRENCYID: Currency;
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
    const filters = "iss.meta=off&iss.only=securities&securities.columns=SECID,PREVADMITTEDQUOTE,SHORTNAME,ISIN,CURRENCYID";
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
                name: el.SHORTNAME,
                currency: el.CURRENCYID
            }));
        }
        return [{
            ticker: row.SECID,
            price: Number.parseFloat(Number.parseFloat(row.PREVADMITTEDQUOTE).toFixed(5)),
            isin: row.ISIN,
            name: row.SHORTNAME,
            currency: row.CURRENCYID
        }];
    }

    return [];
}

export const loadMoexQuoteByTicker = createAsyncThunk<Quote | undefined, string>(
    "loadMoexQuoteByTicker",
    async (ticker: string) => getMoexQuotes([ticker])
        .then((quotes) => quotes[0] ? quotes[0] : undefined)
);

export const loadMoexQuotesByTickers = createAsyncThunk<QuotesMap, string[]>(
    "loadMoexQuotesByTickers",
    async (tickers: string[]) => getMoexQuotesByTickers(tickers)
);

export function getMoexQuotesByTickers(tickers: string[]): Promise<QuotesMap> {
    return getMoexQuotes(tickers).then((quotes) => {
        const quotesByTickers: QuotesMap = {};
        for (const quote of quotes) {
            quotesByTickers[quote.ticker] = quote;
        }
        return quotesByTickers;
    });
}

export function getMoexQuotesByIsinCodes(): Promise<QuotesMap> {
    return getMoexQuotes().then((quotes) => {
        const quotesByIsinCodes: QuotesMap = {};
        for (const quote of quotes) {
            quotesByIsinCodes[quote.isin] = quote;
        }
        return quotesByIsinCodes;
    });
}
