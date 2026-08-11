import { createConfig } from "remark-config-nick2bad4u";

import remarkLintRuleDocHeadings from "./scripts/remark-lint-rule-doc-headings.mjs";

/** @type {import("remark-config-nick2bad4u").RemarkConfig} */
const remarkConfig = createConfig({
    plugins: [remarkLintRuleDocHeadings],
    settings: {},
});

export default remarkConfig;
