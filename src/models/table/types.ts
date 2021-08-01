import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";

export type TableData = BrokerAccountPosition[] | ModelPortfolioPosition[];

export type RowData = BrokerAccountPosition | ModelPortfolioPosition;
