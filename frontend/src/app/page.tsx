"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { ProductOverviewCards } from "@/components/ProductOverviewCards";
import { BarChartSection } from "@/components/BarChartSection";
import { RadarChartSection } from "@/components/RadarChartSection";
import { ModelAccuracyChartSection } from "@/components/ModelAccuracyChartSection";
import { WordCloudSection } from "@/components/WordCloudSection";
import { HeatmapSection } from "@/components/HeatmapSection";
import { TrustPredictorSection } from "@/components/TrustPredictorSection";
import { CsvUploadModal } from "@/components/CsvUploadModal";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  const fetchSummary = () => {
    fetch("http://localhost:8000/api/dashboard-summary")
      .then((res) => res.json())
      .then((data) => {
        if (data.total_samples) {
          setSummaryData(data);
        }
      })
      .catch(() => {
        // Zero state
      });
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onOpenUpload={() => setIsUploadOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          onOpenUpload={() => setIsUploadOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-10">
          <div id="overview">
            <ProductOverviewCards summary={summaryData} />
          </div>
          <BarChartSection summary={summaryData} />
          <RadarChartSection />
          <ModelAccuracyChartSection />
          <WordCloudSection />
          <HeatmapSection />
          <TrustPredictorSection />
        </main>
      </div>

      <CsvUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={() => fetchSummary()}
      />
    </div>
  );
}
