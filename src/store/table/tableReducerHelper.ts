import { v4 as uuidv4 } from "uuid";
import { BrokeragePortfolioTypes } from "../../../custom_typings/portfolios/enums";
import { BrokerAccountTableData, ModelPortfolioTableData } from "../../../custom_typings/portfolios/types";
import { CurrentPortfolio, TableData } from "../../../custom_typings/table/types";

const NEW_ENTRY = "Новая запись";
const NO_NAME = "Без названия";

export function generateNewRow(currentPortfolio: CurrentPortfolio, groupName: string) {
    if (currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        currentPortfolio[1].push(newModelPortfolioRow(groupName));
    } else {
        currentPortfolio[1].push(newBrokerAccountRow(groupName));
    }
}

export const newModelPortfolioRow: (groupName: string) => ModelPortfolioTableData = (groupName: string) => ({
    id: uuidv4(),
    ticker: NEW_ENTRY,
    groupName,
    weight: 1,
    proportion: 0,
    targetAmount: 0,
    currentPrice: 0,
    targetQuantity: 0,
    quantity: 0,
    amount: 0
});

export const newBrokerAccountRow: (groupName: string) => BrokerAccountTableData = (groupName: string) => ({
    id: uuidv4(),
    ticker: NEW_ENTRY,
    groupName,
    proportion: 0,
    averagePrice: 0,
    currentPrice: 0,
    quantity: 0,
    amount: 0
});

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
