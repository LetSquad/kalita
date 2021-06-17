import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { SidebarMenuElementsTypes } from "../../../custom_typings/enums";
import {
    BrokerAccountMenuElement,
    BrokerAccountTableData, MenuElementIdentifier,
    ModelPortfolioMenuElement,
    ModelPortfolioTableData,
    SidebarMenuGroupType
} from "../../../custom_typings/types";
import { newBrokerGroupMenuElement, newModelGroupMenuElement } from "./sidebarMenuReducerHelper";

type UpdateMenuData = {
    elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    data: ModelPortfolioTableData[]
} | {
    elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    data: BrokerAccountTableData[]
};

export interface SidebarMenuState {
    menuGroups: SidebarMenuGroupType[];
    activeMenuElementId?: MenuElementIdentifier
}

const initialState: SidebarMenuState = {
    menuGroups: [
        {
            name: "Модельные портфели",
            elements: [
                {
                    id: uuidv4(),
                    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
                    name: "Портфель тинька",
                    data: [
                        {
                            id: uuidv4(),
                            groupName: "Финансы",
                            ticker: "SBER",
                            weight: 1,
                            proportion: 0.92,
                            targetAmount: 18_348.62,
                            currentPrice: 303.02,
                            targetQuantity: 61,
                            quantity: 40,
                            amount: 112_120.8
                        },
                        {
                            id: uuidv4(),
                            groupName: "Финансы",
                            ticker: "SBERP",
                            weight: 15,
                            proportion: 13.76,
                            targetAmount: 275_229.36,
                            currentPrice: 281.01,
                            targetQuantity: 980,
                            quantity: 470,
                            amount: 132_074.7
                        },
                        {
                            id: uuidv4(),
                            groupName: "Телекомы",
                            ticker: "MTSS",
                            weight: 4,
                            proportion: 3.67,
                            targetAmount: 73_394.5,
                            currentPrice: 340.2,
                            targetQuantity: 216,
                            quantity: 120,
                            amount: 40_824
                        },
                        {
                            id: uuidv4(),
                            groupName: "Телекомы",
                            ticker: "MGTSP",
                            weight: 1,
                            proportion: 0.92,
                            targetAmount: 18_348.62,
                            currentPrice: 1712,
                            targetQuantity: 11,
                            quantity: 10,
                            amount: 17_120
                        }
                    ]
                }, {
                    id: uuidv4(),
                    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
                    name: "Портфель ВТБ",
                    data: []
                }
            ],
            isOpen: true,
            type: SidebarMenuElementsTypes.MODEL_PORTFOLIO
        },
        {
            name: "Брокерские счета",
            elements: [
                {
                    id: uuidv4(),
                    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
                    name: "Новый счет",
                    data: [
                        {
                            id: uuidv4(),
                            groupName: "Финансы",
                            ticker: "SBER",
                            proportion: 0.92,
                            averagePrice: 18_348.62,
                            currentPrice: 303.02,
                            quantity: 40,
                            amount: 112_120.8
                        },
                        {
                            id: uuidv4(),
                            groupName: "Телекомы",
                            ticker: "MTSS",
                            proportion: 3.67,
                            averagePrice: 73_394.5,
                            currentPrice: 340.2,
                            quantity: 120,
                            amount: 40_824
                        }
                    ]
                }, {
                    id: uuidv4(),
                    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
                    name: "Главный счет",
                    data: []
                }
            ],
            isOpen: true,
            type: SidebarMenuElementsTypes.BROKER_ACCOUNT
        }
    ],
    activeMenuElementId: undefined
};

export const sidebarMenuSlice = createSlice({
    name: "sidebarMenu",
    initialState,
    reducers: {
        addNewElementToGroup: (state, action: PayloadAction<SidebarMenuElementsTypes>) => {
            state.menuGroups = state.menuGroups.map((menuGroup) => {
                if (menuGroup.type === action.payload) {
                    if (menuGroup.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                        return {
                            ...menuGroup,
                            elements: [...menuGroup.elements, newBrokerGroupMenuElement]
                        };
                    }
                    return {
                        ...menuGroup,
                        elements: [...menuGroup.elements, newModelGroupMenuElement]
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
                if (menuElement && menuElement.type === action.payload.elementType) {
                    menuElement.data = action.payload.data;
                }
            }
        }
    }
});

export const {
    addNewElementToGroup,
    deleteElementFromGroup,
    renameElementInGroup,
    changePortfolioTypeOpenState,
    setActiveId,
    updateMenuElementData
} = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;
