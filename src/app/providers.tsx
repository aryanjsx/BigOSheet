"use client";

import { ProgressProvider } from "@/context/ProgressContext";
import { SheetProvider } from "@/context/SheetContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <SheetProvider>{children}</SheetProvider>
    </ProgressProvider>
  );
}
