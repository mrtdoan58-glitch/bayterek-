"use client";
// route -> runtime frekansı senkronu. Route = bakış açısı.
import { useEffect } from "react";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FrequencyKey } from "@/lib/ontology";
import { EntityView } from "@/components/frequency/EntityView";

export function FrequencySync({ mode }: { mode: FrequencyKey }) {
  const { onto, setMode } = useFrek();
  useEffect(() => {
    if (onto.mode !== mode) setMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  return <EntityView />;
}
