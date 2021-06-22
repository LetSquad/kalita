import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../../model/portfolios/types";
import { EditableTableColumns } from "../../model/table/enums";
import { CurrentPortfolio, TableUpdatePayload } from "../../model/table/types";
import {
    generateNewRow,
    getNewGroupName,
    recalculateBrokerAccountPercentage,
    recalculateModelPortfolioPercentage,
    recalculateRow
} from "./tableReducerHelper";

export interface TableDataState {
    currentPortfolio?: CurrentPortfolio,
    isSettingsOpened: boolean
}

const initialState: TableDataState = {
    currentPortfolio: undefined,
    isSettingsOpened: false
};

export const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setCurrentPortfolio: (state, action: PayloadAction<CurrentPortfolio>) => {
            if (action.payload.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
                state.currentPortfolio = {
                    type: BrokeragePortfolioTypes.BROKER_ACCOUNT,
                    positions: recalculateBrokerAccountPercentage(action.payload.positions)
                };
            } else if (action.payload.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                state.currentPortfolio = {
                    type: BrokeragePortfolioTypes.MODEL_PORTFOLIO,
                    positions: recalculateModelPortfolioPercentage(action.payload.positions, action.payload.totalTargetAmount),
                    totalTargetAmount: action.payload.totalTargetAmount
                };
            }
            state.isSettingsOpened = false;
        },
        openSettings: (state) => {
            state.isSettingsOpened = true;
        },
        closeSettings: (state) => {
            state.isSettingsOpened = false;
        },
        addToGroup: (state, action: PayloadAction<string>) => {
            if (state.currentPortfolio) {
                generateNewRow(state.currentPortfolio, action.payload);
            }
        },
        addNewGroup: (state) => {
            if (state.currentPortfolio) {
                generateNewRow(state.currentPortfolio, getNewGroupName(state.currentPortfolio.positions));
            }
        },
        update: (state, action: PayloadAction<TableUpdatePayload>) => {
            if (state.currentPortfolio) {
                const updatedPortfolio = recalculateRow(state.currentPortfolio, action);

                if (updatedPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    state.currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    action.payload.valueKey === EditableTableColumns.WEIGHT
                ) {
                    updatedPortfolio.positions = recalculateModelPortfolioPercentage(
                        updatedPortfolio.positions,
                        state.currentPortfolio.totalTargetAmount
                    );
                } else if (
                    updatedPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT &&
                    state.currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    action.payload.valueKey === EditableTableColumns.QUANTITY
                ) {
                    updatedPortfolio.positions = recalculateBrokerAccountPercentage(updatedPortfolio.positions);
                }

                state.currentPortfolio = updatedPortfolio;
            }
        },
        updateGroupName: (state, action: PayloadAction<{ oldGroupName: string, newGroupName: string }>) => {
            if (state.currentPortfolio) {
                state.currentPortfolio.positions = state.currentPortfolio.positions.map((row) => {
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
        deleteRowById: (state, action: PayloadAction<string>) => {
            if (state.currentPortfolio) {
                state.currentPortfolio.positions =
                    (state.currentPortfolio.positions as Array<ModelPortfolioPosition | BrokerAccountPosition>)
                        .filter((row) => row.id !== action.payload) as ModelPortfolioPosition[] | BrokerAccountPosition[];
            }
        },
        updateTotalTargetAmount: (state, action: PayloadAction<number>) => {
            if (state.currentPortfolio && state.currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
                state.currentPortfolio.totalTargetAmount = action.payload;
                state.currentPortfolio.positions = recalculateModelPortfolioPercentage(
                    state.currentPortfolio.positions,
                    state.currentPortfolio.totalTargetAmount
                );
            }
        }
    }
});

export const {
    openSettings,
    closeSettings,
    setCurrentPortfolio,
    addToGroup,
    addNewGroup,
    update,
    updateGroupName,
    deleteRowById,
    updateTotalTargetAmount
} = tableSlice.actions;

export default tableSlice.reducer;
