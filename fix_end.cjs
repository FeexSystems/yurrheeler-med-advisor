const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

const target = `          </TabsContent>
        </Tabs>
      </main>`;

const replacement = `          </TabsContent>
          </div>
        </Tabs>
      </main>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/pages/Index.tsx', content);
