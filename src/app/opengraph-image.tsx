import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #091224 0%, #11203b 50%, #060b17 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "52px 64px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* 背景の光 */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
          }}
        />

        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "36px",
          }}
        >
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
            }}
          >
            時事
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: "900",
              letterSpacing: "-0.5px",
            }}
          >
            時事図鑑
          </span>
          <span
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              marginLeft: "8px",
            }}
          >
            | 政治・国際情勢を事実ベースで追跡
          </span>
        </div>

        {/* ボディコンテンツ：左右2カラム */}
        <div style={{ display: "flex", flex: 1, gap: "40px" }}>
          {/* 左カラム：キャッチコピー・説明 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1.2,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#ffffff",
                fontSize: "44px",
                fontWeight: "900",
                lineHeight: "1.25",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              }}
            >
              <span>感情論ではなく、</span>
              <span>
                <span style={{ color: "#60a5fa" }}>事実とデータ</span>で追う
              </span>
              <span>政治・国際情勢の全体像。</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#cbd5e1",
                fontSize: "19px",
                lineHeight: "1.6",
                marginBottom: "32px",
              }}
            >
              <span>日々の細かいニュースで迷子にならない。</span>
              <span>テーマごとの経緯・構造・対立論点を客観整理。</span>
            </div>

            {/* バッジ群 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  color: "#e2e8f0",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                ⚡ 160以上の重要トピック
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  color: "#e2e8f0",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                🏛 国内政治 ＆ 国際情勢
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  color: "#e2e8f0",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                📊 一次情報ソース完備
              </div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  color: "#e2e8f0",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                ✨ 完全無料
              </div>
            </div>
          </div>

          {/* 右カラム：トピックカードのプレビュー風 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 0.9,
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {/* カード1 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    background: "rgba(56, 189, 248, 0.2)",
                    color: "#7dd3fc",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  国内政治 ・ 行政・内閣
                </span>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                  }}
                >
                  ● 進行中
                </span>
              </div>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: "800",
                  lineHeight: "1.3",
                }}
              >
                防災省・防災庁創設と国の危機管理体制
              </div>
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                相次ぐ激甚災害への即応体制強化と専任組織の創設論点
              </div>
            </div>

            {/* カード2 */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span
                  style={{
                    background: "rgba(251, 113, 133, 0.2)",
                    color: "#fecdd3",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  国際情勢 ・ 紛争・安全保障
                </span>
                <span
                  style={{
                    color: "#fb7185",
                    fontSize: "13px",
                  }}
                >
                  ● 緊張激化
                </span>
              </div>
              <div
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: "800",
                  lineHeight: "1.3",
                }}
              >
                台湾海峡有事リスクと米中対立・日本の防衛
              </div>
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                地政学的チョークポイントと日本のシーレーン防衛の焦点
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <div style={{ color: "#94a3b8", fontSize: "15px" }}>
            時事図鑑 — 日本政策図鑑（Poliscape）姉妹プラットフォーム
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: "800",
              letterSpacing: "0.03em",
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
