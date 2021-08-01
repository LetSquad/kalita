import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import {
    MenuElementIdentifier, MenuElementOrder, SidebarMenuElement, SidebarMenuGroupData
} from "../../models/menu/types";
import { baseSidebarMenuGroups, newBrokerGroupMenuElement, newModelGroupMenuElement } from "./sidebarMenuReducerHelper";

interface SidebarMenuState extends SidebarMenuGroupData {
    currentProjectName?: string;
    currentPortfolioName?: string;
    activeMenuElementId?: MenuElementIdentifier;
}

const initialState: SidebarMenuState = {
    currentProjectName: undefined,
    currentPortfolioName: undefined,
    ...baseSidebarMenuGroups,
    activeMenuElementId: undefined
};

export const sidebarMenuSlice = createSlice({
    name: "sidebarMenu",
    initialState,
    reducers: {
        setCurrentProjectName: (state: SidebarMenuState, action: PayloadAction<string | undefined>) => {
            state.currentProjectName = action.payload;
        },
        setCurrentPortfolioName: (state: SidebarMenuState, action: PayloadAction<string | undefined>) => {
            state.currentPortfolioName = action.payload;
        },
        setMenuGroups: (state: SidebarMenuState, action: PayloadAction<SidebarMenuGroupData>) => {
            state.modelPortfolios = action.payload.modelPortfolios;
            state.brokerAccounts = action.payload.brokerAccounts;
        },
        addNewElementToGroup: (state: SidebarMenuState, action: PayloadAction<MenuElementIdentifier>) => {
            if (action.payload.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios = {
                    ...state.modelPortfolios,
                    isOpen: true,
                    elements: [...state.modelPortfolios.elements, newModelGroupMenuElement(action.payload.id)]
                };
            } else if (action.payload.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts = {
                    ...state.brokerAccounts,
                    isOpen: true,
                    elements: [...state.brokerAccounts.elements, newBrokerGroupMenuElement(action.payload.id)]
                };
            }
        },
        deleteElementFromGroup: (state: SidebarMenuState, action: PayloadAction<MenuElementIdentifier>) => {
            if (action.payload.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios.elements = state.modelPortfolios.elements.filter((e) => e.id !== action.payload.id);
            } else if (action.payload.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts.elements = state.brokerAccounts.elements.filter((e) => e.id !== action.payload.id);
            }
        },
        renameElementInGroup: (state: SidebarMenuState, action: PayloadAction<MenuElementIdentifier & { newName: string }>) => {
            let menuElement: SidebarMenuElement | undefined;
            if (action.payload.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                menuElement = state.modelPortfolios.elements.find((e) => e.id === action.payload.id);
            } else if (action.payload.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                menuElement = state.brokerAccounts.elements.find((e) => e.id === action.payload.id);
            }
            if (menuElement) {
                menuElement.name = action.payload.newName;
            }
        },
        changePortfolioTypeOpenState: (state: SidebarMenuState, action: PayloadAction<SidebarMenuElementsTypes>) => {
            if (action.payload === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios.isOpen = !state.modelPortfolios.isOpen;
            } else if (action.payload === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts.isOpen = !state.brokerAccounts.isOpen;
            }
        },
        setActiveId: (state: SidebarMenuState, action: PayloadAction<MenuElementIdentifier>) => {
            state.activeMenuElementId = action.payload;
        },
        updateOrder: (state: SidebarMenuState, action: PayloadAction<{
            oldOrder: MenuElementOrder,
            newOrder: MenuElementOrder
        }>) => {
            if (action.payload.oldOrder.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                [
                    state.modelPortfolios.elements[action.payload.oldOrder.index],
                    state.modelPortfolios.elements[action.payload.newOrder.index]
                ] = [
                    state.modelPortfolios.elements[action.payload.newOrder.index],
                    state.modelPortfolios.elements[action.payload.oldOrder.index]
                ];
            } else if (action.payload.oldOrder.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                [
                    state.brokerAccounts.elements[action.payload.oldOrder.index],
                    state.brokerAccounts.elements[action.payload.newOrder.index]
                ] = [
                    state.brokerAccounts.elements[action.payload.newOrder.index],
                    state.brokerAccounts.elements[action.payload.oldOrder.index]
                ];
            }
        },
        setDefault: () => initialState
    }
});

export const {
    setCurrentProjectName,
    setCurrentPortfolioName,
    setMenuGroups,
    addNewElementToGroup,
    deleteElementFromGroup,
    renameElementInGroup,
    changePortfolioTypeOpenState,
    setActiveId,
    updateOrder,
    setDefault
} = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;
