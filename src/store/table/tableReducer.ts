import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrokerAccountTableData, ModelPortfolioTableData } from "../../../custom_typings/portfolios/types";
import { EditableTableColumns } from "../../../custom_typings/table/enums";
import { CurrentPortfolio } from "../../../custom_typings/table/types";
import { generateNewRow, getNewGroupName } from "./tableReducerHelper";

interface UpdatePayload {
    id: string,
    valueKey: EditableTableColumns,
    newValue: string
}

export interface TableDataState {
    currentPortfolio?: CurrentPortfolio
}

const initialState: TableDataState = {
    currentPortfolio: undefined
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
                        return {
                            ...row,
                            [action.payload.valueKey]: action.payload.newValue
                        };
                    }
                    return row;
                }) as ModelPortfolioTableData[] | BrokerAccountTableData[];
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
                }) as ModelPortfolioTableData[] | BrokerAccountTableData[];
            }
        },
        deleteRowById: (state, action: PayloadAction<string>) => {
            if (state.currentPortfolio) {
                state.currentPortfolio[1] = (state.currentPortfolio[1] as Array<ModelPortfolioTableData
                | BrokerAccountTableData>)
                    .filter((row) => row.id !== action.payload) as ModelPortfolioTableData[] | BrokerAccountTableData[];
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
