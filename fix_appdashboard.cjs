const fs = require('fs');

let content = fs.readFileSync('src/pages/AppDashboard.tsx', 'utf8');

// Rename Index to AppDashboard
content = content.replace(/const Index: React\.FC = \(\) => {/, 'const AppDashboard: React.FC = () => {');
content = content.replace(/export default Index;/, 'export default AppDashboard;');

// Remove showHero state
content = content.replace(/const \[showHero, setShowHero\] = useState<boolean>\(true\);\n/, '');

// Remove everything in {showHero && (...)} completely.
// Since regexing nested braces is hard, let's use string manipulation

const heroSectionStart = content.indexOf('{showHero && (');
if (heroSectionStart !== -1) {
  const mainWorkspaceLayoutStart = content.indexOf('{/* Main Workspace Layout */}');
  
  if (mainWorkspaceLayoutStart !== -1) {
    // Cut out the hero and landing page content
    const toRemove = content.substring(heroSectionStart, mainWorkspaceLayoutStart);
    content = content.replace(toRemove, '');
  }
}

// Remove {!showHero && (
content = content.replace(/{!showHero && \(\n\s*<main/, '<main');
// We have an extra )} at the end before footer
content = content.replace(/<\/main>\n\s*\)}/, '</main>');

// Footer replacement
content = content.replace(/{showHero \? <LandingFooter \/> : \(/, '');
content = content.replace(/<\/footer>\n\s*\)}/, '</footer>');

fs.writeFileSync('src/pages/AppDashboard.tsx', content);
