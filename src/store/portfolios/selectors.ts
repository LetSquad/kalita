import { createSelector } from "@reduxjs/toolkit";

import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import { RootState } from "../index";
import { getCurrentPortfolio } from "./portfoliosReducerHelper";

const selectPortfolios = (state: RootState) => state.portfolios;

export const currentPortfolioSelector = createSelector(
    selectPortfolios,
    (portfolios) => {
        if (portfolios.currentTable) {
            return getCurrentPortfolio(portfolios.currentTable, portfolios.modelPortfolios, portfolios.brokerAccounts);
        }
        return undefined;
    }
);

export const currentTargetAmountSelector = createSelector(currentPortfolioSelector, (currentPortfolio) => {
    if (currentPortfolio?.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        return currentPortfolio?.totalTargetAmount;
    }
    return undefined;
});

export const baseCurrencySelector = createSelector(currentPortfolioSelector, (currentPortfolio) => {
    if (currentPortfolio?.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
        return currentPortfolio?.settings?.baseCurrency;
    }
    return undefined;
});
