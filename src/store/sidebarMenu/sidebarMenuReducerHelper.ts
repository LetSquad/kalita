import { v4 as uuidv4 } from "uuid";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import { BrokerAccountMenuElement, ModelPortfolioMenuElement, SidebarMenuGroupType } from "../../models/menu/types";

const NEW_PORTFOLIO = "Новый портфель";

export const baseSidebarMenuGroups: SidebarMenuGroupType[] = [
    {
        name: "Модельные портфели",
        elements: [],
        isOpen: true,
        type: SidebarMenuElementsTypes.MODEL_PORTFOLIO
    },
    {
        name: "Брокерские счета",
        elements: [],
        isOpen: true,
        type: SidebarMenuElementsTypes.BROKER_ACCOUNT
    }
];

export const defaultTotalTargetAmount = 1_000_000;

export const newBrokerGroupMenuElement: () => BrokerAccountMenuElement = () => ({
    id: uuidv4(),
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    name: NEW_PORTFOLIO,
    data: []
});

export const newModelGroupMenuElement: () => ModelPortfolioMenuElement = () => ({
    id: uuidv4(),
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    name: NEW_PORTFOLIO,
    data: { positions: [], totalTargetAmount: defaultTotalTargetAmount }
});
