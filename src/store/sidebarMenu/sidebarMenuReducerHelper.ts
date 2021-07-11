import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import { BrokerAccountMenuElement, ModelPortfolioMenuElement, SidebarMenuGroupData } from "../../models/menu/types";
import { ModelPortfolioQuantityMode } from "../../models/portfolios/enums";

const NEW_PORTFOLIO = "Новый портфель";

export const baseSidebarMenuGroups: SidebarMenuGroupData = {
    modelPortfolios: {
        name: "Модельные портфели",
        type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
        isOpen: true,
        elements: []
    },
    brokerAccounts: {
        name: "Брокерские счета",
        type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
        isOpen: true,
        elements: []
    }
};

export const newBrokerGroupMenuElement: (id: string) => BrokerAccountMenuElement = (id: string) => ({
    id,
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    name: NEW_PORTFOLIO
});

export const newModelGroupMenuElement: (id: string) => ModelPortfolioMenuElement = (id: string) => ({
    id,
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    name: NEW_PORTFOLIO
});
