import React, { useCallback, useEffect, useMemo } from "react";
import { Input } from "semantic-ui-react";
import { SidebarMenuElementsTypes } from "../../model/menu/enums";
import { CurrentModelPortfolio } from "../../model/table/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import { updateTotalTargetAmount } from "../../store/table/tableReducer";
import { modelPortfolioColumns } from "./columns";
import Table from "./Table";
import styles from "./styles/ModelTable.scss";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";

interface Props {
    currentPortfolio: CurrentModelPortfolio
}

export default function ModelTable({ currentPortfolio }: Props) {
    const dispatch = useAppDispatch();
    const totalTargetAmount = useAppSelector((state) => {
        if (!state.tableData.currentPortfolio || state.tableData.currentPortfolio.type !== BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return undefined;
        }
        return state.tableData.currentPortfolio.totalTargetAmount;
    });

    const updateMenuElementContent = useCallback((_currentPortfolio: CurrentModelPortfolio) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            content: _currentPortfolio.positions
        }));
    }, [dispatch]);

    const updateMenuElementTotalTargetAmount = useCallback((newTotalTargetAmount: number) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            totalTargetAmount: newTotalTargetAmount
        }));
    }, [dispatch]);

    const updateTargetAmount = useCallback((value: string) => {
        const newTotalTargetAmount = Number.parseInt(value, 10);
        dispatch(updateTotalTargetAmount(newTotalTargetAmount));
        updateMenuElementTotalTargetAmount(newTotalTargetAmount);
    }, [dispatch, updateMenuElementTotalTargetAmount]);

    const targetAmountInput = useMemo(() => (
        <div className={styles.targetAmountInputContainer}>
            <span>Целевая сумма:</span>
            <Input
                label={{ basic: true, content: "₽" }} labelPosition="right"
                value={totalTargetAmount} className={styles.targetAmountInput}
                onChange={(event, data) => updateTargetAmount(data.value)}
            />
        </div>
    ), [totalTargetAmount, updateTargetAmount]);

    useEffect(() => {
        updateMenuElementContent(currentPortfolio);
    }, [currentPortfolio, updateMenuElementContent]);

    return useMemo(() => (
        <Table
            columns={modelPortfolioColumns(currentPortfolio.positions)}
            currentPortfolio={currentPortfolio}
            additionalHeaderPart={targetAmountInput}
        />
    ), [currentPortfolio, targetAmountInput]);
}
