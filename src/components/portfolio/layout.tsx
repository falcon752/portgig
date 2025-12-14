"use client";

import { ReactNode, useEffect, useRef } from "react";

type DraftStore = Record<string, any>;

export default function PortfolioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const drafts = useRef<DraftStore>({});

  // load drafts once
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-drafts");
    if (saved) drafts.current = JSON.parse(saved);
  }, []);

  // expose globally INSIDE portfolio scope
  useEffect(() => {
    (window as any).__PORTFOLIO_DRAFTS__ = {
      get(key: string) {
        return drafts.current[key] ?? null;
      },
      set(key: string, value: any) {
        drafts.current[key] = value;
        localStorage.setItem(
          "portfolio-drafts",
          JSON.stringify(drafts.current)
        );
      },
      clear(key: string) {
        delete drafts.current[key];
        localStorage.setItem(
          "portfolio-drafts",
          JSON.stringify(drafts.current)
        );
      },
    };
  }, []);

  return <>{children}</>;
}
