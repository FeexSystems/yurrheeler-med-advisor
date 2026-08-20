import React, { useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, Bot, User, Loader2, Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { Mic, MicOff, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";

export function AiChatInterface() {
  const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, isLoading, reload, stop } = useChat({
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

  const { isListening, hasSupport, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      setInput((prev) => prev + (prev ? " " : "") + transcript);
    },
  });
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">AI Stream Chat</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Vercel AI SDK & Gemini</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessages([])}
            className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 h-8 text-xs font-medium"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Chat
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setMessages([{
                id: Date.now().toString(),
                role: "assistant",
                content: "Hello. I am the YurrheelerMed Clinical Intelligence Assistant. How can I assist with your triage evaluation today?",
              }]);
              setInput("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs font-medium"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            New Chat
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role !== "user" && (
                <Avatar className="w-8 h-8 shrink-0 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                }`}
              >
                <ReactMarkdown
                  className={`prose prose-sm max-w-none ${
                    message.role === "user" ? "prose-invert" : "dark:prose-invert"
                  }`}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {message.role === "user" && (
                <Avatar className="w-8 h-8 shrink-0 bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 shrink-0 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Analyzing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-end gap-2">
          
          {hasSupport && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`shrink-0 h-11 w-11 rounded-full border-slate-200 dark:border-slate-700 transition-colors ${
                isListening 
                  ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100 dark:bg-red-900/30 dark:border-red-800/50 dark:hover:bg-red-900/50' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300'
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-pulse" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}

          <div className="flex-1 relative bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl flex items-end overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isLoading) {
                    const form = e.currentTarget.form;
                    if (form) form.requestSubmit();
                  }
                }
              }}
              placeholder="Message YurrheelerMed..."
              className="flex-1 max-h-48 min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 pl-5 pr-14 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none scrollbar-thin"
              rows={1}
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-8 w-8 text-slate-500 hover:text-red-500 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
                  onClick={stop}
                >
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                messages.length > 1 && !input.trim() && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="rounded-full h-8 w-8 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm"
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
                disabled={isLoading || !input.trim()}
                className={`rounded-full h-8 w-8 shrink-0 transition-all ${
                  input.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm scale-105' 
                    : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'
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
