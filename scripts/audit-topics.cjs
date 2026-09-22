const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) results = results.concat(walk(full));
    else if (file.endsWith(".json")) results.push(full);
  });
  return results;
}

function getNgrams(str) {
  const s = str.replace(/\s+/g, "").toLowerCase();
  const set = new Set();
  for (let i = 0; i < s.length - 1; i++) {
    set.add(s.substring(i, i + 2));
  }
  return set;
}

function calcSimilarity(set1, set2) {
  if (set1.size === 0 || set2.size === 0) return 0;
  let intersection = 0;
  for (const item of set1) {
    if (set2.has(item)) intersection++;
  }
  return intersection / (set1.size + set2.size - intersection);
}

// 9つのクラスタに自動マッピング
function assignCluster(topic) {
  const id = topic.id;
  const cat = (topic.categoryLabel || topic.category || "").toLowerCase();
  const scope = topic.scope;
  const title = topic.title;

  if (scope === "international") {
    // 国際
    if (/taiwan|china|us-china|quad|south-china|semiconductor|indo-pacific|korea|japan-china|japan-south-korea|myanmar|bangladesh|philippines|asean/.test(id) || /日中|台湾|中国|アジア|太平洋|米中/.test(cat + title)) {
      return { id: "intl-1", name: "【国際①】米中対立・東アジア・アジア太平洋・半導体" };
    }
    if (/russia|ukraine|nato|europe|putin|nordic|far-right|belarus|moldova|georgia|arctic/.test(id) || /ロシア|ウクライナ|欧州|nato|cis/.test(cat + title)) {
      return { id: "intl-2", name: "【国際②】ロシア・ウクライナ・欧州・NATO" };
    }
    if (/israel|palestine|gaza|iran|middle-east|red-sea|syria|saudi|yemen|brics|global-south|africa|latin|venezuela|panama|somalia|sudan/.test(id) || /中東|アフリカ|中南米|新興国|南アジア/.test(cat + title)) {
      return { id: "intl-3", name: "【国際③】中東情勢・グローバルサウス・新興国・資源" };
    }
    return { id: "intl-4", name: "【国際④】米国政治・国際秩序・軍縮・巨大IT・気候・国際法" };
  } else {
    // 国内
    if (/political-funds|faction|constitutional|election|parliament|diet|my-number|public-records|imperial|unicameral|party|local-election|tokyo-governor|ishin|cdp|ldp|ishiba|kishida/.test(id) || /国会|選挙|政権|政党|憲法|皇室|政治制度/.test(cat + title)) {
      return { id: "dom-1", name: "【国内①】政治・統治・選挙・政党・国会" };
    }
    if (/boj|monetary|inflation|cost-of-living|consumption-tax|fiscal|income-barrier|tax|stock|yen|regional-bank|super-rich|cryptocurrency|inward-investment/.test(id) || /金融|経済|財政|税制|物価|通貨/.test(cat + title)) {
      return { id: "dom-2", name: "【国内②】経済・財政・税制・金融・物価" };
    }
    if (/pension|healthcare|nursing|declining-birthrate|child|medical|dementia|loneliness|young-carer|social-security|my-number-insurance/.test(id) || /年金|社会保障|医療|介護|少子化|福祉|こども/.test(cat + title)) {
      return { id: "dom-3", name: "【国内③】社会保障・医療・介護・少子化・子ども" };
    }
    if (/minimum-wage|work-style|logistics|ride-sharing|teacher|agriculture|rice|fishery|forestry|akiy|empty-house|water-pipes|infrastructure|linear|shinkansen|regional-railway|tourism|overtourism/.test(id) || /労働|交通|インフラ|国土|農林|地域|観光|物流|農業/.test(cat + title)) {
      return { id: "dom-4", name: "【国内④】労働・働き方・産業・農林水産・インフラ・地方" };
    }
    return { id: "dom-5", name: "【国内⑤】治安・警察・司法・法務・教育・文化・IT" };
  }
}

const files = walk("src/data/topics");
let data = [];

files.forEach(f => {
  try {
    const raw = fs.readFileSync(f, "utf-8");
    const d = JSON.parse(raw);
    const devs = d.developments || [];
    let latestDevYear = 0;
    let latestDevDate = "";
    let latestDevTitle = "";
    devs.forEach(item => {
      const m = (item.date || "").match(/(\d{4})/);
      if (m) {
        const y = parseInt(m[1]);
        if (y >= latestDevYear) {
          latestDevYear = y;
          latestDevDate = item.date;
          latestDevTitle = item.title;
        }
      }
    });

    const ov = d.overview || "";
    const bg = d.background || "";
    const sim = Math.round(calcSimilarity(getNgrams(ov), getNgrams(bg)) * 100);

    const cluster = assignCluster(d);

    // Stale indicators
    const staleKishida = (raw.match(/岸田首相は|岸田首相が|岸田内閣は|岸田政権下で進められており/g) || []).length;
    const staleBiden = (raw.match(/バイデン大統領は|バイデン政権は|バイデン大統領が/g) || []).length;
    const staleYear = (raw.match(/今年（2024年）|2024年現在|現在（2024年）/g) || []).length;

    // Check specific structural issues
    const issues = [];
    if (latestDevYear <= 2023) issues.push(`⚠️ 経緯が${latestDevYear}年で停止`);
    else if (latestDevYear === 2024) issues.push("⚠️ 経緯が2024年で停止");

    if (sim >= 16) issues.push(`⚠️ 現状と背景の重複度高 (${sim}%)`);
    if (staleKishida > 0) issues.push(`⚠️ 岸田政権表記(${staleKishida}箇所)`);
    if (staleBiden > 0) issues.push(`⚠️ バイデン政権表記(${staleBiden}箇所)`);
    if (staleYear > 0) issues.push(`⚠️ 2024年現在表記(${staleYear}箇所)`);
    if (!bg) issues.push("⚠️ background不在");

    data.push({
      id: d.id,
      title: d.title,
      scope: d.scope,
      category: d.categoryLabel || d.category,
      clusterId: cluster.id,
      clusterName: cluster.name,
      latestDevYear,
      latestDevDate,
      latestDevTitle,
      devCount: devs.length,
      sim,
      ovLen: ov.length,
      bgLen: bg.length,
      issues,
      needsAudit: issues.length > 0
    });
  } catch (e) {
    console.error("Error parsing", f, e);
  }
});

// 集計
const clusters = {};
data.forEach(d => {
  if (!clusters[d.clusterId]) {
    clusters[d.clusterId] = {
      name: d.clusterName,
      total: 0,
      stopped2024OrEarlier: 0,
      current: 0,
      highOverlap: 0,
      topics: []
    };
  }
  const c = clusters[d.clusterId];
  c.total++;
  if (d.latestDevYear <= 2024) c.stopped2024OrEarlier++;
  else c.current++;
  if (d.sim >= 16) c.highOverlap++;
  c.topics.push(d);
});

console.log("=== 集計サマリー ===");
Object.keys(clusters).sort().forEach(cid => {
  const c = clusters[cid];
  console.log(`${c.name}: 全${c.total}件 (2024年以前停止: ${c.stopped2024OrEarlier}件, 2025-2026年最新: ${c.current}件, 重複度高: ${c.highOverlap}件)`);
});

fs.writeFileSync("scripts/audit-result.json", JSON.stringify({ data, clusters }, null, 2));
console.log("Saved audit-result.json successfully!");
