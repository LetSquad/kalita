import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { loadMoexQuoteByTicker, loadMoexQuotesByTickers } from "../../apis/moexApi";
import { QuoteData } from "../../models/apis/types";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import { MenuElementIdentifier } from "../../models/menu/types";
import { BrokeragePortfolioTypes, Currency } from "../../models/portfolios/enums";
import {
    AnalyticsIdentifier,
    BrokerAccountIdentifier,
    BrokerAccountPosition,
    BrokerReportData,
    CurrencyUpdatePayload,
    ModelPortfolioIdentifier,
    ModelPortfolioPosition,
    PortfolioIdentifier,
    PortfolioReorderPayload,
    Portfolios,
    PortfolioUpdatePayload
} from "../../models/portfolios/types";
import { ModelPortfolioPriceMode, ModelPortfolioQuantityMode } from "../../models/settings/enums";
import { EditableTableColumns } from "../../models/table/enums";
import {
    addNewElementToGroup,
    deleteElementFromGroup,
    setActiveId,
    setDefault
} from "../sidebarMenu/sidebarMenuReducer";
import {
    generateNewPosition,
    getBrokerAccountsPositionsByIds,
    getCurrentPortfolio,
    getNewGroupName,
    getPortfolioTypeFromSidebarType,
    mapPositionFromBrokerReport,
    newBrokerAccount,
    newModelPortfolio,
    recalculateBrokerAccountPercentage,
    recalculateModelPortfolioPercentage,
    recalculateModelPortfolioQuantity,
    recalculatePortfolioCurrency,
    recalculatePortfolioPercentage,
    recalculatePortfolioPrice,
    recalculateRow,
    recalculateRowPrice
} from "./portfoliosReducerHelper";

export interface PortfoliosState extends Portfolios {
    currentTable?: ModelPortfolioIdentifier | BrokerAccountIdentifier | AnalyticsIdentifier;
    activeGroup?: string;
}

const initialState: PortfoliosState = {
    modelPortfolios: [],
    brokerAccounts: [],
    currentTable: undefined,
    activeGroup: undefined
};

export const portfoliosSlice = createSlice({
    name: "portfolios",
    initialState,
    reducers: {
        setPortfolios: (state: PortfoliosState, action: PayloadAction<Portfolios>) => {
            state.modelPortfolios = action.payload.modelPortfolios;
            state.brokerAccounts = action.payload.brokerAccounts;
        },
        addNewPortfolio: (state: PortfoliosState, action: PayloadAction<MenuElementIdentifier>) => {
            if (action.payload.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios = [
                    ...state.modelPortfolios,
                    newModelPortfolio(action.payload.id)
                ];
            } else if (action.payload.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts = [
                    ...state.brokerAccounts,
                    newBrokerAccount(action.payload.id)
                ];
            }
        },
        deletePortfolio: (state: PortfoliosState, action: PayloadAction<MenuElementIdentifier>) => {
            if (action.payload.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios = state.modelPortfolios.filter((portfolio) => portfolio.id !== action.payload.id);
            } else if (action.payload.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts = state.brokerAccounts.filter((account) => account.id !== action.payload.id);
            }
        },
        setCurrentPortfolio: (state: PortfoliosState, action: PayloadAction<PortfolioIdentifier>) => {
            state.currentTable = action.payload;
            state.activeGroup = undefined;

            const currentPortfolio = getCurrentPortfolio(action.payload, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                currentPortfolio.positions = recalculatePortfolioPercentage(currentPortfolio);
                if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    currentPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT
                ) {
                    currentPortfolio.positions = recalculateModelPortfolioQuantity(
                        currentPortfolio.positions,
                        getBrokerAccountsPositionsByIds(state.brokerAccounts, currentPortfolio.settings.quantitySources)
                    );
                }

                if (currentPortfolio.positions.length > 0) {
                    state.activeGroup = currentPortfolio.positions[0].groupName;
                }
            }
        },
        addNewPosition: (state: PortfoliosState, action: PayloadAction<string | undefined>) => {
            if (!state.currentTable) {
                return;
            }
            if (action.payload) {
                state.activeGroup = action.payload;
            }
            if (!state.activeGroup) {
                return;
            }

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                generateNewPosition(currentPortfolio, state.activeGroup);
            }
        },
        addBrokerAccountPositions: (state: PortfoliosState, action: PayloadAction<BrokerReportData>) => {
            if (!state.currentTable || state.currentTable.type !== BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                return;
            }
            const currentAccount = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentAccount) {
                for (const position of action.payload.positions) {
                    currentAccount.positions.push(mapPositionFromBrokerReport(action.payload.accountName, position));
                }
                currentAccount.positions = recalculateBrokerAccountPercentage(currentAccount.positions);
            }
        },
        addNewGroup: (state: PortfoliosState) => {
            if (!state.currentTable) {
                return;
            }
            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                const groupName: string = getNewGroupName(currentPortfolio.positions);
                state.activeGroup = groupName;
                generateNewPosition(currentPortfolio, groupName);
            }
        },
        update: (state: PortfoliosState, action: PayloadAction<PortfolioUpdatePayload>) => {
            if (!state.currentTable) {
                return;
            }
            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                const currentPosition = (currentPortfolio.positions as Array<ModelPortfolioPosition | BrokerAccountPosition>)
                    .find((p) => p.id === action.payload.id);
                if (currentPosition) {
                    state.activeGroup = currentPosition.groupName;
                }

                recalculateRow(currentPortfolio, action.payload);

                if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                    if (action.payload.valueKey === EditableTableColumns.TICKER &&
                            currentPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT
                    ) {
                        currentPortfolio.positions = recalculateModelPortfolioQuantity(
                            currentPortfolio.positions,
                            getBrokerAccountsPositionsByIds(state.brokerAccounts, currentPortfolio.settings.quantitySources)
                        );
                    } else if (action.payload.valueKey === EditableTableColumns.WEIGHT ||
                        action.payload.valueKey === EditableTableColumns.CURRENT_PRICE
                    ) {
                        currentPortfolio.positions = recalculateModelPortfolioPercentage(currentPortfolio);
                    }
                } else if (
                    currentPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT &&
                        action.payload.valueKey === EditableTableColumns.QUANTITY
                ) {
                    currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
                    for (const modelPortfolio of state.modelPortfolios) {
                        if (
                            modelPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT &&
                            modelPortfolio.settings.quantitySources.includes(currentPortfolio.id)
                        ) {
                            modelPortfolio.positions = recalculateModelPortfolioQuantity(
                                modelPortfolio.positions,
                                getBrokerAccountsPositionsByIds(state.brokerAccounts, modelPortfolio.settings.quantitySources)
                            );
                        }
                    }
                }
            }
        },
        updatePosition: (state: PortfoliosState, action: PayloadAction<PortfolioReorderPayload>) => {
            if (!state.currentTable) {
                return;
            }

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            let positionGroup: string;
            if (currentPortfolio) {
                if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                    const movedPosition = currentPortfolio.positions.splice(action.payload.oldOrder, 1)[0];
                    positionGroup = movedPosition.groupName;

                    currentPortfolio.positions.splice(
                        action.payload.newOrder,
                        0,
                        action.payload.newGroupName ? { ...movedPosition, groupName: action.payload.newGroupName } : movedPosition
                    );
                } else {
                    const movedPosition = currentPortfolio.positions.splice(action.payload.oldOrder, 1)[0];
                    positionGroup = movedPosition.groupName;

                    currentPortfolio.positions.splice(
                        action.payload.newOrder,
                        0,
                        action.payload.newGroupName ? { ...movedPosition, groupName: action.payload.newGroupName } : movedPosition
                    );
                }

                state.activeGroup = action.payload.newGroupName ?? positionGroup;
            }
        },
        updateGroupName: (state: PortfoliosState, action: PayloadAction<{ oldGroupName: string, newGroupName: string }>) => {
            if (!state.currentTable) {
                return;
            }
            state.activeGroup = action.payload.newGroupName;

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                currentPortfolio.positions = currentPortfolio.positions.map((row) => {
                    if (row.groupName === action.payload.oldGroupName) {
                        return {
                            ...row,
                            groupName: action.payload.newGroupName
                        };
                    }
                    return row;
                }) as ModelPortfolioPosition[] | BrokerAccountPosition[];
            }
        },
        deleteRowById: (state: PortfoliosState, action: PayloadAction<string>) => {
            if (!state.currentTable) {
                return;
            }

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                currentPortfolio.positions =
                        (currentPortfolio.positions as Array<ModelPortfolioPosition | BrokerAccountPosition>)
                            .filter((row) => row.id !== action.payload) as ModelPortfolioPosition[] | BrokerAccountPosition[];
                currentPortfolio.positions = recalculatePortfolioPercentage(currentPortfolio);
            }
        },
        updateTotalTargetAmount: (state: PortfoliosState, action: PayloadAction<string | number>) => {
            if (!state.currentTable || state.currentTable.type !== BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                return;
            }
            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                currentPortfolio.totalTargetAmount = action.payload;
                currentPortfolio.positions = recalculateModelPortfolioPercentage(currentPortfolio);
            }
        },
        updateBaseCurrency: (state: PortfoliosState, action: PayloadAction<CurrencyUpdatePayload>) => {
            if (!state.currentTable) {
                return;
            }
            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (!currentPortfolio || currentPortfolio.settings.baseCurrency === action.payload.currency) {
                return;
            }

            const previousCurrency: Currency = currentPortfolio.settings.baseCurrency;
            currentPortfolio.settings.baseCurrency = action.payload.currency;
            currentPortfolio.positions = recalculatePortfolioCurrency(currentPortfolio, previousCurrency, action.payload.quotes);
            currentPortfolio.positions = recalculatePortfolioPercentage(currentPortfolio);
        },
        updateModelPortfolioPriceMode: (state: PortfoliosState, action: PayloadAction<ModelPortfolioPriceMode>) => {
            if (!state.currentTable) {
                return;
            }

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                currentPortfolio.settings.priceMode = action.payload;
            }
        },
        updateModelPortfolioQuantityMode: (state: PortfoliosState, action: PayloadAction<ModelPortfolioQuantityMode>) => {
            if (!state.currentTable) {
                return;
            }

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                currentPortfolio.settings.quantityMode = action.payload;
                if (action.payload === ModelPortfolioQuantityMode.BROKER_ACCOUNT) {
                    currentPortfolio.positions = recalculateModelPortfolioQuantity(
                        currentPortfolio.positions,
                        getBrokerAccountsPositionsByIds(state.brokerAccounts, currentPortfolio.settings.quantitySources)
                    );
                }
            }
        },
        updateModelPortfolioQuantitySources: (state: PortfoliosState, action: PayloadAction<string[]>) => {
            if (!state.currentTable) {
                return;
            }

            const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                currentPortfolio.settings.quantitySources = action.payload;
                if (currentPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT) {
                    currentPortfolio.positions = recalculateModelPortfolioQuantity(
                        currentPortfolio.positions,
                        getBrokerAccountsPositionsByIds(state.brokerAccounts, action.payload)
                    );
                }
            }
        },
        resetCurrentPortfolio: (state: PortfoliosState) => {
            state.currentTable = undefined;
            state.activeGroup = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMoexQuoteByTicker.fulfilled, (state: PortfoliosState, action: PayloadAction<QuoteData>) => {
                if (state.currentTable) {
                    const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                    if (currentPortfolio) {
                        currentPortfolio.positions = recalculateRowPrice(currentPortfolio, action.payload[0], action.payload[1]);
                        currentPortfolio.positions = recalculatePortfolioPercentage(currentPortfolio);
                    }
                }
            })
            .addCase(loadMoexQuotesByTickers.fulfilled, (state: PortfoliosState, action) => {
                if (state.currentTable && !action.meta.arg.isGlobalUpdate) {
                    const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                    if (currentPortfolio) {
                        currentPortfolio.positions = recalculatePortfolioPrice(currentPortfolio, action.payload[0], action.payload[1]);
                        currentPortfolio.positions = recalculatePortfolioPercentage(currentPortfolio);
                    }
                }

                if (action.meta.arg.isGlobalUpdate) {
                    for (const portfolio of [
                        ...state.modelPortfolios.filter((_portfolio) => (
                            _portfolio.settings.priceMode === ModelPortfolioPriceMode.MARKET_DATA
                        )),
                        ...state.brokerAccounts
                    ]) {
                        portfolio.positions = recalculatePortfolioPrice(portfolio, action.payload[0], action.payload[1]);
                        portfolio.positions = recalculatePortfolioPercentage(portfolio);
                    }
                }
            })
            .addCase(addNewElementToGroup, (state: PortfoliosState, action: PayloadAction<MenuElementIdentifier>) => {
                portfoliosSlice.caseReducers.addNewPortfolio(
                    state,
                    action
                );
            })
            .addCase(deleteElementFromGroup, (state: PortfoliosState, action: PayloadAction<MenuElementIdentifier>) => {
                portfoliosSlice.caseReducers.deletePortfolio(
                    state,
                    action
                );
                if (state.currentTable?.id === action.payload.id) {
                    portfoliosSlice.caseReducers.resetCurrentPortfolio(state);
                }
            })
            .addCase(setActiveId, (state: PortfoliosState, action: PayloadAction<MenuElementIdentifier>) => {
                portfoliosSlice.caseReducers.setCurrentPortfolio(
                    state,
                    {
                        ...action,
                        payload: {
                            ...action.payload,
                            type: getPortfolioTypeFromSidebarType(action.payload.type)
                        }
                    }
                );
            })
            .addCase(setDefault, (state) => {
                portfoliosSlice.caseReducers.resetCurrentPortfolio(state);
            });
    }
});

export const {
    setPortfolios,
    addNewPosition,
    addBrokerAccountPositions,
    addNewGroup,
    update,
    updatePosition,
    updateGroupName,
    deleteRowById,
    updateTotalTargetAmount,
    updateBaseCurrency,
    updateModelPortfolioPriceMode,
    updateModelPortfolioQuantityMode,
    updateModelPortfolioQuantitySources
} = portfoliosSlice.actions;

export default portfoliosSlice.reducer;
