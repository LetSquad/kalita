import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseStringPromise } from "xml2js";
import axios from "axios";
import { Quote } from "../models/apis/types";

interface MoexData {
    document: {
        data: {
            id: string,
            rows: {
                row: MoexQuote[]
            }
        }
    }
}

interface MoexQuote {
    SECID: string;
    PREVADMITTEDQUOTE: number;
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

function getStock() {
    return moexHttpClient.get(getUrl("TQBR"));
}

function getFonds() {
    return moexHttpClient.get(getUrl("TQTF"));
}

export const getMoexQuotes = createAsyncThunk(
    "getMoexQuotes",
    async () => {
        const results = await Promise.all([
            getStock(),
            getFonds()
        ]);
        let quotes: Quote[] = [];
        for (const el of results) {
            quotes = [...quotes, ...await (convertResponseToQuotes(el.data))];
        }
        return quotes;
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
    return json.document.data.rows.row ? json.document.data.rows.row.map((el: MoexQuote) => <Quote>{
        ticker: el.SECID,
        price: +el.PREVADMITTEDQUOTE,
        isin: el.ISIN,
        name: el.SHORTNAME
    }) : [];
}
