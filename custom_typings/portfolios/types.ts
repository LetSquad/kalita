export interface ModelPortfolioTableData {
    id: string,
    ticker: string,
    weight: number,
    proportion: number,
    targetAmount: number,
    currentPrice: number,
    targetQuantity: number,
    quantity: number,
    amount: number,
    groupName: string
}

export interface BrokerAccountTableData {
    id: string,
    ticker: string,
    proportion: number,
    averagePrice: number,
    currentPrice: number,
    quantity: number,
    amount: number,
    groupName: string
}
