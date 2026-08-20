const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// The block to replace starts from <main... to <TabsList...
const oldHeader = `<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"><Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Sub-Header / Tab Navigation Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Clinical Triage & Specialist Intelligence Hub
                </h2>
                <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-xs font-bold py-0.5">
                  Live
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
                Multi-agent medical consultation, automated clinical summaries, and biomarker risk analytics.
              </p>
            </div>

            {/* Navigation Tabs Pill Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <TabsList className="bg-slate-200/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-300/80 dark:border-slate-700 flex flex-wrap h-auto gap-1">`;

const newHeader = `<main className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950">
        {/* Header Section */}
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
              
              {/* Origin UI Style Horizontal Navigation Menu */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="w-full relative">
                  <ScrollArea className="w-full whitespace-nowrap -mb-px">
                    <TabsList className="w-full justify-start bg-transparent border-none p-0 h-auto flex rounded-none gap-2">`;

content = content.replace(oldHeader, newHeader);

const oldTabsListEnd = `              </TabsList>
            </div>`;

const newTabsListEnd = `              </TabsList>
                    <ScrollBar orientation="horizontal" className="hidden" />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">`;

content = content.replace(oldTabsListEnd, newTabsListEnd);

// Ensure we fix the old error of having an extra </div>
content = content.replace('          </div>\n        </Tabs>\n      </main>', '        </Tabs>\n      </main>');

// The tabs trigger class might still have pill styles, let's update it to the Origin UI nav style (underline or nice pill)
const currentTrigger = `className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:text-slate-900 dark:hover:text-slate-200 transition-all border border-transparent data-[state=active]:shadow-sm flex-shrink-0"`;
const originUITrigger = `className="data-[state=active]:border-b-blue-600 dark:data-[state=active]:border-b-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 border-b-2 border-transparent rounded-none px-1 py-4 font-medium text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2 flex-shrink-0"`;

content = content.replaceAll(currentTrigger, originUITrigger);
// For chat/aichat which might have had a different class if I missed them:
content = content.replaceAll(/className="[^"]*data-\[state=active\]:shadow-sm[^"]*"/g, originUITrigger);

fs.writeFileSync('src/pages/Index.tsx', content);
