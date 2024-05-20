import { DividendCurrency, MoexCurrency } from "../models/apis/enums";
import { CurrencyQuotesMap } from "../models/apis/types";
import { Currency } from "../models/portfolios/enums";

export function moexCurrencyToInternalCurrency(moexCurrency: MoexCurrency): Currency {
    switch (moexCurrency) {
        case MoexCurrency.RUB: {
            return Currency.RUB;
        }
        case MoexCurrency.USD: {
            return Currency.USD;
        }
    }
}

export function getSymbol(currency: Currency | DividendCurrency): string {
    switch (currency) {
        case Currency.RUB:
        case DividendCurrency.RUB: {
            return "₽";
        }
        case Currency.CNY: {
            return "¥";
        }
        case Currency.USD:
        case DividendCurrency.USD: {
            return "$";
        }
        case Currency.EUR: {
            return "€";
        }
    }
}

export function getCurrencyQuote(
    baseCurrency: Currency,
    targetCurrency: Currency,
    currencyQuotes: CurrencyQuotesMap
): number | undefined {
    const currencyQuote = currencyQuotes[baseCurrency]
        ? currencyQuotes[baseCurrency][targetCurrency]
        : undefined;
    if (!currencyQuote) {
        // TODO: replace with toast
        console.warn(`There is no quote for currency pair ${baseCurrency}:${targetCurrency}`);
    }
    return currencyQuote;
}
