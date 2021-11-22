import sum from "lodash.sum";
import React from "react";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../../models/portfolios/types";
import { ModelPortfolioQuantityMode } from "../../models/settings/enums";
import { ModelPortfolioSettings } from "../../models/settings/types";
import { BaseColumnNames, BrokerAccountColumnNames, ModelPortfolioColumnNames } from "../../models/table/enums";
import { CalcPosition } from "../DataTable/types/calc";
import { ColumnDefinition, VerticalAlignValues } from "../DataTable/types/column";
import { EditTypes } from "../DataTable/types/edit";
import { FormatterTypes } from "../DataTable/types/formatter";
import { TooltipPosition } from "../DataTable/types/tooltip";
import { ActionBlock } from "./ActionBlock";
import styles from "./styles/columns.scss";
import { getSymbol } from "../../utils/currencyUtils";
import { Currency } from "../../models/portfolios/enums";

const TICKER_INVALID_FORMAT = "Тикер должен состоять только из больших латинских букв и цифр и быть от 1 до 12 символов";
const TICKER_DUPLICATE = "Тикер должен быть уникальным в рамках портфеля";
const WEIGHT_INVALID_FORMAT = "Вес должен быть числовым";
const WEIGHT_INVALID_COUNT = "Вес должен быть больше 0";
const QUANTITY_INVALID = "Количество бумаг в портфеле должно быть числовым и больше нуля";
const AVERAGE_PRICE_INVALID = "Цена покупки бумаги должна быть числовой, больше нуля и иметь не более 5 символов после точки";

function tickerValidator(tableData: ModelPortfolioPosition[] | BrokerAccountPosition[], oldValue: string, newValue: string) {
    if (/^[\dA-Z]([\d.A-Z]){0,11}$/.test(newValue)) {
        const tickersCoincidenceLength = tableData
            .map((row) => row.ticker)
            .filter((ticker) => ticker === newValue).length;
        const isTickerNotDuplicated = ((tickersCoincidenceLength === 0 && oldValue !== newValue) ||
            (tickersCoincidenceLength === 1 && oldValue === newValue));

        if (!isTickerNotDuplicated) {
            return TICKER_DUPLICATE;
        }

        return "";
    }

    return TICKER_INVALID_FORMAT;
}

function weightValidator(newValue: string) {
    if (/^\d+$/.test(newValue)) {
        const isWeightRight = Number.parseInt(newValue, 10) > 0;
        if (!isWeightRight) {
            return WEIGHT_INVALID_COUNT;
        }
        return "";
    }

    return WEIGHT_INVALID_FORMAT;
}

function quantityValidator(
    newValue: string
) {
    if (/^\d+$/.test(newValue)) {
        return "";
    }

    return QUANTITY_INVALID;
}

function averagePriceValidator(
    newValue: string
) {
    if (/^\d+([,.]\d{1,5})?$/.test(newValue)) {
        return "";
    }

    return AVERAGE_PRICE_INVALID;
}

export const commonColumns: (
    baseCurrency: Currency,
    dividendsButton: (ticker: string) => JSX.Element
) => ColumnDefinition[] = (baseCurrency, dividendsButton) => [
    {
        title: "Инструмент",
        field: BaseColumnNames.TICKER,
        vertAlign: VerticalAlignValues.MIDDLE,
        edit: {
            type: EditTypes.INPUT,
            params: {
                dashed: true
            }
        },
        validator: {
            validate: (
                tableData,
                rowId,
                field,
                oldValue,
                newValue
            ) => !!tickerValidator(
                tableData as (BrokerAccountPosition[] | ModelPortfolioPosition[]),
                oldValue as string,
                newValue as string
            ),
            tooltip: {
                position: TooltipPosition.LEFT_CENTER,
                text: (
                    tableData,
                    rowId,
                    field,
                    oldValue,
                    newValue
                ) => tickerValidator(
                    tableData as (BrokerAccountPosition[] | ModelPortfolioPosition[]),
                    oldValue as string,
                    newValue as string
                )
            }
        },
        tooltip: {
            position: TooltipPosition.TOP_CENTER,
            text: (
                rowId,
                field,
                value,
                rowData
            ) => rowData.name as string || undefined
        }
    }, {
        title: "Доля",
        field: BaseColumnNames.PERCENTAGE,
        formatter: {
            type: FormatterTypes.PERCENTAGE,
            params: {
                additionalSpace: true
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE,
        groupCalc: {
            position: CalcPosition.TOP,
            calcFunction: (column) => sum(column),
            formatter: {
                type: FormatterTypes.PERCENTAGE,
                params: {
                    additionalSpace: true
                }
            }
        }
    }, {
        title: "Цена",
        field: BaseColumnNames.CURRENT_PRICE,
        formatter: {
            type: FormatterTypes.MONEY,
            params: {
                currency: getSymbol(baseCurrency),
                additionalSpace: true
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "Сумма",
        field: BaseColumnNames.AMOUNT,
        formatter: {
            type: FormatterTypes.MONEY,
            params: {
                currency: getSymbol(baseCurrency),
                additionalSpace: true
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE,
        groupCalc: {
            position: CalcPosition.TOP,
            calcFunction: (column) => sum(column),
            formatter: {
                type: FormatterTypes.MONEY,
                params: {
                    currency: getSymbol(baseCurrency),
                    additionalSpace: true
                }
            }
        },
        tableCalc: {
            position: CalcPosition.TOP,
            calcFunction: (column) => sum(column),
            formatter: {
                type: FormatterTypes.MONEY,
                params: {
                    currency: getSymbol(baseCurrency),
                    additionalSpace: true
                }
            }
        }
    }, {
        field: BaseColumnNames.DIVIDENDS,
        formatter: {
            type: FormatterTypes.ELEMENT,
            params: {
                renderElement: (rowId, field, cellData, rowData) => dividendsButton(rowData.ticker as string)
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        field: BaseColumnNames.ACTION,
        formatter: {
            type: FormatterTypes.ELEMENT,
            params: {
                renderElement: (rowId) => <ActionBlock rowId={rowId} />
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE
    }
];

export const modelPortfolioColumnsOrder = [
    BaseColumnNames.TICKER,
    ModelPortfolioColumnNames.WEIGHT,
    BaseColumnNames.PERCENTAGE,
    ModelPortfolioColumnNames.TARGET_AMOUNT,
    BaseColumnNames.CURRENT_PRICE,
    ModelPortfolioColumnNames.TARGET_QUANTITY,
    ModelPortfolioColumnNames.QUANTITY,
    BaseColumnNames.AMOUNT,
    BaseColumnNames.DIVIDENDS,
    BaseColumnNames.ACTION
];

export const modelPortfolioColumnsWidth = [
    145,
    95,
    85,
    165,
    120,
    190,
    130,
    130,
    45,
    40
];

const _modelPortfolioColumns: (
    dividendsButton: (ticker: string) => JSX.Element,
    portfolioSettings: ModelPortfolioSettings
) => ColumnDefinition[] =
    (dividendsButton, portfolioSettings) => [
        ...commonColumns(portfolioSettings.baseCurrency, dividendsButton),
        {
            title: "Вес",
            field: ModelPortfolioColumnNames.WEIGHT,
            vertAlign: VerticalAlignValues.MIDDLE,
            edit: {
                type: EditTypes.INPUT,
                params: {
                    dashed: true
                }
            },
            validator: {
                validate: (
                    tableData,
                    rowId,
                    field,
                    oldValue,
                    newValue
                ) => !!weightValidator(newValue as string),
                tooltip: {
                    position: TooltipPosition.LEFT_CENTER,
                    text: (
                        tableData,
                        rowId,
                        field,
                        oldValue,
                        newValue
                    ) => weightValidator(newValue as string)
                }
            },
            groupCalc: {
                position: CalcPosition.TOP,
                calcFunction: (column) => sum(column)
            },
            tableCalc: {
                position: CalcPosition.TOP,
                calcFunction: (column) => sum(column)
            }
        }, {
            title: "Целевая сумма",
            field: ModelPortfolioColumnNames.TARGET_AMOUNT,
            formatter: {
                type: FormatterTypes.MONEY,
                params: {
                    currency: getSymbol(portfolioSettings.baseCurrency),
                    additionalSpace: true
                }
            },
            vertAlign: VerticalAlignValues.MIDDLE,
            groupCalc: {
                position: CalcPosition.TOP,
                calcFunction: (column) => sum(column),
                formatter: {
                    type: FormatterTypes.MONEY,
                    params: {
                        currency: getSymbol(portfolioSettings.baseCurrency),
                        additionalSpace: true
                    }
                }
            },
            tableCalc: {
                position: CalcPosition.TOP,
                calcFunction: (column) => sum(column),
                formatter: {
                    type: FormatterTypes.MONEY,
                    params: {
                        currency: getSymbol(portfolioSettings.baseCurrency),
                        additionalSpace: true
                    }
                }
            }
        }, {
            title: "Целевое количество",
            field: ModelPortfolioColumnNames.TARGET_QUANTITY,
            vertAlign: VerticalAlignValues.MIDDLE
        }, {
            title: "В портфеле",
            field: ModelPortfolioColumnNames.QUANTITY,
            vertAlign: VerticalAlignValues.MIDDLE,
            edit: portfolioSettings.quantityMode === ModelPortfolioQuantityMode.MANUAL_INPUT
                ? {
                    type: EditTypes.INPUT,
                    params: {
                        dashed: true
                    }
                }
                : undefined,
            className: (rowId, field, cellData, rowData) =>
                ((cellData as number) < (rowData?.targetQuantity as number)
                    ? styles.errorQuantity
                    : undefined),
            validator: {
                validate: (
                    tableData,
                    rowId,
                    field,
                    oldValue,
                    newValue
                ) => !!quantityValidator(newValue as string),
                tooltip: {
                    position: TooltipPosition.LEFT_CENTER,
                    text: (
                        tableData,
                        rowId,
                        field,
                        oldValue,
                        newValue
                    ) => quantityValidator(newValue as string)
                }
            },
            tooltip: {
                position: TooltipPosition.TOP_CENTER,
                text: (
                    rowId,
                    field,
                    value,
                    rowData
                ) => (
                    typeof value === "number" && typeof rowData.targetQuantity === "number" && value < rowData.targetQuantity
                        ? `Нужно докупить: ${rowData.targetQuantity - value}`
                        : undefined
                )
            }
        }
    ];

export const modelPortfolioColumns: (
    dividendsButton: (ticker: string) => JSX.Element,
    portfolioSettings: ModelPortfolioSettings
) => ColumnDefinition[] =
    (dividendsButton, portfolioSettings) => _modelPortfolioColumns(dividendsButton, portfolioSettings).sort((columnA, columnB) =>
        modelPortfolioColumnsOrder.indexOf(columnA.field as BaseColumnNames | ModelPortfolioColumnNames) -
    modelPortfolioColumnsOrder.indexOf(columnB.field as BaseColumnNames | ModelPortfolioColumnNames))
        .map((column, index) => ({
            ...column,
            width: modelPortfolioColumnsWidth[index]
        }));

export const brokerAccountColumnsOrder = [
    BaseColumnNames.TICKER,
    BaseColumnNames.PERCENTAGE,
    BrokerAccountColumnNames.AVERAGE_PRICE,
    BaseColumnNames.CURRENT_PRICE,
    BrokerAccountColumnNames.QUANTITY,
    BaseColumnNames.AMOUNT,
    BaseColumnNames.DIVIDENDS,
    BaseColumnNames.ACTION
];

export const brokerAccountColumnsWidth = [
    145,
    85,
    145,
    85,
    130,
    130,
    45,
    40
];

export const _brokerAccountColumns: (dividendsButton: (ticker: string) => JSX.Element) => ColumnDefinition[] =
    (dividendsButton) => [
        ...commonColumns(Currency.RUB, dividendsButton),
        {
            title: "Цена покупки",
            field: BrokerAccountColumnNames.AVERAGE_PRICE,
            formatter: {
                type: FormatterTypes.MONEY,
                params: {
                    currency: getSymbol(Currency.RUB),
                    additionalSpace: true
                }
            },
            edit: {
                type: EditTypes.INPUT,
                params: {
                    dashed: true
                }
            },
            validator: {
                validate: (
                    tableData,
                    rowId,
                    field,
                    oldValue,
                    newValue
                ) => !!averagePriceValidator(newValue as string),
                tooltip: {
                    position: TooltipPosition.TOP_CENTER,
                    text: (
                        tableData,
                        rowId,
                        field,
                        oldValue,
                        newValue
                    ) => averagePriceValidator(newValue as string)
                }
            }
        }, {
            title: "В портфеле",
            field: BrokerAccountColumnNames.QUANTITY,
            vertAlign: VerticalAlignValues.MIDDLE,
            edit: {
                type: EditTypes.INPUT,
                params: {
                    dashed: true
                }
            },
            validator: {
                validate: (
                    tableData,
                    rowId,
                    field,
                    oldValue,
                    newValue
                ) => !!quantityValidator(newValue as string),
                tooltip: {
                    position: TooltipPosition.TOP_CENTER,
                    text: (
                        tableData,
                        rowId,
                        field,
                        oldValue,
                        newValue
                    ) => quantityValidator(newValue as string)
                }
            }
        }
    ];

export const brokerAccountColumns: (dividendsButton: (ticker: string) => JSX.Element) => ColumnDefinition[] =
    (dividendsButton) => _brokerAccountColumns(dividendsButton).sort((columnA, columnB) =>
        brokerAccountColumnsOrder.indexOf(columnA.field as BaseColumnNames | BrokerAccountColumnNames) -
    brokerAccountColumnsOrder.indexOf(columnB.field as BaseColumnNames | BrokerAccountColumnNames))
        .map((column, index) => ({
            ...column,
            width: brokerAccountColumnsWidth[index]
        }));
