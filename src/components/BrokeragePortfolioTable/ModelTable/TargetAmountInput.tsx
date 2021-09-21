import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Dropdown,
    Icon,
    Input,
    Popup
} from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateBaseCurrency, updateTotalTargetAmount } from "../../../store/portfolios/portfoliosReducer";
import { currentPortfolioSelector } from "../../../store/portfolios/selectors";
import styles from "./styles/TargetAmountInput.scss";
import { Portfolio } from "../../../models/portfolios/types";
import { BrokeragePortfolioTypes, Currency } from "../../../models/portfolios/enums";
import { getSymbol } from "../../../utils/currencyUtils";
import { getMoexCurrencyQuotes } from "../../../apis/moexApi";

export default function TargetAmountInput() {
    const dispatch = useAppDispatch();

    const currentPortfolio: Portfolio | undefined = useAppSelector(currentPortfolioSelector);
    const totalTargetAmount = currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO
        ? currentPortfolio.totalTargetAmount
        : undefined;
    const baseCurrency = currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO
        ? currentPortfolio.settings.baseCurrency
        : undefined;

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

    const updatePortfolioCurrency = useCallback((value: Currency) => {
        getMoexCurrencyQuotes()
            .then((quotes) => dispatch(updateBaseCurrency({ currency: value, quotes })));
    }, [dispatch]);

    useEffect(() => {
        validateTargetAmount(totalTargetAmount);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return useMemo(() => {
        const targetAmountCurrencies = Object.values(Currency)
            .map((c) => ({ key: c, text: getSymbol(c), value: c }));
        return (
            <div className={styles.inputContainer}>
                <span>Целевая сумма:</span>
                <Input
                    label={(
                        <Dropdown
                            options={targetAmountCurrencies}
                            value={baseCurrency}
                            onChange={(_, data) => updatePortfolioCurrency(data.value as Currency)}
                        />
                    )}
                    labelPosition="right"
                    error={targetAmountError}
                    value={totalTargetAmount}
                    className={styles.input}
                    onChange={(_, data) => updateTargetAmount(data.value)}
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
        );
    }, [questionOpen, targetAmountError, baseCurrency, totalTargetAmount, updateTargetAmount, updatePortfolioCurrency]);
}
