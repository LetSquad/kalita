import { BrokeragePortfolioTypes } from "../portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";
import { BrokerReportEncoding, BrokerReportFormat, EditableTableColumns } from "./enums";

export type TableData = BrokerAccountPosition[] | ModelPortfolioPosition[];

export interface CurrentModelPortfolio {
    id: string,
    type: BrokeragePortfolioTypes.MODEL_PORTFOLIO,
    positions: ModelPortfolioPosition[],
    totalTargetAmount: string | number
}

export interface CurrentBrokerAccount {
    id: string,
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

export interface BrokerReportMetadata {
    readonly brokerName: string,
    readonly icon: string,
    readonly reportFormat: BrokerReportFormat,
    readonly reportEncoding: BrokerReportEncoding,
    readonly reportParser: (brokerName: string, data: any) => BrokerReportData
}

export interface BrokerReportPath {
    readonly path: string,
    readonly format: BrokerReportFormat,
    readonly encoding: BrokerReportEncoding
}

export interface BrokerReportData {
    readonly accountName: string,
    readonly positions: BrokerReportPosition[]
}

export interface BrokerReportPosition {
    readonly code: string,
    readonly averagePrice: number,
    readonly quantity: number
}

export interface BrokerReportDeal {
    readonly code: string,
    readonly price: number,
    readonly quantity: number
}
