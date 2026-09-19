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
