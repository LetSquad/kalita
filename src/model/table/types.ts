import { BrokeragePortfolioTypes } from "../portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";
import { EditableTableColumns } from "./enums";

export type TableData = BrokerAccountPosition[] | ModelPortfolioPosition[];
export type CurrentModelPortfolio = [BrokeragePortfolioTypes.MODEL_PORTFOLIO, ModelPortfolioPosition[]];
export type CurrentBrokerAccount = [BrokeragePortfolioTypes.BROKER_ACCOUNT, BrokerAccountPosition[]];
export type CurrentPortfolio = CurrentModelPortfolio | CurrentBrokerAccount;

export interface TableUpdatePayload {
    readonly id: string,
    readonly valueKey: EditableTableColumns,
    readonly newValue: string
}
