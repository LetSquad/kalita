import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getMoexQuotes } from "../../apis/moexApi";
import { Quote } from "../../models/apis/types";
import { MenuElementIdentifier } from "../../models/menu/types";
import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import {
    BrokerAccountIdentifier,
    BrokerAccountPosition,
    BrokerReportData,
    ModelPortfolioIdentifier,
    ModelPortfolioPosition,
    PortfolioIdentifier,
    Portfolios, PortfolioUpdatePayload
} from "../../models/portfolios/types";
import { EditableTableColumns } from "../../models/table/enums";
import { addNewElementToGroup, deleteElementFromGroup, setActiveId } from "../sidebarMenu/sidebarMenuReducer";
import {
    generateNewPosition,
    getCurrentPortfolio,
    getNewGroupName,
    getPortfolioTypeFromSidebarType,
    mapPositionFromBrokerReport,
    newBrokerAccount,
    newModelPortfolio,
    recalculateBrokerAccountPercentage,
    recalculateModelPortfolioPercentage,
    recalculateRow,
    recalculateRowsPrice
} from "./portfoliosReducerHelper";

export interface PortfoliosState extends Portfolios {
    currentTable?: ModelPortfolioIdentifier | BrokerAccountIdentifier;
}

const initialState: PortfoliosState = {
    modelPortfolios: [],
    brokerAccounts: [],
    currentTable: undefined
};

export const portfoliosSlice = createSlice({
    name: "portfolios",
    initialState,
    reducers: {
        setPortfolios: (state, action: PayloadAction<Portfolios>) => {
            state.modelPortfolios = action.payload.modelPortfolios;
            state.brokerAccounts = action.payload.brokerAccounts;
        },
        addNewPortfolio: (state, action: PayloadAction<PortfolioIdentifier>) => {
            if (action.payload.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios = [
                    ...state.modelPortfolios,
                    newModelPortfolio(action.payload.id)
                ];
            } else if (action.payload.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                state.brokerAccounts = [
                    ...state.brokerAccounts,
                    newBrokerAccount(action.payload.id)
                ];
            }
        },
        deletePortfolio: (state, action: PayloadAction<PortfolioIdentifier>) => {
            if (action.payload.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios.filter((portfolio) => portfolio.id !== action.payload.id);
            } else if (action.payload.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                state.brokerAccounts.filter((account) => account.id !== action.payload.id);
            }
        },
        setCurrentPortfolio: (state, action: PayloadAction<PortfolioIdentifier>) => {
            state.currentTable = action.payload;
            const currentPortfolio = getCurrentPortfolio(action.payload, state.modelPortfolios, state.brokerAccounts);
            if (currentPortfolio) {
                if (currentPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                    currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
                } else if (action.payload.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                    currentPortfolio.positions = recalculateModelPortfolioPercentage(
                        currentPortfolio.positions,
                        typeof currentPortfolio.totalTargetAmount === "number"
                            ? currentPortfolio.totalTargetAmount
                            : 0
                    );
                }
            }
        },
        addNewPosition: (state, action: PayloadAction<string>) => {
            if (state.currentTable) {
                const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                if (currentPortfolio) {
                    generateNewPosition(currentPortfolio, action.payload);
                }
            }
        },
        addBrokerAccountPositions: (state, action: PayloadAction<BrokerReportData>) => {
            if (state.currentTable && state.currentTable.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                const currentAccount = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                if (currentAccount) {
                    for (const position of action.payload.positions) {
                        currentAccount.positions.push(mapPositionFromBrokerReport(action.payload.accountName, position));
                    }
                    currentAccount.positions = recalculateBrokerAccountPercentage(currentAccount.positions);
                }
            }
        },
        addNewGroup: (state) => {
            if (state.currentTable) {
                const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                if (currentPortfolio) {
                    generateNewPosition(currentPortfolio, getNewGroupName(currentPortfolio.positions));
                }
            }
        },
        update: (state, action: PayloadAction<PortfolioUpdatePayload>) => {
            if (state.currentTable) {
                const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                if (currentPortfolio) {
                    recalculateRow(currentPortfolio, action.payload);

                    if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                        action.payload.valueKey === EditableTableColumns.WEIGHT
                    ) {
                        currentPortfolio.positions = recalculateModelPortfolioPercentage(
                            currentPortfolio.positions,
                            typeof currentPortfolio.totalTargetAmount === "number"
                                ? currentPortfolio.totalTargetAmount
                                : 0
                        );
                    } else if (
                        currentPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT &&
                        action.payload.valueKey === EditableTableColumns.QUANTITY
                    ) {
                        currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
                    }

                    if (action.payload.newOrder) {
                        currentPortfolio.positions = action.payload.newOrder.map((id) =>
                            (currentPortfolio.positions as Array<ModelPortfolioPosition | BrokerAccountPosition>)
                                .find((data) => data.id === id)) as ModelPortfolioPosition[] | BrokerAccountPosition[];
                    }
                }
            }
        },
        updateGroupName: (state, action: PayloadAction<{ oldGroupName: string, newGroupName: string }>) => {
            if (state.currentTable) {
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
            }
        },
        deleteRowById: (state, action: PayloadAction<string>) => {
            if (state.currentTable) {
                const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                if (currentPortfolio) {
                    currentPortfolio.positions =
                        (currentPortfolio.positions as Array<ModelPortfolioPosition | BrokerAccountPosition>)
                            .filter((row) => row.id !== action.payload) as ModelPortfolioPosition[] | BrokerAccountPosition[];

                    if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                        currentPortfolio.positions = recalculateModelPortfolioPercentage(
                            currentPortfolio.positions,
                            typeof currentPortfolio.totalTargetAmount === "number"
                                ? currentPortfolio.totalTargetAmount
                                : 0
                        );
                    } else if (currentPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                        currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
                    }
                }
            }
        },
        updateTotalTargetAmount: (state, action: PayloadAction<string | number>) => {
            if (state.currentTable && state.currentTable.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                if (currentPortfolio) {
                    currentPortfolio.totalTargetAmount = action.payload;
                    currentPortfolio.positions = recalculateModelPortfolioPercentage(
                        currentPortfolio.positions,
                        typeof action.payload === "number"
                            ? action.payload
                            : 0
                    );
                }
            }
        },
        resetCurrentPortfolio: (state) => {
            state.currentTable = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMoexQuotes.fulfilled, (state, action: PayloadAction<Quote[]>) => {
                if (state.currentTable) {
                    const currentPortfolio = getCurrentPortfolio(state.currentTable, state.modelPortfolios, state.brokerAccounts);
                    if (currentPortfolio) {
                        recalculateRowsPrice(currentPortfolio, action.payload);
                        if (currentPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                            currentPortfolio.positions = recalculateBrokerAccountPercentage(currentPortfolio.positions);
                        } else if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                            currentPortfolio.positions = recalculateModelPortfolioPercentage(
                                currentPortfolio.positions,
                                typeof currentPortfolio.totalTargetAmount === "number"
                                    ? currentPortfolio.totalTargetAmount
                                    : 0
                            );
                        }
                    }
                }
            })
            .addCase(addNewElementToGroup, (state, action: PayloadAction<MenuElementIdentifier>) => {
                portfoliosSlice.caseReducers.addNewPortfolio(
                    state,
                    { ...action, payload: { ...action.payload, type: getPortfolioTypeFromSidebarType(action.payload.type) } }
                );
            })
            .addCase(deleteElementFromGroup, (state, action: PayloadAction<MenuElementIdentifier>) => {
                portfoliosSlice.caseReducers.deletePortfolio(
                    state,
                    { ...action, payload: { ...action.payload, type: getPortfolioTypeFromSidebarType(action.payload.type) } }
                );
                if (state.currentTable?.id === action.payload.id) {
                    portfoliosSlice.caseReducers.resetCurrentPortfolio(state);
                }
            })
            .addCase(setActiveId, (state, action: PayloadAction<MenuElementIdentifier>) => {
                portfoliosSlice.caseReducers.setCurrentPortfolio(
                    state,
                    { ...action, payload: { ...action.payload, type: getPortfolioTypeFromSidebarType(action.payload.type) } }
                );
            });
    }
});

export const {
    setPortfolios,
    addNewPosition,
    addBrokerAccountPositions,
    addNewGroup,
    update,
    updateGroupName,
    deleteRowById,
    updateTotalTargetAmount
} = portfoliosSlice.actions;

export default portfoliosSlice.reducer;
