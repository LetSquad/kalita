import { Currency } from "../portfolios/enums";
import { ModelPortfolioPriceMode, ModelPortfolioQuantityMode } from "./enums";

export interface PortfolioSettings {
    baseCurrency: Currency;
}

export interface ModelPortfolioSettings extends PortfolioSettings {
    priceMode: ModelPortfolioPriceMode;
    quantityMode: ModelPortfolioQuantityMode;
    quantitySources: string[];
}
