import sum from "lodash.sum";

import { Currency } from "../../../models/portfolios/enums";
import { AnalyticsTableColumnNames, BaseColumnNames } from "../../../models/table/enums";
import { getSymbol } from "../../../utils/currencyUtils";
import { CalcPosition } from "../../DataTable/types/calc";
import { ColumnDefinition, VerticalAlignValues } from "../../DataTable/types/column";
import { FormatterTypes } from "../../DataTable/types/formatter";

export const analyticsColumns: (currency: Currency) => ColumnDefinition[] = (currency: Currency) => [
    {
        title: "Портфель",
        field: AnalyticsTableColumnNames.PORTFOLIO,
        vertAlign: VerticalAlignValues.MIDDLE
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
        title: "Сумма",
        field: BaseColumnNames.AMOUNT,
        formatter: {
            type: FormatterTypes.MONEY,
            params: {
                currency: getSymbol(currency),
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
                    currency: getSymbol(currency),
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
                    currency: getSymbol(currency),
                    additionalSpace: true
                }
            }
        }
    }
];
