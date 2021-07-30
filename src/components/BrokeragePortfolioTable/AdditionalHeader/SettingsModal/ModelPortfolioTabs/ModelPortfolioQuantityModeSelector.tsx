import {
    Dropdown,
    DropdownProps,
    CheckboxProps,
    Form,
    Radio
} from "semantic-ui-react";
import React, { useCallback, useMemo } from "react";
import { BrokeragePortfolioTypes } from "../../../../../models/portfolios/enums";
import styles from "../styles/SettingsModal.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { updateModelPortfolioQuantityMode, updateModelPortfolioQuantitySources } from "../../../../../store/portfolios/portfoliosReducer";
import { currentPortfolioSelector } from "../../../../../store/portfolios/selectors";
import { BrokerAccountMenuElement } from "../../../../../models/menu/types";
import { ModelPortfolioQuantityMode } from "../../../../../models/settings/enums";

export default function ModelPortfolioQuantityModeSelector() {
    const dispatch = useAppDispatch();
    const currentPortfolio = useAppSelector(currentPortfolioSelector);

    const brokerAccounts: BrokerAccountMenuElement[] = useAppSelector((state) => state.sidebarMenu.brokerAccounts.elements);
    const quantityMode: ModelPortfolioQuantityMode | undefined = useMemo(() => {
        if (currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return currentPortfolio.settings.quantityMode;
        }
        return undefined;
    }, [currentPortfolio]);

    const brokerReportsOptions = useMemo(
        () => brokerAccounts.map((e) => ({ key: e.id, text: e.name, value: e.id })),
        [brokerAccounts]
    );
    const quantitySources: string[] | undefined = useMemo(() => {
        if (currentPortfolio && currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO) {
            return currentPortfolio.settings.quantitySources;
        }
        return undefined;
    }, [currentPortfolio]);

    const onQuantityModeCheck = useCallback((_, data: CheckboxProps) => {
        dispatch(updateModelPortfolioQuantityMode(data.value as ModelPortfolioQuantityMode));
    }, [dispatch]);

    const onQuantitySourcesSelect = useCallback((_, data: DropdownProps) => {
        dispatch(updateModelPortfolioQuantitySources(data.value as string[]));
    }, [dispatch]);

    return (
        <Form>
            <h3>В портфеле</h3>
            <Form.Field>
                <Radio
                    label="Ручной ввод"
                    name="quantitySource"
                    value={ModelPortfolioQuantityMode.MANUAL_INPUT}
                    checked={quantityMode === ModelPortfolioQuantityMode.MANUAL_INPUT}
                    className={styles.settingsRadio}
                    onChange={onQuantityModeCheck}
                />
                <Radio
                    label="Брокерские счета"
                    name="quantitySource"
                    value={ModelPortfolioQuantityMode.BROKER_ACCOUNT}
                    checked={quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT}
                    className={styles.settingsRadio}
                    onChange={onQuantityModeCheck}
                />
            </Form.Field>
            {quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT ? (
                <Form.Field>
                    <Dropdown
                        placeholder="Выберите брокерские счета"
                        fluid multiple selection
                        options={brokerReportsOptions}
                        value={quantitySources}
                        onChange={onQuantitySourcesSelect}
                    />
                </Form.Field>
            ) : null}
        </Form>
    );
}
