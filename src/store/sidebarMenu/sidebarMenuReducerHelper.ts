import { v4 as uuidv4 } from "uuid";
import { SidebarMenuElementsTypes } from "../../../custom_typings/enums";
import {
    BrokerAccountMenuElement,
    ModelPortfolioMenuElement
} from "../../../custom_typings/types";

const NEW_PORTFOLIO = "Новый портфель";

export const newBrokerGroupMenuElement: BrokerAccountMenuElement = {
    id: uuidv4(),
    type: SidebarMenuElementsTypes.BROKER_ACCOUNT,
    name: NEW_PORTFOLIO,
    data: []
};

export const newModelGroupMenuElement: ModelPortfolioMenuElement = {
    id: uuidv4(),
    type: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
    name: NEW_PORTFOLIO,
    data: []
};
