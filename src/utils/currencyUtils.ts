import { DividendCurrency, MoexCurrency } from "../models/apis/enums";
import { Currency } from "../models/portfolios/enums";

export function moexCurrencyToInternalCurrency(moexCurrency: MoexCurrency): Currency {
    switch (moexCurrency) {
        case MoexCurrency.RUB: return Currency.RUB;
        case MoexCurrency.USD: return Currency.USD;
    }
}

export function getSymbol(currency: Currency | DividendCurrency) {
    switch (currency) {
        case Currency.RUB: case DividendCurrency.RUB: return "₽";
        case Currency.USD: case DividendCurrency.USD: return "$";
        case Currency.EUR: return "€";
    }
}
