import { ModelPortfolioQuantityMode } from "./enums";
import { Currency } from "../portfolios/enums";

export interface PortfolioSettings {
    baseCurrency: Currency;
}

export interface ModelPortfolioSettings extends PortfolioSettings {
    quantityMode: ModelPortfolioQuantityMode;
    quantitySources: string[];
}
