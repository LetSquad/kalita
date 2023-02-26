import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { InstrumentViewMode } from "../../models/settings/enums";

export interface SettingsState {
    tickerViewMode: InstrumentViewMode;
}

const initialState: SettingsState = {
    tickerViewMode: InstrumentViewMode.TICKER
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTickerViewMode: (state: SettingsState, action: PayloadAction<InstrumentViewMode>) => {
            state.tickerViewMode = action.payload;
        },
        setSettings: (state: SettingsState, action: PayloadAction<SettingsState>) => {
            state.tickerViewMode = action.payload.tickerViewMode || InstrumentViewMode.TICKER;
        }
    }
});

export const { setTickerViewMode, setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
