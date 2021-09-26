import React from "react";

export function ErrorScreen(props: { error: Error }) {
    return <div>{props.error.message}</div>;
}
