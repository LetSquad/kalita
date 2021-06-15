import { v4 as uuidv4 } from "uuid";
import { BrokeragePortfolioTypes } from "../../../custom_typings/enums";
import {
    BrokerAccountTableData,
    CurrentPortfolio,
    ModelPortfolioTableData,
    TableData
} from "../../../custom_typings/types";

export function generateNewRow(currentPortfolio: CurrentPortfolio, groupName: string) {
    if (currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        currentPortfolio[1].push(newModelPortfolioRow(groupName));
    } else {
        currentPortfolio[1].push(newBrokerAccountRow(groupName));
    }
}

export const newModelPortfolioRow: (groupName: string) => ModelPortfolioTableData = (groupName: string) => ({
    id: uuidv4(),
    name: "Новая запись",
    groupName,
    weight: 1,
    share: 0,
    targetAmount: 0,
    price: 0,
    targetQuantity: 0,
    briefcase: 0,
    amount: 0
});

export const newBrokerAccountRow: (groupName: string) => BrokerAccountTableData = (groupName: string) => ({
    id: uuidv4(),
    name: "Новая запись",
    groupName,
    share: 0,
    purchasePrice: 0,
    price: 0,
    briefcase: 0,
    amount: 0
});

export function getNewGroupName(tableData: TableData): string {
    const groups = [...new Set(tableData
        .map((data) => data.groupName)
        .filter((groupName) => /^\(Без названия\d*\)$/.test(groupName)))];
    if (groups.length === 0) {
        return "(Без названия)";
    }
    const newGroupsNums = groups.map((groupName) => groupName.replace("(Без названия", "")
        .replace(")", ""));
    return `(Без названия${newGroupsNums.length})`;
}
