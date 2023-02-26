import * as React from "react";
import { FormEvent, useCallback } from "react";

import { CheckboxProps, Form, Radio } from "semantic-ui-react";

import { InstrumentViewMode } from "../../../../../models/settings/enums";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { setTickerViewMode } from "../../../../../store/settings/settingsReducer";
import styles from "../styles/SettingsModal.scss";

export default function CommonSettings() {
    const dispatch = useAppDispatch();

    const tickerViewMode = useAppSelector((state) => state.settings.tickerViewMode);

    const onTickerViewModeCheck = useCallback((event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        dispatch(setTickerViewMode(data.value as InstrumentViewMode));
    }, [dispatch]);

    return (
        <Form>
            <h3>Название инструмента</h3>
            <Form.Field>
                <Radio
                    label="Имя"
                    name="tickerView"
                    value={InstrumentViewMode.INSTRUMENT_NAME}
                    checked={tickerViewMode === InstrumentViewMode.INSTRUMENT_NAME}
                    className={styles.settingsRadio}
                    onChange={onTickerViewModeCheck}
                />
                <Radio
                    label="Тикер"
                    name="tickerView"
                    value={InstrumentViewMode.TICKER}
                    checked={tickerViewMode === InstrumentViewMode.TICKER}
                    className={styles.settingsRadio}
                    onChange={onTickerViewModeCheck}
                />
            </Form.Field>
        </Form>
    );
}
