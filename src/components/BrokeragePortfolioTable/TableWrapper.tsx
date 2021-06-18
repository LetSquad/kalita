import React, { useMemo } from "react";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { CurrentPortfolio } from "../../model/table/types";
import BrokerTable from "./BrokerTable";
import ModelTable from "./ModelTable";

interface Props {
    currentPortfolio: CurrentPortfolio
}

export default function TableWrapper(props: Props) {
    return useMemo(() => {
        if (props.currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return <ModelTable currentPortfolio={props.currentPortfolio} />;
        }
        if (props.currentPortfolio[0] === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
            return <BrokerTable currentPortfolio={props.currentPortfolio} />;
        }
        return null;
    }, [props.currentPortfolio]);
}
