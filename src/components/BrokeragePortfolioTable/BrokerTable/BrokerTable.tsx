import React, { useMemo } from "react";
import { BrokerAccount } from "../../../models/portfolios/types";
import { brokerAccountColumns } from "../columns";
import Table from "../Table";

interface Props {
    currentPortfolio: BrokerAccount
}

export default function BrokerTable({ currentPortfolio }: Props) {
    return useMemo(() => <Table columns={brokerAccountColumns} currentPortfolio={currentPortfolio} />, [currentPortfolio]);
}
