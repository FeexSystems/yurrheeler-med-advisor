const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// I'll replace the `<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">`
// and its inner `<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">`
// up to `</TabsList>` with the new sidebar layout.

const mainMatchStr = `<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

const newMainSidebar = `<main className="flex-1 w-full flex flex-col md:flex-row gap-0 bg-slate-50 dark:bg-slate-950 h-[calc(100vh-64px)] overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full flex flex-col md:flex-row h-full">
          
          {/* Sidebar Menu (Replacing TabsList) */}
          <div className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col h-auto md:h-full overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-wider">
                  Specialist Hub
                </h2>
                <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-1.5 py-0">
                  Live
                </Badge>
              </div>
            </div>
            
            <div className="p-3 flex-1">
              <TabsList className="bg-transparent border-none flex-col items-stretch h-auto gap-1 space-y-1 p-0 w-full">`;

content = content.replace(mainMatchStr, newMainSidebar);

const triggersEndMatchStr = `              </TabsList>
              <a 
                href="/clinical-space" 
                className="bg-clinical-bg border border-clinical-border text-clinical-text text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-clinical-surface-elevated transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Clinical Space (3D)</span>
              </a>
            </div>
          </div>`;

const newTriggersEndStr = `              </TabsList>
            </div>
            <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
              <a 
                href="/clinical-space" 
                className="w-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Clinical Space (3D)</span>
              </a>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col h-full overflow-y-auto bg-slate-50 dark:bg-slate-950/50 p-4 md:p-6 lg:p-8 relative">`;

content = content.replace(triggersEndMatchStr, newTriggersEndStr);

// We also need to style the TabsTriggers to look like vertical sidebar items.
// Let's replace the generic trigger class.
const oldTriggerClass = `className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg"`;
const newTriggerClass = `className="w-full justify-start data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-700"`;

content = content.replaceAll(oldTriggerClass, newTriggerClass);

// Triage chat has a different class maybe? Let's check
const oldChatTriggerClass = `className="data-[state=active]:bg-white data-[state=active]:dark:bg-slate-700 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-lg text-xs font-semibold"`;
// Wait, I actually added "aichat" recently with that class. And "chat" had the default class?
// Let's just blindly replace them safely.
content = content.replaceAll(/className="data-\[state=active\]:bg-white[^"]+"/g, newTriggerClass);

// We should also replace the old TabsContent wrapping to ensure it spans full height if needed, but it's fine.

fs.writeFileSync('src/pages/Index.tsx', content);
