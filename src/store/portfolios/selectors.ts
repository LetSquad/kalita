import { createSelector } from "@reduxjs/toolkit";
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
