import React, { useMemo } from "react";
import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import { CurrentPortfolio } from "../../models/table/types";
import BrokerTable from "./BrokerTable/BrokerTable";
import ModelTable from "./ModelTable/ModelTable";

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
