#!/usr/bin/env node

/**
 * find-related-policies.cjs
 * 
 * 時事図鑑のトピックに対して、Poliscape（日本政策図鑑）の1,500件超の政策データから
 * 関連性の高い法案・政策を自動検索・推薦・適用するスクリプト。
 * 
 * 使い方:
 *   1. 特定トピックの候補を表示 (プレビュー):
 *      node scripts/find-related-policies.cjs <topic-id>
 * 
 *   2. 特定トピックに候補を自動適用 (JSONを更新):
 *      node scripts/find-related-policies.cjs <topic-id> --apply
 * 
 *   3. 全トピックの候補を一括プレビュー:
 *      node scripts/find-related-policies.cjs --all
 * 
 *   4. 全トピックに高適合な政策を一括適用:
 *      node scripts/find-related-policies.cjs --all --apply
 * 
 * オプション:
 *   --threshold <number> : 最低適合スコア (デフォルト: 30)
 *   --max <number>       : 1トピックあたりの最大設定件数 (デフォルト: 3)
 */

const fs = require('fs');
const path = require('path');

// ディレクトリパス
const TOPICS_DIRS = [
  path.resolve(__dirname, '../src/data/topics/domestic'),
  path.resolve(__dirname, '../src/data/topics/international')
];
const POLICIES_DIR = path.resolve(__dirname, '../../Poliscape/src/data/policies');

// 引数解析
const args = process.argv.slice(2);
const isAll = args.includes('--all');
const isApply = args.includes('--apply');
const thresholdArg = args.indexOf('--threshold');
const MIN_SCORE = thresholdArg !== -1 && args[thresholdArg + 1] ? parseInt(args[thresholdArg + 1], 10) : 45;
const maxArg = args.indexOf('--max');
const MAX_POLICIES = maxArg !== -1 && args[maxArg + 1] ? parseInt(args[maxArg + 1], 10) : 3;

const targetTopicId = args.find(a => !a.startsWith('--') && a !== 'undefined');

// ストップワード（一般的すぎて判別に使えない語・法律接尾辞）
const STOPWORDS = new Set([
  '問題', '現在', '課題', '対策', '方針', '現状', '対応', '日本', '世界', '社会',
  '制度', '概要', '推進', '見直し', '見直', '議論', '今後', '全国', '基準', '基本',
  '検討', '状況', '発表', '影響', '実施', '計画', '関係', '強化', '開始', '政府',
  '自治体', '改正', '法改', '法案', '法律', '導入', '論争', '支援', '拡大', '措置',
  '規定', '設置', '整備', '促進', '向上', '確保', '防止', '見直し', 'あり方', '取り組'
]);

// 汎用社会課題語（これ単体では関連法案と断定できない語）
const BROAD_TERMS = new Set([
  '人手不足', '物価高騰', '少子化', '高齢化', '人口減少', '経済成長', '人材確保',
  '財政再建', '危機管理', '地域活性化', '地方創生', '環境問題', '持続可能', '国際社会'
]);

// 1. Poliscapeの政策データをロード・インデックス化
function loadPolicies() {
  if (!fs.existsSync(POLICIES_DIR)) {
    console.error(`❌ Poliscapeの政策ディレクトリが見つかりません: ${POLICIES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(POLICIES_DIR).filter(f => f.endsWith('.json'));
  const policies = [];

  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(POLICIES_DIR, file), 'utf8'));
      policies.push({
        id: data.id || file.replace('.json', ''),
        title: data.title || '',
        catchphrase: data.catchphrase || '',
        category: data.category || '',
        categoryLabel: data.categoryLabel || '',
        summary: [
          ...(data.summary?.standard || []),
          ...(data.summary?.simple || [])
        ].join(' '),
        tags: Array.isArray(data.tags) ? data.tags : []
      });
    } catch (e) {
      // 読み込みエラーはスキップ
    }
  }

  return policies;
}

// 2. テキストから重要語（漢字複合語、カタカナ、英数字）を抽出
function extractTerms(text, tags = []) {
  const terms = new Set();
  if (Array.isArray(tags)) {
    tags.forEach(t => {
      if (t && t.length >= 2) terms.add(t.trim());
    });
  }

  if (!text) return Array.from(terms);

  // 漢字の連続（2〜8文字）
  const kanjiMatches = text.match(/[\u4E00-\u9FFF]{2,8}/g) || [];
  for (const m of kanjiMatches) {
    if (!STOPWORDS.has(m)) {
      terms.add(m);
      if (m.length >= 4) {
        // 部分文字列も追加（例：食料安全保障 -> 食料安全, 安全保障）
        const sub1 = m.slice(0, Math.floor(m.length / 2));
        const sub2 = m.slice(Math.floor(m.length / 2));
        if (sub1.length >= 2 && !STOPWORDS.has(sub1)) terms.add(sub1);
        if (sub2.length >= 2 && !STOPWORDS.has(sub2)) terms.add(sub2);
      }
    }
  }

  // カタカナの連続（2文字以上）
  const katakanaMatches = text.match(/[\u30A1-\u30FA\u30FC]{2,}/g) || [];
  for (const m of katakanaMatches) {
    if (!STOPWORDS.has(m)) terms.add(m);
  }

  // 英数字（3文字以上）
  const engMatches = text.match(/[A-Za-z0-9_]{3,}/g) || [];
  for (const m of engMatches) {
    terms.add(m);
  }

  return Array.from(terms);
}

// 3. トピックと政策の適合スコアを計算
function scorePolicies(topic, policies) {
  // トピック側の重要語抽出
  const headerText = `${topic.title} ${topic.subtitle || ''} ${(topic.tags || []).join(' ')}`;
  const coreTerms = extractTerms(headerText, topic.tags);

  const bodyText = `${topic.simpleSummary || ''} ${topic.overview || ''}`.slice(0, 500);
  const contextTerms = extractTerms(bodyText);

  const scored = [];

  for (const p of policies) {
    let score = 0;
    const matchReasons = [];

    let specificHits = 0;

    // コア語（タイトル・タグ由来）の判定
    for (const term of coreTerms) {
      if (STOPWORDS.has(term)) continue;
      const isBroad = BROAD_TERMS.has(term);

      // 政策タイトルに完全一致
      if (p.title.includes(term)) {
        const weight = isBroad ? 4 : (term.length >= 4 ? 22 : (term.length === 3 ? 12 : 6));
        score += weight;
        if (!isBroad) specificHits++;
        matchReasons.push(`タイトル「${term}」(+${weight})`);
      }
      // 政策キャッチコピーに一致
      else if (p.catchphrase.includes(term)) {
        const weight = isBroad ? 2 : (term.length >= 4 ? 10 : 5);
        score += weight;
        if (!isBroad) specificHits++;
        matchReasons.push(`要約「${term}」(+${weight})`);
      }
      // 政策サマリーに一致
      else if (p.summary.includes(term)) {
        score += (term.length >= 4 ? 3 : 1);
      }
    }

    // 本文コンテキスト語の判定
    for (const term of contextTerms) {
      if (STOPWORDS.has(term) || coreTerms.includes(term) || BROAD_TERMS.has(term)) continue;
      if (p.title.includes(term)) {
        score += (term.length >= 4 ? 8 : 3);
        specificHits++;
      }
    }

    // タグ直接一致ボーナス
    if (topic.tags) {
      for (const tag of topic.tags) {
        if (p.tags.includes(tag)) {
          score += 25;
          specificHits++;
          matchReasons.push(`タグ完全一致「${tag}」(+25)`);
        }
      }
    }

    // 国際トピックの場合は閾値を高くする
    const effectiveMinScore = topic.scope === 'international' ? Math.max(MIN_SCORE, 60) : MIN_SCORE;

    // 最低1件以上の固有語ヒットがあり、かつ閾値以上
    if (score >= effectiveMinScore && specificHits >= 1) {
      // 理由（reason）の自動合成
      let reason = '';
      if (p.catchphrase) {
        // キャッチコピーから簡潔な説明を生成
        const cleanCatch = p.catchphrase.split('。')[0].replace(/^[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+/, '');
        reason = `${cleanCatch}に関する制度であり、${topic.title}の課題解決や法的枠組みと直接連動します。`;
      } else {
        reason = `${p.title}に関する法制度であり、本トピックの政策課題・行政対応の根拠法となります。`;
      }

      scored.push({
        id: p.id,
        title: p.title,
        score,
        reason,
        matches: matchReasons.slice(0, 3)
      });
    }
  }

  // スコア降順ソート
  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  const topScore = scored[0].score;
  // 1位のスコアが閾値未満なら候補なし
  if (topScore < MIN_SCORE) return [];

  // 動的足切り: 1位のスコアの45%以上かつMIN_SCORE以上のもののみ採用
  const filtered = scored.filter(s => s.score >= MIN_SCORE && s.score >= topScore * 0.45);

  return filtered.slice(0, MAX_POLICIES);
}

// 4. トピックファイルの読み込み
function findTopicFile(topicId) {
  for (const dir of TOPICS_DIRS) {
    const filePath = path.join(dir, `${topicId}.json`);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}

// 5. 全トピックファイルの取得
function getAllTopicFiles() {
  const files = [];
  for (const dir of TOPICS_DIRS) {
    if (fs.existsSync(dir)) {
      const list = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
      for (const file of list) {
        files.push(path.join(dir, file));
      }
    }
  }
  return files;
}

// メイン実行
function main() {
  console.log(`🔍 Poliscape 政策データを読み込み中...`);
  const policies = loadPolicies();
  console.log(`✅ ${policies.length} 件の政策データをインデックス化しました。\n`);

  if (isAll) {
    const topicFiles = getAllTopicFiles();
    console.log(`📋 全 ${topicFiles.length} 件の時事トピックをスキャンします (閾値スコア >= ${MIN_SCORE})...\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const filePath of topicFiles) {
      const topic = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const existingPolicies = topic.relatedPolicies || [];

      // すでに3件以上設定されている場合はスキップ（上書き防止）
      if (existingPolicies.length >= 3 && !isApply) {
        continue;
      }

      const matched = scorePolicies(topic, policies);

      if (matched.length === 0) {
        skippedCount++;
        continue;
      }

      console.log(`--------------------------------------------------`);
      console.log(`📌 [${topic.scope || 'domestic'}] ${topic.title} (${topic.id})`);
      console.log(`   現在の政策リンク: ${existingPolicies.length}件`);
      console.log(`   💡 推奨政策 (上位${matched.length}件):`);

      matched.forEach((m, idx) => {
        console.log(`     ${idx + 1}. [スコア:${m.score}] ${m.title}`);
        console.log(`        ID: ${m.id}`);
        console.log(`        理由: ${m.reason}`);
      });

      if (isApply) {
        // 既存のIDと重複しないものだけを追加
        const existingIds = new Set(existingPolicies.map(p => p.id));
        const toAdd = matched.filter(m => !existingIds.has(m.id)).map(m => ({
          id: m.id,
          title: m.title,
          reason: m.reason
        }));

        if (toAdd.length > 0) {
          topic.relatedPolicies = [...existingPolicies, ...toAdd].slice(0, MAX_POLICIES);
          fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + '\n', 'utf8');
          console.log(`   ✅ JSONに ${toAdd.length} 件の政策を反映しました。`);
          updatedCount++;
        } else {
          console.log(`   ℹ️ 既にすべて設定済みです。`);
        }
      }
    }

    console.log(`\n==================================================`);
    if (isApply) {
      console.log(`🎉 完了: ${updatedCount} 件のトピックを更新しました (マッチなし: ${skippedCount}件)`);
      console.log(`※ 変更を反映するため 'node scripts/generate-topics.cjs' を実行してください。`);
    } else {
      console.log(`✨ スキャン完了。実際にトピックJSONへ書き込むには '--apply' を付けて実行してください:`);
      console.log(`   node scripts/find-related-policies.cjs --all --apply`);
    }

  } else if (targetTopicId) {
    const filePath = findTopicFile(targetTopicId);
    if (!filePath) {
      console.error(`❌ トピックが見つかりません: ${targetTopicId}`);
      process.exit(1);
    }

    const topic = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📌 対象トピック: ${topic.title} (${topic.id})`);
    console.log(`   現在の関連政策数: ${(topic.relatedPolicies || []).length} 件\n`);

    const matched = scorePolicies(topic, policies);

    if (matched.length === 0) {
      console.log(`⚠️ スコア ${MIN_SCORE} 以上の明確に関連する政策は見つかりませんでした。`);
      console.log(`   （無理に設定する必要はありません）`);
      return;
    }

    console.log(`💡 関連政策候補 (上位 ${matched.length} 件):`);
    matched.forEach((m, idx) => {
      console.log(`\n  ${idx + 1}. 【${m.title}】`);
      console.log(`     ID: ${m.id}`);
      console.log(`     適合スコア: ${m.score} 点 (${m.matches.join(', ')})`);
      console.log(`     推薦理由: ${m.reason}`);
    });

    if (isApply) {
      const existing = topic.relatedPolicies || [];
      const existingIds = new Set(existing.map(p => p.id));
      const toAdd = matched.filter(m => !existingIds.has(m.id)).map(m => ({
        id: m.id,
        title: m.title,
        reason: m.reason
      }));

      if (toAdd.length > 0) {
        topic.relatedPolicies = [...existing, ...toAdd].slice(0, MAX_POLICIES);
        fs.writeFileSync(filePath, JSON.stringify(topic, null, 2) + '\n', 'utf8');
        console.log(`\n✅ ${toAdd.length} 件の政策リンクを ${path.basename(filePath)} に反映しました！`);
        console.log(`※ 反映のため 'node scripts/generate-topics.cjs' を実行してください。`);
      } else {
        console.log(`\nℹ️ 候補の政策は既にすべて設定されています。`);
      }
    } else {
      console.log(`\n👉 この候補をJSONに適用する場合は、--apply を付けて実行してください:`);
      console.log(`   node scripts/find-related-policies.cjs ${targetTopicId} --apply`);
    }

  } else {
    console.log(`時事図鑑 政策リンク推薦ツール\n`);
    console.log(`使い方:`);
    console.log(`  node scripts/find-related-policies.cjs <topic-id>          # 1件プレビュー`);
    console.log(`  node scripts/find-related-policies.cjs <topic-id> --apply  # 1件適用`);
    console.log(`  node scripts/find-related-policies.cjs --all               # 全件プレビュー`);
    console.log(`  node scripts/find-related-policies.cjs --all --apply       # 全件一括適用\n`);
  }
}

main();
