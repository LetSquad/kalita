import React, { useMemo } from "react";
import { BrokeragePortfolioTypes } from "../../../custom_typings/enums";
import { CurrentPortfolio } from "../../../custom_typings/types";
import { brokerAccountColumns, modelPortfolioColumns } from "./columns";
import Table from "./Table";

interface Props {
    currentPortfolio: CurrentPortfolio
}

export default function TableWrapper(props: Props) {
    return useMemo(() => {
        if (props.currentPortfolio[0] === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return <Table columns={modelPortfolioColumns} currentPortfolio={props.currentPortfolio} />;
        }
        if (props.currentPortfolio[0] === BrokeragePortfolioTypes.BROKER_ACCOUNT) {
            return <Table columns={brokerAccountColumns} currentPortfolio={props.currentPortfolio} />;
        }
        return <></>;
    }, [props.currentPortfolio]);
}
