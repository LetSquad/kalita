import {
    Component,
    ErrorInfo,
    PropsWithChildren,
    ReactChild
} from "react";

import { ErrorScreen } from "./ErrorScreen";

export class WithErrorBoundaries extends Component<PropsWithChildren<{}>, { error: Error | undefined }> {
    constructor(props: PropsWithChildren<{ children: ReactChild }>) {
        super(props);
        this.state = {
            error: undefined
        };
    }

    public static getDerivedStateFromError(error: Error) {
        return {
            error
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log(error);
        console.log(errorInfo);
    }

    public render() {
        if (this.state.error) {
            return <ErrorScreen error={this.state.error} />;
        }
        return this.props.children;
    }
}
