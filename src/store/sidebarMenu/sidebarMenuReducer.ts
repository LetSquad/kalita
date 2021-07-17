import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import { MenuElementIdentifier, SidebarMenuElement, SidebarMenuGroupData } from "../../models/menu/types";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../../models/portfolios/types";
import { baseSidebarMenuGroups, newBrokerGroupMenuElement, newModelGroupMenuElement } from "./sidebarMenuReducerHelper";

type UpdateMenuData = {
    elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    data: ModelPortfolioPosition[]
} | {
    elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    totalTargetAmount: number | string
} | {
    elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    data: BrokerAccountPosition[]
};

interface SidebarMenuState extends SidebarMenuGroupData {
    currentProjectName?: string,
    currentPortfolioName?: string,
    activeMenuElementId?: MenuElementIdentifier
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
        addNewElementToGroup: (state: SidebarMenuState, action: PayloadAction<SidebarMenuElementsTypes>) => {
            if (action.payload === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios = {
                    ...state.modelPortfolios,
                    isOpen: true,
                    elements: [...state.modelPortfolios.elements, newModelGroupMenuElement()]
                };
            } else if (action.payload === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts = {
                    ...state.brokerAccounts,
                    isOpen: true,
                    elements: [...state.brokerAccounts.elements, newBrokerGroupMenuElement()]
                };
            }
        },
        deleteElementFromGroup: (state: SidebarMenuState, action: PayloadAction<MenuElementIdentifier>) => {
            if (action.payload.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                state.modelPortfolios.elements.filter((e) => e.id !== action.payload.id);
            } else if (action.payload.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                state.brokerAccounts.elements.filter((e) => e.id !== action.payload.id);
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
        updateMenuElementData: (state: SidebarMenuState, action: PayloadAction<UpdateMenuData>) => {
            if (action.payload.elementType === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                const menuElement = state.modelPortfolios.elements.find((elem) => elem.id === state.activeMenuElementId?.id);
                if (!menuElement) {
                    return;
                }
                if ("data" in action.payload) {
                    menuElement.data.positions = action.payload.data;
                } else if ("totalTargetAmount" in action.payload) {
                    menuElement.data.totalTargetAmount = action.payload.totalTargetAmount;
                }
            } else if (action.payload.elementType === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                const menuElement = state.brokerAccounts.elements.find((elem) => elem.id === state.activeMenuElementId?.id);
                if (!menuElement) {
                    return;
                }
                menuElement.data = action.payload.data;
            }
        }
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
    updateMenuElementData
} = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;
