import Link from "@docusaurus/Link";

import styles from "../pages/index.module.css";

const liveBadges = [
    {
        alt: "npm license",
        href: "https://www.npmjs.com/package/eslint-plugin-sdl-2",
        src: "https://flat.badgen.net/npm/license/eslint-plugin-sdl-2?color=8b5cf6",
    },
    {
        alt: "npm total downloads",
        href: "https://www.npmjs.com/package/eslint-plugin-sdl-2",
        src: "https://flat.badgen.net/npm/dt/eslint-plugin-sdl-2?color=ec4899",
    },
    {
        alt: "latest GitHub release",
        href: "https://github.com/Nick2bad4u/eslint-plugin-sdl-2/releases",
        src: "https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-sdl-2?color=f97316",
    },
    {
        alt: "GitHub stars",
        href: "https://github.com/Nick2bad4u/eslint-plugin-sdl-2/stargazers",
        src: "https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-sdl-2?color=facc15",
    },
    {
        alt: "GitHub forks",
        href: "https://github.com/Nick2bad4u/eslint-plugin-sdl-2/forks",
        src: "https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-sdl-2?color=22d3ee",
    },
    {
        alt: "GitHub open issues",
        href: "https://github.com/Nick2bad4u/eslint-plugin-sdl-2/issues",
        src: "https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-sdl-2?color=38bdf8",
    },
];

/**
 * Renders live repository and package badges powered by flat.badgen.net.
 *
 * @param {{ className?: string }} [props] - Optional list class override.
 *
 * @returns {JSX.Element} Badge strip with links to package/repository metadata.
 */
export default function GitHubStats({ className = "" } = {}) {
    const badgeListClassName = [styles.liveBadgeList, className]
        .filter(Boolean)
        .join(" ");

    return (
        <ul className={badgeListClassName}>
            {liveBadges.map((badge) => (
                <li key={badge.src} className={styles.liveBadgeListItem}>
                    <Link
                        className={styles.liveBadgeAnchor}
                        href={badge.href}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            alt={badge.alt}
                            className={styles.liveBadgeImage}
                            src={badge.src}
                            loading="lazy"
                            decoding="async"
                        />
                    </Link>
                </li>
            ))}
        </ul>
    );
}
