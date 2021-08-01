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

const moexHttpClient = axios.create({
    baseURL: "https://iss.moex.com/iss/engines/stock/markets/",
    responseType: "text"
});

function getUrl(moexBoardId: string) {
    const filters = "iss.meta=off&iss.only=securities&securities.columns=SECID,PREVADMITTEDQUOTE,SHORTNAME,ISIN";
    return `shares/boards/${moexBoardId}/securities.xml?${filters}`;
}

function getStock(name?: string) {
    return moexHttpClient.get(getUrl("TQBR"), name ? {
        params: {
            securities: name
        }
    } : undefined);
}

function getEtf(name?: string) {
    return moexHttpClient.get(getUrl("TQTF"), name ? {
        params: {
            securities: name
        }
    } : undefined);
}

function getFund(name?: string) {
    return moexHttpClient.get(getUrl("TQIF"), name ? {
        params: {
            securities: name
        }
    } : undefined);
}

export const getMoexQuotes = createAsyncThunk(
    "getMoexQuotes",
    async () => {
        const results = await Promise.all([
            getStock(),
            getEtf(),
            getFund()
        ]);
        let quotes: Quote[] = [];
        for (const el of results) {
            quotes = [...quotes, ...await (convertResponseToQuotes(el.data))];
        }
        return quotes;
    }
);

export const getMoexQuotesForName = createAsyncThunk<{ tickerName: string, quote?: Quote }, string>(
    "getMoexQuotesForName",
    async (tickerName: string) => {
        const results = await Promise.all([
            getStock(tickerName),
            getEtf(tickerName),
            getFund(tickerName)
        ]);

        for (const el of results) {
            const quote = await (convertResponseToQuotes(el.data));
            if (quote.length === 1) {
                return { tickerName, quote: quote[0] };
            }
        }
        return { tickerName };
    }
);

async function convertResponseToQuotes(xmlStr: string): Promise<Quote[]> {
    const moexData = await getMoexData(xmlStr);
    return getQuotes(moexData);
}

function getMoexData(xmlStr: string): Promise<MoexData> {
    return parseStringPromise(xmlStr, { ignoreAttrs: false, mergeAttrs: true, explicitArray: false });
}

function getQuotes(json: MoexData): Quote[] {
    if (json.document.data.rows.row) {
        const { row } = json.document.data.rows;
        if (Array.isArray(row)) {
            return row.map((el: MoexQuote) => ({
                ticker: el.SECID,
                price: Number.parseInt(el.PREVADMITTEDQUOTE, 10),
                isin: el.ISIN,
                name: el.SHORTNAME
            }));
        }
        return [{
            ticker: row.SECID,
            price: Number.parseInt(row.PREVADMITTEDQUOTE, 10),
            isin: row.ISIN,
            name: row.SHORTNAME
        }];
    }

    return [];
}
