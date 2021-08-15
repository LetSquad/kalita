import { reactFormatter } from "react-tabulator";
import {
    CalcsValues,
    EditorsValues,
    FormattersValues,
    HorizontalAlignValues,
    SortersValues,
    VerticalAlignValues
} from "../../../custom_typings/react-tabulator/enums";
import {
    CellComponent,
    BaseTabulatorColumnsDefinition,
    ModelPortfolioTabulatorColumnsDefinition,
    BrokerAccountTabulatorColumnsDefinition
} from "../../../custom_typings/react-tabulator/types";
import { ModelPortfolioPosition } from "../../models/portfolios/types";
import { BaseColumnNames, BrokerAccountColumnNames, ModelPortfolioColumnNames } from "../../models/table/enums";
import styles from "./styles/columns.scss";
import { ModelPortfolioSettings } from "../../models/settings/types";
import { ModelPortfolioQuantityMode } from "../../models/settings/enums";

const tickerValidator = (cell: CellComponent, value: string) => {
    if (/^[\dA-Z]([\d.A-Z]){0,11}$/.test(value)) {
        const tickersCoincidenceLength = cell.getTable().getData()
            .map((row) => row.ticker)
            .filter((ticker) => ticker === value).length;
        return ((tickersCoincidenceLength === 0 && cell.getOldValue() as string !== value) ||
            (tickersCoincidenceLength === 1 && (cell.getOldValue() as string || cell.getInitialValue() as string) === value));
    }
    return false;
};

export const commonColumns: (actionBlock: JSX.Element) => BaseTabulatorColumnsDefinition[] = (actionBlock: JSX.Element) => [
    {
        field: BaseColumnNames.HANDLE,
        rowHandle: true,
        formatter: FormattersValues.HANDLE,
        headerSort: false,
        frozen: true
    }, {
        title: "Инструмент",
        field: BaseColumnNames.TICKER,
        sorter: SortersValues.STRING,
        formatter: (cell: CellComponent) => `<span class="${styles.editCell}">${cell.getValue()}</span>`,
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        headerHozAlign: HorizontalAlignValues.LEFT,
        editor: EditorsValues.INPUT,
        validator: tickerValidator
    }, {
        title: "Доля",
        field: BaseColumnNames.PERCENTAGE,
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: "%",
            symbolAfter: "%"
        },
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        headerHozAlign: HorizontalAlignValues.LEFT,
        topCalc: CalcsValues.SUM,
        topCalcFormatter: FormattersValues.MONEY,
        topCalcFormatterParams: {
            symbol: "%",
            symbolAfter: "%"
        }
    }, {
        title: "Цена",
        field: BaseColumnNames.CURRENT_PRICE,
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: " ₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        hozAlign: HorizontalAlignValues.LEFT,
        headerHozAlign: HorizontalAlignValues.LEFT
    }, {
        title: "Сумма",
        field: BaseColumnNames.AMOUNT,
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: " ₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        headerHozAlign: HorizontalAlignValues.LEFT,
        topCalc: CalcsValues.SUM,
        topCalcFormatter: FormattersValues.MONEY,
        topCalcFormatterParams: {
            symbol: " ₽",
            symbolAfter: "р"
        }
    }, {
        field: BaseColumnNames.ACTION,
        formatter: reactFormatter(actionBlock),
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        hozAlign: HorizontalAlignValues.CENTER,
        headerSort: false
    }
];

export const modelPortfolioColumnsOrder = [
    BaseColumnNames.HANDLE,
    BaseColumnNames.TICKER,
    ModelPortfolioColumnNames.WEIGHT,
    BaseColumnNames.PERCENTAGE,
    ModelPortfolioColumnNames.TARGET_AMOUNT,
    BaseColumnNames.CURRENT_PRICE,
    ModelPortfolioColumnNames.TARGET_QUANTITY,
    ModelPortfolioColumnNames.QUANTITY,
    BaseColumnNames.AMOUNT,
    BaseColumnNames.ACTION
];

export const modelPortfolioColumnsWidth = [
    { minWidth: 30, maxWidth: 30 },
    { minWidth: 130, maxWidth: 170, widthGrow: 4 },
    { minWidth: 80, maxWidth: 110, widthGrow: 1 },
    { minWidth: 85, maxWidth: 85 },
    { minWidth: 165, widthGrow: 2 },
    { minWidth: 120, widthGrow: 1 },
    { minWidth: 190, widthGrow: 3 },
    { minWidth: 130, widthGrow: 1 },
    { minWidth: 130, widthGrow: 3 },
    { minWidth: 40, maxWidth: 40 }
];

export const modelPortfolioColumns: (
    data: ModelPortfolioPosition[],
    portfolioSettings: ModelPortfolioSettings
) => (actionBlock: JSX.Element) => ModelPortfolioTabulatorColumnsDefinition[] =
    (data: ModelPortfolioPosition[], portfolioSettings: ModelPortfolioSettings) => (actionBlock: JSX.Element) => [
        ...commonColumns(actionBlock),
        {
            title: "Вес",
            field: ModelPortfolioColumnNames.WEIGHT,
            sorter: SortersValues.NUMBER,
            formatter: (cell: CellComponent) => `<span class="${styles.editCell}">${cell.getValue()}</span>`,
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            hozAlign: HorizontalAlignValues.LEFT,
            headerHozAlign: HorizontalAlignValues.LEFT,
            editor: EditorsValues.INPUT,
            validator: "min:1",
            topCalc: CalcsValues.SUM,
            topCalcFormatter: FormattersValues.PLAINTEXT
        }, {
            title: "Целевая сумма",
            field: ModelPortfolioColumnNames.TARGET_AMOUNT,
            sorter: SortersValues.NUMBER,
            formatter: FormattersValues.MONEY,
            formatterParams: {
                symbol: " ₽",
                symbolAfter: "р"
            },
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            headerHozAlign: HorizontalAlignValues.LEFT,
            topCalc: CalcsValues.SUM,
            topCalcFormatter: FormattersValues.MONEY,
            topCalcFormatterParams: {
                symbol: " ₽",
                symbolAfter: "р"
            }
        }, {
            title: "Целевое количество",
            field: ModelPortfolioColumnNames.TARGET_QUANTITY,
            sorter: SortersValues.NUMBER,
            formatter: FormattersValues.PLAINTEXT,
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            hozAlign: HorizontalAlignValues.LEFT,
            headerHozAlign: HorizontalAlignValues.LEFT
        }, {
            title: "В портфеле",
            field: ModelPortfolioColumnNames.QUANTITY,
            sorter: SortersValues.NUMBER,
            formatter: (cell: CellComponent) => {
                const quantity = cell.getValue() as number;
                const rowIndex = cell.getRow().getIndex();
                const targetQuantity = data.find((row) => row.id === rowIndex)?.targetQuantity;
                if (targetQuantity !== undefined && quantity < targetQuantity) {
                    cell.getElement()?.classList?.add(styles.errorQuantity);
                }

                return portfolioSettings.quantityMode === ModelPortfolioQuantityMode.MANUAL_INPUT
                    ? `<span class="${styles.editCell}">${cell.getValue()}</span>`
                    : cell.getValue();
            },
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            hozAlign: HorizontalAlignValues.LEFT,
            headerHozAlign: HorizontalAlignValues.LEFT,
            editor: portfolioSettings.quantityMode === ModelPortfolioQuantityMode.MANUAL_INPUT ? EditorsValues.INPUT : undefined,
            validator: "min:0"
        }
    ].sort((columnA, columnB) =>
        modelPortfolioColumnsOrder.indexOf(columnA.field) - modelPortfolioColumnsOrder.indexOf(columnB.field))
        .map((column, index) => ({
            ...column,
            minWidth: modelPortfolioColumnsWidth[index].minWidth,
            maxWidth: modelPortfolioColumnsWidth[index].maxWidth,
            widthGrow: modelPortfolioColumnsWidth[index].widthGrow
        }));

export const brokerAccountColumnsOrder = [
    BaseColumnNames.HANDLE,
    BaseColumnNames.TICKER,
    BaseColumnNames.PERCENTAGE,
    BrokerAccountColumnNames.AVERAGE_PRICE,
    BaseColumnNames.CURRENT_PRICE,
    BrokerAccountColumnNames.QUANTITY,
    BaseColumnNames.AMOUNT,
    BaseColumnNames.ACTION
];

export const brokerAccountColumnsWidth = [
    { minWidth: 30, maxWidth: 30 },
    { minWidth: 130, maxWidth: 170, widthGrow: 3 },
    { minWidth: 85, maxWidth: 85 },
    { minWidth: 145, widthGrow: 2 },
    { minWidth: 85, widthGrow: 2 },
    { minWidth: 130, widthGrow: 2 },
    { minWidth: 130, widthGrow: 3 },
    { minWidth: 40, maxWidth: 40 }
];

export const brokerAccountColumns: (actionBlock: JSX.Element) =>
BrokerAccountTabulatorColumnsDefinition[] = (actionBlock: JSX.Element) => [
    ...commonColumns(actionBlock),
    {
        title: "Цена покупки",
        field: BrokerAccountColumnNames.AVERAGE_PRICE,
        sorter: SortersValues.NUMBER,
        formatter: (cell: CellComponent) => `<span class="${styles.editCell}">${cell.getValue()} ₽</span>`,
        editor: EditorsValues.INPUT,
        validator: "min:0"
    }, {
        title: "В портфеле",
        field: BrokerAccountColumnNames.QUANTITY,
        sorter: SortersValues.NUMBER,
        formatter: (cell: CellComponent) => `<span class="${styles.editCell}">${cell.getValue()}</span>`,
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        hozAlign: HorizontalAlignValues.LEFT,
        headerHozAlign: HorizontalAlignValues.LEFT,
        editor: EditorsValues.INPUT,
        validator: "min:0"
    }
].sort((columnA, columnB) =>
    brokerAccountColumnsOrder.indexOf(columnA.field) - brokerAccountColumnsOrder.indexOf(columnB.field))
    .map((column, index) => ({
        ...column,
        minWidth: brokerAccountColumnsWidth[index].minWidth,
        maxWidth: brokerAccountColumnsWidth[index].maxWidth,
        widthGrow: brokerAccountColumnsWidth[index].widthGrow
    }));
