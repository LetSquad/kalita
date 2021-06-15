import React from "react";
import { useAppSelector } from "../../../store/hooks";
import SidebarMenuGroup from "./SidebarMenuGroup";
import styles from "./styles/SidebarMenu.scss";

export default function SidebarMenu() {
    const portfoliosTypes = useAppSelector((state) => state.sidebarMenu.menuGroups);

    return (
        <>
            <div className={styles.title}>Меню</div>
            <div className={styles.separator} />
            {portfoliosTypes.map((portfolioType) => (
                <SidebarMenuGroup key={portfolioType.type} sidebarMenuGroupType={portfolioType} />
            ))}
        </>
    );
}
