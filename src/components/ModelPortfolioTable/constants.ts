import { reactFormatter } from "react-tabulator";
import { TabulatorColumn } from "../../../custom_typings/types";

export const columns: (actionBlock: JSX.Element) => TabulatorColumn[] = (actionBlock: JSX.Element) => [
    {
        title: "Имя",
        field: "name",
        sorter: "string",
        formatter: "plaintext",
        visible: true,
        vertAlign: "middle",
        headerHozAlign: "left",
        minWidth: 100,
        editor: "input",
        validator: "required",
        widthGrow: 2
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
        editor: "input",
        validator: "min:1"
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
        minWidth: 152,
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
        minWidth: 191,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left"
    }, {
        title: "В портфеле",
        field: "briefcase",
        sorter: "number",
        formatter: "plaintext",
        minWidth: 128,
        visible: true,
        vertAlign: "middle",
        hozAlign: "left",
        headerHozAlign: "left",
        editor: "input",
        validator: "min:0"
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
    }, {
        title: "",
        field: "action",
        width: 40,
        resizable: false,
        formatter: reactFormatter(actionBlock),
        visible: true,
        vertAlign: "middle",
        hozAlign: "center",
        headerSort: false
    }
];
