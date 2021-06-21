import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { CurrentPortfolio } from "../../model/table/types";
import BrokerTable from "./BrokerTable";
import ModelTable from "./ModelTable";

interface Props {
    currentPortfolio: CurrentPortfolio
}

export default function TableWrapper({ currentPortfolio }: Props) {
    const footerRef = useRef<HTMLDivElement>(null);
    const [tableHolder, setTableHolder] = useState<HTMLDivElement>();

    const onTableRendered = useCallback((table) => {
        if (table?.ref?.children?.[1]) {
            setTableHolder(table.ref.children[1]);
        }
    }, []);

    const onScrollFooter = useCallback((event: any) => {
        if (tableHolder) {
            tableHolder.scrollLeft = event.target.scrollLeft;
        }
    }, [tableHolder]);

    const onScrollTable = useCallback((event: any) => {
        if (footerRef.current) {
            footerRef.current.scrollLeft = event.target.scrollLeft;
        }
    }, [footerRef]);

    useEffect(() => {
        if (tableHolder) {
            tableHolder.addEventListener("scroll", onScrollTable);
        }
    }, [onScrollTable, tableHolder]);

    useEffect(() => {
        if (tableHolder) {
            return tableHolder.removeEventListener("scroll", onScrollTable);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo(() => {
        if (currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return (
                <ModelTable
                    currentPortfolio={currentPortfolio}
                    footerRef={footerRef}
                    onTableRendered={onTableRendered}
                    onScrollFooter={onScrollFooter}
                />
            );
        }
        if (currentPortfolio[0] === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
            return (
                <BrokerTable
                    currentPortfolio={currentPortfolio}
                    footerRef={footerRef}
                    onTableRendered={onTableRendered}
                    onScrollFooter={onScrollFooter}
                />
            );
        }
        return null;
    }, [currentPortfolio, onScrollFooter, onTableRendered]);
}
