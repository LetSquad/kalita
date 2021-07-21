import React, { useCallback, useEffect, useMemo } from "react";
import { SidebarMenuElementsTypes } from "../../../models/menu/enums";
import { CurrentModelPortfolio } from "../../../models/table/types";
import { useAppDispatch } from "../../../store/hooks";
import { updateMenuElementPositions } from "../../../store/sidebarMenu/sidebarMenuReducer";
import { modelPortfolioColumns } from "../columns";
import Table from "../Table";
import TargetAmountInput from "./TargetAmountInput";

interface Props {
    currentPortfolio: CurrentModelPortfolio
}

export default function ModelTable({ currentPortfolio }: Props) {
    const dispatch = useAppDispatch();

    const updateMenuElementContent = useCallback((_currentPortfolio: CurrentModelPortfolio) => {
        dispatch(updateMenuElementPositions({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            data: _currentPortfolio.positions
        }));
    }, [dispatch]);

    useEffect(() => {
        updateMenuElementContent(currentPortfolio);
    }, [currentPortfolio, updateMenuElementContent]);

    return useMemo(() => (
        <Table
            columns={modelPortfolioColumns(currentPortfolio.positions)}
            currentPortfolio={currentPortfolio}
            additionalHeaderPart={<TargetAmountInput />}
        />
    ), [currentPortfolio]);
}
