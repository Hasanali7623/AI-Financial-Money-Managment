import { useState } from "react";
import { Sparkles, Send, Loader2, Brain } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAu12r5JuVgIdkloI7eL14LiwOkH630nzA");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "You are a financial adviser. Give SHORT, CONCISE answers (3-5 sentences max). Be direct and to the point. Only provide essential information without lengthy explanations.",
});

export default function AIAdviser() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Financial Adviser powered by Google Gemini. Ask me anything about personal finance, investments, budgeting, savings, or money management!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    // Add empty assistant message for streaming
    const assistantMsgIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const result = await model.generateContentStream(message);
      let fullText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;

        // Update the assistant message with streaming text
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[assistantMsgIndex] = {
            role: "assistant",
            content: fullText,
          };
          return newMessages;
        });
      }

      if (!fullText) {
        throw new Error("No response from AI");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[assistantMsgIndex] = {
          role: "assistant",
          content: `Error: ${err.message}. Please try again.`,
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            AI Financial Adviser
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-16">
          Get instant financial advice powered by Google Gemini AI
        </p>
      </div>

      {/* Chat Container */}
      <div className="card mb-4 h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      AI Adviser
                    </span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {msg.content.split("\n").map((line, i) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Handle bullet points (*, -, •)
                    if (/^[\*\-•]\s+/.test(trimmedLine)) {
                      return (
                        <li key={i} className="ml-4 mb-1">
                          {trimmedLine.replace(/^[\*\-•]\s+/, "")}
                        </li>
                      );
                    }

                    // Handle bold text **text**
                    const boldText = trimmedLine.replace(
                      /\*\*(.+?)\*\*/g,
                      "<strong>$1</strong>"
                    );

                    return (
                      <p
                        key={i}
                        className="mb-2 leading-relaxed last:mb-0"
                        dangerouslySetInnerHTML={{ __html: boldText }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about finance..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
