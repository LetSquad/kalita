import { Dropdown, Form, Radio } from "semantic-ui-react";
import React, { useMemo } from "react";
import { BrokeragePortfolioTypes, ModelPortfolioQuantityMode } from "../../../../../models/portfolios/enums";
import styles from "../styles/SettingsModal.scss";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { updateModelPortfolioQuantityMode, updateModelPortfolioQuantitySources } from "../../../../../store/portfolios/portfoliosReducer";
import { currentPortfolioSelector } from "../../../../../store/portfolios/selectors";
import { BrokerAccountMenuElement } from "../../../../../models/menu/types";

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

    return (
        <>
            <Form>
                <h3>В портфеле</h3>
                <Form.Field>
                    <Radio
                        label="Ручной ввод"
                        name="quantitySource"
                        value={ModelPortfolioQuantityMode.MANUAL_INPUT}
                        checked={quantityMode === ModelPortfolioQuantityMode.MANUAL_INPUT}
                        className={styles.settingsRadio}
                        onChange={(e, data) => dispatch(updateModelPortfolioQuantityMode(data.value as ModelPortfolioQuantityMode))}
                    />
                    <Radio
                        label="Брокерские счета"
                        name="quantitySource"
                        value={ModelPortfolioQuantityMode.BROKER_ACCOUNT}
                        checked={quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT}
                        className={styles.settingsRadio}
                        onChange={(e, data) => dispatch(updateModelPortfolioQuantityMode(data.value as ModelPortfolioQuantityMode))}
                    />
                </Form.Field>
                {quantityMode === ModelPortfolioQuantityMode.BROKER_ACCOUNT ? (
                    <Form.Field>
                        <Dropdown
                            placeholder="Выберите брокерские счета"
                            fluid multiple selection
                            options={brokerReportsOptions}
                            value={quantitySources}
                            onChange={(e, data) => dispatch(updateModelPortfolioQuantitySources(data.value as string[]))}
                        />
                    </Form.Field>
                ) : null}
            </Form>
        </>
    );
}
