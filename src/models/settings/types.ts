import { Currency } from "../portfolios/enums";
import { ModelPortfolioQuantityMode } from "./enums";

export interface PortfolioSettings {
    baseCurrency: Currency;
}

export interface ModelPortfolioSettings extends PortfolioSettings {
    quantityMode: ModelPortfolioQuantityMode;
    quantitySources: string[];
}
