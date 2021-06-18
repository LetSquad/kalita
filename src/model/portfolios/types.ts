export interface ModelPortfolioPosition extends PortfolioPosition {
    readonly weight: number,
    readonly targetAmount: number,
    readonly targetQuantity: number
}

export interface BrokerAccountPosition extends PortfolioPosition {
    readonly averagePrice: number
}

export interface PortfolioPosition {
    readonly id: string,
    readonly ticker: string,
    readonly percentage: number,
    readonly currentPrice: number,
    readonly quantity: number,
    readonly amount: number,
    readonly groupName: string
}
