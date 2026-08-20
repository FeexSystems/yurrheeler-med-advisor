const fs = require('fs');

let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Add LandingFooter import
const importsToAdd = `
import { LandingFooter } from "@/components/landing/LandingFooter";
`;
index = index.replace('import { FAQ } from "@/components/landing/FAQ";', 'import { FAQ } from "@/components/landing/FAQ";' + importsToAdd);

// Find the start of the footer
const footerStartStr = `{/* Comprehensive Medical Footer */}`;

let parts = index.split(footerStartStr);
if (parts.length === 2) {
  let newStructure = `
      {/* Comprehensive Medical Footer */}
      {showHero ? <LandingFooter /> : (
${parts[1].replace(/<footer[\s\S]+<\/footer>/, function(match) { return match; })}
      )}
    </div>
  );
};
export default Index;
`;

  // Wait, I need to match everything from footer to end.
  // Actually simpler:
  // fs.writeFileSync('src/pages/Index.tsx', parts[0] + "\n      {/* Comprehensive Medical Footer */}\n      {showHero ? <LandingFooter /> : (" + parts[1].replace('    </div>\n  );\n};\nexport default Index;', '      )}\n    </div>\n  );\n};\nexport default Index;'));
}

