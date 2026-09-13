"use client";

import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { DashboardBody } from "@/components/dashboard/DashboardSections";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <PageContainer>
      <DashboardBody onOpenAssistant={() => router.push("/ai-assistant")} />
    </PageContainer>
  );
}
