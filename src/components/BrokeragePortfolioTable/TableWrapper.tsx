import { useCallback, useMemo } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import { Portfolio } from "../../models/portfolios/types";
import { useAppDispatch } from "../../store/hooks";
import { addNewGroup, addNewPosition } from "../../store/portfolios/portfoliosReducer";
import { ADD_NEW_GROUP_HOTKEY, ADD_NEW_POSITION_HOTKEY } from "../../utils/keyboardUtils";
import BrokerTable from "./BrokerTable/BrokerTable";
import ModelTable from "./ModelTable/ModelTable";

interface Props {
    currentPortfolio: Portfolio
}

export default function TableWrapper({ currentPortfolio }: Props) {
    const dispatch = useAppDispatch();

    const addGroup = useCallback(() => {
        dispatch(addNewGroup());
    }, [dispatch]);
    const addRowToGroup = useCallback(() => {
        dispatch(addNewPosition());
    }, [dispatch]);

    useHotkeys(ADD_NEW_GROUP_HOTKEY, addGroup);
    useHotkeys(ADD_NEW_POSITION_HOTKEY, addRowToGroup);

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
