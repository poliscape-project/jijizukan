import { ImageResponse } from "next/og";
import { getAllTopics, getTopicById } from "@/lib/topics";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ビルド時に全162トピックの画像を事前生成（静的化）
export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

// カテゴリ別カラーテーマ
const categoryThemes: Record<
  string,
  {
    bgGradient: string;
    glowTopRight: string;
    glowBottomLeft: string;
    badgeBorder: string;
    accentColor: string;
  }
> = {
  // 国会・行政・内閣・政党
  parliament: {
    bgGradient: "linear-gradient(135deg, #0e1e3e 0%, #162a56 50%, #080f20 100%)",
    glowTopRight: "rgba(59, 130, 246, 0.45)",
    glowBottomLeft: "rgba(96, 165, 250, 0.25)",
    badgeBorder: "rgba(96, 165, 250, 0.8)",
    accentColor: "#60a5fa",
  },
  administration: {
    bgGradient: "linear-gradient(135deg, #0e1e3e 0%, #162a56 50%, #080f20 100%)",
    glowTopRight: "rgba(59, 130, 246, 0.45)",
    glowBottomLeft: "rgba(96, 165, 250, 0.25)",
    badgeBorder: "rgba(96, 165, 250, 0.8)",
    accentColor: "#60a5fa",
  },
  party: {
    bgGradient: "linear-gradient(135deg, #0e1e3e 0%, #162a56 50%, #080f20 100%)",
    glowTopRight: "rgba(59, 130, 246, 0.45)",
    glowBottomLeft: "rgba(96, 165, 250, 0.25)",
    badgeBorder: "rgba(96, 165, 250, 0.8)",
    accentColor: "#60a5fa",
  },
  // 選挙
  election: {
    bgGradient: "linear-gradient(135deg, #1c1842 0%, #2b2568 50%, #0e0c24 100%)",
    glowTopRight: "rgba(129, 140, 248, 0.45)",
    glowBottomLeft: "rgba(165, 180, 252, 0.25)",
    badgeBorder: "rgba(165, 180, 252, 0.8)",
    accentColor: "#a5b4fc",
  },
  // 紛争・安全保障・地政学
  conflict: {
    bgGradient: "linear-gradient(135deg, #221524 0%, #351c33 50%, #110a14 100%)",
    glowTopRight: "rgba(244, 63, 94, 0.4)",
    glowBottomLeft: "rgba(251, 113, 133, 0.25)",
    badgeBorder: "rgba(251, 113, 133, 0.8)",
    accentColor: "#fb7185",
  },
  geopolitics: {
    bgGradient: "linear-gradient(135deg, #1a1b2e 0%, #252848 50%, #0d0e1a 100%)",
    glowTopRight: "rgba(244, 63, 94, 0.35)",
    glowBottomLeft: "rgba(129, 140, 248, 0.25)",
    badgeBorder: "rgba(244, 63, 94, 0.8)",
    accentColor: "#fb7185",
  },
  // 外交・同盟・二国間・多国間
  diplomacy: {
    bgGradient: "linear-gradient(135deg, #09203f 0%, #133863 50%, #051224 100%)",
    glowTopRight: "rgba(56, 189, 248, 0.45)",
    glowBottomLeft: "rgba(14, 165, 233, 0.25)",
    badgeBorder: "rgba(56, 189, 248, 0.8)",
    accentColor: "#38bdf8",
  },
  alliance: {
    bgGradient: "linear-gradient(135deg, #09203f 0%, #133863 50%, #051224 100%)",
    glowTopRight: "rgba(56, 189, 248, 0.45)",
    glowBottomLeft: "rgba(14, 165, 233, 0.25)",
    badgeBorder: "rgba(56, 189, 248, 0.8)",
    accentColor: "#38bdf8",
  },
  bilateral: {
    bgGradient: "linear-gradient(135deg, #09203f 0%, #133863 50%, #051224 100%)",
    glowTopRight: "rgba(56, 189, 248, 0.45)",
    glowBottomLeft: "rgba(14, 165, 233, 0.25)",
    badgeBorder: "rgba(56, 189, 248, 0.8)",
    accentColor: "#38bdf8",
  },
  multilateral: {
    bgGradient: "linear-gradient(135deg, #09203f 0%, #133863 50%, #051224 100%)",
    glowTopRight: "rgba(56, 189, 248, 0.45)",
    glowBottomLeft: "rgba(14, 165, 233, 0.25)",
    badgeBorder: "rgba(56, 189, 248, 0.8)",
    accentColor: "#38bdf8",
  },
  // 経済・通商
  economy: {
    bgGradient: "linear-gradient(135deg, #062c33 0%, #0f464f 50%, #03161a 100%)",
    glowTopRight: "rgba(45, 212, 191, 0.45)",
    glowBottomLeft: "rgba(20, 184, 166, 0.25)",
    badgeBorder: "rgba(45, 212, 191, 0.8)",
    accentColor: "#2dd4bf",
  },
  trade: {
    bgGradient: "linear-gradient(135deg, #062c33 0%, #0f464f 50%, #03161a 100%)",
    glowTopRight: "rgba(45, 212, 191, 0.45)",
    glowBottomLeft: "rgba(20, 184, 166, 0.25)",
    badgeBorder: "rgba(45, 212, 191, 0.8)",
    accentColor: "#2dd4bf",
  },
  // 司法・地方政治
  judiciary: {
    bgGradient: "linear-gradient(135deg, #182234 0%, #24344d 50%, #0c121c 100%)",
    glowTopRight: "rgba(148, 163, 184, 0.4)",
    glowBottomLeft: "rgba(203, 213, 225, 0.2)",
    badgeBorder: "rgba(203, 213, 225, 0.8)",
    accentColor: "#cbd5e1",
  },
  local: {
    bgGradient: "linear-gradient(135deg, #182234 0%, #24344d 50%, #0c121c 100%)",
    glowTopRight: "rgba(148, 163, 184, 0.4)",
    glowBottomLeft: "rgba(203, 213, 225, 0.2)",
    badgeBorder: "rgba(203, 213, 225, 0.8)",
    accentColor: "#cbd5e1",
  },
  default: {
    bgGradient: "linear-gradient(135deg, #0e1e3e 0%, #162a56 50%, #080f20 100%)",
    glowTopRight: "rgba(59, 130, 246, 0.45)",
    glowBottomLeft: "rgba(96, 165, 250, 0.25)",
    badgeBorder: "rgba(96, 165, 250, 0.8)",
    accentColor: "#60a5fa",
  },
};

// ステータス別の表示スタイル
const statusStyles: Record<
  string,
  { bg: string; border: string; color: string; dot: string }
> = {
  ongoing: {
    bg: "rgba(14, 165, 233, 0.22)",
    border: "rgba(56, 189, 248, 0.7)",
    color: "#7dd3fc",
    dot: "#38bdf8",
  },
  escalating: {
    bg: "rgba(225, 29, 72, 0.22)",
    border: "rgba(251, 113, 133, 0.7)",
    color: "#fecdd3",
    dot: "#fb7185",
  },
  resolved: {
    bg: "rgba(16, 185, 129, 0.22)",
    border: "rgba(52, 211, 153, 0.7)",
    color: "#a7f3d0",
    dot: "#34d399",
  },
  stalled: {
    bg: "rgba(245, 158, 11, 0.22)",
    border: "rgba(251, 191, 36, 0.7)",
    color: "#fde68a",
    dot: "#fbbf24",
  },
  new: {
    bg: "rgba(168, 85, 247, 0.22)",
    border: "rgba(192, 132, 252, 0.7)",
    color: "#e9d5ff",
    dot: "#c084fc",
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const topic = getTopicById(id);

  if (!topic) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            background: "linear-gradient(135deg, #0a0f1d 0%, #152238 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "48px",
            fontWeight: "bold",
          }}
        >
          時事図鑑
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const theme = categoryThemes[topic.category] ?? categoryThemes["default"];
  const statusStyle =
    statusStyles[topic.status] ?? statusStyles["ongoing"];

  const scopeLabel = topic.scope === "domestic" ? "国内政治" : "国際情勢";
  const title = topic.title;
  const subtitle = topic.subtitle ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: theme.bgGradient,
          display: "flex",
          flexDirection: "column",
          padding: "52px 64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* 背景装飾光1：右上 */}
        <div
          style={{
            position: "absolute",
            top: "-140px",
            right: "-140px",
            width: "620px",
            height: "620px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.glowTopRight} 0%, transparent 68%)`,
          }}
        />

        {/* 背景装飾光2：左下 */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.glowBottomLeft} 0%, transparent 70%)`,
          }}
        />

        {/* ヘッダー：時事図鑑ロゴ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "auto",
          }}
        >
          {/* ブック・時事エンブレム */}
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f172a",
              fontSize: "20px",
              fontWeight: "900",
              boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            時事
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: "26px",
              fontWeight: "900",
              letterSpacing: "-0.5px",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            時事図鑑
          </span>
          <span
            style={{
              color: "#cbd5e1",
              fontSize: "17px",
              marginLeft: "6px",
              textShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }}
          >
            | 政治・国際情勢を事実とデータで
          </span>
        </div>

        {/* メインコンテンツエリア */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* スコープ・カテゴリ・ステータスバッジ */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* スコープ・カテゴリバッジ */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "6px 20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <span
                style={{
                  color: "#0f172a",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {scopeLabel} ・ {topic.categoryLabel}
              </span>
            </div>

            {/* ステータスバッジ */}
            {topic.statusLabel ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: statusStyle.bg,
                  border: `1.5px solid ${statusStyle.border}`,
                  borderRadius: "20px",
                  padding: "6px 18px",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: statusStyle.dot,
                  }}
                />
                <span
                  style={{
                    color: statusStyle.color,
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {topic.statusLabel}
                </span>
              </div>
            ) : null}
          </div>

          {/* タイトル */}
          <div
            style={{
              color: "#ffffff",
              fontSize: title.length > 22 ? "48px" : "56px",
              fontWeight: "900",
              lineHeight: "1.25",
              letterSpacing: "-0.02em",
              textShadow: "0 4px 16px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)",
              maxWidth: "1070px",
            }}
          >
            {title}
          </div>

          {/* サブタイトル */}
          {subtitle ? (
            <div
              style={{
                color: "#e2e8f0",
                fontSize: "22px",
                lineHeight: "1.5",
                maxWidth: "1050px",
                textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.9)",
                fontWeight: "500",
              }}
            >
              {subtitle.length > 70 ? subtitle.slice(0, 70) + "…" : subtitle}
            </div>
          ) : null}
        </div>

        {/* フッター：信頼性バッジ ＋ ドメイン */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "22px",
            borderTop: "2px solid rgba(255, 255, 255, 0.22)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "24px",
              color: "#cbd5e1",
              fontSize: "17px",
              fontWeight: "700",
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            <span>✔ 事実・一次情報ベース</span>
            <span>✔ 対立論点・背景を客観整理</span>
            <span>✔ 完全無料</span>
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: "800",
              letterSpacing: "0.03em",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            jijizukan.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
