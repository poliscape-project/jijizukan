<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 時事図鑑 開発運用ルール

1. **自律完遂ルール**: 政策データの追加・修正タスクは、「データ作成・更新 → `node scripts/generate-topics.cjs` → `npm run build` → コミット・プッシュ」まで一括で自律実行すること。
2. **海外比較（international）の網羅**: 政策データを追加・更新する際は、無理のない範囲で海外主要国（米・欧・アジア等2〜3カ国）との制度比較（`international` フィールド）を積極的に含めること。
3. **データ格納場所**: `badges`, `highlights`, `voices`, `international` は各政策JSON内に直接内包すること。
4. **トピック重複防止**: 新しいトピックを提案・作成する前に、**必ず `TOPIC_REGISTRY.md` を読んで既存トピックとの重複がないか確認すること**。このファイルは `node scripts/generate-topics.cjs` 実行時に自動生成され、全トピックのID・タイトル・主要キーワードを一覧化している。
