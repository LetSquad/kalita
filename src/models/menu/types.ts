import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";
import { SidebarMenuElementsTypes } from "./enums";

export interface BrokerAccountMenuElement {
    id: string,
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    name: string,
    data: BrokerAccountPosition[]
}

export interface ModelPortfolioMenuElementData {
    positions: ModelPortfolioPosition[];
    totalTargetAmount: number;
}

export interface ModelPortfolioMenuElement {
    id: string,
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    name: string,
    data: ModelPortfolioMenuElementData
}

export interface MenuElementIdentifier {
    id: string,
    type: SidebarMenuElementsTypes,
}

export type MenuElementData = BrokerAccountPosition[] | ModelPortfolioPosition[];

export type SidebarMenuGroupType = {
    name: string,
    isOpen: boolean
} & (
    {
        type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
        elements: ModelPortfolioMenuElement[]
    } | {
        type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
        elements: BrokerAccountMenuElement[]
    }
);
