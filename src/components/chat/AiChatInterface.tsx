import React, { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, Loader2, Sparkles, RefreshCw, X, Mic, MicOff, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

export function AiChatInterface() {
  const { 
    messages = [], 
    setMessages, 
    input = "", 
    setInput, 
    handleInputChange, 
    handleSubmit, 
    isLoading = false, 
    reload, 
    stop 
  } = useChat({
    api: "/api/ai-chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello. I am the YurrheelerMed Clinical Intelligence Assistant. How can I assist with your triage evaluation today?",
      },
    ],
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const safeInput = typeof input === "string" ? input : "";

  const { isListening, hasSupport, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      if (setInput) {
        setInput((prev) => (prev ? prev + " " : "") + transcript);
      }
    },
  });
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [safeInput]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[650px] w-full max-w-4xl mx-auto border border-white/10 rounded-2xl overflow-hidden bg-[#090d14] shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Clinical Stream Synthesis</h3>
            <p className="text-[11px] text-slate-400">Powered by Gemini & Real-time AI Stream</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages?.([])}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-white/10 h-8 text-xs font-medium"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMessages?.([{
                id: Date.now().toString(),
                role: "assistant",
                content: "Hello. I am the YurrheelerMed Clinical Intelligence Assistant. How can I assist with your triage evaluation today?",
              }]);
              if (setInput) setInput("");
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold h-8 text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            New Stream
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6 max-w-3xl mx-auto py-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role !== "user" && (
                <Avatar className="w-8 h-8 shrink-0 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <AvatarFallback className="bg-emerald-950 text-emerald-300 font-bold"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "bg-emerald-600 text-slate-950 font-medium ml-auto"
                    : "bg-slate-900/80 border border-white/10 text-slate-100 shadow-sm"
                }`}
              >
                <div
                  className={`prose prose-sm max-w-none ${
                    message.role === "user" ? "prose-neutral text-slate-950" : "prose-invert text-slate-200"
                  }`}
                >
                  <ReactMarkdown>
                    {message.content || ""}
                  </ReactMarkdown>
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 shrink-0 bg-slate-800 border border-white/10 text-slate-300">
                  <AvatarFallback className="bg-slate-800 text-slate-300"><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 shrink-0 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                <AvatarFallback className="bg-emerald-950 text-emerald-300 font-bold"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-xs text-slate-400">Synthesizing clinical response...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 pt-2 border-t border-white/10 bg-[#090d14]">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
          {hasSupport && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`shrink-0 h-11 w-11 rounded-xl border-white/10 transition-colors ${
                isListening 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30' 
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-pulse text-rose-400" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}

          <div className="flex-1 relative bg-slate-900/90 border border-white/15 rounded-2xl flex items-end overflow-hidden focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              value={safeInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (safeInput.trim() && !isLoading) {
                    const form = e.currentTarget.form;
                    if (form) form.requestSubmit();
                  }
                }
              }}
              placeholder="Describe symptoms or clinical inquiry..."
              className="flex-1 max-h-48 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 pl-4 pr-16 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none scrollbar-thin"
              rows={1}
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-xl h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  onClick={() => stop?.()}
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                messages.length > 1 && !safeInput.trim() && reload && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="rounded-xl h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    onClick={() => reload()}
                    title="Regenerate last response"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )
              )}
              
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !safeInput.trim()}
                className={`rounded-xl h-8 w-8 shrink-0 transition-all ${
                  safeInput.trim() 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
