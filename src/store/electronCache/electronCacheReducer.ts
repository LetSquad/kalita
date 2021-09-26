import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface ElectronCacheState {
    recentProjects: [string, string][]
}

const initialState: ElectronCacheState = {
    recentProjects: []
};

export const electronCacheSlice = createSlice({
    name: "electronCache",
    initialState,
    reducers: {
        addRecentProject: (state, action: PayloadAction<string>) => {
            const recentIndex = state.recentProjects.findIndex((recent) => recent[1] === action.payload);
            state.recentProjects = recentIndex !== -1
                ? [
                    state.recentProjects[recentIndex],
                    ...state.recentProjects.slice(0, recentIndex),
                    ...state.recentProjects.slice(recentIndex + 1)
                ]
                : [[uuidv4(), action.payload], ...state.recentProjects];
        },
        removeRecentProject: ((state, action: PayloadAction<string>) => {
            state.recentProjects = state.recentProjects.filter((recent) => recent[0] !== action.payload);
        })
    }
});

export const { addRecentProject, removeRecentProject } = electronCacheSlice.actions;

export default electronCacheSlice.reducer;
