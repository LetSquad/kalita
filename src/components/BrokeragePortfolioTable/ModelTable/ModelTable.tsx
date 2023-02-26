import { useMemo } from "react";

import { ModelPortfolio } from "../../../models/portfolios/types";
import { useAppSelector } from "../../../store/hooks";
import { modelPortfolioColumns } from "../columns";
import Table from "../Table";
import TargetAmountInput from "./TargetAmountInput";

interface Props {
    currentPortfolio: ModelPortfolio
}

export default function ModelTable({ currentPortfolio }: Props) {
    const tickerViewMode = useAppSelector((state) => state.settings.tickerViewMode);

    return useMemo(() => (
        <Table
            columns={(dividendsButton) => modelPortfolioColumns(dividendsButton, currentPortfolio.settings, tickerViewMode)}
            currentPortfolio={currentPortfolio}
            additionalHeaderPart={<TargetAmountInput />}
        />
    ), [currentPortfolio, tickerViewMode]);
}
