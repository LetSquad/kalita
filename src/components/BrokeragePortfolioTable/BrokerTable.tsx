import React, { useCallback, useEffect, useMemo } from "react";
import { SidebarMenuElementsTypes } from "../../model/menu/enums";
import { CurrentBrokerAccount } from "../../model/table/types";
import { useAppDispatch } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import { brokerAccountColumns } from "./columns";
import Table from "./Table";

interface Props {
    currentPortfolio: CurrentBrokerAccount
}

export default function BrokerTable({ currentPortfolio }: Props) {
    const dispatch = useAppDispatch();

    const updateMenuElement = useCallback((_currentPortfolio: CurrentBrokerAccount) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
            data: _currentPortfolio[1]
        }));
    }, [dispatch]);

    useEffect(() => {
        updateMenuElement(currentPortfolio);
    }, [currentPortfolio, updateMenuElement]);

    return useMemo(() => <Table columns={brokerAccountColumns} currentPortfolio={currentPortfolio} />, [currentPortfolio]);
}
