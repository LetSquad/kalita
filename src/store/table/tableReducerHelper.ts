import { v4 as uuidv4 } from "uuid";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition, PortfolioPosition } from "../../model/portfolios/types";
import { CurrentPortfolio, TableData, TableUpdatePayload } from "../../model/table/types";
import { PayloadAction } from "@reduxjs/toolkit";
import { EditableTableColumns } from "../../model/table/enums";

const NEW_ENTRY = "Новая запись";
const NO_NAME = "Без названия";

export function generateNewRow(currentPortfolio: CurrentPortfolio, groupName: string) {
    if (currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        currentPortfolio[1].push(newModelPortfolioRow(groupName));
    } else {
        currentPortfolio[1].push(newBrokerAccountRow(groupName));
    }
}

export const newModelPortfolioRow: (groupName: string) => ModelPortfolioPosition = (groupName: string) => ({
    id: uuidv4(),
    ticker: NEW_ENTRY,
    groupName,
    weight: 1,
    percentage: 0,
    targetAmount: 0,
    currentPrice: 0,
    targetQuantity: 0,
    quantity: 0,
    amount: 0
});

export const newBrokerAccountRow: (groupName: string) => BrokerAccountPosition = (groupName: string) => ({
    id: uuidv4(),
    ticker: NEW_ENTRY,
    groupName,
    percentage: 0,
    averagePrice: 0,
    currentPrice: 0,
    quantity: 0,
    amount: 0
});

export function recalculateRow(portfolio: CurrentPortfolio, action: PayloadAction<TableUpdatePayload>): CurrentPortfolio {
    portfolio[1] = portfolio[1].map((row) => {
        if (row.id === action.payload.id) {
            if (action.payload.valueKey === EditableTableColumns.QUANTITY) {
                return recalculatePositionAmountByQuantity(row, Number.parseInt(action.payload.newValue, 10));
            }
            if (action.payload.valueKey === EditableTableColumns.WEIGHT) {
                return {
                    ...row,
                    [action.payload.valueKey]: Number.parseInt(action.payload.newValue, 10)
                };
            }
            return {
                ...row,
                [action.payload.valueKey]: action.payload.newValue
            };
        }
        return row;
    }) as ModelPortfolioPosition[] | BrokerAccountPosition[];
    return portfolio;
}

export function recalculateModelPortfolioPercentage(
    modelPortfolio: ModelPortfolioPosition[],
    totalTargetAmount: number
): ModelPortfolioPosition[] {
    let totalWeight = 0;
    for (const position of modelPortfolio) {
        totalWeight += position.weight;
    }
    return modelPortfolio.map((position) => {
        const proportion = position.weight / totalWeight;
        return {
            ...position,
            percentage: proportion * 100,
            targetAmount: totalTargetAmount * proportion
        };
    });
}

export function recalculateBrokerAccountPercentage(brokerAccount: BrokerAccountPosition[]) {
    let totalAmount = 0;
    for (const position of brokerAccount) {
        totalAmount += position.amount;
    }
    return brokerAccount.map((position) => ({
        ...position,
        percentage: (position.amount / totalAmount) * 100
    }));
}

export function recalculatePositionAmountByQuantity<T extends PortfolioPosition>(position: T, quantity: number): T {
    return {
        ...position,
        quantity,
        amount: position.currentPrice * quantity
    };
}

export function getNewGroupName(tableData: TableData): string {
    const noNameRegExp = new RegExp(`^\\(${NO_NAME}\\d*\\)$`);
    const groups = [...new Set(tableData
        .map((data) => data.groupName)
        .filter((groupName) => noNameRegExp.test(groupName)))];
    if (groups.length === 0) {
        return `(${NO_NAME})`;
    }
    const newGroupsNums = groups.map((groupName) => groupName.replace(`(${NO_NAME}`, "")
        .replace(")", ""));
    return `(${NO_NAME}${newGroupsNums.length})`;
}
