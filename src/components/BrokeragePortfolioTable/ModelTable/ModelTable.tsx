import { useMemo } from "react";

import { ModelPortfolio } from "../../../models/portfolios/types";
import { modelPortfolioColumns } from "../columns";
import Table from "../Table";
import TargetAmountInput from "./TargetAmountInput";

interface Props {
    currentPortfolio: ModelPortfolio
}

export default function ModelTable({ currentPortfolio }: Props) {
    return useMemo(() => (
        <Table
            columns={(dividendsButton) => modelPortfolioColumns(dividendsButton, currentPortfolio.settings)}
            currentPortfolio={currentPortfolio}
            additionalHeaderPart={<TargetAmountInput />}
        />
    ), [currentPortfolio]);
}
