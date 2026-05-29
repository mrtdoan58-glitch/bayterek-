"use client";
import React, { useEffect, useState } from "react";
import { useFrek } from "@/components/runtime/FrequencyProvider";
import { FREQUENCIES } from "@/lib/ontology";

export function ProgressLine() {
  const { onto } = useFrek();
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      setP((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 || 0);
    };
    addEventListener("scroll", fn);
    return () => removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, height: 2, zIndex: 100, width: `${p}%`,
      background: FREQUENCIES[onto.mode].accent2, opacity: 0.7,
      transition: "width .1s linear, background 1s",
    }} />
  );
}
