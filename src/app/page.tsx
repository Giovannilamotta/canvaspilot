"use client";

import AppLayout from "@/components/layout/AppLayout";
import DataLoader from "@/components/layout/DataLoader";

export default function Home() {
  return (
    <DataLoader>
      <AppLayout />
    </DataLoader>
  );
}
