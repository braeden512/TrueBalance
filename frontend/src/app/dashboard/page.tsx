"use client";

import AuthWrapper from "@/components/AuthWrapper";

export default function DashboardPage() {
  return (
    // authwrapper ensures that they have to be logged in to see it
    <AuthWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Dashboard text boom</p>
      </div>
    </AuthWrapper>
  );
}