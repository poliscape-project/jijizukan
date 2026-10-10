const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'handbook', 'fruits.json');
const munisPath = path.join(__dirname, '..', 'src', 'data', 'municipalities_summary.json');

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const munisRaw = fs.readFileSync(munisPath, 'utf8');
const munis = JSON.parse(munisRaw);
const muniMap = new Map(munis.map(m => [m.code, m.name]));

const fisheryItems = [
  {
    id: "maguro",
    name: "まぐろ類（マグロ・遠洋＆養殖）",
    kana: "マグロ",
    englishName: "Tuna (Ocean & Aquaculture)",
    category: "fishery",
    categoryLabel: "水産業・海洋資源",
    unit: "t",
    icon: "🐟",
    summary: "農林水産省「漁業・養殖業生産統計」によるまぐろ類（クロマグロ・ミナミマグロ・メバチ・キハダ・ビンナガ等）の全国漁獲・養殖量。遠洋漁業の巨大母港を擁する静岡県や、クロマグロ完全養殖・蓄養が盛んな鹿児島県・長崎県が全国を牽引。",
    season: "通年（秋冬に脂が乗り最盛期）",
    nationalTotalProduction: 112000,
    nationalOutputValue: 1050,
    mainVarieties: [
      "焼津ミナミマグロ（静岡）",
      "大間まぐろ（青森・津軽海峡一本釣り）",
      "奄美本まぐろ（鹿児島・完全養殖）",
      "近大マグロ（和歌山・串本発祥）",
      "気仙沼メカジキ・ビンチョウ（宮城）"
    ],
    growingConditions: "静岡県（焼津港・清水港）は駿河湾の天然の深良港と首都圏近接の利点を活かし、世界中の大洋を巡る超低温（マイナス60度）遠洋マグロはえ縄船の日本最大の基地として発展しました。一方、鹿児島県（奄美大島）や長崎県（五島・対馬）は黒潮が洗う温暖で清浄な外洋性入江に恵まれ、近畿大学が世界で初めて成功させた人工種苗技術等を導入したクロマグロ養殖の一大拠点となっています。青森県大間町は親潮と対馬暖流が交錯しスルメイカ等の餌が豊富な津軽海峡の荒波で最高級一本釣りを展開します。",
    trivia: "東京・豊洲市場の初競りで数億円の史上最高値を記録して話題となる「大間まぐろ」は、津軽海峡の激しい潮流で育つ天然クロマグロの最高峰です。一方、日本の食卓に並ぶ冷凍マグロ刺身の多くは焼津・清水から供給されており、マイナス60度の冷凍技術（細胞を壊さず解凍するコールドチェーン）の確立が近代日本の豊かな魚食文化を支えています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "220003",
        prefectureName: "静岡県",
        production: 35800,
        share: 32.0,
        mainCities: [
          { code: "222127", name: "焼津市", highlight: "日本一の遠洋漁業母港・焼津港" },
          { code: "221007", name: "静岡市", highlight: "清水港・冷凍マグロ水揚げ日本一" }
        ],
        notes: "焼津港・清水港を擁する世界のマグロ基地。超低温冷蔵倉庫群が集積。"
      },
      {
        rank: 2,
        prefectureCode: "460003",
        prefectureName: "鹿児島県",
        production: 20100,
        share: 17.9,
        mainCities: [
          { code: "462047", name: "枕崎市", highlight: "遠洋はえ縄船団と冷凍マグロ基地" }
        ],
        notes: "奄美大島等の温暖な湾内での本マグロ養殖と、枕崎・串木野の遠洋漁業が両輪。"
      },
      {
        rank: 3,
        prefectureCode: "040003",
        prefectureName: "宮城県",
        production: 11200,
        share: 10.0,
        mainCities: [
          { code: "042056", name: "気仙沼市", highlight: "近海・遠洋マグロ水揚げの三陸中枢" }
        ],
        notes: "気仙沼港・塩竈港が中核。メカジキやビンチョウマグロの水揚げも全国屈指。"
      },
      {
        rank: 4,
        prefectureCode: "420003",
        prefectureName: "長崎県",
        production: 8900,
        share: 7.9,
        mainCities: [
          { code: "422118", name: "対馬市", highlight: "対馬海峡の本マグロ養殖・蓄養拠点" }
        ],
        notes: "五島列島・対馬のリアス式海岸でクロマグロ養殖が急成長。"
      },
      {
        rank: 5,
        prefectureCode: "020003",
        prefectureName: "青森県",
        production: 4800,
        share: 4.3,
        mainCities: [
          { code: "024236", name: "大間町", highlight: "津軽海峡・一本釣り大間まぐろの聖地" }
        ],
        notes: "大間町・三厩（外ヶ浜町）の津軽海峡天然クロマグロは日本最高峰のブランド。"
      }
    ]
  },
  {
    id: "scallop",
    name: "ほたてがい（ホタテ・養殖＆天然地撒き）",
    kana: "ホタテガイ",
    englishName: "Scallop (Aquaculture & Dredge)",
    category: "fishery",
    categoryLabel: "水産業・海洋資源",
    unit: "t",
    icon: "🐚",
    summary: "農林水産省統計によるホタテガイの全国生産量（海面養殖＋天然地撒き採貝）。北海道（オホーツク海・噴火湾）と青森県（陸奥湾）の2道県で全国シェアの99%以上を占める寒冷海洋の至宝。",
    season: "初夏〜秋（地撒き天然）、冬〜春（養殖）",
    nationalTotalProduction: 495000,
    nationalOutputValue: 880,
    mainVarieties: [
      "オホーツク地撒き天然ホタテ（猿払・紋別・網走）",
      "噴火湾耳吊り養殖ホタテ（森町・八雲・伊達）",
      "陸奥湾養殖ホタテ（青森・平内・むつ）",
      "三陸リアス式ホタテ（岩手・宮城）"
    ],
    growingConditions: "ホタテガイは水温5〜15℃前後の冷たい清浄な海水と、豊富な植物プランクトンを必要とします。北海道オホーツク海沿岸は、冬にロシア・アムール川から漂着する流氷が大量のミネラル・栄養塩をもたらし、広大な砂泥海底に稚貝を放流して数年育てて獲る「地撒き（じまき）漁法」が行われます。一方、北海道の内海である噴火湾や青森県陸奥湾は、外洋の荒波から遮られた静穏な湾内で、ロープに貝殻を吊るして海中で育てる「耳吊り垂下式養殖」が盛んです。",
    trivia: "北海道最北部の「猿払村（さるふつむら）」は、昭和40年代に貧困と過疎に苦しんだ歴史から村民一丸でホタテ稚貝放流事業に挑戦。大成功を収めて日本一のホタテの産地となり、全国の市区町村でトップクラスの住民平均所得を誇る「奇跡の村」として教科書やビジネス書で広く知られています。またホタテは近年、対米・対中輸出の主力水産物としても経済安全保障の重要品目です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "010003",
        prefectureName: "北海道",
        production: 408000,
        share: 82.4,
        mainCities: [
          { code: "015113", name: "猿払村", highlight: "日本一のホタテの村・村民所得トップクラス" },
          { code: "012190", name: "紋別市", highlight: "オホーツク流氷が育む極上ホタテ基地" },
          { code: "013455", name: "森町", highlight: "噴火湾の耳吊り垂下式養殖ホタテ" }
        ],
        notes: "オホーツク海の地撒き天然ホタテと、噴火湾の養殖ホタテの二大産地で全国の8割超。"
      },
      {
        rank: 2,
        prefectureCode: "020003",
        prefectureName: "青森県",
        production: 82500,
        share: 16.7,
        mainCities: [
          { code: "023019", name: "平内町", highlight: "陸奥湾ホタテ養殖発祥の地・生産量日本一の町" },
          { code: "022080", name: "むつ市", highlight: "下北半島・陸奥湾の甘み豊かなホタテ" }
        ],
        notes: "八甲田山系と白神山地から清流が注ぎ込む陸奥湾。穏やかな波とプランクトンで甘みが濃厚。"
      },
      {
        rank: 3,
        prefectureCode: "030003",
        prefectureName: "岩手県",
        production: 2800,
        share: 0.6,
        mainCities: [
          { code: "032026", name: "宮古市", highlight: "三陸リアス式海岸の大粒ホタテ" }
        ],
        notes: "三陸親潮の荒波と深い入江でじっくり育てられる大型肉厚ホタテ。"
      },
      {
        rank: 4,
        prefectureCode: "040003",
        prefectureName: "宮城県",
        production: 1700,
        share: 0.3,
        mainCities: [
          { code: "042021", name: "石巻市", highlight: "雄勝湾・金華山沖の肉厚ホタテ" }
        ],
        notes: "リアス海岸の静かな湾内でカキやギンザケと並び高品質養殖を展開。"
      }
    ]
  },
  {
    id: "bonito",
    name: "かつお類（カツオ・生鮮一本釣り＆遠洋）",
    kana: "カツオ",
    englishName: "Bonito / Skipjack Tuna",
    category: "fishery",
    categoryLabel: "水産業・海洋資源",
    unit: "t",
    icon: "🐟",
    summary: "農林水産省統計によるかつお類の全国漁獲量。生鮮カツオ水揚げ28年連続日本一を誇る宮城県気仙沼港、遠洋冷凍基地の静岡県焼津港、一本釣りと藁焼き文化が息づく高知県が三大拠点。",
    season: "春（初ガツオ：3〜5月）、秋（戻りガツオ：9〜11月）",
    nationalTotalProduction: 218000,
    nationalOutputValue: 620,
    mainVarieties: [
      "気仙沼戻りガツオ（生鮮水揚げ日本一・トロ鰹）",
      "土佐一本釣り初ガツオ（高知・藁焼きタタキ）",
      "焼津遠洋一本釣り鰹（鰹節・たたき原料）",
      "枕崎本枯節原料鰹（鹿児島）"
    ],
    growingConditions: "カツオは暖流の黒潮に乗って太平洋を北上する代表的な回遊魚です。春に太平洋側（九州・四国・紀伊半島・伊豆諸島）を北上する「初ガツオ」は赤身が引き締まりさっぱりした味わいで、江戸時代から「目には青葉 山ほととぎす 初鰹」と珍重されました。夏に三陸沖で親潮の豊富な餌（サンマ・イワシ）をたっぷり食べて南下する「戻りガツオ」は全身に脂が乗り、気仙沼港などに大量に水揚げされます。傷みやすいカツオを最高鮮度で保つため、伝統の一本釣り漁法と急速冷却技術が不可欠です。",
    trivia: "宮城県気仙沼市は生鮮カツオの水揚げ量で昭和後期から四半世紀以上連続で日本一を守り続けています。一方、高知県黒潮町や中土佐町は、豪快に藁の炎で表面を一瞬で炙る「鰹のタタキ」食文化の聖地。鹿児島県枕崎市は日本の伝統出汁を支える最高級「本枯節（ほんかれぶし）」の生産量日本一を誇るなど、獲る・食べる・加工する文化が全国各地の自治体に深く根付いています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "220003",
        prefectureName: "静岡県",
        production: 76000,
        share: 34.9,
        mainCities: [
          { code: "222127", name: "焼津市", highlight: "遠洋一本釣り鰹水揚げ日本一・焼津港" }
        ],
        notes: "遠洋カツオ船団の母港。船上急速凍結された冷凍カツオの流通中枢。"
      },
      {
        rank: 2,
        prefectureCode: "040003",
        prefectureName: "宮城県",
        production: 54000,
        share: 24.8,
        mainCities: [
          { code: "042056", name: "気仙沼市", highlight: "28年連続生鮮カツオ水揚げ日本一" }
        ],
        notes: "三陸沖の脂の乗った「戻りガツオ」が近海一本釣り船から大量水揚げされる生鮮の都。"
      },
      {
        rank: 3,
        prefectureCode: "390003",
        prefectureName: "高知県",
        production: 26500,
        share: 12.2,
        mainCities: [
          { code: "392014", name: "高知市", highlight: "ひろめ市場・土佐カツオ食文化の中心" },
          { code: "394289", name: "黒潮町", highlight: "土佐佐賀港・一本釣りと藁焼きタタキの町" }
        ],
        notes: "伝統の土佐一本釣り。県民1人あたりカツオ消費量は全国平均の数倍でダントツ1位。"
      },
      {
        rank: 4,
        prefectureCode: "460003",
        prefectureName: "鹿児島県",
        production: 21500,
        share: 9.9,
        mainCities: [
          { code: "462047", name: "枕崎市", highlight: "鰹節生産量日本一・枕崎港" }
        ],
        notes: "南太平洋の遠洋カツオ水揚げと、300年の伝統を誇る鰹節製造の一大産業集積。"
      },
      {
        rank: 5,
        prefectureCode: "240003",
        prefectureName: "三重県",
        production: 12000,
        share: 5.5,
        mainCities: [
          { code: "242110", name: "尾鷲市", highlight: "熊野灘の近海カツオ一本釣り基地" }
        ],
        notes: "志摩半島や尾鷲港など熊野灘沿岸での近海一本釣り。郷土料理「てこね寿司」の主役。"
      }
    ]
  },
  {
    id: "salmon",
    name: "さけ・ます類（サケ・秋鮭＆ギンザケ養殖）",
    kana: "サケ・マス",
    englishName: "Salmon & Trout",
    category: "fishery",
    categoryLabel: "水産業・海洋資源",
    unit: "t",
    icon: "🍣",
    summary: "農林水産省統計によるサケ・マス類の全国生産量。北太平洋から生まれ故郷の川へ戻る天然「秋鮭（シロザケ）」の北海道と、三陸リアス式海岸で国内養殖サーモンの85%以上を育てる宮城県が二大巨頭。",
    season: "秋（9〜11月：秋鮭・いくら）、春〜初夏（養殖銀鮭）",
    nationalTotalProduction: 89000,
    nationalOutputValue: 580,
    mainVarieties: [
      "北海道秋鮭（白鮭・いくら・鮭児）",
      "みやぎサーモン（宮城・銀鮭海面養殖）",
      "南部鼻曲がり鮭（岩手・三陸定置網）",
      "越後村上塩引き鮭（新潟・三面川伝統鮭文化）"
    ],
    growingConditions: "サケは川で生まれ海に下り、北太平洋・ベーリング海を数千キロ回遊して産卵のために生まれた川へ母川回帰する母川回帰魚です。北海道や東北の冷涼な河川と豊かな森林が稚貝・稚魚を育み、秋になると沿岸の定置網に丸々と太った「秋鮭（アキアジ）」が入網します。一方、宮城県牡鹿半島・女川湾は、親潮が流れ込む冷たい海水と、リアス式海岸の静穏な波、水深の深さが揃い、日本で唯一の本格的な海面ギンザケ養殖の適地となっています。",
    trivia: "北海道標津町（しべつちょう）はサケの水揚げ日本一を誇り、町内に「標津サーモン科学館」を擁するサケの聖地です。また新潟県村上市は江戸時代に世界で初めて「種川の制（川の一部を保護して自然繁殖を促す制度）」を確立した鮭のまちで、100種類以上の鮭料理文化が息づきます。近年は回転寿司や刺身需要の拡大で宮城県の「みやぎサーモン（生食銀鮭）」が急成長しています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "010003",
        prefectureName: "北海道",
        production: 61500,
        share: 69.1,
        mainCities: [
          { code: "016934", name: "標津町", highlight: "サケの水揚げ日本一・サーモンパーク" },
          { code: "012238", name: "根室市", highlight: "オホーツク・根室海峡の秋鮭水揚げ中枢" }
        ],
        notes: "全国の秋鮭漁獲の約7割を占める大産地。筋子・イクラ加工産業の全国中枢。"
      },
      {
        rank: 2,
        prefectureCode: "040003",
        prefectureName: "宮城県",
        production: 16200,
        share: 18.2,
        mainCities: [
          { code: "045811", name: "女川町", highlight: "銀鮭養殖日本一・みやぎサーモン中枢" },
          { code: "042021", name: "石巻市", highlight: "牡鹿半島のリアス式養殖サーモン基地" }
        ],
        notes: "国産養殖サーモン（ギンザケ）のシェア85%以上。脂の乗った生食用として全国流通。"
      },
      {
        rank: 3,
        prefectureCode: "030003",
        prefectureName: "岩手県",
        production: 5900,
        share: 6.6,
        mainCities: [
          { code: "032026", name: "宮古市", highlight: "本州一のサケ水揚げ港・新巻鮭発祥" }
        ],
        notes: "津軽石川など清流に戻る「南部鼻曲がり鮭」。伝統の新巻鮭加工が有名。"
      },
      {
        rank: 4,
        prefectureCode: "020003",
        prefectureName: "青森県",
        production: 3100,
        share: 3.5,
        mainCities: [
          { code: "022080", name: "むつ市", highlight: "津軽海峡海峡サーモン海面養殖" }
        ],
        notes: "下北半島沿岸の秋鮭定置網と、荒波で育てる海峡サーモンの養殖。"
      },
      {
        rank: 5,
        prefectureCode: "150003",
        prefectureName: "新潟県",
        production: 1100,
        share: 1.2,
        mainCities: [
          { code: "152129", name: "村上市", highlight: "三面川・鮭のまち・伝統の塩引き鮭" }
        ],
        notes: "三面川の青海川など日本海側屈指の回帰河川。干し上げる「塩引き鮭」は伝統文化財。"
      }
    ]
  },
  {
    id: "nori",
    name: "のり類（海苔・養殖乾のり）",
    kana: "ノリ",
    englishName: "Nori / Seaweed (Aquaculture)",
    category: "fishery",
    categoryLabel: "水産業・海洋資源",
    unit: "t",
    icon: "🍙",
    summary: "農林水産省「漁業・養殖業生産統計」による海苔（乾のり）の全国生産量。最大6メートルの日本一の干満差を誇る有明海沿岸（佐賀・福岡・熊本）と、瀬戸内海の播磨灘（兵庫県）が全国の8割以上を生産。",
    season: "冬期（11月〜翌3月：初摘み・一番摘み）",
    nationalTotalProduction: 58000,
    nationalOutputValue: 920,
    mainVarieties: [
      "佐賀海苔「佐賀のり・紫香（しこう）」（20年連続日本一）",
      "福岡有明のり（柳川・大牟田）",
      "明石一番摘み海苔（兵庫・瀬戸内海）",
      "くまもと有明のり（天草・玉名）",
      "江戸前木更津海苔（千葉・東京湾）"
    ],
    growingConditions: "有明海は日本一の干潮・満潮の潮位差（最大6メートル）を有し、筑後川をはじめ大小100以上の河川から豊富なミネラルと栄養塩が注ぎ込みます。有明海独自の「支柱式養殖」は、満潮時には海中で栄養をたっぷり吸収し、干潮時には海面上に露出して冬の太陽光を直接浴びることで、アミノ酸（旨味）が凝縮され口の中でとろける柔らかい海苔が育ちます。一方、兵庫県（播磨灘）は速い潮流を活かした「浮動流野式」で、おにぎりや巻き寿司に適した色艶と歯切れの良い海苔を大量生産します。",
    trivia: "佐賀県は有明海苔の「販売額・生産量ともに20年連続日本一」を達成している絶対王者です。有明海の一番摘み海苔は、火であぶると鮮やかな緑色に変わり、口に含むと芳醇な香りと甘みが広がります。おにぎり・コンビニ需要を支える兵庫県産と、高級贈答用を牽引する佐賀県産という、産地ごとの明確な役割分担が日本の海苔産業を形作っています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "410003",
        prefectureName: "佐賀県",
        production: 14800,
        share: 25.5,
        mainCities: [
          { code: "412015", name: "佐賀市", highlight: "有明海苔の中心地・販売額20年連続日本一" },
          { code: "414255", name: "白石町", highlight: "広大な有明海干潟で育つ最高級海苔" }
        ],
        notes: "有明海の干満差と支柱式養殖が生み出すとろける甘み。全国のトップブランド。"
      },
      {
        rank: 2,
        prefectureCode: "400003",
        prefectureName: "福岡県",
        production: 9800,
        share: 16.9,
        mainCities: [
          { code: "402079", name: "柳川市", highlight: "水郷柳川・筑後川河口の福岡有明のり" }
        ],
        notes: "筑後川がもたらす豊富な栄養塩。福岡有明のりとして全国の寿司店・贈答に流通。"
      },
      {
        rank: 3,
        prefectureCode: "280003",
        prefectureName: "兵庫県",
        production: 9100,
        share: 15.7,
        mainCities: [
          { code: "282031", name: "明石市", highlight: "明石海峡の急流が育む色艶と歯切れの海苔" }
        ],
        notes: "瀬戸内海・播磨灘の浮動流野式。コンビニおにぎりや加工海苔の全国最大拠点。"
      },
      {
        rank: 4,
        prefectureCode: "430003",
        prefectureName: "熊本県",
        production: 7200,
        share: 12.4,
        mainCities: [
          { code: "432067", name: "玉名市", highlight: "有明海沿岸の伝統海苔産地" }
        ],
        notes: "有明海南部・島原湾の豊かな漁場。一番摘みの香り高さが人気。"
      },
      {
        rank: 5,
        prefectureCode: "120003",
        prefectureName: "千葉県",
        production: 3600,
        share: 6.2,
        mainCities: [
          { code: "122068", name: "木更津市", highlight: "江戸前海苔の伝統を受け継ぐ東京湾産地" }
        ],
        notes: "かつて江戸前の代名詞だった東京湾の海苔。豊かな磯の香りと伝統の技。"
      }
    ]
  },
  {
    id: "yellowtail",
    name: "ぶり類（ブリ・養殖ハマチ＆天然寒ブリ）",
    kana: "ブリ",
    englishName: "Yellowtail / Amberjack",
    category: "fishery",
    categoryLabel: "水産業・海洋資源",
    unit: "t",
    icon: "🐟",
    summary: "農林水産省統計によるブリ類（ブリ・ハマチ・カンパチ）の全国生産量。錦江湾や長島町など温暖で水深の深い入江で日本一の養殖ブリを育てる鹿児島県・愛媛県と、冬の日本海定置網「寒ブリ」の富山県氷見が有名。",
    season: "冬期（11月〜2月：寒ブリ・養殖最盛期）",
    nationalTotalProduction: 138000,
    nationalOutputValue: 1150,
    mainVarieties: [
      "鹿児島「鰤王（ぶりおう）」「ボンタンぶり」（長島町・東町漁協）",
      "愛媛「宇和島ぶり」「戸島一番ブリ」",
      "富山「氷見の寒ブリ」（定置網・天然最高峰）",
      "高知「極上の藁焼きブリ」（須崎・宿毛）",
      "長崎五島列島ハーブブリ"
    ],
    growingConditions: "ブリは出世魚（モジャコ→ワカシ→イナダ・ハマチ→ワラサ→ブリ）として知られ、縁起物として正月や慶事に欠かせない日本の伝統魚です。鹿児島県（長島海峡・錦江湾）や愛媛県（宇和海）は、黒潮が流入する温暖な水温と、リアス式海岸の深い水深、潮通しの良さが揃い、日本最大の海面ブリ養殖地帯を形成しています。一方、日本海側の富山湾（氷見市）は、能登半島に沿って南下する天然ブリが「あいの風」の吹く冬に湾内の大型定置網へ迷い込み、脂の乗り切った最高級「氷見の寒ブリ」として水揚げされます。",
    trivia: "鹿児島県長島町の東町漁協が手がける「鰤王（ぶりおう）」は、単一漁協として世界最大のブリ養殖規模を誇り、米国をはじめ世界各国へ冷蔵・冷凍で輸出されるグローバルブランドです。一方、富山湾の定置網漁法は400年以上の歴史を持ち、魚を傷つけず生きたまま水揚げする持続可能な漁業モデルとして国連FAOの世界農業遺産など世界中から注目されています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "460003",
        prefectureName: "鹿児島県",
        production: 44500,
        share: 32.2,
        mainCities: [
          { code: "464040", name: "長島町", highlight: "世界最大の養殖ブリ産地・鰤王の島" },
          { code: "462144", name: "垂水市", highlight: "錦江湾の桜島美湯豚・養殖カンパチ＆ブリ" }
        ],
        notes: "全国シェア3割超の養殖ブリ大国。東町漁協の「鰤王」は世界基準の衛生管理。"
      },
      {
        rank: 2,
        prefectureCode: "380003",
        prefectureName: "愛媛県",
        production: 30200,
        share: 21.9,
        mainCities: [
          { code: "382035", name: "宇和島市", highlight: "宇和海のリアス海岸・戸島一番ブリ" }
        ],
        notes: "宇和海沿岸のリアス海岸。マダイと並ぶ愛媛養殖水産業の看板魚。"
      },
      {
        rank: 3,
        prefectureCode: "390003",
        prefectureName: "高知県",
        production: 15100,
        share: 10.9,
        mainCities: [
          { code: "392081", name: "宿毛市", highlight: "宿毛湾の黒潮養殖ブリ・直七ぶり" }
        ],
        notes: "宿毛湾や須崎湾など黒潮直結の海域で高品質な養殖ブリを展開。"
      },
      {
        rank: 4,
        prefectureCode: "420003",
        prefectureName: "長崎県",
        production: 12800,
        share: 9.3,
        mainCities: [
          { code: "422118", name: "対馬市", highlight: "対馬海峡・五島の清浄海域で育つブリ" }
        ],
        notes: "離島の豊かな漁場。天然ブリの水揚げと先進的養殖の両輪。"
      },
      {
        rank: 5,
        prefectureCode: "160003",
        prefectureName: "富山県",
        production: 4200,
        share: 3.0,
        mainCities: [
          { code: "162051", name: "氷見市", highlight: "氷見の寒ブリ・越中式定置網発祥の地" }
        ],
        notes: "能登半島が形成する天然の生簀・富山湾。雪起こしの雷とともに獲れる極上寒ブリ。"
      }
    ]
  }
];

// 自治体コード検証
console.log('Verifying municipality codes for fishery items...');
for (const item of fisheryItems) {
  for (const r of item.rankings) {
    for (const city of r.mainCities) {
      if (!muniMap.has(city.code)) {
        console.error(`ERROR: Municipality code ${city.code} (${city.name}) NOT found in summary!`);
        process.exit(1);
      }
    }
  }
}
console.log('All municipality codes verified successfully.');

// 重複チェックとマージ
const existingIds = new Set(data.items.map(i => i.id));
let addedCount = 0;

for (const item of fisheryItems) {
  if (existingIds.has(item.id)) {
    console.log(`Skipping existing item: ${item.id}`);
    const idx = data.items.findIndex(i => i.id === item.id);
    data.items[idx] = item;
  } else {
    data.items.push(item);
    addedCount++;
    console.log(`Added: ${item.id} (${item.name})`);
  }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`Done! Added ${addedCount} fishery items. Total items: ${data.items.length}`);
