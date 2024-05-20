import { toast, ToastBar, Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Icon, Loader } from "semantic-ui-react";

import { persistor, store } from "../store";
import partsStyles from "../styles/parts.scss";
import toastsStyles from "../styles/toasts.scss";
import { RootRouter } from "./RootRouter";
import { WithErrorBoundaries } from "./utils/WithErrorBoundaries";

export default function App() {
    return (
        <WithErrorBoundaries>
            <Provider store={store}>
                <PersistGate
                    loading={(
                        <div className={partsStyles.loaderContainer}>
                            <Loader
                                active
                                inline="centered"
                            />
                        </div>
                    )}
                    persistor={persistor}
                >
                    <RootRouter />
                </PersistGate>
            </Provider>
            <Toaster
                position="bottom-right"
                gutter={8}
                toastOptions={{
                    className: toastsStyles.toast,
                    success: {
                        duration: 10_000
                    },
                    error: {
                        duration: 10_000
                    }
                }}
            >
                {(t) => (
                    <ToastBar toast={t}>
                        {({ icon, message }) => (
                            <>
                                {icon}
                                {message}
                                {t.type !== "loading" && (
                                    <Icon
                                        name="remove"
                                        className={toastsStyles.toastDismissIcon}
                                        onClick={() => toast.dismiss(t.id)}
                                        link
                                    />
                                )}
                            </>
                        )}
                    </ToastBar>
                )}
            </Toaster>
        </WithErrorBoundaries>
    );
}
