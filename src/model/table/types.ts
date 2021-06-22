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
    readonly newValue: string
}
