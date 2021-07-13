import React, {
    useCallback, useEffect, useMemo, useRef, useState
} from "react";
import { Input, Popup } from "semantic-ui-react";
import { SidebarMenuElementsTypes } from "../../models/menu/enums";
import { CurrentModelPortfolio } from "../../models/table/types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateMenuElementData } from "../../store/sidebarMenu/sidebarMenuReducer";
import { updateTotalTargetAmount } from "../../store/table/tableReducer";
import { modelPortfolioColumns } from "./columns";
import Table from "./Table";
import styles from "./styles/ModelTable.scss";
import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";

interface Props {
    currentPortfolio: CurrentModelPortfolio
}

const BASIC_WARNING_TARGET_AMOUNT_MESSAGE = "Введено некорректное значение.";
const EMPTY_TARGET_AMOUNT_POPUP = `${BASIC_WARNING_TARGET_AMOUNT_MESSAGE} Целевая сумма не может быть пустой`;
const OVERSIZE_TARGET_AMOUNT_POPUP = "Целевая сумма не может быть больше 999999999999.";
const INVALID_TARGET_AMOUNT_POPUP = "Сумма может состоять только из цифр";

export default function ModelTable({ currentPortfolio }: Props) {
    const dispatch = useAppDispatch();

    const inputRef = useRef<Input>(null);

    const totalTargetAmount = useAppSelector((state) => {
        if (!state.tableData.currentPortfolio || state.tableData.currentPortfolio.type !== BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return undefined;
        }
        return state.tableData.currentPortfolio.totalTargetAmount;
    });

    const [targetAmountInputMessage, setTargetAmountInputMessage] = useState<string>();
    const [targetAmountValue, setTargetAmountValue] = useState<string>(totalTargetAmount ? totalTargetAmount.toString() : "0");

    const updateMenuElementContent = useCallback((_currentPortfolio: CurrentModelPortfolio) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            content: _currentPortfolio.positions
        }));
    }, [dispatch]);

    const updateMenuElementTotalTargetAmount = useCallback((newTotalTargetAmount: number) => {
        dispatch(updateMenuElementData({
            elementType: SidebarMenuElementsTypes.MODEL_PORTFOLIO,
            totalTargetAmount: newTotalTargetAmount
        }));
    }, [dispatch]);

    const updateTargetAmount = useCallback((value: string) => {
        if (value === "") {
            dispatch(updateTotalTargetAmount(0));
            setTargetAmountInputMessage(EMPTY_TARGET_AMOUNT_POPUP);
            setTargetAmountValue(value);
            return;
        }
        if (/^\d{1,12}$/.test(value)) {
            const newTotalTargetAmount = Number.parseInt(value, 10);
            dispatch(updateTotalTargetAmount(newTotalTargetAmount));
            updateMenuElementTotalTargetAmount(newTotalTargetAmount);
            setTargetAmountValue(value);
            if (targetAmountInputMessage) {
                setTargetAmountInputMessage(undefined);
            }
            return;
        }

        let errorMessage = BASIC_WARNING_TARGET_AMOUNT_MESSAGE;
        if (value.length > 12) {
            errorMessage = `${errorMessage} ${OVERSIZE_TARGET_AMOUNT_POPUP}`;
        }
        if (!/^\d+$/.test(value)) {
            errorMessage = `${errorMessage} ${INVALID_TARGET_AMOUNT_POPUP}`;
        }

        setTargetAmountInputMessage(errorMessage);
        if (value.length <= 12) {
            setTargetAmountValue(value);
        }
    }, [dispatch, targetAmountInputMessage, updateMenuElementTotalTargetAmount]);

    const targetAmountInput = useMemo(() => (
        <Popup
            disabled={!targetAmountInputMessage}
            position="bottom center"
            defaultOpen
            trigger={(
                <div className={styles.targetAmountInputContainer}>
                    <span>Целевая сумма:</span>
                    <Input
                        label={{ basic: true, content: "₽" }} labelPosition="right" error={!!targetAmountInputMessage}
                        value={targetAmountValue} className={styles.targetAmountInput} ref={inputRef}
                        onChange={(event, data) => updateTargetAmount(data.value)}
                    />
                </div>
            )}
            content={targetAmountInputMessage}
        />
    ), [targetAmountInputMessage, targetAmountValue, updateTargetAmount]);

    useEffect(() => {
        updateMenuElementContent(currentPortfolio);
    }, [currentPortfolio, updateMenuElementContent]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [targetAmountInputMessage]);

    return useMemo(() => (
        <Table
            columns={modelPortfolioColumns(currentPortfolio.positions)}
            currentPortfolio={currentPortfolio}
            additionalHeaderPart={targetAmountInput}
        />
    ), [currentPortfolio, targetAmountInput]);
}
