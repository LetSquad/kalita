import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";

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
        update: (state, action: PayloadAction<TableUpdatePayload>) => {
            if (state.currentPortfolio) {
                const updatedPortfolio = recalculateRow(state.currentPortfolio, action);

                if (updatedPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                    action.payload.valueKey === EditableTableColumns.WEIGHT
                ) {
                    updatedPortfolio[1] = recalculateModelPortfolioPercentage(
                        updatedPortfolio[1],
                        state.totalTargetAmount
                    );
                } else if (
                    updatedPortfolio[0] === BrokeragePortfolioTypes.BROKER_ACCOUNT &&
                    action.payload.valueKey === EditableTableColumns.QUANTITY
                ) {
                    updatedPortfolio[1] = recalculateBrokerAccountPercentage(updatedPortfolio[1]);
                }

                state.currentPortfolio = updatedPortfolio;
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
