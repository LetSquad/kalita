import { TabulatorColumn } from "../../../custom_typings/types";

export const columns: TabulatorColumn[] = [
    {
        title: "Имя",
        field: "name",
        sorter: "string",
        formatter: "plaintext",
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        minWidth: 100,
        editor: "input"
    }, {
        title: "Вес",
        field: "weight",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left",
        editor: "input"
    }, {
        title: "Доля",
        field: "share",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "%",
            symbolAfter: "%"
        },
        visible: true,
        vertAlign: "middle",
        minWidth: 100,
        headerHozAlign: "left",
        topCalc: "sum",
        topCalcFormatter: "money",
        topCalcFormatterParams: {
            symbol: "%",
            symbolAfter: "%"
        }
    }, {
        title: "Целевая сумма",
        field: "targetAmount",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        minWidth: 100,
        topCalc: "sum",
        topCalcFormatter: "money",
        topCalcFormatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        }
    }, {
        title: "Цена",
        field: "price",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left"
    }, {
        title: "Целевое количество",
        field: "targetQuantity",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left"
    }, {
        title: "В портфеле",
        field: "briefcase",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 100,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left",
        editor: "input"
    }, {
        title: "Сумма",
        minWidth: 100,
        field: "amount",
        sorter: "number",
        formatter: "money",
        formatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        },
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        bottomCalc: "sum",
        bottomCalcFormatter: "money",
        bottomCalcFormatterParams: {
            symbol: "₽",
            symbolAfter: "р"
        }
    }
];
