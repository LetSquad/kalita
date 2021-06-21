import React, {
    Ref,
    UIEventHandler,
    useCallback,
    useEffect,
    useMemo
} from "react";
import { Input } from "semantic-ui-react";
import { SidebarMenuElementsTypes } from "../../model/menu/enums";
import { CurrentModelPortfolio } from "../../model/table/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import { updateTotalTargetAmount } from "../../store/table/tableReducer";
import { modelPortfolioColumns, modelPortfolioColumnsOrder, modelPortfolioColumnsWidth } from "./columns";
import Table from "./Table";
import footerStyles from "./styles/TablesFooter.scss";
import styles from "./styles/ModelTable.scss";

interface Props {
    currentPortfolio: CurrentModelPortfolio,
    footerRef: Ref<HTMLDivElement>,
    onTableRendered: (tableRef: Ref<any>) => void,
    onScrollFooter: (event: UIEventHandler<HTMLDivElement>) => void
}

export default function ModelTable({
    currentPortfolio, footerRef, onTableRendered, onScrollFooter
}: Props) {
    const dispatch = useAppDispatch();
    const totalTargetAmount = useAppSelector((state) => state.tableData.totalTargetAmount);

    const updateMenuElement = useCallback((_currentPortfolio: CurrentModelPortfolio) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            data: _currentPortfolio[1]
        }));
    }, [dispatch]);

    const updateTargetAmount = useCallback((value: string) => {
        dispatch(updateTotalTargetAmount(value));
    }, [dispatch]);

    const footer = useMemo(() => (
        // @ts-ignore
        <div className={footerStyles.footer} onScroll={onScrollFooter} ref={footerRef}>
            {modelPortfolioColumnsOrder.map((column, index) => {
                const width = modelPortfolioColumnsWidth[index];
                let value: number | string | JSX.Element;
                switch (column) {
                    case "weight": {
                        value = 0;
                        for (const row of currentPortfolio[1]) {
                            value += row.weight;
                        }
                        break;
                    }
                    case "amount": {
                        value = 0;
                        for (const row of currentPortfolio[1]) {
                            value += row.amount;
                        }
                        break;
                    }
                    case "targetAmount": {
                        value = (
                            <Input
                                value={totalTargetAmount} className={styles.targetAmountInput}
                                onChange={(event, data) => updateTargetAmount(data.value)}
                            />
                        );
                        break;
                    }
                    default: {
                        value = "";
                    }
                }
                return (
                    <div key={column} className={footerStyles.cell} style={{ width, minWidth: width }}>
                        {value}
                    </div>
                );
            })}
        </div>
    ), [currentPortfolio, footerRef, onScrollFooter, totalTargetAmount, updateTargetAmount]);

    useEffect(() => {
        updateMenuElement(currentPortfolio);
    }, [currentPortfolio, updateMenuElement]);

    return (
        <>
            <Table
                columns={modelPortfolioColumns(currentPortfolio[1])}
                currentPortfolio={currentPortfolio} onTableRendered={onTableRendered}
            />
            {footer}
        </>
    );
}
