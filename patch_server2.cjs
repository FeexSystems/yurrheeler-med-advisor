const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The replacement for the 'try' in chat didn't trigger, let's fix it:
code = code.replace(
  `    if (ai) {\n      const contents:`,
  `    if (ai) {\n      try {\n      const contents:`
);

code = code.replace(
  `    if (ai) {\n      const response = await ai.models.generateContent({`,
  `    if (ai) {\n      try {\n      const response = await ai.models.generateContent({`
);

fs.writeFileSync('server.ts', code);
