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
