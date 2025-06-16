

#!/bin/bash

# Exit on error
set -e

# Initialize npm and install VitePress
npm init -y
npm install vitepress

# Create basic structure
mkdir -p docs/.vitepress
touch docs/index.md
touch docs/about.md

# Create config file
cat <<EOL > docs/.vitepress/config.js
export default {
  title: "Workbench",
  description: "Things I'm building, thinking about, or remembering.",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "About", link: "/about" }
    ]
  }
}
EOL
