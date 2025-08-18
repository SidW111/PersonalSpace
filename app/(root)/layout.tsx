import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen">
      SideBar
      <section className="flex flex-col h-full flex-1">
        Mobile Nav header
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
