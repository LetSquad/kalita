import React, { useCallback, useEffect, useMemo } from "react";
import { SidebarMenuElementsTypes } from "../../../models/menu/enums";
import { CurrentBrokerAccount } from "../../../models/table/types";
import { useAppDispatch } from "../../../store/hooks";
import { updateMenuElementPositions } from "../../../store/sidebarMenu/sidebarMenuReducer";
import { brokerAccountColumns } from "../columns";
import Table from "../Table";

interface Props {
    currentPortfolio: CurrentBrokerAccount
}

export default function BrokerTable({ currentPortfolio }: Props) {
    const dispatch = useAppDispatch();

    const updateMenuElement = useCallback((_currentPortfolio: CurrentBrokerAccount) => {
        dispatch(updateMenuElementPositions({
            elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
            data: _currentPortfolio.positions
        }));
    }, [dispatch]);

    useEffect(() => {
        updateMenuElement(currentPortfolio);
    }, [currentPortfolio, updateMenuElement]);

    return useMemo(() => <Table columns={brokerAccountColumns} currentPortfolio={currentPortfolio} />, [currentPortfolio]);
}
