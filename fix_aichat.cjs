const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

const target = `          {/* TAB 1: AI Chat Triage Interface */}
          <TabsContent value="chat" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MedicalChatInterface initialSymptom={promptSymptom} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>`;

const replacement = `          {/* TAB 1: AI Chat Triage Interface */}
          <TabsContent value="chat" className="mt-0 focus-visible:outline-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <MedicalChatInterface initialSymptom={promptSymptom} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* TAB 1B: Stream Chat Interface */}
          <TabsContent value="aichat" className="mt-0 focus-visible:outline-hidden">
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
          </TabsContent>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Index.tsx', content);
