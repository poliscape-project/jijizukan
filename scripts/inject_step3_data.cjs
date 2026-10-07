const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

console.log('--- Step 3 Data Injection Starting ---');

// 1. Load existing municipalities
const muniPath = path.join(__dirname, '../src/data/municipalities.json');
const munis = JSON.parse(fs.readFileSync(muniPath, 'utf-8'));
console.log(`Loaded ${munis.length} municipalities from DB.`);

// 2. Load Sustainability 2024 Excel (HIT / Population Strategy Council)
console.log('Loading sustainability_2024.xlsx...');
const susFile = path.join(__dirname, 'sustainability_2024.xlsx');
const wb = xlsx.readFile(susFile);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const susMap = new Map();
for (let r = 2; r < rows.length; r++) {
  const row = rows[r];
  if (!row || !row[0]) continue;
  const rawCode = String(row[0]).trim();
  const code5 = rawCode.padStart(5, '0');

  const cat = String(row[3]).trim();
  let categoryLabel = '持続可能性自治体';
  let categoryType = 'sustainable';
  if (cat.startsWith('C')) {
    categoryLabel = '消滅可能性自治体';
    categoryType = 'vanishing';
  } else if (cat === 'A') {
    categoryLabel = '自立持続可能性自治体';
    categoryType = 'self-reliant';
  } else if (cat.startsWith('B')) {
    categoryLabel = 'ブラックホール型自治体';
    categoryType = 'blackhole';
  }

  const youngFemaleChangeRate = Math.round((Number(row[7]) || 0) * 10) / 10;
  const projectedPop2050 = Number(row[9]) || 0;
  const pop2020 = Number(row[14]) || 0;
  const popChangeRate = pop2020 > 0
    ? Math.round(((projectedPop2050 - pop2020) / pop2020) * 1000) / 10
    : 0;

  susMap.set(code5, {
    category: categoryLabel,
    categoryType,
    youngFemaleChangeRate,
    projectedPop2050,
    popChangeRate
  });
}
console.log(`Parsed sustainability data for ${susMap.size} entities.`);

// 3. Known Major Companies & Featured Industries Dictionary
// Mapped by 5-digit code or city name pattern
const companyDatabase = {
  // 北海道
  '01100': {
    majorCompanies: ['雪印メグミルク', 'ニトリHD', 'ツルハHD', '石屋製菓（白い恋人）', 'ロイズコンフェクト', 'サッポロビール北海道工場'],
    featuredSpecialties: ['札幌ラーメン', '白い恋人', 'スイーツ・乳製品', '海鮮グルメ'],
    industryType: '大都市商業・サービス・観光中枢型'
  },
  '01202': {
    majorCompanies: ['函館どつく', 'マルハニチロ', 'エフエム北海道', '函館バス'],
    featuredSpecialties: ['函館イカ加工品', 'がごめ昆布', '函館ワイン', '塩ラーメン'],
    industryType: '水産海洋・観光リゾート型'
  },
  '01205': {
    majorCompanies: ['日本製鉄 北日本製鉄所（室蘭）', '日本製鋼所（JSW室蘭製作所）'],
    featuredSpecialties: ['室蘭やきとり', '鉄鋼・重化学工業', 'ボルト・鋳鋼品'],
    industryType: '企業城下町・鉄鋼重化学型'
  },
  '01213': {
    majorCompanies: ['出光興産（北海道製油所）', '王子製紙（苫小牧工場）', 'トヨタ自動車北海道', '日本製紙'],
    featuredSpecialties: ['苫小牧ホッキ貝', '自動車部品', '製紙パルプ'],
    industryType: 'ものづくり・臨海工業都市型'
  },
  '01224': {
    majorCompanies: ['Rapidus（次世代半導体IIM-1）', 'キリンビール北海道千歳工場', 'カルビー千歳工場', '新千歳空港関連企業群'],
    featuredSpecialties: ['最先端半導体', '千歳鮭・イクラ', 'ビール・スナック菓子'],
    industryType: '先端半導体・航空物流拠点型'
  },
  '01408': {
    majorCompanies: ['ニッカウヰスキー余市蒸溜所', '余市ワイナリー'],
    featuredSpecialties: ['シングルモルトウイスキー', '余市ワイン', 'リンゴ・ぶどう'],
    industryType: '醸造・果樹農業・観光型'
  },
  '01564': {
    majorCompanies: ['紋別水産加工協業', 'マルカイチ水産', 'オホーツク森林組合'],
    featuredSpecialties: ['オホーツク産ホタテ', '毛ガニ・ズワイガニ', '流氷観光'],
    industryType: 'オホーツク水産加工・林業拠点型'
  },
  // 東北
  '02411': { // 六ヶ所村
    majorCompanies: ['日本原燃（六ヶ所再処理工場・ウラン濃縮）', 'むつ小川原国家石油備蓄基地', 'ユーラスエナジー（風力発電）'],
    featuredSpecialties: ['原子力燃料サイクル施設', '長芋', 'ゴボウ', '風力発電'],
    industryType: '国家エネルギー政策・特定産業立地型'
  },
  '03206': { // 北上市
    majorCompanies: ['キオクシア岩手（半導体メモリ）', 'ジャパンセミコンダクター', 'トヨタ自動車東日本（近隣集積）'],
    featuredSpecialties: ['半導体フラッシュメモリ', '二子さといも', '北上牛'],
    industryType: '先端電子デバイス・工業集積型'
  },
  '04100': { // 仙台市
    majorCompanies: ['アイリスオーヤマ本社', '東北電力本社', 'カメイ', 'ユアテック'],
    featuredSpecialties: ['仙台牛', '笹かまぼこ', '牛タン', '生活家電・収納'],
    industryType: '東北中枢都市・本社機能集積型'
  },
  '04205': { // 気仙沼市
    majorCompanies: ['気仙沼水産加工協同組合', '八葉水産', 'ミヤカン'],
    featuredSpecialties: ['気仙沼フカヒレ', '戻りカツオ', 'メカジキ', 'サンマ'],
    industryType: '遠洋・沿岸水産加工基地型'
  },
  '05215': { // にかほ市
    majorCompanies: ['TDK（発祥の地・秋田工場群）', 'TDK秋田'],
    featuredSpecialties: ['電子部品・フェライト磁石', 'にかほ秋田牛', 'ハタハタ'],
    industryType: '企業城下町・高精度電子部品型'
  },
  // 関東
  '08202': { // 日立市
    majorCompanies: ['日立製作所（発祥の地・海岸工場・大みか工場）', '日立金属', '三菱日立パワーシステムズ'],
    featuredSpecialties: ['重電機器・社会インフラシステム', '日立さくらポーク'],
    industryType: '企業城下町・重電メガクラスター型'
  },
  '08220': { // つくば市
    majorCompanies: ['JAXA筑波宇宙センター', '産業技術総合研究所（産総研）', 'アステラス製薬研究拠点', 'サイバーダイン'],
    featuredSpecialties: ['宇宙航空研究・ロボット', '科学技術研究', 'つくば福来みかん'],
    industryType: '国家研究学園都市・先端バイオロボ型'
  },
  '09201': { // 宇都宮市
    majorCompanies: ['キヤノン光学技術研究所', 'SUBARU航空宇宙カンパニー', 'カルビー清原工場', '久保田製薬'],
    featuredSpecialties: ['宇都宮餃子', '航空宇宙機器', '精密光学機器', 'イチゴ（とちおとめ）'],
    industryType: '内陸型高度ものづくり・食品都市型'
  },
  '09215': { // 那須烏山市
    majorCompanies: ['烏山製紙（国指定重要無形文化財・烏山和紙）', '島崎酒造（どうくつ酒蔵）', 'やよい農園'],
    featuredSpecialties: ['烏山和紙', '洞窟熟成酒', '中山かぼちゃ', 'アユ料理'],
    industryType: '伝統工芸・農林水産・観光資源型'
  },
  '09384': { // 芳賀町
    majorCompanies: ['本田技研工業（四輪開発センター・HRCホンダ・レーシング）', '芳賀・宇都宮LRT関連'],
    featuredSpecialties: ['モータースポーツ技術研究', '芳賀梨', '工業団地集積'],
    industryType: '自動車研究開発特化型'
  },
  '09411': { // 那珂川町
    majorCompanies: ['八溝木材加工協同組合', '温泉トラフグ養殖施設', '小砂焼陶芸村'],
    featuredSpecialties: ['八溝材（スギ・ヒノキ）', '温泉トラフグ', '小砂焼', 'ホンモロコ'],
    industryType: '林業資源・先端循環型水産養殖型'
  },
  '10205': { // 太田市
    majorCompanies: ['SUBARU（本工場・矢島工場・太田北工場）', 'スバル関連サプライヤー群'],
    featuredSpecialties: ['SUBARU四輪完成車・部品', '太田焼きそば', '大和芋'],
    industryType: '企業城下町・自動車完成車クラスター型'
  },
  '13101': { // 千代田区
    majorCompanies: ['三菱商事', '三井物産', '丸紅', '日立製作所', 'メガバンク各行（三菱UFJ・三井住友・みずほ）'],
    featuredSpecialties: ['国家中枢機関', '総合商社・金融メガバンク', '大手グローバル企業本社'],
    industryType: '日本の政治・経済・金融中枢型'
  },
  '13103': { // 港区
    majorCompanies: ['ソニーグループ', 'ソフトバンク', 'NEC', '電通グループ', 'サントリーホールディングス東京'],
    featuredSpecialties: ['グローバルIT・テクノロジー', '総合メディア・エンタメ', '国際ビジネス拠点'],
    industryType: '最先端メガテック・国際ビジネス中枢型'
  },
  '14100': { // 横浜市
    majorCompanies: ['日産自動車グローバル本社', 'JGC（日揮HD）', '相模鉄道', 'ファンケル', 'コーエーテクモHD'],
    featuredSpecialties: ['自動車産業', 'エンジニアリング', '中華街・国際観光', '港湾貿易'],
    industryType: '国際貿易港湾・大手グローバル本社中枢型'
  },
  '14130': { // 川崎市
    majorCompanies: ['富士通本店', '東芝研究開発センター', 'ENEOS川崎製油所', '昭和電工', 'JFEスチール'],
    featuredSpecialties: ['京浜臨海コンビナート', '先端ICT研究開発', '精密加工技術'],
    industryType: '臨海重化学コンビナート・先端R&D型'
  },
  '14321': { // 寒川町
    majorCompanies: ['キヤノン寒川事業所', '日産工機本社工場', '河西工業本社'],
    featuredSpecialties: ['自動車用エンジン・部品', '精密事務機器', '寒川神社観光'],
    industryType: '湘南内陸型ものづくり工業集積型'
  },
  // 中部
  '15204': { // 三条市
    majorCompanies: ['スノーピーク本社', '角利産業', '高儀', '下村工業'],
    featuredSpecialties: ['アウトドア用品', '燕三条金物・包丁・刃物', '三条カレーラーメン'],
    industryType: '金物・刃物・アウトドア世界拠点型'
  },
  '15213': { // 燕市
    majorCompanies: ['ツインバード本社', '新越ワークス', '和平フレイズ'],
    featuredSpecialties: ['金属洋食器（全国シェア90%超）', 'チタン・ステンレス精密加工', '燕背脂ラーメン'],
    industryType: '金属ハウスウェア・超精密研磨加工型'
  },
  '16206': { // 黒部市
    majorCompanies: ['YKK（創業地・黒部事業所）', 'YKK AP（黒部製造所）'],
    featuredSpecialties: ['ファスナー（世界シェアトップ）', 'アルミ建材', '黒部名水', '宇奈月温泉'],
    industryType: '企業城下町・世界的ファスナー建材型'
  },
  '17203': { // 小松市
    majorCompanies: ['小松製作所（コマツ発祥の地・粟津工場）', 'コマツ産機', '村田製作所（小松村田）'],
    featuredSpecialties: ['建設機械・鉱山機械', '九谷焼', '電子セラミック部品'],
    industryType: '企業城下町・世界的建機マザー工場型'
  },
  '18207': { // 鯖江市
    majorCompanies: ['シャルマン', 'ボストンクラブ', '増永眼鏡'],
    featuredSpecialties: ['眼鏡フレーム（国内シェア96%）', 'チタン加工', '越前漆器'],
    industryType: '世界3大メガネ産地・精密チタン加工型'
  },
  '19424': { // 忍野村
    majorCompanies: ['ファナック（FANUC）グローバル本社・巨大ロボット工場群'],
    featuredSpecialties: ['産業用ロボット・工作機械CNC（世界首位級）', '忍野八海名水', '忍野そば'],
    industryType: '世界的ファクトリーオートメーション企業城下町'
  },
  '20206': { // 諏訪市
    majorCompanies: ['セイコーエプソン本社', '竹屋（タケヤみそ）', '東洋バルヴ'],
    featuredSpecialties: ['インクジェットプリンター・水晶振動子', '信州味噌', '諏訪湖・精密機械'],
    industryType: '東洋のスイス・精密電子機器中枢型'
  },
  '20321': { // 軽井沢町
    majorCompanies: ['星野リゾート本社', 'プリンスホテル', '軽井沢ブルワリー'],
    featuredSpecialties: ['高級リゾートホテル・別荘開発', 'クラフトビール', '高原野菜'],
    industryType: '日本屈指の国際高原リゾート・別荘地型'
  },
  '22130': { // 浜松市
    majorCompanies: ['スズキ本社', 'ヤマハ本社', '河合楽器製作所', '浜松ホトニクス', 'ローランド'],
    featuredSpecialties: ['軽自動車・二輪車', '楽器製造（ピアノ世界シェア大半）', '光検出半導体', '浜松餃子・ウナギ'],
    industryType: '世界のものづくり首都・輸送機器＆楽器集積型'
  },
  '22210': { // 富士市
    majorCompanies: ['日本製紙', '王子マテリア', 'ジヤトコ（変速機）', '旭化成富士工場'],
    featuredSpecialties: ['製紙・パルプ（日本有数の紙の街）', '自動車用CVT変速機', '富士山伏流水特産品'],
    industryType: '製紙パルプ・自動車変速機工業都市型'
  },
  '22211': { // 磐田市
    majorCompanies: ['ヤマハ発動機本社', 'スズキ磐田工場', '遠州トラック'],
    featuredSpecialties: ['二輪車・マリンエンジン', '四輪完成車', '温室メロン', '磐田茶'],
    industryType: '企業城下町・二輪モビリティ世界拠点型'
  },
  '22221': { // 湖西市
    majorCompanies: ['プライムアースEVエナジー（車載電池）', '豊田自動織機 共和工場', 'アスモ（デンソー）'],
    featuredSpecialties: ['EV・ハイブリッド車載用リチウムイオン電池', '豊田佐吉生誕地', '浜名湖ウナギ'],
    industryType: '次世代EVモビリティ電池・トヨタ発祥の地'
  },
  '23100': { // 名古屋市
    majorCompanies: ['トヨタ通商', '日本ガイシ', 'ノリタケカンパニー', '中部電力', 'JR東海', 'ブラザー工業'],
    featuredSpecialties: ['中京工業地帯司令塔', '特殊陶磁器・ガイシ', '航空宇宙', '名古屋めし'],
    industryType: '中部圏経済中枢・高度製造業ヘッドクオーター型'
  },
  '23210': { // 刈谷市
    majorCompanies: ['デンソー本社', 'アイシン本社', '豊田自動織機本社', 'トヨタ紡織本社', 'ジェイテクト本社'],
    featuredSpecialties: ['世界屈指のメガサプライヤー集積', '自動車部品・繊維機械', '万燈祭'],
    industryType: '世界屈指の自動車メガサプライヤー企業城下町'
  },
  '23211': { // 豊田市
    majorCompanies: ['トヨタ自動車本社・元町工場・高岡工場・堤工場', '豊田鉄工', '小島プレス工業'],
    featuredSpecialties: ['世界最大級の自動車産業クラスター', '自動車部品・関連サプライヤー'],
    industryType: '世界的メガ企業城下町・クルマの街'
  },
  '23427': { // 飛島村
    majorCompanies: ['トヨタ自動車名港センター', '三菱重工業名古屋航空宇宙システム製作所', '日本通運', '上組'],
    featuredSpecialties: ['名古屋港巨大物流ハブ', 'ロケット・航空機部品輸送', '金魚養殖'],
    industryType: '日本一の財政力を誇る国際コンテナ港湾・物流メガハブ'
  },
  '24202': { // 四日市市
    majorCompanies: ['キオクシア四日市工場（世界最大級NAND型フラッシュメモリ）', '三菱ケミカル', 'コスモ石油', '味の素'],
    featuredSpecialties: ['最先端半導体メモリ', '石油化学コンビナート', '萬古焼', 'とんてき'],
    industryType: '世界最大級半導体メモリ＆石油化学コンビナート型'
  },
  '24207': { // 鈴鹿市
    majorCompanies: ['本田技研工業 鈴鹿製作所', 'ホンダモビリティランド（鈴鹿サーキット）'],
    featuredSpecialties: ['軽乗用車（N-BOX等）完成車', 'F1日本グランプリ・モータースポーツ', '伊勢茶'],
    industryType: '企業城下町・ホンダ四輪完成車＆モータースポーツ都市'
  },
  // 近畿
  '26100': { // 京都市
    majorCompanies: ['任天堂本社', '京セラ本社', 'オムロン本社', '島津製作所', '日本新薬', 'ワコール', '村田製作所（京都拠点）'],
    featuredSpecialties: ['家庭用ゲーム・IP', '精密電子部品・分析機器', '伝統工芸（西陣織・京焼）', '国際文化観光'],
    industryType: '先端ハイテク・世界的ゲームエンタメ＆文化観光中枢型'
  },
  '26209': { // 向日市
    majorCompanies: ['ニデック（旧日本電産）グローバル本社'],
    featuredSpecialties: ['精密小型・車載用モーター（世界首位級）', '激辛商店街', '竹林'],
    industryType: '世界的モーターメガカンパニー本社都市型'
  },
  '26211': { // 長岡京市
    majorCompanies: ['村田製作所本社', '三菱電機京都製作所', 'サントリー京都ビール工場'],
    featuredSpecialties: ['積層セラミックコンデンサ（世界首位）', '液晶テレビ・半導体', 'プレミアムモルツ'],
    industryType: '電子部品世界首位・先端エレクトロニクス企業城下町'
  },
  '27100': { // 大阪市
    majorCompanies: ['武田薬品工業大阪本社', 'キーエンス本社', 'クボタ本社', 'サントリーHD', '伊藤忠商事大阪本社', '大和ハウス工業'],
    featuredSpecialties: ['総合商社・金融・メガファーマ', '超高収益センサ・計測器', '産業機械', '食文化'],
    industryType: '西日本最大の経済・商業・イノベーション中枢型'
  },
  '27140': { // 堺市
    majorCompanies: ['シマノ本社（自転車部品世界首位）', 'クボタ堺製造所', 'シャープ堺', '堺アルミ'],
    featuredSpecialties: ['自転車コンポーネント・釣具', '農業機械・ディーゼルエンジン', '堺刃物', '古墳群'],
    industryType: '世界的自転車パーツ・農業機械・伝統刃物型'
  },
  '27213': { // 泉佐野市
    majorCompanies: ['関西国際空港関連企業群', '全日空ゲートタワー', '泉州タオル組合'],
    featuredSpecialties: ['関西国際空港ハブ物流', '泉州タオル（発祥の地）', '水ナス', 'ふるさと納税全国1位'],
    industryType: '国際空港ゲートウェイ・繊維・ふるさと納税最強都市'
  },
  '27223': { // 門真市
    majorCompanies: ['パナソニック ホールディングス本社', 'タイガー魔法瓶本社', '海洋堂（本社工場）'],
    featuredSpecialties: ['家電・車載電池・電材ソリューション', '魔法瓶・調理家電', 'フィギュア・模型'],
    industryType: '企業城下町・世界的総合電機パナソニックの街'
  },
  '28202': { // 尼崎市
    majorCompanies: ['クボタ阪神工場', 'ヤンマー尼崎工場', '三菱電機伊丹製作所（隣接）', '住友精密工業'],
    featuredSpecialties: ['産業用ディーゼルエンジン', '精密航空宇宙機器', '鉄鋼・金属加工'],
    industryType: '阪神臨海重工業・産業機械マザー拠点型'
  },
  // 中国・四国
  '33202': { // 倉敷市
    majorCompanies: ['三菱自動車水島製作所', 'JFEスチール西日本製鉄所', '旭化成水島製造所'],
    featuredSpecialties: ['水島臨海重化学コンビナート', '軽自動車・EV完成車', '国産ジーンズ（児島）', '美観地区観光'],
    industryType: '水島重化学コンビナート・自動車・繊維デニム型'
  },
  '34100': { // 広島市
    majorCompanies: ['マツダ本社（隣接府中町）', 'カルビー広島工場', 'オタフクソース本社', 'アンデルセン'],
    featuredSpecialties: ['自動車産業', 'お好み焼き・カキ養殖', '平和記念・観光', 'ベーカリー'],
    industryType: '中国地方中枢・自動車産業＆食文化都市型'
  },
  '34302': { // 府中町
    majorCompanies: ['マツダ（MAZDA）グローバル本社・宇品工場'],
    featuredSpecialties: ['マツダ乗用車完成車・ロータリーエンジン技術', '自動車関連サプライヤー'],
    industryType: 'マツダ完全企業城下町（日本屈指の自立町）'
  },
  '38202': { // 今治市
    majorCompanies: ['今治造船本社（国内首位・世界トップクラス）', '日本食研HD本社', '今治タオル工業組合'],
    featuredSpecialties: ['大型商船・ばら積み船建造', '今治タオル（世界的ブランド）', '焼肉のたれ・調味料'],
    industryType: '日本最大の海事造船都市＆世界ブランド今治タオル'
  },
  // 九州・沖縄
  '40100': { // 北九州市
    majorCompanies: ['TOTO本社', '安川電機本社', '日本製鉄八幡製鉄所', 'ゼンリン本社'],
    featuredSpecialties: ['温水洗浄便座・高級衛生陶器', '産業用ロボット・サーボモーター', '近代化遺産（八幡製鉄所）'],
    industryType: '産業用ロボット・衛生陶器・近代鉄鋼産業の都'
  },
  '40621': { // 苅田町
    majorCompanies: ['日産自動車九州', 'トヨタ自動車九州 苅田工場', 'UBE（宇部興産苅田セメント）'],
    featuredSpecialties: ['日産・トヨタ巨大完成車・エンジン工場', 'セメント・石灰石', '重要港湾苅田港'],
    industryType: '九州屈指の自動車メガクラスター・工業臨海町'
  },
  '43216': { // 合志市
    majorCompanies: ['東京エレクトロン九州本社・合志事業所'],
    featuredSpecialties: ['半導体コータ・デベロッパ製造', '先端半導体製造装置'],
    industryType: '世界最先端半導体製造装置マザー開発拠点型'
  },
  '43403': { // 大津町
    majorCompanies: ['本田技研工業 熊本製作所（ホンダ二輪世界マザー工場）'],
    featuredSpecialties: ['大型二輪車（ゴールドウイング等）完成車', 'からいも（サツマイモ）'],
    industryType: '企業城下町・ホンダ世界二輪マザー工場型'
  },
  '43404': { // 菊陽町
    majorCompanies: ['JASM（TSMC熊本第1・第2半導体受託製造工場）', 'ソニーセミコンダクタマニュファクチャリング', '東京エレクトロン九州'],
    featuredSpecialties: ['世界的最先端半導体ロジックファウンドリ', 'CMOSイメージセンサ', '半導体製造装置'],
    industryType: 'アジア最先端半導体メガハブ・半導体バレー'
  },
  '45202': { // 都城市
    majorCompanies: ['霧島酒造（本格焼酎黒霧島・全国売上首位）', '住友ゴム工業都城工場（ダンロップ）', '南日本酪農協同（スコール）'],
    featuredSpecialties: ['本格芋焼酎（黒霧島）', '都城産宮崎牛・豚肉・鶏肉（市町村別農業産出額日本一）', '自動車タイヤ'],
    industryType: '畜産・本格焼酎・農業産出額日本一＆ふるさと納税最強都市'
  },
  '47348': { // 八重瀬町
    majorCompanies: ['八重瀬町農業協同組合', '南の駅やえせ', 'サトウキビ生産組合'],
    featuredSpecialties: ['サトウキビ・黒糖', '紅芋・マンゴー', '具志頭海岸観光'],
    industryType: '沖縄本島南部・サトウキビ農業＆子育て若年流入型'
  }
};

// 4. Merge into Municipalities Data
let countMergedSus = 0;
let countMergedEco = 0;

for (const m of munis) {
  const code5 = m.code.slice(0, 5);
  const ind = m.industryRatio || { primary: 0, secondary: 0, tertiary: 0 };

  // Sustainability
  if (susMap.has(code5)) {
    m.sustainability = susMap.get(code5);
    countMergedSus++;
  } else {
    m.sustainability = {
      category: '推計対象外（原発被災区域）',
      categoryType: 'unestimated',
      youngFemaleChangeRate: 0,
      projectedPop2050: 0,
      popChangeRate: 0
    };
  }

  // Economy & Companies
  const knownEco = companyDatabase[code5];
  if (knownEco) {
    m.economy = {
      industryType: knownEco.industryType,
      majorCompanies: knownEco.majorCompanies,
      featuredSpecialties: knownEco.featuredSpecialties,
      description: `${m.name}は${knownEco.industryType}として、${knownEco.majorCompanies.slice(0, 3).join('、')}などの有力企業・中核拠点が立地し、${knownEco.featuredSpecialties.slice(0, 2).join('や')}などの看板産業が地域経済と雇用・税収を強力に牽引しています。`
    };
    countMergedEco++;
  } else {
    // Generate tailored economy profile based on industryRatio and typeGroup
    let indType = 'バランス型地域経済';
    let desc = `${m.name}は第1次産業から第3次産業まで多様な産業が支え合うバランスの取れた経済基盤を有しています。`;
    const specialties = [];

    if (ind.primary >= 15) {
      indType = '農林水産業拠点型';
      desc = `${m.name}は就業者数の${ind.primary}%が農林水産業に従事する全国有数の第1次産業拠点であり、高品質な農産物・水産資源が地域経済の屋台骨となっています。`;
      specialties.push('地域ブランド農林水産物', '旬の特産品');
    } else if (ind.secondary >= 32) {
      indType = 'ものづくり・製造工業都市型';
      desc = `${m.name}は第2次産業就業者比率が${ind.secondary}%に達し、製造業・金属加工・建設業の事業所群が雇用と法人税収を支える工業集積地域です。`;
      specialties.push('工業製品・部品加工', '製造業集積');
    } else if (ind.tertiary >= 78) {
      indType = '商業・サービス・都市機能型';
      desc = `${m.name}は第3次産業が${ind.tertiary}%を占め、商業・飲食・IT・医療福祉などの都市型サービス業と消費活動が街の活力を生み出しています。`;
      specialties.push('商業・サービス', '観光・文化振興');
    }

    m.economy = {
      industryType: indType,
      majorCompanies: undefined,
      featuredSpecialties: specialties.length > 0 ? specialties : ['地場特産品', '地域商工業'],
      description: desc
    };
  }
}

console.log(`Merged Sustainability into: ${countMergedSus}/${munis.length}`);
console.log(`Merged Economy data into: ${munis.length}/${munis.length}`);

// Write updated municipalities.json
fs.writeFileSync(muniPath, JSON.stringify(munis, null, 2), 'utf-8');
console.log(`Updated ${muniPath} (size: ${(fs.statSync(muniPath).size / 1024 / 1024).toFixed(2)} MB)`);

// 5. Generate updated municipalities_summary.json
const summaryList = munis.map(m => {
  const pop = m.population || 1;
  const reserveTotal = m.financial.reserveFundTotal * 1000;
  const debtTotal = m.financial.debtOutstanding * 1000;
  return {
    code: m.code,
    prefCode: m.prefCode,
    prefName: m.prefName,
    name: m.name,
    typeGroup: m.typeGroup,
    population: m.population,
    area: m.area,
    financialStrength: m.financial.financialStrengthIndex,
    ordinaryBalance: m.financial.ordinaryBalanceRatio,
    realDebtRatio: m.financial.realDebtServiceRatio,
    revTotal: m.revenues.total,
    expTotal: m.expensesByPurpose.total,
    publicWorks: m.expensesByPurpose.publicWorks,
    welfare: m.expensesByPurpose.welfare,
    publicWorksPerCapita: Math.round((m.expensesByPurpose.publicWorks * 1000) / pop),
    reserveTotal,
    debtTotal,
    netPerCapita: Math.round((reserveTotal - debtTotal) / pop),
    assemblyCostPerCapita: Math.round((m.expensesByPurpose.assembly * 1000) / pop),
    agingRate: m.demographics ? m.demographics.elderlyRate : undefined,
    childRate: m.demographics ? m.demographics.childRate : undefined,
    furusatoBalance: m.furusato ? m.furusato.balance : undefined,
    furusatoReceived: m.furusato ? m.furusato.received : undefined,
    furusatoDeducted: m.furusato ? m.furusato.deducted : undefined,
    furusatoBalancePerCapita: m.furusato ? m.furusato.balancePerCapita : undefined,
    sustainabilityCategory: m.sustainability ? m.sustainability.category : undefined,
    youngFemaleChangeRate: m.sustainability ? m.sustainability.youngFemaleChangeRate : undefined,
    industryType: m.economy ? m.economy.industryType : undefined,
    hasAlerts: Boolean(m.alerts && m.alerts.length > 0)
  };
});

const summaryPath = path.join(__dirname, '../src/data/municipalities_summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summaryList), 'utf-8');
console.log(`Generated ${summaryPath} (size: ${(fs.statSync(summaryPath).size / 1024).toFixed(1)} KB)`);

console.log('--- Step 3 Data Injection Completed Successfully! ---');
