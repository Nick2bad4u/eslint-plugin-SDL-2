import Translate, { translate } from "@docusaurus/Translate";
import { type ReactNode, useState } from "react";

import styles from "./styles.module.css";

interface Props {
    readonly onReload: () => void;
}

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
        <div className={styles.popup}>
            <output aria-live="polite" className={styles.message}>
                <Translate
                    description="The text for the PWA reload popup"
                    id="theme.PwaReloadPopup.info"
                >
                    New version available
                </Translate>
            </output>

            <div className={styles.actions}>
                <button
                    className={`button button--sm ${styles.reloadButton}`}
                    onClick={() => {
                        setIsVisible(false);
                        onReload();
                    }}
                    type="button"
                >
                    <Translate
                        description="The text for the PWA reload button"
                        id="theme.PwaReloadPopup.refreshButtonText"
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
                    className={styles.closeButton}
                    onClick={() => {
                        setIsVisible(false);
                    }}
                    type="button"
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        </div>
    );
}
