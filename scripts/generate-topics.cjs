const fs = require('fs');

const domFiles = fs.readdirSync('src/data/topics/domestic').filter(f => f.endsWith('.json')).sort();
const intlFiles = fs.readdirSync('src/data/topics/international').filter(f => f.endsWith('.json')).sort();

function toCamel(str) {
  return str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());
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
  code += `  ${varName} as unknown as Topic,\n`;
}
for (const f of intlFiles) {
  const name = f.replace('.json', '');
  const varName = toCamel(name) + 'Data';
  code += `  ${varName} as unknown as Topic,\n`;
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
