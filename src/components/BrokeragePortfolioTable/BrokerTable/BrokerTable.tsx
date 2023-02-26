import { useMemo } from "react";

import { BrokerAccount } from "../../../models/portfolios/types";
import { useAppSelector } from "../../../store/hooks";
import { brokerAccountColumns } from "../columns";
import Table from "../Table";

interface Props {
    currentPortfolio: BrokerAccount
}

export default function BrokerTable({ currentPortfolio }: Props) {
    const instrumentViewMode = useAppSelector((state) => state.settings.instrumentViewMode);

    return useMemo(() => (
        <Table
            columns={(dividendsButton) => brokerAccountColumns(dividendsButton, instrumentViewMode)}
            currentPortfolio={currentPortfolio}
        />
    ), [currentPortfolio, instrumentViewMode]);
}
