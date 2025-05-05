"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabItem<T extends string> {
  key: T;
  label: string;
  disabled?: boolean;
  className?: string;
  borderColor?: string; // Nueva propiedad
}

interface TabCardProps<T extends string> {
  title: string;
  tabItems: ReadonlyArray<TabItem<T>>;
  tabComponents: Record<T, React.ComponentType>;
  defaultTab: T;
  tabClassName?: (tab: TabItem<T>, activeTab: T) => string;
}

export function TabCard<T extends string>({ title, tabItems, tabComponents, defaultTab, tabClassName }: TabCardProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);
  const Component: React.ComponentType = tabComponents[activeTab];

  return (
    <div className="relative bg-card h-full">
      <main className="mx-auto sm:px-6 lg:px-8 py-6 max-w-8xl">
        <div className="px-4 sm:px-6 py-5">
          <h2 className="font-semibold text-secondary-foreground text-2xl">{title}</h2>
        </div>

        <div className="gap-6 grid grid-cols-1 lg:grid-cols-4 mt-6">
          <div className="lg:col-span-1">
            <nav className="space-y-1 bg-card shadow p-4 border rounded-lg">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => !tab.disabled && setActiveTab(tab.key)}
                  disabled={tab.disabled}
                  className={
                    tabClassName
                      ? tabClassName(tab, activeTab)
                      : cn(
                          "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md",
                          activeTab === tab.key ? "bg-secondary text-secondary-foreground" : "text-secondary-foreground hover:bg-secondary",
                          tab.borderColor // Añadimos el color del borde aquí también
                        )
                  }
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-card shadow p-4 border rounded-lg text-primary-foreground">
              <Component />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
