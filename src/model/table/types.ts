import { BrokeragePortfolioTypes } from "../portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";
import { EditableTableColumns } from "./enums";

export type TableData = BrokerAccountPosition[] | ModelPortfolioPosition[];
export type CurrentModelPortfolio = [BrokeragePortfolioTypes.MODEL_PORTFOLIO, ModelPortfolioPosition[]];
export type CurrentBrokerAccount = [BrokeragePortfolioTypes.BROKER_ACCOUNT, BrokerAccountPosition[]];
export type CurrentPortfolio = CurrentModelPortfolio | CurrentBrokerAccount;

export type ImportedCurrentModelPortfolio = [
    BrokeragePortfolioTypes.MODEL_PORTFOLIO,
    { portfolio: ModelPortfolioPosition[], totalTargetAmount: number }
];
export type ImportedCurrentPortfolio = CurrentBrokerAccount | ImportedCurrentModelPortfolio;

export interface TableUpdatePayload {
    readonly id: string,
    readonly valueKey: EditableTableColumns,
    readonly newValue: string
}
