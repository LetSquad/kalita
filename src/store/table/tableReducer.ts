import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../../model/portfolios/types";
import { EditableTableColumns } from "../../model/table/enums";
import { CurrentPortfolio } from "../../model/table/types";
import {
    generateNewRow,
    getNewGroupName, recalculateBrokerAccountPercentage,
    recalculateModelPortfolioPercentage,
    recalculatePositionAmountByQuantity
} from "./tableReducerHelper";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";

interface UpdatePayload {
    readonly id: string,
    readonly valueKey: EditableTableColumns,
    readonly newValue: string
}

export interface TableDataState {
    currentPortfolio?: CurrentPortfolio,
    totalTargetAmount: number
}

const initialState: TableDataState = {
    currentPortfolio: undefined,
    totalTargetAmount: 1_000_000
};

export const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        setCurrentPortfolio: (state, action: PayloadAction<CurrentPortfolio>) => {
            state.currentPortfolio = action.payload;
        },
        addToGroup: (state, action: PayloadAction<string>) => {
            if (state.currentPortfolio) {
                generateNewRow(state.currentPortfolio, action.payload);
            }
        },
        addNewGroup: (state) => {
            if (state.currentPortfolio) {
                generateNewRow(state.currentPortfolio, getNewGroupName(state.currentPortfolio[1]));
            }
        },
        update: (state, action: PayloadAction<UpdatePayload>) => {
            if (state.currentPortfolio) {
                state.currentPortfolio[1] = state.currentPortfolio[1].map((row) => {
                    if (row.id === action.payload.id) {
                        if (action.payload.valueKey === EditableTableColumns.QUANTITY) {
                            return recalculatePositionAmountByQuantity(row, Number.parseInt(action.payload.newValue, 10));
                        }
                        if (action.payload.valueKey === EditableTableColumns.WEIGHT) {
                            return {
                                ...row,
                                [action.payload.valueKey]: Number.parseInt(action.payload.newValue, 10)
                            };
                        }
                        return {
                            ...row,
                            [action.payload.valueKey]: action.payload.newValue
                        };
                    }
                    return row;
                }) as ModelPortfolioPosition[] | BrokerAccountPosition[];

                if (state.currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    action.payload.valueKey === EditableTableColumns.WEIGHT
                ) {
                    state.currentPortfolio[1] = recalculateModelPortfolioPercentage(
                        state.currentPortfolio[1],
                        state.totalTargetAmount
                    );
                } else if (
                    state.currentPortfolio[0] === BrokeragePortfolioTypes.BROKER_ACCOUNT &&
                    action.payload.valueKey === EditableTableColumns.QUANTITY
                ) {
                    state.currentPortfolio[1] = recalculateBrokerAccountPercentage(state.currentPortfolio[1]);
                }
            }
        },
        updateGroupName: (state, action: PayloadAction<{ oldGroupName: string, newGroupName: string }>) => {
            if (state.currentPortfolio) {
                state.currentPortfolio[1] = state.currentPortfolio[1].map((row) => {
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
                state.currentPortfolio[1] = (state.currentPortfolio[1] as Array<ModelPortfolioPosition | BrokerAccountPosition>)
                    .filter((row) => row.id !== action.payload) as ModelPortfolioPosition[] | BrokerAccountPosition[];
            }
        }
    }
});

export const {
    setCurrentPortfolio,
    addToGroup,
    addNewGroup,
    update,
    updateGroupName,
    deleteRowById
} = tableSlice.actions;

export default tableSlice.reducer;
