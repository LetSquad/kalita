import { SidebarMenuElementsTypes } from "./enums";

export interface SidebarMenuElement {
    id: string;
    name: string;
}

export interface BrokerAccountMenuElement extends SidebarMenuElement {
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT;
}

export interface ModelPortfolioMenuElement extends SidebarMenuElement {
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO;
}

export interface AnalyticsMenuElement extends SidebarMenuElement {
    type: SidebarMenuElementsTypes.ANALYTICS;
}

export interface MenuElementIdentifier {
    id: string;
    type: SidebarMenuElementsTypes;
}

export interface MenuElementOrder {
    index: number;
    type: SidebarMenuElementsTypes;
}

export interface SidebarMenuGroupType {
    name: string;
    isOpen: boolean;
    type: SidebarMenuElementsTypes;
    elements: ModelPortfolioMenuElement[] | BrokerAccountMenuElement[];
}

export interface ModelPortfolioMenuGroup extends SidebarMenuGroupType {
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO;
    elements: ModelPortfolioMenuElement[];
}

export interface BrokerAccountMenuGroup extends SidebarMenuGroupType {
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT;
    elements: BrokerAccountMenuElement[];
}

export interface SidebarMenuGroupData {
    modelPortfolios: ModelPortfolioMenuGroup;
    brokerAccounts: BrokerAccountMenuGroup;
}
