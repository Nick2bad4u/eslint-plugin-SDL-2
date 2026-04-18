import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import GitHubStats from "../components/GitHubStats";

import styles from "./index.module.css";

type HeroBadge = {
    readonly description: string;
    readonly icon: string;
    readonly label: string;
};

type HeroStat = {
    readonly description: string;
    readonly headline: string;
    readonly toneClassName:
        | "heroStatAnalysis"
        | "heroStatDesign"
        | "heroStatMaintenance";
};

type LifecycleStep = {
    readonly className:
        | "phaseAnalysis"
        | "phasePlanning"
        | "phaseDesign"
        | "phaseDevelopment"
        | "phaseTesting"
        | "phaseMaintenance";
    readonly label: string;
};

type HomeCard = {
    readonly description: string;
    readonly icon: string;
    readonly title: string;
    readonly to: string;
    readonly toneClassName:
        | "cardTonePlanning"
        | "cardToneDevelopment"
        | "cardToneMaintenance";
};

const heroBadges: readonly HeroBadge[] = [
    {
        description:
            "The docs theme mirrors the six-stage wheel in the project logo, from analysis through maintenance.",
        icon: "\uf0ad",
        label: "SDL lifecycle aligned",
    },
    {
        description:
            "Coverage spans browser, Node, Electron, Angular, AngularJS, and Trusted Types surfaces.",
        icon: "\uf135",
        label: "Cross-stack security coverage",
    },
    {
        description:
            "Presets, remediation docs, and safe suggestions help teams roll rules out incrementally.",
        icon: "\ue73d",
        label: "Practical adoption path",
    },
];

const heroStats: readonly HeroStat[] = [
    {
        description:
            "Current checked-in SDL and platform-hardening rules in the plugin source.",
        headline: "🛡 52 SDL rules",
        toneClassName: "heroStatAnalysis",
    },
    {
        description:
            "Layer common, framework, runtime, and policy presets to match your codebase.",
        headline: "🧩 9 presets",
        toneClassName: "heroStatDesign",
    },
    {
        description:
            "A focused set of rules opportunistically uses parser services when full TypeScript data is available.",
        headline: "🧠 6 type-assisted rules",
        toneClassName: "heroStatMaintenance",
    },
];

const lifecycleSteps: readonly LifecycleStep[] = [
    { className: "phaseAnalysis", label: "1 · Analysis" },
    { className: "phasePlanning", label: "2 · Planning" },
    { className: "phaseDesign", label: "3 · Design" },
    { className: "phaseDevelopment", label: "4 · Development" },
    { className: "phaseTesting", label: "5 · Testing" },
    { className: "phaseMaintenance", label: "6 · Maintenance" },
];

const overviewButtonIcon = "\udb81\udf1d";
const comparePresetsButtonIcon = "\udb85\udc92";
const heroKickerIcon = "\uf0ad";
const heroKickerIcon2 = "\uf135";

const homeCards: readonly HomeCard[] = [
    {
        description:
            "Install the plugin, enable a preset, and start with the SDL overview and first security checks.",
        icon: "\uf135",
        title: "Get Started",
        to: "/docs/rules/getting-started",
        toneClassName: "cardTonePlanning",
    },
    {
        description:
            "Adopt common rules first, then layer framework and runtime-specific protections where they apply.",
        icon: "\ue690",
        title: "Presets",
        to: "/docs/rules/presets",
        toneClassName: "cardToneDevelopment",
    },
    {
        description:
            "Browse every SDL rule with focused examples, rationale, and remediation guidance.",
        icon: "\uf02d",
        title: "Rule Reference",
        to: "/docs/rules/overview",
        toneClassName: "cardToneMaintenance",
    },
];

/** Render the Docusaurus documentation homepage experience. */
export default function Home() {
    const logoSrc = useBaseUrl("/img/logo.png");

    return (
        <Layout
            title="eslint-plugin-sdl-2 docs"
            description="Security-focused documentation for eslint-plugin-sdl-2"
        >
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroMain}>
                            <p className={styles.heroKicker}>
                                {`${heroKickerIcon} SDL lifecycle-aware security linting ${heroKickerIcon2}`}
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                eslint-plugin-sdl-2
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                SDL-oriented ESLint rules that flag insecure
                                APIs and unsafe patterns across browser, Node,
                                Electron, Angular, AngularJS, and related
                                application surfaces.
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        key={badge.label}
                                        className={styles.heroBadge}
                                    >
                                        <p className={styles.heroBadgeLabel}>
                                            <span
                                                aria-hidden="true"
                                                className={styles.heroBadgeIcon}
                                            >
                                                {badge.icon}
                                            </span>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/overview"
                                >
                                    {overviewButtonIcon} Start with Overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/presets"
                                >
                                    {comparePresetsButtonIcon} Compare Presets
                                </Link>
                            </div>

                            <GitHubStats className={styles.heroLiveBadges} />

                            <div className={styles.heroStats}>
                                {heroStats.map((stat) => (
                                    <article
                                        key={stat.headline}
                                        className={`${styles.heroStatCard} ${styles[stat.toneClassName]}`}
                                    >
                                        <p className={styles.heroStatHeading}>
                                            {stat.headline}
                                        </p>
                                        <p
                                            className={
                                                styles.heroStatDescription
                                            }
                                        >
                                            {stat.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt="SDL lifecycle wheel logo for eslint-plugin-sdl-2"
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="1024"
                                loading="eager"
                                src={logoSrc}
                                width="1024"
                            />

                            <div className={styles.heroPanelCopy}>
                                <p className={styles.heroPanelEyebrow}>
                                    Six-phase secure development lifecycle
                                </p>
                                <p className={styles.heroPanelText}>
                                    Every rule maps to one of six lifecycle
                                    phases: analysis, planning, design,
                                    development, testing, and maintenance — so
                                    you always know exactly where in your
                                    workflow a finding applies.
                                </p>

                                <ul className={styles.phaseList}>
                                    {lifecycleSteps.map((step) => (
                                        <li
                                            key={step.label}
                                            className={`${styles.phaseChip} ${styles[step.className]}`}
                                        >
                                            {step.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.cardDeck}>
                        <div className={styles.cardGrid}>
                            {homeCards.map((card) => (
                                <article
                                    key={card.title}
                                    className={`${styles.card} ${styles[card.toneClassName]}`}
                                >
                                    <div className={styles.cardHeader}>
                                        <p className={styles.cardIcon}>
                                            {card.icon}
                                        </p>
                                        <Heading
                                            as="h2"
                                            className={styles.cardTitle}
                                        >
                                            {card.title}
                                        </Heading>
                                    </div>
                                    <p className={styles.cardDescription}>
                                        {card.description}
                                    </p>
                                    <Link
                                        className={styles.cardLink}
                                        to={card.to}
                                    >
                                        Open section →
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
