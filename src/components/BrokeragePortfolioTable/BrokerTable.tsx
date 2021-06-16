import React, { useCallback, useEffect } from "react";
import { SidebarMenuElementsTypes } from "../../../custom_typings/enums";
import { CurrentBrokerAccount } from "../../../custom_typings/types";
import { useAppDispatch } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import { brokerAccountColumns } from "./columns";
import Table from "./Table";

interface Props {
    currentPortfolio: CurrentBrokerAccount
}

export default function BrokerTable(props: Props) {
    const dispatch = useAppDispatch();

    const updateMenuElement = useCallback((currentPortfolio: CurrentBrokerAccount) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
            data: currentPortfolio[1]
        }));
    }, [dispatch]);

    useEffect(() => {
        updateMenuElement(props.currentPortfolio);
    }, [props.currentPortfolio, updateMenuElement]);

    return <Table columns={brokerAccountColumns} currentPortfolio={props.currentPortfolio} />;
}
