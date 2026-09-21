const fs = require('fs');
const cp = require('child_process');

const domFiles = fs.readdirSync('src/data/topics/domestic').filter(f => f.endsWith('.json')).sort();
const intlFiles = fs.readdirSync('src/data/topics/international').filter(f => f.endsWith('.json')).sort();

function toCamel(str) {
  return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
}

// Gitの初回追加コミット日時を取得
const creationDates = {};
try {
  const logOutput = cp.execSync('git log --diff-filter=A --name-only --format=COMMIT:%cI').toString();
  let currentIso = '';
  for (const line of logOutput.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('COMMIT:')) {
      currentIso = trimmed.replace('COMMIT:', '');
    } else if (currentIso) {
      creationDates[trimmed.replace(/\\/g, '/')] = currentIso;
    }
  }
} catch (e) {
  console.warn('Failed to extract git creation dates:', e);
}

let code = 'import type { Topic } from "@/types/topic";\n\n';

code += `// 国内トピック (${domFiles.length}件)\n`;
for (const f of domFiles) {
  const name = f.replace('.json', '');
  const varName = toCamel(name) + 'Data';
  code += `import ${varName} from "@/data/topics/domestic/${f}";\n`;
}

code += `\n// 国際トピック (${intlFiles.length}件)\n`;
for (const f of intlFiles) {
  const name = f.replace('.json', '');
  const varName = toCamel(name) + 'Data';
  code += `import ${varName} from "@/data/topics/international/${f}";\n`;
}

code += '\nexport const topics: Topic[] = [\n';
for (const f of domFiles) {
  const name = f.replace('.json', '');
  const varName = toCamel(name) + 'Data';
  const created = creationDates['src/data/topics/domestic/' + f] || '2026-09-19T00:00:00+09:00';
  code += `  { ...${varName}, createdAt: "${created}" } as unknown as Topic,\n`;
}
for (const f of intlFiles) {
  const name = f.replace('.json', '');
  const varName = toCamel(name) + 'Data';
  const created = creationDates['src/data/topics/international/' + f] || '2026-09-19T00:00:00+09:00';
  code += `  { ...${varName}, createdAt: "${created}" } as unknown as Topic,\n`;
}
code += '];\n\n';

code += `export function getAllTopics(): Topic[] {
  return topics;
}

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getTopicsByScope(scope: "domestic" | "international"): Topic[] {
  return topics.filter((t) => t.scope === scope);
}

export function getRecentlyUpdatedTopics(limit: number = 10): Topic[] {
  return [...topics]
    .sort(
      (a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
    .slice(0, limit);
}
`;

fs.writeFileSync('src/lib/topics.ts', code);
console.log(`Successfully generated topics.ts with ${domFiles.length + intlFiles.length} topics!`);

// --- TOPIC_REGISTRY.md 自動生成 ---
const path = require('path');

function readTopicMeta(dir, filename) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, filename), 'utf8'));
  const tags = (data.tags || []).slice(0, 6).join(', ');
  return { id: data.id, title: data.title, tags };
}

function buildTable(rows) {
  let table = '| ID | タイトル | 主要キーワード |\n|---|---|---|\n';
  for (const r of rows) {
    table += `| ${r.id} | ${r.title} | ${r.tags} |\n`;
  }
  return table;
}

const domMeta = domFiles.map(f => readTopicMeta('src/data/topics/domestic', f));
const intlMeta = intlFiles.map(f => readTopicMeta('src/data/topics/international', f));

let registry = `<!-- このファイルは generate-topics.cjs により自動生成されます。手動編集しないでください。 -->\n`;
registry += `# TOPIC_REGISTRY — 全${domFiles.length + intlFiles.length}件のトピック一覧\n\n`;
registry += `> **AIエージェントへ**: 新しいトピックを提案する前に、このファイルで既存トピックとの重複がないか必ず確認してください。ID・タイトル・キーワードのいずれかが類似していれば、そのトピックは既に存在します。\n\n`;
registry += `## 国内トピック（${domFiles.length}件）\n\n`;
registry += buildTable(domMeta);
registry += `\n## 国際トピック（${intlFiles.length}件）\n\n`;
registry += buildTable(intlMeta);

fs.writeFileSync('TOPIC_REGISTRY.md', registry);
console.log(`Successfully generated TOPIC_REGISTRY.md with ${domFiles.length + intlFiles.length} entries!`);
