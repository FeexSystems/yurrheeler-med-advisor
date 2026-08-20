const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Ensure ScrollArea is imported (it is actually not imported in Index.tsx unless we check, but let's just add it if missing)
if (!content.includes('import { ScrollArea, ScrollBar }')) {
  content = content.replace('import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";', 
    'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";\nimport { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";');
}

const oldStart = `<main className="flex-1 w-full flex flex-col md:flex-row gap-0 bg-slate-50 dark:bg-slate-950 h-[calc(100vh-64px)] overflow-hidden">
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

const newStart = `<main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
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
          <a 
            href="/clinical-space" 
            className="shrink-0 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-2 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Space (3D)</span>
          </a>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="w-full relative">
            <ScrollArea className="w-full whitespace-nowrap rounded-xl bg-slate-100/80 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-800 shadow-inner">
              <TabsList className="w-full justify-start bg-transparent border-none p-0 h-auto flex rounded-none gap-1">`;

content = content.replace(oldStart, newStart);

const oldTriggerClass = `className="w-full justify-start data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent data-[state=active]:border-slate-200 dark:data-[state=active]:border-slate-700"`;
const newTriggerClass = `className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 text-slate-600 dark:text-slate-400 text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:text-slate-900 dark:hover:text-slate-200 transition-all border border-transparent data-[state=active]:shadow-sm flex-shrink-0"`;

content = content.replaceAll(oldTriggerClass, newTriggerClass);

const oldEnd = `              </TabsList>
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

const newEnd = `              </TabsList>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
          
          {/* Main Content Area */}
          <div className="min-w-0 flex flex-col">`;

content = content.replace(oldEnd, newEnd);

fs.writeFileSync('src/pages/Index.tsx', content);
