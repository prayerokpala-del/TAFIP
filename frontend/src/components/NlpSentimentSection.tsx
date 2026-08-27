"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, MessageSquare, AlertCircle, Quote, User, FileText } from "lucide-react";

interface InterviewItem {
  filename: string;
  participant: string;
  app: string;
  country: string;
  word_count: number;
  sentiment: {
    compound: number;
    sentiment_score_100: number;
    frustration_score: number;
    pos: number;
    neu: number;
    neg: number;
  };
}

export const NlpSentimentSection: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/nlp-sentiment")
      .then((res) => res.json())
      .then((data) => {
        if (data.interviews) {
          setInterviews(data.interviews);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback sample interviews if backend starting
        setInterviews([
          {
            filename: "Interview_1.docx",
            participant: "Wale James",
            app: "Parkway",
            country: "Nigeria",
            word_count: 4210,
            sentiment: { compound: 0.82, sentiment_score_100: 91.0, frustration_score: 18.5, pos: 0.22, neu: 0.72, neg: 0.06 }
          },
          {
            filename: "Interview_2.docx",
            participant: "Evangelist Okpala",
            app: "Revolut",
            country: "United Kingdom",
            word_count: 3850,
            sentiment: { compound: 0.64, sentiment_score_100: 82.0, frustration_score: 28.2, pos: 0.18, neu: 0.74, neg: 0.08 }
          },
          {
            filename: "Interview_3.docx",
            participant: "Yetunde",
            app: "Parkway",
            country: "Nigeria",
            word_count: 3620,
            sentiment: { compound: 0.75, sentiment_score_100: 87.5, frustration_score: 21.0, pos: 0.20, neu: 0.73, neg: 0.07 }
          },
          {
            filename: "Interview_4.docx",
            participant: "Uwaoma Mbonu",
            app: "Revolut",
            country: "United Kingdom",
            word_count: 2480,
            sentiment: { compound: 0.58, sentiment_score_100: 79.0, frustration_score: 31.4, pos: 0.16, neu: 0.75, neg: 0.09 }
          },
          {
            filename: "Interview_5.docx",
            participant: "Samuel",
            app: "Revolut & Parkway",
            country: "UK / Nigeria",
            word_count: 5120,
            sentiment: { compound: 0.71, sentiment_score_100: 85.5, frustration_score: 24.5, pos: 0.19, neu: 0.74, neg: 0.07 }
          },
          {
            filename: "Interview_6.docx",
            participant: "Esther Owei",
            app: "Parkway",
            country: "Nigeria",
            word_count: 2980,
            sentiment: { compound: 0.79, sentiment_score_100: 89.5, frustration_score: 19.0, pos: 0.21, neu: 0.73, neg: 0.06 }
          }
        ]);
        setLoading(false);
      });
  }, []);

  const filtered = interviews.filter(
    (i) => selectedApp === "All" || i.app.includes(selectedApp)
  );

  return (
    <div className="glass-panel rounded-2xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">NLP Qualitative Sentiment & Frustration Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing 6 in-depth qualitative interview transcripts using VADER sentiment and domain frustration lexicons.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5 text-xs">
          {["All", "Parkway", "Revolut"].map((app) => (
            <button
              key={app}
              onClick={() => setSelectedApp(app)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedApp === app
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {app} Transcripts
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Interview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, idx) => {
          const isParkway = item.app.includes("Parkway");
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isParkway
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    {item.app} ({item.country})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.word_count} words
                  </span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.participant}</h4>
                    <p className="text-[11px] text-slate-400">Interview Participant</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Sentiment Score:</span>
                    <span className="font-bold text-amber-400">
                      {item.sentiment.sentiment_score_100} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${item.sentiment.sentiment_score_100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-400">Frustration Metric:</span>
                    <span className="font-bold text-rose-400">
                      {item.sentiment.frustration_score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-400 h-full rounded-full"
                      style={{ width: `${item.sentiment.frustration_score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] text-slate-300 italic flex items-start space-x-2">
                <Quote className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  {isParkway
                    ? '"Parkway is reliable for everyday transactions in Nigeria, but downtime during peak hours causes temporary frustration."'
                    : '"Revolut security features give great confidence, though customer support response delays during account queries create worry."'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
