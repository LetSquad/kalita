import { Currency } from "./enums";

export interface Quote {
    readonly isin: string;
    readonly name: string;
    readonly ticker: string;
    readonly price: number;
    readonly currency: Currency;
}

export interface QuotesMap {
    [key: string]: Quote;
}

export interface QuoteDividendsDate {
    readonly date: string
    readonly value: number
    readonly currency: string
}

export interface MoexQuote {
    SECID: string;
    PREVADMITTEDQUOTE: string;
    SHORTNAME: string;
    ISIN: string;
    CURRENCYID: Currency;
}

export interface MoexQuoteDividends {
    SECID: string;
    ISIN: string;
    registryclosedate: string;
    value: string;
    currencyid: string;
}

export interface MoexData {
    document: {
        data: {
            id: string,
            rows: {
                row: MoexQuote[] | MoexQuote;
            }
        }
    }
}

export interface MoexDataDividends {
    document: {
        data: {
            id: string,
            rows: {
                row: MoexQuoteDividends[] | MoexQuoteDividends;
            }
        }
    }
}
