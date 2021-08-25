import React, { useMemo } from "react";
import { ModelPortfolio } from "../../../models/portfolios/types";
import { modelPortfolioColumns } from "../columns";
import NewTable from "../NewTable";
import Table from "../Table";
import TargetAmountInput from "./TargetAmountInput";

interface Props {
    currentPortfolio: ModelPortfolio
}

export default function ModelTable({ currentPortfolio }: Props) {
    return useMemo(() => (
        <NewTable
            columns={modelPortfolioColumns(currentPortfolio.positions, currentPortfolio.settings)}
            currentPortfolio={currentPortfolio}
            additionalHeaderPart={<TargetAmountInput />}
        />
    ), [currentPortfolio]);
}
