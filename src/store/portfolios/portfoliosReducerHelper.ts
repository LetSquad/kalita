import { v4 as uuidv4 } from "uuid";
import { Quote } from "../../models/apis/types";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import {
    BrokerAccount,
    BrokerAccountIdentifier,
    BrokerAccountPosition,
    BrokerReportPosition,
    ModelPortfolio,
    ModelPortfolioIdentifier,
    ModelPortfolioPosition,
    Portfolio,
    PortfolioIdentifier,
    PortfolioPosition,
    PortfolioUpdatePayload
} from "../../models/portfolios/types";
import { ModelPortfolioQuantityMode } from "../../models/settings/enums";
import { EditableTableColumns } from "../../models/table/enums";
import { TableData } from "../../models/table/types";

export const defaultTotalTargetAmount = 1_000_000;

const NEW_ENTRY = "Новая запись";
const NEW_GROUP = "Новая группа";

export function getPortfolioTypeFromSidebarType(sidebarType: SidebarMenuElementsTypes): BrokeragePortfolioTypes {
    return sidebarType === SidebarMenuElementsTypes.MODEL_PORTFOLIO
        ? BrokeragePortfolioTypes.MODEL_PORTFOLIO
        : BrokeragePortfolioTypes.BROKER_ACCOUNT;
}

export const newBrokerAccount: (id: string) => BrokerAccount = (id: string) => ({
    id,
    type: BrokeragePortfolioTypes.BROKER_ACCOUNT,
    positions: []
});

export const newModelPortfolio: (id: string) => ModelPortfolio = (id: string) => ({
    id,
    type: BrokeragePortfolioTypes.MODEL_PORTFOLIO,
    positions: [],
    totalTargetAmount: defaultTotalTargetAmount,
    settings: { quantityMode: ModelPortfolioQuantityMode.MANUAL_INPUT, quantitySources: [] }
});

export function getCurrentPortfolio(currentTable: ModelPortfolioIdentifier,
    modelPortfolios: ModelPortfolio[],
    brokerAccounts: BrokerAccount[]) : ModelPortfolio | undefined;
export function getCurrentPortfolio(currentTable: BrokerAccountIdentifier,
    modelPortfolios: ModelPortfolio[],
    brokerAccounts: BrokerAccount[]) : BrokerAccount | undefined;
export function getCurrentPortfolio(
    currentTable: PortfolioIdentifier,
    modelPortfolios: ModelPortfolio[],
    brokerAccounts: BrokerAccount[]
): ModelPortfolio | BrokerAccount | undefined;
export function getCurrentPortfolio(
    currentTable: PortfolioIdentifier,
    modelPortfolios: ModelPortfolio[],
    brokerAccounts: BrokerAccount[]
): ModelPortfolio | BrokerAccount | undefined {
    if (currentTable.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        return modelPortfolios.find((portfolio) => portfolio.id === currentTable.id);
    }

    return brokerAccounts.find((account) => account.id === currentTable.id);
}

export function getCurrentPortfolioIndex(
    currentTable: PortfolioIdentifier,
    modelPortfolios: ModelPortfolio[],
    brokerAccounts: BrokerAccount[]
): number {
    if (currentTable.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        return modelPortfolios.findIndex((portfolio) => portfolio.id === currentTable.id);
    }

    return brokerAccounts.findIndex((account) => account.id === currentTable.id);
}

export function getBrokerAccountsPositionsByIds(
    brokerAccounts: BrokerAccount[],
    brokerAccountsIds: string[]
): BrokerAccountPosition[] {
    return brokerAccounts.filter((ba) => brokerAccountsIds.includes(ba.id))
        .flatMap((ba) => ba.positions);
}

export function generateNewPosition(currentPortfolio: Portfolio, groupName: string) {
    if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        currentPortfolio.positions.push(newModelPortfolioRow(getNewRowName(currentPortfolio.positions), groupName));
        currentPortfolio.positions = recalculateModelPortfolioPercentage(currentPortfolio);
    } else {
        currentPortfolio.positions.push(newBrokerAccountRow(getNewRowName(currentPortfolio.positions), groupName));
        currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
    }
}

export function mapPositionFromBrokerReport(groupName: string, position: BrokerReportPosition): BrokerAccountPosition {
    const currentPrice = position.currentPrice ? position.currentPrice : position.averagePrice;
    return {
        id: uuidv4(),
        name: position.name,
        ticker: position.code,
        percentage: 0,
        currentPrice,
        quantity: position.quantity,
        amount: position.quantity * currentPrice,
        groupName,
        averagePrice: position.averagePrice
    };
}

export const newModelPortfolioRow: (tickerName: string, groupName: string) => ModelPortfolioPosition =
    (tickerName: string, groupName: string) => ({
        id: uuidv4(),
        ticker: tickerName,
        groupName,
        weight: 1,
        percentage: 0,
        targetAmount: 0,
        currentPrice: 0,
        targetQuantity: 0,
        quantity: 0,
        amount: 0
    });

export const newBrokerAccountRow: (tickerName: string, groupName: string) => BrokerAccountPosition =
    (tickerName: string, groupName: string) => ({
        id: uuidv4(),
        ticker: tickerName,
        groupName,
        percentage: 0,
        averagePrice: 0,
        currentPrice: 0,
        quantity: 0,
        amount: 0
    });

export function recalculateRow(portfolio: Portfolio, tableUpdate: PortfolioUpdatePayload) {
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
            if (tableUpdate.valueKey === EditableTableColumns.AVERAGE_PRICE) {
                return {
                    ...row,
                    [tableUpdate.valueKey]: Number.parseFloat(Number.parseFloat(tableUpdate.newValue.replace(",", ".")).toFixed(5))
                };
            }
            return {
                ...row,
                [tableUpdate.valueKey]: tableUpdate.newValue
            };
        }
        return row;
    }) as ModelPortfolioPosition[] | BrokerAccountPosition[];
}

export function recalculateRowsPrice(
    positions: PortfolioPosition[],
    quotes: Quote[]
): ModelPortfolioPosition[] | BrokerAccountPosition[] {
    const quotesByTickers = new Map<string, Quote>();
    for (const quote of quotes) {
        quotesByTickers.set(quote.ticker, quote);
    }
    return positions.map((row) => {
        const quote = quotesByTickers.get(row.ticker);
        if (quote) {
            return {
                ...row,
                currentPrice: quote.price,
                amount: quote.price * row.quantity,
                name: quote.name
            };
        }
        return {
            ...row,
            currentPrice: 0,
            amount: 0,
            name: undefined
        };
    }) as ModelPortfolioPosition[] | BrokerAccountPosition[];
}

export function recalculateRowPrice(
    positions: PortfolioPosition[],
    quote?: Quote
): ModelPortfolioPosition[] | BrokerAccountPosition[] {
    return positions.map((row) => {
        if (row.ticker === quote?.ticker) {
            if (quote) {
                return {
                    ...row,
                    currentPrice: quote.price,
                    amount: quote.price * row.quantity,
                    name: quote.name
                };
            }
            return {
                ...row,
                currentPrice: 0,
                amount: 0,
                name: undefined
            };
        }
        return row;
    }) as ModelPortfolioPosition[] | BrokerAccountPosition[];
}

export function recalculateModelPortfolioPercentage(modelPortfolio: ModelPortfolio): ModelPortfolioPosition[] {
    const totalTargetAmount: number | undefined = typeof modelPortfolio.totalTargetAmount === "number"
        ? modelPortfolio.totalTargetAmount
        : 0;

    let totalWeight = 0;
    for (const position of modelPortfolio.positions) {
        totalWeight += position.weight;
    }
    return modelPortfolio.positions.map((position) => {
        const proportion = position.weight / totalWeight;
        const targetAmount = totalTargetAmount ? (totalTargetAmount * proportion) : 0;
        return {
            ...position,
            percentage: proportion * 100,
            targetAmount,
            targetQuantity: targetAmount && position.currentPrice > 0 ? Math.floor(targetAmount / position.currentPrice) : 0
        };
    });
}

export function recalculateModelPortfolioQuantity(modelPortfolioPositions: ModelPortfolioPosition[], sources: PortfolioPosition[]) {
    const quantityMap = new Map<string, number>();
    for (const source of sources) {
        const currentQuantity = quantityMap.get(source.ticker);
        if (currentQuantity) {
            quantityMap.set(source.ticker, currentQuantity + source.quantity);
        } else {
            quantityMap.set(source.ticker, source.quantity);
        }
    }

    return modelPortfolioPositions.map((p) => recalculatePositionAmountByQuantity(p, quantityMap.get(p.ticker) || 0));
}

export function recalculateBrokerAccountPercentage(brokerAccountPositions: BrokerAccountPosition[]) {
    let totalAmount = 0;
    for (const position of brokerAccountPositions) {
        totalAmount += position.amount;
    }
    return brokerAccountPositions.map((position) => ({
        ...position,
        percentage: totalAmount > 0 ? (position.amount / totalAmount) * 100 : 0
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
    return getNewName(tableData, NEW_GROUP, "groupName");
}

export function getNewRowName(tableData: TableData): string {
    return getNewName(tableData, NEW_ENTRY, "ticker");
}

function getNewName(tableData: TableData, nameConst: string, fieldName: "ticker" | "groupName"): string {
    const noNameRegExp = new RegExp(`^${nameConst} ?\\d*$`);
    const strings = [...new Set(tableData
        .map((data) => data[fieldName])
        .filter((ticker) => noNameRegExp.test(ticker)))];
    if (strings.length === 0) {
        return nameConst;
    }
    const newStringsNums = strings.map((ticker) => {
        if (ticker.length === nameConst.length) return 0;
        return Number.parseInt(ticker.slice(ticker.lastIndexOf(" ")), 10);
    }).sort((a, b) => a - b);
    return `${nameConst} ${newStringsNums[newStringsNums.length - 1] + 1}`;
}
