import { EditableTableColumns } from "../table/enums";
import {
    BrokeragePortfolioTypes,
    BrokerReportPositionCodeFormat,
    BrokerReportEncoding,
    BrokerReportFormat, BrokerCode
} from "./enums";
import { ModelPortfolioSettings } from "../settings/types";

export interface ModelPortfolioIdentifier {
    id: string;
    type: BrokeragePortfolioTypes.MODEL_PORTFOLIO;
}

export interface BrokerAccountIdentifier {
    id: string;
    type: BrokeragePortfolioTypes.BROKER_ACCOUNT;
}

export type PortfolioIdentifier = ModelPortfolioIdentifier | BrokerAccountIdentifier;

export interface Portfolios {
    modelPortfolios: ModelPortfolio[];
    brokerAccounts: BrokerAccount[];
}

export type Portfolio = ModelPortfolio | BrokerAccount;

export interface ModelPortfolio {
    id: string;
    type: BrokeragePortfolioTypes.MODEL_PORTFOLIO;
    positions: ModelPortfolioPosition[];
    totalTargetAmount: number | string;
    settings: ModelPortfolioSettings;
}

export interface BrokerAccount {
    id: string;
    type: BrokeragePortfolioTypes.BROKER_ACCOUNT;
    positions: BrokerAccountPosition[];
}

export type PortfolioPosition = {
    readonly id: string;
    readonly name?: string;
    readonly ticker: string;
    readonly percentage: number;
    readonly currentPrice: number;
    readonly quantity: number;
    readonly amount: number;
    readonly groupName: string;
};

export type ModelPortfolioPosition = PortfolioPosition & {
    readonly weight: number;
    readonly targetAmount: number;
    readonly targetQuantity: number;
};

export type BrokerAccountPosition = PortfolioPosition & {
    readonly averagePrice: number;
};

export interface PortfolioUpdatePayload {
    readonly id: string;
    readonly valueKey: EditableTableColumns;
    readonly newValue: string;
    readonly newOrder?: string[];
}

export interface BrokerReportMetadata {
    readonly brokerName: string;
    readonly brokerCode: BrokerCode;
    readonly icon: string;
    readonly reportFormat: BrokerReportFormat;
    readonly reportEncoding: BrokerReportEncoding;
    readonly positionCodeFormat: BrokerReportPositionCodeFormat;
}

export interface BrokerReportLoadResult {
    readonly reportData?: BrokerReportData;
    readonly error?: Error;
}

export interface BrokerReportPath {
    readonly brokerName: string;
    readonly brokerCode:BrokerCode;
    readonly path: string;
    readonly format: BrokerReportFormat;
    readonly encoding: BrokerReportEncoding;
    readonly positionCodeFormat: BrokerReportPositionCodeFormat;
}

export interface BrokerReportData {
    readonly accountName: string;
    readonly positions: BrokerReportPosition[];
}

export interface BrokerReportPosition {
    readonly code: string;
    readonly name?: string;
    readonly averagePrice: number;
    readonly currentPrice?: number;
    readonly quantity: number;
}

export interface BrokerReportDeal {
    readonly code: string;
    readonly price: number;
    readonly quantity: number;
}
