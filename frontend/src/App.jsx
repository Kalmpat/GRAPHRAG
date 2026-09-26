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
import { SectionCards } from "./components/section-cards";
import { DocumentManager } from "./components/document-manager";
import { MessageScrollerDemo } from "./components/messagescroller";
import { KnowledgeGraphVisualization } from "./components/visualization";

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
                  <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">

                        </div>
                
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "home" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">GraphRAG Chatbot</h1>
                <p className="text-muted-foreground"></p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className=" rounded-lg">
                    <MessageScrollerDemo />
                  </div>
                  <div className=" rounded-lg  md:col-span-2 ">
                     <KnowledgeGraphVisualization/>
                  </div>
                </div>
              </div>
            )}

              {activeTab === "documents" && (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">Document Manager</h1>
             
                  <DocumentManager/>
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
