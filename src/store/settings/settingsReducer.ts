import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { InstrumentViewMode } from "../../models/settings/enums";

export interface SettingsState {
    instrumentViewMode: InstrumentViewMode;
}

const initialState: SettingsState = {
    instrumentViewMode: InstrumentViewMode.TICKER
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTickerViewMode: (state: SettingsState, action: PayloadAction<InstrumentViewMode>) => {
            state.instrumentViewMode = action.payload;
        },
        setSettings: (state: SettingsState, action: PayloadAction<SettingsState | undefined>) => {
            state.instrumentViewMode = action.payload?.instrumentViewMode || InstrumentViewMode.TICKER;
        }
    }
});

export const { setTickerViewMode, setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
