import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          {/* Bal oldali sáv */}
          <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Teljesen kiterjesztett munkaterület */}
          <SidebarInset>
            {/* Opcionális felső sáv az oldalsáv nyitó/csukó gombjával */}
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <span className="text-sm font-medium">GraphRAG Dashboard</span>
              <ModeToggle />
            </header>

            {/* Fő tartalom - teljes szélességben */}
            <main className="flex-1 p-6 w-full ">
              {activeTab === "dashboard" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">GraphRAG Munkaterület</h1>
                  <p className="text-muted-foreground mt-1">
                    Itt fog megjelenni a kiválasztott menüpont tartalma.
                  </p>
                </div>
              )}

              {activeTab === "home" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">GraphRAG Chatbot</h1>
                  <p className="text-muted-foreground">
                    Itt építjük fel a keresőt és a chatet.
                  </p>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Dokumentumkezelő</h1>
                  <p className="text-muted-foreground">
                    Dokumentumok feltöltése és kezelése.
                  </p>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Settings</h1>
                  <p className="text-muted-foreground">
                    Itt lesznek majd a beállítások
                  </p>
                </div>
              )}

              {activeTab === "help" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Segítség</h1>
                  <p className="text-muted-foreground">Itt lesz a segítség</p>
                </div>
              )}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
