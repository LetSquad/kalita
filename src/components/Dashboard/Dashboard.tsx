import React from "react";
import { Menu, Segment, Sidebar } from "semantic-ui-react";
import partsStyles from "../../styles/parts.scss";
import DashboardContent from "./DashboardContent";
import SidebarMenu from "./SidebarMenu/SidebarMenu";
import styles from "./styles/Dashboard.scss";

export default function Dashboard() {
    return (
        <div className={partsStyles.baseContainer}>
            <Sidebar.Pushable as={Segment} className={styles.pushableSegment}>
                <Sidebar
                    as={Menu}
                    animation="push"
                    icon="labeled"
                    direction="left"
                    vertical
                    visible
                    className={styles.sidebar}
                >
                    <SidebarMenu />
                </Sidebar>
                <Sidebar.Pusher className={styles.pusher}>
                    <DashboardContent />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}
