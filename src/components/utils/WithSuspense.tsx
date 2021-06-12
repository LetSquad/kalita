import React, { Suspense } from "react";
import { Loader } from "semantic-ui-react";

export function WithSuspense(props: { children: JSX.Element }): JSX.Element {
    return (
        <Suspense fallback={(
            <div>
                <Loader active inline="centered" />
            </div>
        )}
        >
            {props.children}
        </Suspense>
    );
}
