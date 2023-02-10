import * as React from "react";
import {
    FormEvent,
    SyntheticEvent,
    useCallback,
    useMemo
} from "react";

import {
    CheckboxProps,
    Dropdown,
    DropdownProps,
    Form,
    Radio
} from "semantic-ui-react";

import { loadMoexQuotesByTickers } from "../../../../../apis/moexApi";
import { BrokerAccountMenuElement } from "../../../../../models/menu/types";
import { ModelPortfolio } from "../../../../../models/portfolios/types";
import { ModelPortfolioPriceMode, ModelPortfolioQuantityMode } from "../../../../../models/settings/enums";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { updateModelPortfolioPriceMode, updateModelPortfolioQuantityMode, updateModelPortfolioQuantitySources } from "../../../../../store/portfolios/portfoliosReducer";
import styles from "../styles/SettingsModal.scss";

interface ModelPortfolioDataSourcesSelectorProps {
    currentPortfolio: ModelPortfolio,
}

export default function ModelPortfolioDataSourcesSelector({ currentPortfolio }: ModelPortfolioDataSourcesSelectorProps) {
    const dispatch = useAppDispatch();

    const brokerAccounts: BrokerAccountMenuElement[] = useAppSelector((state) => state.sidebarMenu.brokerAccounts.elements);

    const brokerReportsOptions = useMemo(
        () => brokerAccounts.map((e) => ({ key: e.id, text: e.name, value: e.id })),
        [brokerAccounts]
    );

    const onPriceModeCheck = useCallback((event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        const priceMode = data.value as ModelPortfolioPriceMode;
        dispatch(updateModelPortfolioPriceMode(priceMode));
        if (priceMode === ModelPortfolioPriceMode.MARKET_DATA) {
            const tickers: string[] = currentPortfolio.positions.map((position) => position.ticker);
            dispatch(loadMoexQuotesByTickers({ tickers }));
        }
    }, [dispatch, currentPortfolio]);

    const onQuantityModeCheck = useCallback((event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        dispatch(updateModelPortfolioQuantityMode(data.value as ModelPortfolioQuantityMode));
    }, [dispatch]);

    const onQuantitySourcesSelect = useCallback((event: SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        dispatch(updateModelPortfolioQuantitySources(data.value as string[]));
    }, [dispatch]);

    return (
        <Form>
            <h3>Цена</h3>
            <Form.Field>
                <Radio
                    label="Ручной ввод"
                    name="priceSource"
                    value={ModelPortfolioPriceMode.MANUAL_INPUT}
                    checked={currentPortfolio.settings.priceMode === ModelPortfolioPriceMode.MANUAL_INPUT}
                    className={styles.settingsRadio}
                    onChange={onPriceModeCheck}
                />
                <Radio
                    label="Рыночные данные"
                    name="priceSource"
                    value={ModelPortfolioPriceMode.MARKET_DATA}
                    checked={currentPortfolio.settings.priceMode === ModelPortfolioPriceMode.MARKET_DATA}
                    className={styles.settingsRadio}
                    onChange={onPriceModeCheck}
                />
            </Form.Field>

            <h3>В портфеле</h3>
            <Form.Field>
                <Radio
                    label="Ручной ввод"
                    name="quantitySource"
                    value={ModelPortfolioQuantityMode.MANUAL_INPUT}
                    checked={currentPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.MANUAL_INPUT}
                    className={styles.settingsRadio}
                    onChange={onQuantityModeCheck}
                />
                <Radio
                    label="Брокерские счета"
                    name="quantitySource"
                    value={ModelPortfolioQuantityMode.BROKER_ACCOUNT}
                    checked={currentPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT}
                    className={styles.settingsRadio}
                    onChange={onQuantityModeCheck}
                />
            </Form.Field>
            {currentPortfolio.settings.quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT ? (
                <Form.Field>
                    <Dropdown
                        placeholder="Выберите брокерские счета"
                        fluid
                        multiple
                        selection
                        options={brokerReportsOptions}
                        value={currentPortfolio.settings.quantitySources}
                        onChange={onQuantitySourcesSelect}
                    />
                </Form.Field>
            ) : null}
        </Form>
    );
}
