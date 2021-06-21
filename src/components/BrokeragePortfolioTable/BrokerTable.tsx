import React, {
    Ref, UIEventHandler, useCallback, useEffect, useMemo
} from "react";
import { SidebarMenuElementsTypes } from "../../model/menu/enums";
import { CurrentBrokerAccount } from "../../model/table/types";
import { useAppDispatch } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import {
    brokerAccountColumns,
    brokerAccountColumnsOrder,
    brokerAccountColumnsWidth
} from "./columns";
import footerStyles from "./styles/TablesFooter.scss";
import Table from "./Table";

interface Props {
    currentPortfolio: CurrentBrokerAccount,
    footerRef: Ref<HTMLDivElement>,
    onTableRendered: (tableRef: Ref<any>) => void,
    onScrollFooter: (event: UIEventHandler<HTMLDivElement>) => void
}

export default function BrokerTable({
    currentPortfolio, footerRef, onTableRendered, onScrollFooter
}: Props) {
    const dispatch = useAppDispatch();

    const updateMenuElement = useCallback((_currentPortfolio: CurrentBrokerAccount) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.BROKER_ACCOUNT,
            data: _currentPortfolio[1]
        }));
    }, [dispatch]);

    const footer = useMemo(() => (
        // @ts-ignore
        <div className={footerStyles.footer} onScroll={onScrollFooter} ref={footerRef}>
            {brokerAccountColumnsOrder.map((column, index) => {
                const width = brokerAccountColumnsWidth[index];
                let value: number | string | JSX.Element;
                switch (column) {
                    case "amount": {
                        value = 0;
                        for (const row of currentPortfolio[1]) {
                            value += row.amount;
                        }
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
    ), [currentPortfolio, footerRef, onScrollFooter]);

    useEffect(() => {
        updateMenuElement(currentPortfolio);
    }, [currentPortfolio, updateMenuElement]);

    return (
        <>
            <Table columns={brokerAccountColumns} currentPortfolio={currentPortfolio} onTableRendered={onTableRendered} />
            {footer}
        </>
    );
}
