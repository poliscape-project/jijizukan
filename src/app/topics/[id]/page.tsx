import React from "react";
import { notFound } from "next/navigation";
import { getAllTopics, getTopicById } from "@/lib/topics";
import { TopicDetailView } from "@/components/TopicDetailView";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const topic = getTopicById(id);
  if (!topic) {
    return { title: "トピックが見つかりません | 時事図鑑" };
  }
  return {
    title: topic.title,
    description: topic.subtitle,
    openGraph: {
      title: `${topic.title} | 時事図鑑`,
      description: topic.subtitle,
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.title} | 時事図鑑`,
      description: topic.subtitle,
    },
  };
}

export default async function TopicDetailPage({ params }: PageProps) {
  const { id } = await params;
  const topic = getTopicById(id);

  if (!topic) {
    notFound();
  }

  return <TopicDetailView topic={topic} />;
}
