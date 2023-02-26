#!/usr/bin/env bash
set -euo pipefail

yarn i18next \"libs/ui-lib/src/**/*.{js,jsx,ts,tsx}\" -c ./scripts/i18next-parser.config.js;

find libs/locales/lib -type f -exec sed -i 's#": "ai:#": "#' {} \;
