import * as React from "react";
import { FormEvent, useCallback } from "react";

import { CheckboxProps, Form, Radio } from "semantic-ui-react";

import { TickerViewMode } from "../../../../../models/settings/enums";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { setTickerViewMode } from "../../../../../store/settings/settingsReducer";
import styles from "../styles/SettingsModal.scss";

export default function CommonSettings() {
    const dispatch = useAppDispatch();

    const tickerViewMode = useAppSelector((state) => state.settings.tickerViewMode);

    const onTickerViewModeCheck = useCallback((event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        dispatch(setTickerViewMode(data.value as TickerViewMode));
    }, [dispatch]);

    return (
        <Form>
            <h3>Отображение тикера</h3>
            <Form.Field>
                <Radio
                    label="Имя"
                    name="tickerView"
                    value={TickerViewMode.TICKER_NAME}
                    checked={tickerViewMode === TickerViewMode.TICKER_NAME}
                    className={styles.settingsRadio}
                    onChange={onTickerViewModeCheck}
                />
                <Radio
                    label="Тикер"
                    name="tickerView"
                    value={TickerViewMode.TICKER}
                    checked={tickerViewMode === TickerViewMode.TICKER}
                    className={styles.settingsRadio}
                    onChange={onTickerViewModeCheck}
                />
            </Form.Field>
        </Form>
    );
}
