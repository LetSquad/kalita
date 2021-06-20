import { reactFormatter } from "react-tabulator";
import {
    FormattersValues,
    HorizontalAlignValues,
    SortersValues,
    VerticalAlignValues
} from "../../model/libs/react-tabulator/enums";
import { TabulatorColumn } from "../../model/libs/react-tabulator/types";
import styles from "./styles/columns.scss";
import { ModelPortfolioPosition } from "../../model/portfolios/types";

export const commonColumns: (actionBlock: JSX.Element) => TabulatorColumn[] = (actionBlock: JSX.Element) => [
    {
        title: "Тикер",
        field: "ticker",
        sorter: SortersValues.STRING,
        formatter: FormattersValues.PLAINTEXT,
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        headerHozAlign: HorizontalAlignValues.LEFT,
        minWidth: 100,
        editor: "input",
        validator: "required",
        widthGrow: 2
    }, {
        title: "Доля",
        field: "percentage",
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: "%",
            symbolAfter: "%"
        },
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        minWidth: 100,
        headerHozAlign: HorizontalAlignValues.LEFT,
        topCalc: "sum",
        topCalcFormatter: FormattersValues.MONEY,
        topCalcFormatterParams: {
            symbol: "%",
            symbolAfter: "%"
        }
    }, {
        title: "Цена",
        field: "currentPrice",
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        minWidth: 100,
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        hozAlign: HorizontalAlignValues.LEFT,
        headerHozAlign: HorizontalAlignValues.LEFT
    }, {
        title: "Сумма",
        minWidth: 100,
        field: "amount",
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        headerHozAlign: HorizontalAlignValues.LEFT,
        bottomCalc: "sum",
        bottomCalcFormatter: FormattersValues.MONEY,
        bottomCalcFormatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        }
    }, {
        title: "",
        field: "action",
        width: 40,
        resizable: false,
        formatter: reactFormatter(actionBlock),
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        hozAlign: HorizontalAlignValues.CENTER,
        headerSort: false
    }
];

const modelPortfolioColumnsOrder = [
    "ticker",
    "weight",
    "percentage",
    "targetAmount",
    "currentPrice",
    "targetQuantity",
    "quantity",
    "amount",
    "action"
];

export const modelPortfolioColumns: (data: ModelPortfolioPosition[]) => (actionBlock: JSX.Element) => TabulatorColumn[] =
    (data: ModelPortfolioPosition[]) => (actionBlock: JSX.Element) => [
        ...commonColumns(actionBlock),
        {
            title: "Вес",
            field: "weight",
            sorter: SortersValues.NUMBER,
            formatter: FormattersValues.PLAINTEXT,
            minWidth: 100,
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            hozAlign: HorizontalAlignValues.LEFT,
            headerHozAlign: HorizontalAlignValues.LEFT,
            editor: "input",
            validator: "min:1"
        }, {
            title: "Целевая сумма",
            field: "targetAmount",
            sorter: SortersValues.NUMBER,
            formatter: FormattersValues.MONEY,
            formatterParams: {
                symbol: "₽",
                symbolAfter: "р"
            },
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            headerHozAlign: HorizontalAlignValues.LEFT,
            minWidth: 152,
            topCalc: "sum",
            topCalcFormatter: FormattersValues.MONEY,
            topCalcFormatterParams: {
                symbol: "₽",
                symbolAfter: "р"
            }
        }, {
            title: "Целевое количество",
            field: "targetQuantity",
            sorter: SortersValues.NUMBER,
            formatter: FormattersValues.PLAINTEXT,
            minWidth: 191,
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            hozAlign: HorizontalAlignValues.LEFT,
            headerHozAlign: HorizontalAlignValues.LEFT
        }, {
            title: "В портфеле",
            field: "quantity",
            sorter: SortersValues.NUMBER,
            formatter: (cell: any) => {
                const quantity = cell.getValue();
                const rowIndex = cell.getRow().getIndex();
                const targetQuantity = data.find((row) => row.id === rowIndex)?.targetQuantity;
                if (targetQuantity !== undefined) {
                    if (quantity >= targetQuantity) {
                        cell.getElement().classList.add(styles.successQuantity);
                    } else {
                        cell.getElement().classList.add(styles.errorQuantity);
                    }
                }

                return quantity;
            },
            minWidth: 128,
            visible: true,
            vertAlign: VerticalAlignValues.MIDDLE,
            hozAlign: HorizontalAlignValues.LEFT,
            headerHozAlign: HorizontalAlignValues.LEFT,
            editor: "input",
            validator: "min:0"
        }
    ].sort((columnA, columnB) =>
        modelPortfolioColumnsOrder.indexOf(columnA.field) - modelPortfolioColumnsOrder.indexOf(columnB.field));

const brokerAccountColumnsOrder = [
    "ticker",
    "percentage",
    "averagePrice",
    "currentPrice",
    "quantity",
    "amount",
    "action"
];

export const brokerAccountColumns: (actionBlock: JSX.Element) => TabulatorColumn[] = (actionBlock: JSX.Element) => [
    ...commonColumns(actionBlock),
    {
        title: "Цена покупки",
        field: "averagePrice",
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.MONEY,
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        }
    }, {
        title: "В портфеле",
        field: "quantity",
        sorter: SortersValues.NUMBER,
        formatter: FormattersValues.PLAINTEXT,
        minWidth: 128,
        visible: true,
        vertAlign: VerticalAlignValues.MIDDLE,
        hozAlign: HorizontalAlignValues.LEFT,
        headerHozAlign: HorizontalAlignValues.LEFT,
        editor: "input",
        validator: "min:0"
    }
].sort((columnA, columnB) =>
    brokerAccountColumnsOrder.indexOf(columnA.field) - brokerAccountColumnsOrder.indexOf(columnB.field));
