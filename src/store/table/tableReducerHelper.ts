import { v4 as uuidv4 } from "uuid";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition, PortfolioPosition } from "../../model/portfolios/types";
import { CurrentPortfolio, TableData } from "../../model/table/types";

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

export function recalculateModelPortfolioPercentage(
    modelPortfolio: ModelPortfolioPosition[],
    totalTargetAmount: number
): ModelPortfolioPosition[] {
    const totalWeight: number = modelPortfolio.map(p => p.weight)
        .reduce((acc, w) => acc + w);
    return modelPortfolio.map(position => {
        const proportion = position.weight / totalWeight;
        return {
            ...position,
            percentage: proportion * 100,
            targetAmount: totalTargetAmount * proportion
        };
    });
}

export function recalculateBrokerAccountPercentage(brokerAccount: BrokerAccountPosition[]) {
    const totalAmount: number = brokerAccount.map(p => p.amount)
        .reduce((acc, a) => acc + a);
    return brokerAccount.map(position => {
        return {
            ...position,
            percentage: position.amount / totalAmount * 100
        }
    });
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
