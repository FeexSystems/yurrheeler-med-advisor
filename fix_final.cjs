const fs = require('fs');
let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// I need to find the <main> block and replace everything up to <TabsList>
const startIndex = content.indexOf('<main className');
const tabsListIndex = content.indexOf('<TabsTrigger', startIndex);

if (startIndex !== -1 && tabsListIndex !== -1) {
  // Find the `<TabsList...>` tag that precedes `<TabsTrigger`
  const beforeTabsTrigger = content.substring(0, tabsListIndex);
  const tabsListStart = beforeTabsTrigger.lastIndexOf('<TabsList');
  
  if (tabsListStart !== -1) {
    const toReplace = content.substring(startIndex, tabsListStart);
    const newHeader = `<main className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-64px)]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Clinical Triage & Specialist Hub
                    </h2>
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] sm:text-xs font-bold py-0.5 px-2">
                      Live
                    </Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Multi-agent medical consultation, automated clinical summaries, and biomarker risk analytics.
                  </p>
                </div>
                
                <a 
                  href="/clinical-space" 
                  className="shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Clinical Space (3D)</span>
                </a>
              </div>
              
              <div className="w-full relative">
                <ScrollArea className="w-full whitespace-nowrap -mb-px">
                  `;
                  
    content = content.replace(toReplace, newHeader);
  }
}

// Now replace TabsList class
content = content.replace(/<TabsList className="[^"]*">/, '<TabsList className="w-full justify-start bg-transparent border-none p-0 h-auto flex rounded-none gap-4">');

// Now we fix the closing of the tabs list, scroll area, and main content area.
// Let's find </TabsList>
const tabsListEndIndex = content.indexOf('</TabsList>');
const mainContentEndIndex = content.indexOf('{/* Main Content Area */}');

if (tabsListEndIndex !== -1 && mainContentEndIndex !== -1) {
  // Replace everything between </TabsList> and {/* Main Content Area */}
  const toReplaceEnd = content.substring(tabsListEndIndex, mainContentEndIndex);
  const newEnd = `</TabsList>
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          `;
  content = content.replace(toReplaceEnd, newEnd);
}

fs.writeFileSync('src/pages/Index.tsx', content);
