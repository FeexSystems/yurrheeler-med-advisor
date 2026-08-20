const fs = require('fs');

let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Add imports for landing components
const importsToAdd = `
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HighlightedFeature } from "@/components/landing/HighlightedFeature";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
`;

index = index.replace('import { useClinicalStore } from "@/clinical/store";', 'import { useClinicalStore } from "@/clinical/store";' + importsToAdd);

// Change `showHero` logic: 
// When showHero is true: render HeroSection, HighlightedFeature, FeaturesGrid, Testimonials, FAQ, Footer
// When showHero is false (i.e. App started): render just the Tabs

// Actually, looking at it, let's just make the "Start AI Consultation" click set showHero to false.
index = index.replace(
  'onStartConsultation={() => setActiveTab("chat")}',
  'onStartConsultation={() => { setActiveTab("chat"); setShowHero(false); }}'
);

index = index.replace(
  'onExploreAgents={() => setActiveTab("agents")}',
  'onExploreAgents={() => { setActiveTab("agents"); setShowHero(false); }}'
);

index = index.replace(
  'onExploreAnatomy={() => setActiveTab("anatomy")}',
  'onExploreAnatomy={() => { setActiveTab("anatomy"); setShowHero(false); }}'
);

index = index.replace(
  'setPromptSymptom(symptom);',
  'setPromptSymptom(symptom);\n    setShowHero(false);'
);

// We need to wrap the <main> block in `!showHero && (`
// Let's replace the whole structure. It's safer to use string replacement.

const mainStartStr = `      {/* Main Workspace Layout */}`;
const footerStartStr = `      {/* Comprehensive Medical Footer */}`;

let parts = index.split(mainStartStr);
let mainAndFooter = parts[1];
let parts2 = mainAndFooter.split(footerStartStr);
let mainWorkspace = parts2[0];
let footer = parts2[1];

let newStructure = `
      {/* Landing Page Content */}
      {showHero && (
        <>
          <HighlightedFeature />
          <FeaturesGrid />
          <Testimonials />
          <FAQ />
        </>
      )}

      {/* Main Workspace Layout */}
      {!showHero && (
        ${mainWorkspace}
      )}

      {/* Comprehensive Medical Footer */}
${footerStartStr}
${footer}
`;

fs.writeFileSync('src/pages/Index.tsx', parts[0] + newStructure);
