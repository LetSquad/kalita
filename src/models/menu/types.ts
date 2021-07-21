import { BrokerAccountPosition, ModelPortfolioPosition } from "../portfolios/types";
import { SidebarMenuElementsTypes } from "./enums";

export interface SidebarMenuElement {
    id: string,
    name: string
}

export interface BrokerAccountMenuElement extends SidebarMenuElement {
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    data: BrokerAccountPosition[]
}

export interface ModelPortfolioMenuElementData {
    positions: ModelPortfolioPosition[];
    totalTargetAmount: number | string;
}

export interface ModelPortfolioMenuElement extends SidebarMenuElement {
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    data: ModelPortfolioMenuElementData
}

export interface MenuElementIdentifier {
    id: string,
    type: SidebarMenuElementsTypes,
}

export interface SidebarMenuGroupType {
    name: string,
    isOpen: boolean,
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO | SidebarMenuElementsTypes.BROKER_ACCOUNT,
    elements: ModelPortfolioMenuElement[] | BrokerAccountMenuElement[]
}

export interface ModelPortfolioMenuGroup extends SidebarMenuGroupType {
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    elements: ModelPortfolioMenuElement[]
}

export interface BrokerAccountMenuGroup extends SidebarMenuGroupType {
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    elements: BrokerAccountMenuElement[]
}

export interface SidebarMenuGroupData {
    modelPortfolios: ModelPortfolioMenuGroup,
    brokerAccounts: BrokerAccountMenuGroup
}
