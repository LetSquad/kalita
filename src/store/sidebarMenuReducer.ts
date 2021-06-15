import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { SidebarMenuElementsTypes } from "../../custom_typings/enums";
import {
    BrokerAccountMenuElement,
    BrokerAccountTableData,
    ModelPortfolioMenuElement,
    ModelPortfolioTableData,
    SidebarMenuGroupType
} from "../../custom_typings/types";

type UpdateMenuData = {
    elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    data: ModelPortfolioTableData[]
} | {
    elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    data: BrokerAccountTableData[]
};

export interface SidebarMenuState {
    menuGroups: SidebarMenuGroupType[];
    activeMenuElementId?: [SidebarMenuElementsTypes, string]
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
                            name: "SBER",
                            share: 0.92,
                            purchasePrice: 18_348.62,
                            price: 303.02,
                            briefcase: 40,
                            amount: 112_120.8
                        },
                        {
                            id: uuidv4(),
                            groupName: "Телекомы",
                            name: "MTSS",
                            share: 3.67,
                            purchasePrice: 73_394.5,
                            price: 340.2,
                            briefcase: 120,
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
        addNewElement: (state, action: PayloadAction<SidebarMenuElementsTypes>) => {
            state.menuGroups = state.menuGroups.map((menuGroup) => {
                if (menuGroup.type === action.payload) {
                    if (menuGroup.type === SidebarMenuElementsTypes.BROKER_ACCOUNT) {
                        return {
                            ...menuGroup,
                            sidebarMenu: [...menuGroup.elements, {
                                id: [SidebarMenuElementsTypes.BROKER_ACCOUNT, uuidv4()],
                                name: "Новый портфель",
                                data: []
                            }]
                        };
                    }
                    return {
                        ...menuGroup,
                        sidebarMenu: [...menuGroup.elements, {
                            id: [SidebarMenuElementsTypes.MODEL_PORTFOLIO, uuidv4()],
                            name: "Новый портфель",
                            data: []
                        }]
                    };
                }
                return menuGroup;
            });
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
        setActiveId: (state, action: PayloadAction<[SidebarMenuElementsTypes, string]>) => {
            state.activeMenuElementId = action.payload;
        },
        updateMenuElementData: (state, action: PayloadAction<UpdateMenuData>) => {
            const group = state.menuGroups.find((menuGroup) => menuGroup.type === state.activeMenuElementId?.[0]);
            if (group) {
                const menuElement = (group.elements as Array<ModelPortfolioMenuElement | BrokerAccountMenuElement>)
                    .find((elem) => elem.id === state.activeMenuElementId?.[1]);
                if (menuElement && menuElement.type === action.payload.elementType) {
                    menuElement.data = action.payload.data;
                }
            }
        }
    }
});

export const {
    addNewElement,
    changePortfolioTypeOpenState,
    setActiveId,
    updateMenuElementData
} = sidebarMenuSlice.actions;

export default sidebarMenuSlice.reducer;
