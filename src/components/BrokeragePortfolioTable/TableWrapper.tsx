import React, { useMemo } from "react";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { CurrentPortfolio } from "../../model/table/types";
import BrokerTable from "./BrokerTable";
import ModelTable from "./ModelTable";

interface Props {
    currentPortfolio: CurrentPortfolio
}

export default function TableWrapper({ currentPortfolio }: Props) {
    return useMemo(() => {
        if (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return (
                <ModelTable currentPortfolio={currentPortfolio} />
            );
        }
        if (currentPortfolio.type === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
            return (
                <BrokerTable currentPortfolio={currentPortfolio} />
            );
        }
        return null;
    }, [currentPortfolio]);
}
