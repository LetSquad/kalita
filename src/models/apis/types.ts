import { DividendCurrency, MoexCurrency } from "./enums";

export type QuotesData = [CurrencyQuotesMap, QuotesMap];

export type QuoteData = [CurrencyQuotesMap, Quote | undefined];

export type QuotesMap = Record<string, Quote>;

export type CurrencyQuotesMap = Record<string, CurrencyQuotes>;

export type CurrencyQuotes = Record<string, number>;

export interface Quote {
    readonly isin: string;
    readonly name: string;
    readonly ticker: string;
    readonly price: number;
    readonly currency: MoexCurrency;
}

export interface QuoteDividends {
    readonly date: string
    readonly value: number
    readonly currency: DividendCurrency
}

export interface MoexQuote {
    SECID: string;
    PREVLEGALCLOSEPRICE: string;
    SHORTNAME: string;
    ISIN: string;
    CURRENCYID: MoexCurrency;
}

export interface MoexCurrencyQuote {
    SECID: string;
    CURRENTVALUE: string;
}

export interface MoexQuoteDividends {
    secid: string;
    isin: string;
    registryclosedate: string;
    value: string;
    currencyid: DividendCurrency;
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

export interface MoexCurrencyData {
    document: {
        data: {
            id: string,
            rows: {
                row: MoexCurrencyQuote[];
            }
        }
    }
}

export interface MoexDividendsData {
    document: {
        data: {
            id: string,
            rows: {
                row: MoexQuoteDividends[] | MoexQuoteDividends;
            }
        }
    }
}
