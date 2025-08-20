import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import SideBar from "@/components/SideBar";
import { getCurrentUser } from "@/utils/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-up");
  return (
    <main className="flex h-screen">
      <SideBar {...currentUser} />
      <section className="flex flex-col h-full flex-1">
        <MobileNavigation {...currentUser} /> <Header {...currentUser} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
}
