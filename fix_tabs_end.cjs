const fs = require('fs');
let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

const target = `              </TabsList>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
          
          {/* Main Content Area */}
          <div className="min-w-0 flex flex-col">`;

const replacement = `              </TabsList>
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/Index.tsx', content);
