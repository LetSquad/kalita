import { BrokeragePortfolioTypes } from "../portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";
import { EditableTableColumns } from "./enums";

export type TableData = BrokerAccountPosition[] | ModelPortfolioPosition[];

export interface CurrentModelPortfolio {
    type: BrokeragePortfolioTypes.MODEL_PORTFOLIO,
    positions: ModelPortfolioPosition[],
    totalTargetAmount: number
}

export interface CurrentBrokerAccount {
    type: BrokeragePortfolioTypes.BROKER_ACCOUNT,
    positions: BrokerAccountPosition[]
}
export type CurrentPortfolio = CurrentModelPortfolio | CurrentBrokerAccount;

export interface TableUpdatePayload {
    readonly id: string,
    readonly valueKey: EditableTableColumns,
    readonly newValue: string,
    readonly newOrder?: string[]
}

export interface BrokerReportData {
    readonly accountName: string,
    readonly positions: Array<BrokerReportPosition>
}

export interface BrokerReportPosition {
    readonly name: string,
    readonly averagePrice: number,
    readonly quantity: number
}

export interface BrokerReportDeal {
    readonly name: string,
    readonly price: number,
    readonly quantity: number
}
