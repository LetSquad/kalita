import { ModelPortfolioQuantityMode } from "./enums";

export interface ModelPortfolioSettings {
    quantityMode: ModelPortfolioQuantityMode;
    quantitySources: string[];
}
