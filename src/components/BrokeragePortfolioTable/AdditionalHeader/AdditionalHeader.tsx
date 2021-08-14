import React, { useCallback } from "react";
import { Icon } from "semantic-ui-react";
import { Portfolio } from "../../../models/portfolios/types";
import {
    addNewGroup,
    changeChartMode
} from "../../../store/portfolios/portfoliosReducer";
import { AdditionalHeaderMenu } from "./AdditionalHeaderMenu";
import styles from "./styles/AdditionalHeader.scss";
import { getMoexQuotes } from "../../../apis/moexApi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

interface Props {
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element,
    importTableToCsvText: () => string | undefined;
}

export function AdditionalHeader({
    currentPortfolio, additionalHeaderPart, importTableToCsvText
}: Props) {
    const dispatch = useAppDispatch();

    const isChartMode: boolean = useAppSelector((state) => state.portfolios.isChartMode);

    const addGroup = useCallback(() => {
        dispatch(addNewGroup());
    }, [dispatch]);

    const updateQuotesCurrentPrice = useCallback(() => {
        dispatch(getMoexQuotes());
    }, [dispatch]);

    const onChangeChartMode = useCallback(() => {
        dispatch(changeChartMode());
    }, [dispatch]);

    return (
        <div className={styles.additionalHeader}>
            <div className={styles.additionalHeaderPart}>
                {additionalHeaderPart}
            </div>
            <div>
                <AdditionalHeaderMenu currentPortfolio={currentPortfolio} importTableToCsvText={importTableToCsvText} />
                <Icon
                    title={`Показать ${isChartMode ? "таблицу" : "диаграмму"}`}
                    name={isChartMode ? "table" : "chart pie"}
                    link
                    className={styles.additionalHeaderIcon}
                    onClick={onChangeChartMode}
                />
                <Icon name="sync alternate" link className={styles.additionalHeaderIcon} onClick={() => updateQuotesCurrentPrice()} />
                <Icon name="plus" link className={styles.additionalHeaderIcon} onClick={() => addGroup()} />
            </div>
        </div>
    );
}
