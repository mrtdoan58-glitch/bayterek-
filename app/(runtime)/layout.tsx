"use client";
// =====================================================================
// RUNTIME LAYOUT — SÜREKLİ EVREN SHELL'İ
// EN KRİTİK DOSYA: Dünya Ağacı, atmosfer, nav burada yaşar.
// Route değiştiğinde {children} değişir; bu shell ASLA unmount olmaz.
// "route = bakış açısı, runtime = sürekli dünya"
// =====================================================================

import React from "react";
import { FrequencyProvider } from "@/components/runtime/FrequencyProvider";
import { WorldTree } from "@/components/worldtree/WorldTree";
import { AtmosphereLayer, GrainLayer, RecoveryFlash } from "@/components/ritual/AtmosphereLayer";
import { CosmicNav, MobileNav } from "@/components/navigation/CosmicNav";
import { MythMemory, MemoryTrigger } from "@/components/memory/MythMemory";
import { ProgressLine } from "@/components/runtime/ProgressLine";

export default function RuntimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <FrequencyProvider>
      <div className="runtime-shell">
        {/* daimî katmanlar — route değişiminde unmount OLMAZ */}
        <ProgressLine />
        <AtmosphereLayer />
        <GrainLayer />
        <WorldTree />
        <CosmicNav />

        {/* yalnızca bu kısım route'a göre değişir (perspektif) */}
        {children}

        {/* daimî üst katmanlar */}
        <RecoveryFlash />
        <MemoryTrigger />
        <MythMemory />
        <MobileNav />
      </div>
    </FrequencyProvider>
  );
}
