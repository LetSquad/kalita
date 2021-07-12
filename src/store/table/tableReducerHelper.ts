import { v4 as uuidv4 } from "uuid";
import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition, PortfolioPosition } from "../../models/portfolios/types";
import {
    BrokerReportPosition, CurrentPortfolio, TableData, TableUpdatePayload
} from "../../models/table/types";
import { EditableTableColumns } from "../../models/table/enums";
import { Quote } from "../../models/apis/types";

const NEW_ENTRY = "Новая запись";
const NEW_GROUP = "Новая группа";

export function generateNewPosition(currentPortfolio: CurrentPortfolio, groupName: string) {
    if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        currentPortfolio.positions.push(newModelPortfolioRow(groupName));
        currentPortfolio.positions = recalculateModelPortfolioPercentage(
            currentPortfolio.positions,
            currentPortfolio.totalTargetAmount
        );
    } else {
        currentPortfolio.positions.push(newBrokerAccountRow(groupName));
        currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
    }
}

export function mapPositionFromBrokerReport(groupName: string, position: BrokerReportPosition): BrokerAccountPosition {
    return {
        id: uuidv4(),
        ticker: position.code,
        percentage: 0,
        currentPrice: position.averagePrice,
        quantity: position.quantity,
        amount: position.quantity * position.averagePrice,
        groupName,
        averagePrice: position.averagePrice
    };
}

export const newModelPortfolioRow: (groupName: string) => ModelPortfolioPosition = (groupName: string) => ({
    id: uuidv4(),
    ticker: NEW_ENTRY,
    groupName,
    weight: 1,
    percentage: 0,
    targetAmount: 0,
    currentPrice: 1,
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
    currentPrice: 1,
    quantity: 0,
    amount: 0
});

export function recalculateRow(portfolio: CurrentPortfolio, tableUpdate: TableUpdatePayload): CurrentPortfolio {
    portfolio.positions = portfolio.positions.map((row) => {
        if (row.id === tableUpdate.id) {
            if (tableUpdate.valueKey === EditableTableColumns.QUANTITY) {
                return recalculatePositionAmountByQuantity(row, Number.parseInt(tableUpdate.newValue, 10));
            }
            if (tableUpdate.valueKey === EditableTableColumns.WEIGHT) {
                return {
                    ...row,
                    [tableUpdate.valueKey]: Number.parseInt(tableUpdate.newValue, 10)
                };
            }
            return {
                ...row,
                [tableUpdate.valueKey]: tableUpdate.newValue
            };
        }
        return row;
    }) as ModelPortfolioPosition[] | BrokerAccountPosition[];
    return portfolio;
}

export function recalculateRowsPrice(portfolio: CurrentPortfolio, quotes: Quote[]) {
    const priceMap = new Map<string, number>();
    for (const quote of quotes) {
        priceMap.set(quote.ticker, quote.price);
    }
    portfolio.positions = portfolio.positions.map((row) => {
        const newPrice = priceMap.get(row.ticker);
        if (newPrice) {
            return {
                ...row,
                currentPrice: newPrice,
                amount: newPrice * row.quantity
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
        const targetAmount = totalTargetAmount * proportion;
        return {
            ...position,
            percentage: proportion * 100,
            targetAmount,
            targetQuantity: Math.floor(targetAmount / position.currentPrice)
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
    const noNameRegExp = new RegExp(`^${NEW_GROUP} ?\\d*$`);
    const groups = [...new Set(tableData
        .map((data) => data.groupName)
        .filter((groupName) => noNameRegExp.test(groupName)))];
    if (groups.length === 0) {
        return NEW_GROUP;
    }
    const newGroupsNums = groups.map((groupName) => {
        if (groupName.length === NEW_GROUP.length) return 0;
        return Number.parseInt(groupName[groupName.length - 1], 10);
    }).sort();
    return `${NEW_GROUP} ${newGroupsNums[newGroupsNums.length - 1] + 1}`;
}
