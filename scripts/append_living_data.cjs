const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'handbook', 'fruits.json');
const munisPath = path.join(__dirname, '..', 'src', 'data', 'municipalities_summary.json');

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const munisRaw = fs.readFileSync(munisPath, 'utf8');
const munis = JSON.parse(munisRaw);
const muniMap = new Map(munis.map(m => [m.code, m.name]));

const livingItems = [
  {
    id: "gyoza",
    name: "ギョーザ（餃子購入額）",
    kana: "ギョーザ",
    englishName: "Gyoza / Dumplings Spending",
    category: "living",
    categoryLabel: "暮らし・家計・日本一",
    unit: "円",
    icon: "🥟",
    summary: "総務省統計局「家計調査」（二人以上の世帯）によるギョーザの1世帯あたり年間支出金額。宮崎市・宇都宮市・浜松市が繰り広げる「日本一の餃子の街」三つ巴の激戦が毎年全国的な話題を呼んでいます。",
    season: "通年（秋冬に消費増・持ち帰り文化）",
    nationalTotalProduction: 2045,
    nationalOutputValue: 420,
    mainVarieties: [
      "宮崎餃子（ラード焼き・持ち帰り生餃子）",
      "宇都宮餃子（野菜多め・白菜系ヘルシー）",
      "浜松餃子（円盤焼き・もやし添え）",
      "鹿児島黒豚餃子"
    ],
    growingConditions: "宮崎県は豚肉・鶏肉・キャベツ・ニラなど餃子の全原材料が県内で最高鮮度で揃う農業王国であり、夕食にテイクアウトの生餃子を家庭で焼いて食べる生活文化が浸透しています。宇都宮市は第二次世界大戦中の陸軍第14師団が中国から製法を持ち帰り、戦後引き揚げ者が屋台を開いたのが始まり。浜松市は戦後のものづくり工場労働者の夜勤スタミナ源として発展し、フライパンで丸く焼いて中心にもやしを添える独自スタイルが定着しました。",
    trivia: "毎年2月上旬に総務省から家計調査が発表される日は、宮崎・宇都宮・浜松各市の協議会や市長が記者会見を行うほどの盛り上がりを見せます。宮崎市は2020年以降、官民一体の「宮崎市ぎょうざ協議会」を結成してPRを強化し、宇都宮・浜松の二強に割って入る快挙を達成しました。地域の一次産業（畜産・野菜）とシビックプライドが結実したシビックテック探究の好例です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "450003",
        prefectureName: "宮崎県",
        production: 4053,
        share: 8.5,
        mainCities: [
          { code: "452017", name: "宮崎市", highlight: "餃子購入額日本一・持ち帰り生餃子文化" }
        ],
        notes: "宮崎市が宇都宮・浜松を抑えて年間購入額日本一を獲得。お持ち帰り専門店が街中に点在。"
      },
      {
        rank: 2,
        prefectureCode: "090003",
        prefectureName: "栃木県",
        production: 3929,
        share: 8.2,
        mainCities: [
          { code: "092011", name: "宇都宮市", highlight: "元祖・餃子の街・餃子通り" }
        ],
        notes: "「餃子の街」の代名詞。市内に約80店舗の専門店が集積し、野菜たっぷりのヘルシーな味わいが特徴。"
      },
      {
        rank: 3,
        prefectureCode: "220003",
        prefectureName: "静岡県",
        production: 3718,
        share: 7.8,
        mainCities: [
          { code: "221309", name: "浜松市", highlight: "円盤餃子ともやし添え・ものづくりの夜食発祥" }
        ],
        notes: "フライパンの円形焼きと中央の茹でもやしがトレードマーク。キャベツの甘みと豚肉の旨味が際立つ。"
      },
      {
        rank: 4,
        prefectureCode: "460003",
        prefectureName: "鹿児島県",
        production: 3020,
        share: 6.3,
        mainCities: [
          { code: "462012", name: "鹿児島市", highlight: "黒豚・キャベツの産地直結餃子" }
        ],
        notes: "日本一の養豚王国・鹿児島ならではのジューシーな黒豚肉を贅沢に使った餃子消費が極めて活発。"
      },
      {
        rank: 5,
        prefectureCode: "250003",
        prefectureName: "滋賀県",
        production: 2750,
        share: 5.8,
        mainCities: [
          { code: "252018", name: "大津市", highlight: "関西トップの餃子消費都市" }
        ],
        notes: "京阪神のベッドタウンとしてファミリー層が多く、家庭内での手作り・持ち帰り餃子需要が常に全国上位。"
      }
    ]
  },
  {
    id: "ramen-eating-out",
    name: "ラーメン・中華そば（外食支出額）",
    kana: "ラーメン・チュウカソバ",
    englishName: "Ramen / Chinese Noodles Spending",
    category: "living",
    categoryLabel: "暮らし・家計・日本一",
    unit: "円",
    icon: "🍜",
    summary: "総務省家計調査による「中華そば（外食）」の1世帯あたり年間支出額。厳しい寒さと独自のおもてなし文化を背景に、山形市と新潟市が全国屈指の支出額日本一を熾烈に競い合っています。",
    season: "通年（冬期に急増・夏は冷やしラーメン）",
    nationalTotalProduction: 6800,
    nationalOutputValue: 7500,
    mainVarieties: [
      "山形ラーメン（冷やしラーメン・鳥中華・赤湯辛味噌）",
      "新潟5大ラーメン（燕三条背脂・長岡生姜・新潟あっさり・濃厚味噌・三条カレー）",
      "仙台ラーメン",
      "盛岡麺文化（冷麺・温麺・じゃじゃ麺）"
    ],
    growingConditions: "山形県は盆地気候で冬の寒さが厳しく熱々のスープが愛される一方、夏は日本屈指の猛暑となるため昭和初期に「冷やしラーメン」が考案されました。さらに山形には「来客には出前の中華そばをとってもてなす」という独自の生活文化（もてなし文化）が根付いており、日常的な外食・出前頻度が全国一です。新潟県は港町や燕三条の金属加工職人の夜勤労働者の塩分補給として、背脂や生姜を効かせた冷めにくいラーメン文化が花開きました。",
    trivia: "山形市は2021年に新潟市に日本一の座を譲った際、行政（市役所）とラーメン店主が「ラーメンの聖地、山形市を創る協議会」を結成。市民総出で外食消費を盛り上げ、翌2022年に王座を奪還しました。また山形県南陽市役所には実在の公的部署「ラーメン課」が設置されるなど、シビックテックと地域振興の最高のお手本となっています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "060003",
        prefectureName: "山形県",
        production: 17593,
        share: 11.2,
        mainCities: [
          { code: "062014", name: "山形市", highlight: "中華そば支出額日本一・冷やしラーメン発祥" },
          { code: "062138", name: "南陽市", highlight: "市役所にラーメン課のある街・赤湯辛味噌" }
        ],
        notes: "年間1万7千円超の外食支出は全国平均の約2.5倍。人口あたりのラーメン店数も日本一。"
      },
      {
        rank: 2,
        prefectureCode: "150003",
        prefectureName: "新潟県",
        production: 15224,
        share: 9.7,
        mainCities: [
          { code: "151009", name: "新潟市", highlight: "ラーメン王国・あっさり極細＆濃厚味噌" },
          { code: "152137", name: "燕市", highlight: "燕三条背脂極太煮干しラーメン" }
        ],
        notes: "新潟5大ラーメンを擁する激戦地。金属洋食器・金型のものづくり産業と密接にリンクした食文化。"
      },
      {
        rank: 3,
        prefectureCode: "040003",
        prefectureName: "宮城県",
        production: 13034,
        share: 8.3,
        mainCities: [
          { code: "041009", name: "仙台市", highlight: "東北最大のラーメン激戦区・辛味噌" }
        ],
        notes: "東北の中枢都市として有名店が集積。宮城・山形・福島の麺文化が交差する大市場。"
      },
      {
        rank: 4,
        prefectureCode: "090003",
        prefectureName: "栃木県",
        production: 11850,
        share: 7.5,
        mainCities: [
          { code: "092011", name: "宇都宮市", highlight: "佐野ラーメン近接・餃子とセットの麺食文化" }
        ],
        notes: "餃子だけでなくラーメン支出も全国4位。青竹手打ちの佐野ラーメン文化圏とも接続。"
      },
      {
        rank: 5,
        prefectureCode: "030003",
        prefectureName: "岩手県",
        production: 11200,
        share: 7.1,
        mainCities: [
          { code: "032018", name: "盛岡市", highlight: "麺都盛岡・冷麺・じゃじゃ麺・わんこそば" }
        ],
        notes: "三大麺（わんこそば・冷麺・じゃじゃ麺）を誇る麺どころ。中華そばも日常食として極めて親しまれる。"
      }
    ]
  },
  {
    id: "natto",
    name: "納豆（年間購入額）",
    kana: "ナットウ",
    englishName: "Natto / Fermented Soybeans Spending",
    category: "living",
    categoryLabel: "暮らし・家計・日本一",
    unit: "円",
    icon: "🥢",
    summary: "総務省家計調査による「納豆」の1世帯あたり年間支出金額。水戸納豆で有名な茨城県のみならず、福島・盛岡・青森など東北各市が全国トップクラスを独占する雪国の伝統発酵食品文化です。",
    season: "通年（冬期の朝食・日常食）",
    nationalTotalProduction: 4300,
    nationalOutputValue: 2600,
    mainVarieties: [
      "水戸納豆（小粒大豆・わらづと納豆）",
      "福島紅大豆納豆",
      "盛岡大粒納豆",
      "ひきわり納豆（青森・秋田）"
    ],
    growingConditions: "茨城県水戸市は那珂川の氾濫に備えて台風前に収穫できる「早生（わせ）小粒大豆」が栽培され、明治22年の常磐線開通時に駅ホームで販売された「水戸天狗納豆」が全国土産として定着しました。一方、支出額で水戸を上回る東北地方（福島・岩手・青森・山形）は、長い豪雪期の保存食として納豆を汁物（納豆汁）に仕立てたり、朝夕の日常食として家族全員で消費する習慣が数百年受け継がれています。",
    trivia: "西日本と東日本で最も消費格差が大きい食品の一つが納豆です。東北各市が年間6,000円を超えるのに対し、関西や四国の一部都市では2,000円台にとどまります。しかし近年は腸活ブームやにおい控えめ納豆の開発により全国的な健康食として定着し、ふるさと納税返礼品としても高級わら納豆が大人気です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "070003",
        prefectureName: "福島県",
        production: 6733,
        share: 10.5,
        mainCities: [
          { code: "072010", name: "福島市", highlight: "納豆購入額全国トップ常連の街" }
        ],
        notes: "年間購入額で全国1位を幾度も獲得。朝食だけでなく夕食やおやつ、郷土料理にも多用。"
      },
      {
        rank: 2,
        prefectureCode: "030003",
        prefectureName: "岩手県",
        production: 6450,
        share: 10.1,
        mainCities: [
          { code: "032018", name: "盛岡市", highlight: "雪国の日常発酵食・朝食の定番" }
        ],
        notes: "寒冷な冬を乗り切る良質な植物性タンパク質源として、大粒納豆からひきわりまで幅広く消費。"
      },
      {
        rank: 3,
        prefectureCode: "080003",
        prefectureName: "茨城県",
        production: 6041,
        share: 9.4,
        mainCities: [
          { code: "082015", name: "水戸市", highlight: "水戸納豆発祥の地・小粒わら納豆" }
        ],
        notes: "全国にその名を知られる納豆の代名詞。大豆品種改良と加工技術のイノベーション拠点。"
      },
      {
        rank: 4,
        prefectureCode: "020003",
        prefectureName: "青森県",
        production: 5820,
        share: 9.1,
        mainCities: [
          { code: "022012", name: "青森市", highlight: "ひきわり納豆消費が日本一高い地域" }
        ],
        notes: "粒を細かく砕いた「ひきわり納豆」の消費比率が全国トップ。離乳食から高齢者食まで親しまれる。"
      },
      {
        rank: 5,
        prefectureCode: "060003",
        prefectureName: "山形県",
        production: 5610,
        share: 8.8,
        mainCities: [
          { code: "062014", name: "山形市", highlight: "納豆汁など冬の郷土温食文化" }
        ],
        notes: "すり鉢で納豆をすりつぶして味噌汁に入れる伝統の「納豆汁」は冬の代表的なご馳走。"
      }
    ]
  },
  {
    id: "curry-consumption",
    name: "カレールウ（年間購入額）",
    kana: "カレールウ",
    englishName: "Curry Roux Spending",
    category: "living",
    categoryLabel: "暮らし・家計・日本一",
    unit: "円",
    icon: "🍛",
    summary: "総務省家計調査による「カレールウ」の1世帯あたり年間購入金額。鳥取市が長年全国1位の座を守り続けるほか、新潟・青森・富山など日本海側の降雪地帯で圧倒的な消費量を誇る日本の国民食です。",
    season: "通年（週末の定番食・家庭料理）",
    nationalTotalProduction: 1500,
    nationalOutputValue: 1200,
    mainVarieties: [
      "鳥取カレー（鳥取砂丘らっきょう添え）",
      "新潟バスセンターの黄色いカレー",
      "富山ブラックカレー",
      "金沢カレー（濃厚ルー・千切りキャベツ・カツ）"
    ],
    growingConditions: "鳥取市や北陸各県は全国屈指の「女性の有業率（共働き率）の高さ」を誇ります。共働きで忙しい家庭において、前日や朝に作っておけば家族全員が温め直して食べられるカレーは最強の時短メニューです。さらに鳥取県は全国一の「砂丘らっきょう」産地であり、カレーとらっきょうの組み合わせが日常の食卓に深く根付いています。冬の積雪による買い出し頻度の抑制と、大鍋料理の相性の良さも消費を強力に後押ししています。",
    trivia: "鳥取市が家計調査でカレールウ購入額日本一であることが知られて以降、鳥取市では「鳥取カレー総合研究所」が設立され、特産の梨やらっきょう、カニを使ったご当地カレーが次々と開発されました。地域の公的データが新たな観光資源・ご当地グルメ振興を生み出した好例です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "310003",
        prefectureName: "鳥取県",
        production: 2130,
        share: 9.8,
        mainCities: [
          { code: "312011", name: "鳥取市", highlight: "カレールウ購入額日本一・砂丘らっきょうの産地" }
        ],
        notes: "長年にわたり全国1位の座を維持。らっきょうの消費量も全国トップクラス。"
      },
      {
        rank: 2,
        prefectureCode: "150003",
        prefectureName: "新潟県",
        production: 1980,
        share: 9.1,
        mainCities: [
          { code: "151009", name: "新潟市", highlight: "バスセンターのカレー・家庭の常備食" }
        ],
        notes: "米どころ新潟はお米の消費量も日本一。美味しいご飯とカレーの相乗効果で高水準。"
      },
      {
        rank: 3,
        prefectureCode: "020003",
        prefectureName: "青森県",
        production: 1890,
        share: 8.7,
        mainCities: [
          { code: "022012", name: "青森市", highlight: "りんご・にんにくの隠し味・冬の家庭料理" }
        ],
        notes: "特産のりんごやにんにくをすりおろしてカレーに入れる家庭が多く、冬の定番暖房食。"
      },
      {
        rank: 4,
        prefectureCode: "160003",
        prefectureName: "富山県",
        production: 1820,
        share: 8.4,
        mainCities: [
          { code: "162019", name: "富山市", highlight: "共働き率と三世代同居による大鍋カレー文化" }
        ],
        notes: "広い住まいと三世代同居が多く、大鍋でたっぷり作る家庭料理の筆頭。"
      },
      {
        rank: 5,
        prefectureCode: "170003",
        prefectureName: "石川県",
        production: 1790,
        share: 8.2,
        mainCities: [
          { code: "172014", name: "金沢市", highlight: "金沢カレー文化・内食外食ともに高水準" }
        ],
        notes: "ステンレス皿に千切りキャベツとカツを載せる濃厚金沢カレーが外食でも一大産業に発展。"
      }
    ]
  },
  {
    id: "coffee-cafe",
    name: "喫茶代・モーニング（年間支出額）",
    kana: "キッサダイ・モーニング",
    englishName: "Cafe / Morning Service Spending",
    category: "living",
    categoryLabel: "暮らし・家計・日本一",
    unit: "円",
    icon: "☕",
    summary: "総務省家計調査による「喫茶代（外食）」の1世帯あたり年間支出額。中京圏（岐阜市・名古屋市）の驚異的な「モーニングサービス文化」と、関西（京都・神戸）の老舗珈琲館・サロン文化が全国を牽引しています。",
    season: "通年（朝のモーニング・憩いの場）",
    nationalTotalProduction: 7200,
    nationalOutputValue: 10000,
    mainVarieties: [
      "岐阜モーニング（茶碗蒸し・赤飯・サラダ付き）",
      "名古屋モーニング（小倉トースト・ゆで卵）",
      "一宮モーニング（発祥の地・尾州織物）",
      "京都ネルドリップ珈琲・純喫茶",
      "神戸港町カフェ"
    ],
    growingConditions: "岐阜市や愛知県一宮市周辺は、かつて日本一の毛織物産地（尾州織物）でした。織物工場の中は機織り機の騒音が激しいため、商談や打ち合わせを近所の喫茶店で行う習慣が根付きました。店主たちが繊維業の客をもてなそうと、コーヒー1杯にゆで卵やトースト、茶碗蒸しなどを無料サービス（モーニング）したことから競争が加速し、現在では地域の高齢者や家族連れの朝のコミュニティサロンとして定着しています。",
    trivia: "中京圏では「朝食は家で作らず、近所の喫茶店でモーニングを食べるのが一番安くて豪華」というユニークな生活常識があります。一方、京都市はパン消費額も日本一を誇り、伝統的な職人や学生、芸術家が思索に耽る場として独自の珈琲文化を育んできました。都市の産業史と生活様式が喫茶店という空間に見事に反映されています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "210003",
        prefectureName: "岐阜県",
        production: 15622,
        share: 12.8,
        mainCities: [
          { code: "212016", name: "岐阜市", highlight: "喫茶代支出額日本一・豪華モーニング文化" }
        ],
        notes: "年間1万5千円超を喫茶店に支出。コーヒー1杯で茶碗蒸しや麺類まで付く驚異のサービス。"
      },
      {
        rank: 2,
        prefectureCode: "230003",
        prefectureName: "愛知県",
        production: 14350,
        share: 11.8,
        mainCities: [
          { code: "231002", name: "名古屋市", highlight: "コメダ珈琲店発祥・小倉トースト" },
          { code: "232033", name: "一宮市", highlight: "モーニング発祥の地・織物工場の商談場" }
        ],
        notes: "コメダ珈琲店をはじめとする巨大喫茶チェーンの揺籃の地。一宮市は全国モーニング博を開催。"
      },
      {
        rank: 3,
        prefectureCode: "130003",
        prefectureName: "東京都",
        production: 11200,
        share: 9.2,
        mainCities: [
          { code: "131016", name: "千代田区", highlight: "ビジネス街のサードプレイス・カフェ需要" }
        ],
        notes: "単身世帯の多さとテレワーク・商談のサードプレイス需要で高額消費を維持。"
      },
      {
        rank: 4,
        prefectureCode: "260003",
        prefectureName: "京都府",
        production: 10890,
        share: 8.9,
        mainCities: [
          { code: "261009", name: "京都市", highlight: "イノダコーヒ・前田珈琲・大学と職人の街" }
        ],
        notes: "パン消費量日本一と連動。老舗純喫茶が生活文化として溶け込み、学生・文化人が集う。"
      },
      {
        rank: 5,
        prefectureCode: "280003",
        prefectureName: "兵庫県",
        production: 9850,
        share: 8.1,
        mainCities: [
          { code: "281000", name: "神戸市", highlight: "UCC上島珈琲発祥・開港場モダン喫茶" }
        ],
        notes: "明治開港以来のハイカラな洋食・ベーカリー・珈琲文化が根付く港町。"
      }
    ]
  },
  {
    id: "housing-space",
    name: "住宅延べ床面積（広さ日本一）",
    kana: "ジュウタクノベユカメンセキ",
    englishName: "Housing Floor Space & Home Ownership",
    category: "living",
    categoryLabel: "暮らし・家計・日本一",
    unit: "㎡",
    icon: "🏡",
    summary: "総務省「住宅・土地統計調査」による1住宅あたり延べ床面積および持ち家比率。富山県・福井県・山形県など北陸・東北地方が、東京都（約65㎡）の2倍以上に達する圧倒的な「住まいの広さ」と堅実な持家社会を誇ります。",
    season: "通年（住環境・子育て・三世代同居）",
    nationalTotalProduction: 92,
    nationalOutputValue: 61,
    mainVarieties: [
      "富山の伝統家屋（枠の内造り・アズマダチ）",
      "越前瓦の堅牢住宅",
      "山形・秋田の豪雪対応木造住宅",
      "大型ガレージ・雪囲い"
    ],
    growingConditions: "富山県をはじめとする北陸・東北地方は、平野部が広く地価が手頃であることに加え、古くから「家を建てて一人前」「堅実に貯蓄して立派な家を残す」という勤勉・貯蓄の気風が強く根付いています。また、冬の厳しい積雪に耐えうる頑丈な太い梁と柱を用いた伝統工法が発達し、親・子・孫が一緒に暮らす「三世代同居」の割合が高いため、仏間や客間、多目的スペースを備えた大空間の住まいが標準となっています。",
    trivia: "東京都の平均住宅延べ面積が約65.2㎡であるのに対し、富山県は152.3㎡と2.3倍以上の差があります。「富山は広さ日本一」「福井は持ち家率と幸福度日本一」という住環境の豊かさは、近年ではリモートワークや子育て世帯の地方移住（U・Iターン）を呼び込む強力なアドバンテージとなっています。自治体カルテの「実質公債費比率」や「財政力」とも深く関わる地方の生活基盤の象徴です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "160003",
        prefectureName: "富山県",
        production: 152,
        share: 76.8,
        mainCities: [
          { code: "162019", name: "富山市", highlight: "住宅延べ床面積日本一・広大な木造持ち家文化" },
          { code: "162027", name: "高岡市", highlight: "伝統木造工法と職人の技が息づく街" }
        ],
        notes: "1住宅あたり平均152.3㎡で全国ダントツ1位。持ち家率も76.8%と極めて高水準。"
      },
      {
        rank: 2,
        prefectureCode: "180003",
        prefectureName: "福井県",
        production: 146,
        share: 76.5,
        mainCities: [
          { code: "182010", name: "福井市", highlight: "全国家族幸福度トップ・三世代同居と共働き" },
          { code: "182028", name: "敦賀市", highlight: "嶺南の中核・ゆとりある住宅環境" }
        ],
        notes: "平均146.2㎡。共働き率日本一と三世代同居が支える高い世帯所得と堅実な住まい。"
      },
      {
        rank: 3,
        prefectureCode: "060003",
        prefectureName: "山形県",
        production: 141,
        share: 75.7,
        mainCities: [
          { code: "062014", name: "山形市", highlight: "広大な敷地と豪雪対応の堅牢家屋" },
          { code: "062049", name: "酒田市", highlight: "庄内平野のゆとりある住環境" }
        ],
        notes: "平均141.5㎡。豪雪に耐える大黒柱と広い間取りが特徴的なゆとりの暮らし。"
      },
      {
        rank: 4,
        prefectureCode: "050003",
        prefectureName: "秋田県",
        production: 140,
        share: 77.3,
        mainCities: [
          { code: "052019", name: "秋田市", highlight: "持ち家率全国トップクラス・広い住まい" },
          { code: "052035", name: "横手市", highlight: "かまくらの街・雪国の大空間住宅" }
        ],
        notes: "持ち家率77.3%は全国屈指。140㎡前後の広大な木造家屋が標準的。"
      },
      {
        rank: 5,
        prefectureCode: "150003",
        prefectureName: "新潟県",
        production: 133,
        share: 74.2,
        mainCities: [
          { code: "151009", name: "新潟市", highlight: "越後平野のゆとりある住環境" },
          { code: "152021", name: "長岡市", highlight: "信濃川流域の豪雪対応頑丈住宅" }
        ],
        notes: "平均133.4㎡。車社会に対応した複数台ガレージ完備のゆったりした敷地。"
      }
    ]
  }
];

// 自治体コード検証
console.log('Verifying municipality codes...');
for (const item of livingItems) {
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

for (const item of livingItems) {
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
console.log(`Done! Added ${addedCount} living items. Total items: ${data.items.length}`);
