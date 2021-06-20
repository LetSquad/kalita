import React, { useCallback, useEffect } from "react";
import { SidebarMenuElementsTypes } from "../../model/menu/enums";
import { CurrentModelPortfolio } from "../../model/table/types";
import { useAppDispatch } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import { modelPortfolioColumns } from "./columns";
import Table from "./Table";

interface Props {
    currentPortfolio: CurrentModelPortfolio
}

export default function ModelTable(props: Props) {
    const dispatch = useAppDispatch();

    const updateMenuElement = useCallback((currentPortfolio: CurrentModelPortfolio) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            data: currentPortfolio[1]
        }));
    }, [dispatch]);

    useEffect(() => {
        updateMenuElement(props.currentPortfolio);
    }, [props.currentPortfolio, updateMenuElement]);

    return <Table columns={modelPortfolioColumns(props.currentPortfolio[1])} currentPortfolio={props.currentPortfolio} />;
}
