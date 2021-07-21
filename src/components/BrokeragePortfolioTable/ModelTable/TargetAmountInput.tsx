import React, {
    useCallback, useEffect, useMemo, useState
} from "react";
import { Icon, Input, Popup } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateModelPortfolioTargetAmount } from "../../../store/sidebarMenu/sidebarMenuReducer";
import { updateTotalTargetAmount } from "../../../store/table/tableReducer";
import styles from "./styles/TargetAmountInput.scss";
import { BrokeragePortfolioTypes } from "../../../models/portfolios/enums";

export default function TargetAmountInput() {
    const dispatch = useAppDispatch();

    const totalTargetAmount = useAppSelector((state) => {
        if (!state.tableData.currentPortfolio || state.tableData.currentPortfolio.type !== BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return undefined;
        }
        return state.tableData.currentPortfolio.totalTargetAmount;
    });

    const [targetAmountError, setTargetAmountError] = useState(false);
    const [questionOpen, setQuestionOpen] = useState(false);

    const updateMenuElementTotalTargetAmount = useCallback((newTotalTargetAmount: number | string) => {
        dispatch(updateModelPortfolioTargetAmount({
            totalTargetAmount: newTotalTargetAmount
        }));
    }, [dispatch]);

    const validateTargetAmount = useCallback((value: number | string | undefined) => {
        if (typeof value === "string" && (value === "" || value.length > 12 || !/^\d+$/.test(value))) {
            if (!targetAmountError) {
                setTargetAmountError(true);
                setQuestionOpen(true);
            }
            return;
        }
        if (targetAmountError) {
            setTargetAmountError(false);
            setQuestionOpen(false);
        }
    }, [targetAmountError]);

    const updateTargetAmount = useCallback((value: string) => {
        let newTotalTargetAmount: number | string = value;
        if (/^\d{1,12}$/.test(value)) {
            newTotalTargetAmount = Number.parseInt(value, 10);
        }
        validateTargetAmount(newTotalTargetAmount);
        if (value.length <= 12) {
            dispatch(updateTotalTargetAmount(newTotalTargetAmount));
            updateMenuElementTotalTargetAmount(newTotalTargetAmount);
        }
    }, [dispatch, updateMenuElementTotalTargetAmount, validateTargetAmount]);

    useEffect(() => {
        validateTargetAmount(totalTargetAmount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo(() => (
        <div className={styles.inputContainer}>
            <span>Целевая сумма:</span>
            <Input
                label={{
                    basic: true,
                    content: "₽"
                }} labelPosition="right" error={targetAmountError}
                value={totalTargetAmount} className={styles.input}
                onChange={(event, data) => updateTargetAmount(data.value)}
            />
            <Popup
                open={questionOpen}
                on="hover"
                onClose={() => setQuestionOpen(false)}
                onOpen={() => setQuestionOpen(true)}
                position="bottom center"
                trigger={<Icon className={styles.inputQuestion} name="question circle outline" />}
                content="Целевая сумма должна быть числом и не должна превышать 999999999999"
            />
        </div>
    ), [questionOpen, targetAmountError, totalTargetAmount, updateTargetAmount]);
}
