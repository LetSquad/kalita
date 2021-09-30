import React, {
    useCallback, useEffect, useMemo, useState
} from "react";
import { Icon, Input, Popup } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateTotalTargetAmount } from "../../../store/portfolios/portfoliosReducer";
import { currentTargetAmountSelector } from "../../../store/portfolios/selectors";
import styles from "./styles/TargetAmountInput.scss";

export default function TargetAmountInput() {
    const dispatch = useAppDispatch();

    const totalTargetAmount = useAppSelector(currentTargetAmountSelector);

    const [targetAmountError, setTargetAmountError] = useState(false);
    const [questionOpen, setQuestionOpen] = useState(false);

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
        }
    }, [dispatch, validateTargetAmount]);

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
                }}
                labelPosition="right"
                error={targetAmountError}
                value={totalTargetAmount}
                className={styles.input}
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
