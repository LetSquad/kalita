import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TickerViewMode } from "../../models/settings/enums";

export interface SettingsState {
    tickerViewMode: TickerViewMode;
}

const initialState: SettingsState = {
    tickerViewMode: TickerViewMode.TICKER
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTickerViewMode: (state: SettingsState, action: PayloadAction<TickerViewMode>) => {
            state.tickerViewMode = action.payload;
        },
        setSettings: (state: SettingsState, action: PayloadAction<SettingsState>) => {
            state.tickerViewMode = action.payload.tickerViewMode || TickerViewMode.TICKER;
        }
    }
});

export const { setTickerViewMode, setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
