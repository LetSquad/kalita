import { v4 as uuidv4 } from "uuid";
import { SidebarMenuElementsTypes } from "../../../custom_typings/enums";
import {
    BrokerAccountMenuElement,
    ModelPortfolioMenuElement
} from "../../../custom_typings/types";

export const newBrokerGroupMenuElement: BrokerAccountMenuElement = {
    id: uuidv4(),
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    name: "Новый портфель",
    data: []
};

export const newModelGroupMenuElement: ModelPortfolioMenuElement = {
    id: uuidv4(),
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    name: "Новый портфель",
    data: []
};
