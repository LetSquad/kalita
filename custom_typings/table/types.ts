import { BrokeragePortfolioTypes } from "../portfolios/enums";
import { BrokerAccountTableData, ModelPortfolioTableData } from "../portfolios/types";

export type TableData = BrokerAccountTableData[] | ModelPortfolioTableData[];
export type CurrentModelPortfolio = [BrokeragePortfolioTypes.MODEL_PORTFOLIO, ModelPortfolioTableData[]];
export type CurrentBrokerAccount = [BrokeragePortfolioTypes.BROKER_ACCOUNT, BrokerAccountTableData[]];
export type CurrentPortfolio = CurrentModelPortfolio | CurrentBrokerAccount;
