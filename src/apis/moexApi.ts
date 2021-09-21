import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseStringPromise } from "xml2js";
import axios from "axios";
import {
    CurrencyQuotes,
    CurrencyQuotesMap, MoexCurrencyData,
    MoexData,
    MoexDividendsData,
    MoexQuote,
    MoexQuoteDividends,
    Quote,
    QuoteData,
    QuoteDividends,
    QuotesData,
    QuotesMap
} from "../models/apis/types";
import { Currency } from "../models/portfolios/enums";

const BOARD_STOCKS = "TQBR";
const BOARD_ETFS = "TQTF";
const BOARD_FUNDS = "TQIF";

const QUOTE_USD = "USDFIXME";
const QUOTES_EUR = "EURFIXME";
const QUOTES_EUR_USD = "EURUSDFIXME";

const QUOTES_FILTER_LIMIT = 10;

const moexHttpClient = axios.create({
    baseURL: "https://iss.moex.com",
    responseType: "text"
});

function getUrl(board: string): string {
    const filters = "iss.meta=off&iss.only=securities&securities.columns=SECID,PREVADMITTEDQUOTE,SHORTNAME,ISIN,CURRENCYID";
    return `/iss/engines/stock/markets/shares/boards/${board}/securities.xml?${filters}`;
}

function getCurrencyQuotes(): Promise<CurrencyQuotes> {
    return moexHttpClient.get(
        "/iss/engines/currency/markets/index/boards/FIXI/securities.xml" +
        "?iss.meta=off&iss.only=marketdata&marketdata.columns=SECID,CURRENTVALUE"
    ).then((response) => convertCurrencyResponseToQuotes(response.data));
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

function convertCurrencyResponseToQuotes(xmlStr: string): Promise<CurrencyQuotes> {
    return parseStringPromise(xmlStr, { ignoreAttrs: false, mergeAttrs: true, explicitArray: false })
        .then((moexData) => parseCurrencyQuotes(moexData));
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

function parseCurrencyQuotes(json: MoexCurrencyData): CurrencyQuotes {
    const quotes: CurrencyQuotes = {};
    for (const row of json.document.data.rows.row) {
        quotes[row.SECID] = Number.parseFloat(row.CURRENTVALUE);
    }
    return quotes;
}

function createCurrencyQuotesMap(moexQuotes: CurrencyQuotes): CurrencyQuotesMap {
    const map: CurrencyQuotesMap = {};
    const rubMap: CurrencyQuotes = {};
    rubMap[Currency.USD] = 1 / moexQuotes[QUOTE_USD];
    rubMap[Currency.EUR] = 1 / moexQuotes[QUOTES_EUR];
    map[Currency.RUB] = rubMap;
    const usdMap: CurrencyQuotes = {};
    usdMap[Currency.RUB] = moexQuotes[QUOTE_USD];
    usdMap[Currency.EUR] = 1 / moexQuotes[QUOTES_EUR_USD];
    map[Currency.USD] = usdMap;
    const eurMap: CurrencyQuotes = {};
    eurMap[Currency.RUB] = moexQuotes[QUOTES_EUR];
    eurMap[Currency.USD] = moexQuotes[QUOTES_EUR_USD];
    map[Currency.EUR] = eurMap;
    return map;
}

export const loadMoexQuoteByTicker = createAsyncThunk<QuoteData, string>(
    "loadMoexQuoteByTicker",
    async (ticker: string) => Promise.all([
        getMoexCurrencyQuotes(),
        getMoexQuotes([ticker]).then((quotes) => (quotes[0] ? quotes[0] : undefined))
    ])
);

export const loadMoexQuotesByTickers = createAsyncThunk<QuotesData, string[]>(
    "loadMoexQuotesByTickers",
    async (tickers: string[]) => Promise.all([
        getMoexCurrencyQuotes(),
        getMoexQuotesByTickers(tickers)
    ])
);

export function getMoexCurrencyQuotes(): Promise<CurrencyQuotesMap> {
    return getCurrencyQuotes()
        .then((currencyQuotes) => createCurrencyQuotesMap(currencyQuotes));
}

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

function getDividendsUrl(ticket: string): string {
    return `/iss/securities/${ticket}/dividends.xml?iss.meta=off`;
}

export function getStockDividends(ticket: string): Promise<QuoteDividends[]> {
    return moexHttpClient.get(getDividendsUrl(ticket))
        .then((moexData) => convertResponseToQuotesDividends(moexData.data));
}

function getMoexDataDividends(xmlStr: string): Promise<MoexDividendsData> {
    return parseStringPromise(xmlStr, { ignoreAttrs: false, mergeAttrs: true, explicitArray: false });
}

function convertResponseToQuotesDividends(xmlStr: string): Promise<QuoteDividends[]> {
    return getMoexDataDividends(xmlStr)
        .then((moexDataDividends) => getDividends(moexDataDividends));
}

function getDividends(json: MoexDividendsData): QuoteDividends[] {
    if (json.document.data.rows.row) {
        const { row } = json.document.data.rows;
        if (Array.isArray(row)) {
            return row.map((el: MoexQuoteDividends) => ({
                date: el.registryclosedate,
                value: Number.parseFloat(el.value),
                currency: el.currencyid
            }));
        }
        return [{
            date: row.registryclosedate,
            value: Number.parseInt(row.value, 10),
            currency: row.currencyid
        }];
    }

    return [];
}
