import fs from "fs-extra";
import React, { useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { saveProjectFileName } from "../../model/constants";
import { BrokeragePortfolioTypes } from "../../model/portfolios/enums";
import { CurrentPortfolio } from "../../model/table/types";
import { useAppSelector } from "../../store/hooks";
import BrokerTable from "./BrokerTable";
import ModelTable from "./ModelTable";

interface Props {
    currentPortfolio: CurrentPortfolio
}

export default function TableWrapper({ currentPortfolio }: Props) {
    const history = useHistory();
    const { addToast } = useToasts();

    const menuGroups = useAppSelector((state) => state.sidebarMenu.menuGroups);

    useEffect(() => {
        const folderPath = decodeURI(history.location.search.replace("?currentProject=", ""));
        const filePath = `${folderPath}/${saveProjectFileName}`;
        try {
            fs.writeJsonSync(filePath, menuGroups);
            console.log("SAVE");
        } catch {
            addToast(`Ошибка сохранения проекта "${folderPath}"`, { appearance: "error" });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuGroups]);

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
