import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import {
    BrokerAccountMenuElement,
    MenuElementIdentifier,
    ModelPortfolioMenuElement,
    SidebarMenuGroupType
} from "../../models/menu/types";
import { BrokerAccountPosition, ModelPortfolioPosition } from "../../models/portfolios/types";
import { baseSidebarMenuGroups, newBrokerGroupMenuElement, newModelGroupMenuElement } from "./sidebarMenuReducerHelper";

type UpdateMenuData = {
    elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    content: ModelPortfolioPosition[]
} | {
    elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    totalTargetAmount: number
} | {
    elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    data: BrokerAccountPosition[]
};

interface SidebarMenuState {
    currentProjectName?: string;
    currentPortfolioName?: string;
    menuGroups: SidebarMenuGroupType[];
    activeMenuElementId?: MenuElementIdentifier
}

const initialState: SidebarMenuState = {
    currentProjectName: undefined,
    currentPortfolioName: undefined,
    menuGroups: baseSidebarMenuGroups,
    activeMenuElementId: undefined
};

export const sidebarMenuSlice = createSlice({
    name: "sidebarMenu",
    initialState,
    reducers: {
        setCurrentProjectName: (state, action: PayloadAction<string | undefined>) => {
            state.currentProjectName = action.payload;
        },
        setCurrentPortfolioName: (state, action: PayloadAction<string | undefined>) => {
            state.currentPortfolioName = action.payload;
        },
        setMenuGroups: (state, action: PayloadAction<SidebarMenuGroupType[]>) => {
            state.menuGroups = action.payload;
        },
        addNewElementToGroup: (state, action: PayloadAction<SidebarMenuElementsTypes>) => {
            state.menuGroups = state.menuGroups.map((menuGroup) => {
                if (menuGroup.type === action.payload) {
                    if (menuGroup.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                        return {
                            ...menuGroup,
                            isOpen: true,
                            elements: [...menuGroup.elements, newBrokerGroupMenuElement()]
                        };
                    }
                    return {
                        ...menuGroup,
                        isOpen: true,
                        elements: [...menuGroup.elements, newModelGroupMenuElement()]
                    };
                }
                return menuGroup;
            });
        },
        deleteElementFromGroup: (state, action: PayloadAction<MenuElementIdentifier>) => {
            state.menuGroups = state.menuGroups.map((menuGroup) => {
                if (menuGroup.type === action.payload.type) {
                    if (menuGroup.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                        return {
                            ...menuGroup,
                            elements: menuGroup.elements.filter((elem) => elem.id !== action.payload.id)
                        };
                    }
                    return {
                        ...menuGroup,
                        elements: menuGroup.elements.filter((elem) => elem.id !== action.payload.id)
                    };
                }
                return menuGroup;
            });
        },
        renameElementInGroup: (state, action: PayloadAction<MenuElementIdentifier & { newName: string }>) => {
            const group = state.menuGroups.find((menuGroup) => menuGroup.type === action.payload.type);
            if (group) {
                const menuElement = (group.elements as Array<ModelPortfolioMenuElement | BrokerAccountMenuElement>)
                    .find((elem) => elem.id === action.payload.id);
                if (menuElement && menuElement.type === action.payload.type) {
                    menuElement.name = action.payload.newName;
                }
            }
        },
        changePortfolioTypeOpenState: (state, action: PayloadAction<SidebarMenuElementsTypes>) => {
            state.menuGroups = state.menuGroups.map((menuGroup) =>
                (menuGroup.type === action.payload
                    ? {
                        ...menuGroup,
                        isOpen: !menuGroup.isOpen
                    }
                    : menuGroup));
        },
        setActiveId: (state, action: PayloadAction<MenuElementIdentifier>) => {
            state.activeMenuElementId = action.payload;
        },
        updateMenuElementData: (state, action: PayloadAction<UpdateMenuData>) => {
            const group = state.menuGroups.find((menuGroup) => menuGroup.type === state.activeMenuElementId?.type);
            if (group) {
                const menuElement = (group.elements as Array<ModelPortfolioMenuElement | BrokerAccountMenuElement>)
                    .find((elem) => elem.id === state.activeMenuElementId?.id);
                if (menuElement) {
                    if (menuElement.type === SidebarMenuElementsTypes.MODEL_PORTFOLIO &&
                        action.payload.elementType === SidebarMenuElementsTypes.MODEL_PORTFOLIO) {
                        if ("content" in action.payload) {
                            menuElement.data.positions = action.payload.content;
                        } else if ("totalTargetAmount" in action.payload) {
                            menuElement.data.totalTargetAmount = action.payload.totalTargetAmount;
                        }
                    } else if (menuElement.type === SidebarMenuElementsTypes.BROKER_ACCOUNT &&
                        action.payload.elementType === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                        menuElement.data = action.payload.data;
                    }
                }
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
