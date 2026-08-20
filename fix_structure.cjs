const fs = require('fs');

let content = fs.readFileSync('src/pages/Index.tsx', 'utf8');

const target1 = `<main className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950">
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
                <div className="w-full relative">`;

const replacement1 = `<main className="flex-1 w-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
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
              <div className="w-full relative">`;

content = content.replace(target1, replacement1);

fs.writeFileSync('src/pages/Index.tsx', content);
