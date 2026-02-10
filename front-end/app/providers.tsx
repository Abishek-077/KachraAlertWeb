"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./lib/auth-context";
import { LanguageProvider } from "./lib/language-context";
import MotionStudio from "./_components/MotionStudio";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <AuthProvider>
          <MotionStudio>{children}</MotionStudio>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
