import Translate, { translate } from "@docusaurus/Translate";
import { type ReactNode, useState } from "react";

import styles from "./styles.module.css";

type Props = {
    readonly onReload: () => void;
};

/**
 * Show a dismissible PWA update banner when a newer service worker is ready.
 *
 * @param param0 - Popup behavior callbacks from the PWA plugin.
 *
 * @returns Update banner or `null` when dismissed.
 */
export default function PwaReloadPopup({ onReload }: Props): ReactNode {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles["popup"]} role="status">
            <p className={styles["message"]}>
                <Translate
                    id="theme.PwaReloadPopup.info"
                    description="The text for the PWA reload popup"
                >
                    New version available
                </Translate>
            </p>

            <div className={styles["actions"]}>
                <button
                    className={`button button--sm ${styles["reloadButton"]}`}
                    type="button"
                    onClick={() => {
                        setIsVisible(false);
                        onReload();
                    }}
                >
                    <Translate
                        id="theme.PwaReloadPopup.refreshButtonText"
                        description="The text for the PWA reload button"
                    >
                        Refresh
                    </Translate>
                </button>

                <button
                    aria-label={translate({
                        description:
                            "The ARIA label for the close button of the PWA reload popup",
                        id: "theme.PwaReloadPopup.closeButtonAriaLabel",
                        message: "Close",
                    })}
                    className={styles["closeButton"]}
                    type="button"
                    onClick={() => setIsVisible(false)}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        </div>
    );
}