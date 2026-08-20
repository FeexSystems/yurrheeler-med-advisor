const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Add import
if (!content.includes('SaaSProductShowcase')) {
  content = content.replace('import { HighlightedFeature } from "@/components/landing/HighlightedFeature";', 
  'import { HighlightedFeature } from "@/components/landing/HighlightedFeature";\nimport SaaSProductShowcase from "@/components/landing/SaaSProductShowcase";');
}

// Replace in JSX
content = content.replace('<HighlightedFeature />', '<SaaSProductShowcase />');

fs.writeFileSync('src/pages/Index.tsx', content);
