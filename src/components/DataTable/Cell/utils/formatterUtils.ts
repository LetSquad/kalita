import {
    CurrencyPosition,
    MoneyFormatterParams,
    PercentageFormatterParams,
    StarFormatterParams
} from "../../types/formatter";

export const defaultMoneyFormatterParams: MoneyFormatterParams = {
    decimal: ".",
    thousand: ",",
    currency: "",
    currencyPosition: CurrencyPosition.AFTER,
    additionalSpace: false,
    precision: 2,
    zerosRemove: false
};

export function formatMoneyFormatterValue({
    value,
    decimal: decimalSym = ".",
    thousand: thousandSym = ",",
    currency = "",
    currencyPosition = CurrencyPosition.AFTER,
    additionalSpace = false,
    precision = 2,
    extendedPrecision = 2,
    zerosRemove = false
}: MoneyFormatterParams & { value: number }) {
    let precisionValue: string | number = extendedPrecision === false ? value : Number(value.toFixed(extendedPrecision));

    const extendedPrecisionDecimal = String(precisionValue).split(".")[1];

    precisionValue = precision !== false && extendedPrecisionDecimal?.length < precision
        ? Number(precisionValue).toFixed(precision)
        : precisionValue;

    precisionValue = zerosRemove ? Number(precisionValue) : precisionValue;

    const formattedValues = String(precisionValue).split(".");

    let integer = formattedValues[0];
    const decimal = formattedValues.length > 1 ? decimalSym + formattedValues[1] : "";

    const rgx = /(\d+)(\d{3})/;

    while (rgx.test(integer)) {
        integer = integer.replace(rgx, `$1${thousandSym}$2`);
    }
    return currencyPosition === CurrencyPosition.BEFORE
        ? `${currency}${additionalSpace ? " " : ""}${integer}${decimal}`
        : `${integer}${decimal}${additionalSpace ? " " : ""}${currency}`;
}

export const defaultPercentageFormatterParams: PercentageFormatterParams = {
    additionalSpace: false,
    precision: 2,
    zerosRemove: false
};

export function formatPercentageFormatterValue({
    value,
    additionalSpace = false,
    precision = 2,
    zerosRemove = false,
    withLabel = true
}: PercentageFormatterParams & { value: number }) {
    let precisionValue: string | number = precision === false ? value : value.toFixed(precision);
    precisionValue = zerosRemove ? Number(precisionValue) : precisionValue;

    return `${precisionValue}${additionalSpace ? " " : ""}${withLabel ? "%" : ""}`;
}

export const defaultStarFormatterParams: StarFormatterParams = {
    maxStars: 5
};
