const fs = require('fs');
let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Import AiChatInterface
const newImport = 'import { AiChatInterface } from "@/components/chat/AiChatInterface";\n';
content = content.replace('import { MedicalChatInterface }', newImport + 'import { MedicalChatInterface }');

// Add tab trigger
const tabTriggerStr = `
                <TabsTrigger
                  value="aichat"
                  className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-lg text-xs font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  <span>Stream Chat</span>
                </TabsTrigger>
`;
content = content.replace('<span>Triage Chat</span>\n                </TabsTrigger>', '<span>Triage Chat</span>\n                </TabsTrigger>' + tabTriggerStr);

// Add tab content
const tabContentStr = `
          {/* TAB AI Stream Chat */}
          <TabsContent value="aichat" className="mt-0 focus-visible:outline-none">
            <AnimatePresence mode="wait">
              <motion.div
                key="aichat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <AiChatInterface />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
`;
content = content.replace('          {/* TAB 2: Triage Records */}', tabContentStr + '          {/* TAB 2: Triage Records */}');

fs.writeFileSync('src/pages/Index.tsx', content);
