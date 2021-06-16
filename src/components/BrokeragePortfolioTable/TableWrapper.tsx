import React, { useMemo } from "react";
import { BrokeragePortfolioTypes } from "../../../custom_typings/enums";
import { CurrentPortfolio } from "../../../custom_typings/types";
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
