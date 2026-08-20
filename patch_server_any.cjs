const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/catch \(aiError: any\)/g, 'catch (aiError: unknown)');
code = code.replace(/catch \(error: any\)/g, 'catch (error: unknown)');

// Also I should make sure the error message access is safe for unknown types
code = code.replace(/aiError\.message \|\| aiError/g, '(aiError as Error).message || aiError');
code = code.replace(/error\.message\?\.includes/g, '(error as Error).message?.includes');

fs.writeFileSync('server.ts', code);
