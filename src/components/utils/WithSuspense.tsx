import { Suspense } from "react";

import { Loader } from "semantic-ui-react";

import partsStyles from "../../styles/parts.scss";

export function WithSuspense(props: { children: JSX.Element }): JSX.Element {
    return (
        <Suspense fallback={(
            <div className={partsStyles.loaderContainer}>
                <Loader
                    active
                    inline="centered"
                />
            </div>
        )}
        >
            {props.children}
        </Suspense>
    );
}
