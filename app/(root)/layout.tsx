import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import SideBar from "@/components/SideBar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      <SideBar  />
      <section className="flex flex-col h-full flex-1">
        <MobileNavigation /> <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
