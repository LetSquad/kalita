import { v4 as uuidv4 } from "uuid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableData } from "../../custom_typings/types";

type UpdatePayload = {
    id: string,
    valueKey: keyof TableData,
    newValue: string
};

export interface TableDataState {
    data: TableData[]
}

const initialState: TableDataState = {
    data: [
        {
            id: uuidv4(),
            groupName: "Финансы",
            name: "SBER",
            weight: 1,
            share: 0.92,
            targetAmount: 18_348.62,
            price: 303.02,
            targetQuantity: 61,
            briefcase: 40,
            amount: 112_120.8
        },
        {
            id: uuidv4(),
            groupName: "Финансы",
            name: "SBERP",
            weight: 15,
            share: 13.76,
            targetAmount: 275_229.36,
            price: 281.01,
            targetQuantity: 980,
            briefcase: 470,
            amount: 132_074.7
        },
        {
            id: uuidv4(),
            groupName: "Телекомы",
            name: "MTSS",
            weight: 4,
            share: 3.67,
            targetAmount: 73_394.5,
            price: 340.2,
            targetQuantity: 216,
            briefcase: 120,
            amount: 40_824
        },
        {
            id: uuidv4(),
            groupName: "Телекомы",
            name: "MGTSP",
            weight: 1,
            share: 0.92,
            targetAmount: 18_348.62,
            price: 1712,
            targetQuantity: 11,
            briefcase: 10,
            amount: 17_120
        }
    ]
};

export const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<TableData>) => {
            state.data = [...state.data, action.payload];
        },
        update: (state, action: PayloadAction<UpdatePayload>) => {
            state.data = state.data.map((data) => {
                if (data.id === action.payload.id) {
                    return {
                        ...data,
                        [action.payload.valueKey]: action.payload.newValue
                    };
                }
                return data;
            });
        }
    }
});

export const { add, update } = tableSlice.actions;

export default tableSlice.reducer;
