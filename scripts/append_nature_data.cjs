const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'handbook', 'fruits.json');
const munisPath = path.join(__dirname, '..', 'src', 'data', 'municipalities_summary.json');

const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const munisRaw = fs.readFileSync(munisPath, 'utf8');
const munis = JSON.parse(munisRaw);
const muniMap = new Map(munis.map(m => [m.code, m.name]));

const natureItems = [
  {
    id: "sunshine-duration",
    name: "年間日照時間（太陽の恵み日本一）",
    kana: "ニッショウジカン",
    englishName: "Annual Sunshine Duration",
    category: "nature",
    categoryLabel: "自然・気候・文化日本一",
    unit: "時間",
    icon: "☀️",
    summary: "気象庁「過去の気象データ」（平年値）による年間日照時間。四方を山に囲まれた甲府盆地を擁する山梨県が年間2,300時間超で全国1位。果樹栽培や太陽光発電の好適地として自然エネルギー集積が進む。",
    season: "通年（冬期の快晴率が特に高い）",
    nationalTotalProduction: 1950,
    nationalOutputValue: 2800,
    mainVarieties: [
      "甲府盆地の日照・ぶどう桃栽培",
      "北杜市メガソーラー（日本一の日照の街）",
      "高知黒潮サンシャイン",
      "静岡遠州のからっ風と冬晴れ",
      "埼玉熊谷の快晴日数"
    ],
    growingConditions: "山梨県甲府盆地は周囲を富士山・南アルプス・八ヶ岳・御坂山地に囲まれた典型的な内陸性盆地気候です。日本海側からの雪雲も太平洋側からの雨雲も高い山々に遮られるため、年間降水量が約1,100ミリと全国でも有数の少雨地帯となり、年間を通じて雲が出にくく日照時間が極めて長くなります。この気候特性はぶどう・すもも・ももなどの糖度を極限まで高める果樹王国を育み、近年では北杜市を中心に日本屈指の太陽光発電基地を形成しています。",
    trivia: "山梨県北杜市（ほくとし）は旧明野村時代から「日本一の日照時間の街」として知られ、広大なひまわり畑（北杜市明野サンフラワーフェス）が夏の風物詩です。日照の多さは農業だけでなく、冬でも晴天の日が多いため日中の体感温度が暖かく、澄んだ空気と合わせて天体観測や星空リゾートとしても全国から人気を集めています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "190003",
        prefectureName: "山梨県",
        production: 2320,
        share: 11.9,
        mainCities: [
          { code: "192015", name: "甲府市", highlight: "甲府盆地の少雨晴天・果樹とワインの街" },
          { code: "192091", name: "北杜市", highlight: "日本一の日照時間・明野ひまわり畑" }
        ],
        notes: "年間約2,320時間で全国トップ。甲府盆地の少雨と八ヶ岳南麓の豊かな日照。"
      },
      {
        rank: 2,
        prefectureCode: "390003",
        prefectureName: "高知県",
        production: 2280,
        share: 11.7,
        mainCities: [
          { code: "392014", name: "高知市", highlight: "南国土佐の強い太陽光・施設園芸農業" }
        ],
        notes: "太平洋に面した温暖気候。冬でも晴天が多くハウス促成栽培（ナス・ピーマン）が盛ん。"
      },
      {
        rank: 3,
        prefectureCode: "100003",
        prefectureName: "群馬県",
        production: 2260,
        share: 11.6,
        mainCities: [
          { code: "102016", name: "前橋市", highlight: "赤城おろしと冬の圧倒的快晴率" }
        ],
        notes: "冬の上州からっ風とともに晴天が続く関東平野北部。乾燥と日照が特徴。"
      },
      {
        rank: 4,
        prefectureCode: "220003",
        prefectureName: "静岡県",
        production: 2250,
        share: 11.5,
        mainCities: [
          { code: "221309", name: "浜松市", highlight: "遠州のからっ風と日照時間の長さ" }
        ],
        notes: "温暖な気候と豊富な日照。温州みかんやお茶の栽培、ものづくりの好条件。"
      },
      {
        rank: 5,
        prefectureCode: "110003",
        prefectureName: "埼玉県",
        production: 2220,
        share: 11.4,
        mainCities: [
          { code: "112020", name: "熊谷市", highlight: "年間快晴日数全国トップクラスの街" }
        ],
        notes: "年間快晴日数が全国第1位を誇る晴れの王国。冬場の安定した青空が有名。"
      }
    ]
  },
  {
    id: "snowfall-depth",
    name: "年間降雪量（世界屈指の豪雪地帯）",
    kana: "コウセツリョウ",
    englishName: "Annual Snowfall Depth",
    category: "nature",
    categoryLabel: "自然・気候・文化日本一",
    unit: "cm",
    icon: "❄️",
    summary: "気象庁統計による県庁所在市・主要都市の年間累積降雪量。青森市が年間600cm超で「人口30万人以上の都市として世界一の豪雪都市」として国際的に有名。雪解け水は豊かな米作りや酒造り、水力発電を育む。",
    season: "冬期（12月〜翌3月：最深積雪期）",
    nationalTotalProduction: 180,
    nationalOutputValue: 1200,
    mainVarieties: [
      "酸ヶ湯温泉（積雪5m超・日本記録）",
      "さっぽろ雪まつり（世界三大雪まつり）",
      "越後十日町雪まつり（発祥の地）",
      "肘折温泉の豪雪（山形・大蔵村）",
      "立山黒部雪の大谷（富山・雪壁20m）"
    ],
    growingConditions: "ユーラシア大陸からの冷たいシベリア寒気団が、対馬暖流が流れる温かい日本海を渡る際に大量の水蒸気を吸収して雪雲を発達させます。この雪雲が日本の脊梁山脈（奥羽山脈・越後山脈・北アルプス）に衝突して急激に上昇気流となり、日本海側・山沿いに世界でも類を見ない記録的豪雪をもたらします。青森市は八甲田山と陸奥湾の地形的収束帯に位置するため平野部・都市部でも猛烈な雪が降り積もります。",
    trivia: "青森市は米CNN等で「世界で最も雪が降る大都市（Snowiest Major City in the World）」として特集されるほど世界的に有名です。また山形県大蔵村の肘折温泉や青森県酸ヶ湯温泉は積雪4〜5mを記録する豪雪の聖地。新潟県十日町市は日本で初めて「市民が雪を楽しむ祭典（十日町雪まつり）」を創始し、雪を厄介者から観光・文化資源へと転換した先駆者です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "020003",
        prefectureName: "青森県",
        production: 612,
        share: 26.2,
        mainCities: [
          { code: "022012", name: "青森市", highlight: "人口30万人以上で世界一の豪雪都市" }
        ],
        notes: "年平均降雪量612cm。八甲田山からの雪雲が直撃する世界有数の雪の都。"
      },
      {
        rank: 2,
        prefectureCode: "060003",
        prefectureName: "山形県",
        production: 426,
        share: 18.2,
        mainCities: [
          { code: "062014", name: "山形市", highlight: "蔵王の樹氷（スノーモンスター）" },
          { code: "063657", name: "大蔵村", highlight: "肘折温泉・積雪4m超の豪雪地帯" }
        ],
        notes: "奥羽山脈と出羽三山に囲まれた盆地。大蔵村肘折温泉は国内有数の積雪記録。"
      },
      {
        rank: 3,
        prefectureCode: "010003",
        prefectureName: "北海道",
        production: 402,
        share: 17.2,
        mainCities: [
          { code: "011002", name: "札幌市", highlight: "人口200万大都市でさっぽろ雪まつり" }
        ],
        notes: "パウダースノーのメッカ。200万都市で4m超の降雪があり地下街・ロードヒーティングが発達。"
      },
      {
        rank: 4,
        prefectureCode: "150003",
        prefectureName: "新潟県",
        production: 380,
        share: 16.3,
        mainCities: [
          { code: "152102", name: "十日町市", highlight: "現代雪まつり発祥の地・豪雪文化" },
          { code: "152251", name: "魚沼市", highlight: "魚沼コシヒカリを潤す豊かな雪解け水" }
        ],
        notes: "川端康成『雪国』の舞台。豊富な雪解け水が日本一のコシヒカリと日本酒を育む。"
      },
      {
        rank: 5,
        prefectureCode: "160003",
        prefectureName: "富山県",
        production: 320,
        share: 13.7,
        mainCities: [
          { code: "162019", name: "富山市", highlight: "立山連峰・雪の大谷（雪壁20m）" }
        ],
        notes: "立山黒部アルペンルートの「雪の大谷」は高さ20mの雪壁が世界的観光名所。"
      }
    ]
  },
  {
    id: "forest-ratio",
    name: "森林率（豊かな森と清流日本一）",
    kana: "シンリンリツ",
    englishName: "Forest Cover Ratio",
    category: "nature",
    categoryLabel: "自然・気候・文化日本一",
    unit: "%",
    icon: "🌲",
    summary: "林野庁「森林資源現況調査」による県土面積に占める森林面積割合。高知県が83.8%で全国ダントツ1位。日本全体でも国土の約67%（3分の2）が森林であり、フィンランドに次ぐ世界第2位クラスの森林大国。",
    season: "通年（新緑・紅葉・林業サイクル）",
    nationalTotalProduction: 67,
    nationalOutputValue: 24000,
    mainVarieties: [
      "土佐ヒノキ・四万十川源流（高知）",
      "飛騨の木工・美濃和紙原料林（岐阜）",
      "木曽ヒノキ・信州カラマツ（長野）",
      "富士山・南アルプス水源林（山梨）",
      "南部赤松・気仙スギ（岩手）"
    ],
    growingConditions: "日本列島は温暖湿潤気候（モンスーン気候）に属し、年間を通じて十分な降水量があるため、放置すれば自然に森林が成立する世界でも恵まれた植生環境にあります。特に高知県や岐阜県、長野県は険しい山岳地形が県土の大部分を占め、降水量も非常に多いため、古くからスギやヒノキなどの良質な人工林が造成されてきました。この広大な森林は「緑のダム」として豪雨を蓄え、四万十川や長良川などの奇跡の清流を生み出す源泉となっています。",
    trivia: "森林率日本一の高知県にある梼原町（ゆすはらちょう）は、町の9割以上が森林で占められ、世界的な建築家・隈研吾氏が木造建築の原点とした「雲の上のホテル」「雲の上の図書館」などの町並みで有名です。また岐阜県高山市は面積が東京都とほぼ同じ日本一広い市であり、「飛騨の匠」の伝統木工家具産業が世界ブランドとして愛されています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "390003",
        prefectureName: "高知県",
        production: 83.8,
        share: 83.8,
        mainCities: [
          { code: "394050", name: "梼原町", highlight: "隈研吾木造建築の聖地・森林率91%の町" }
        ],
        notes: "県土の83.8%が森林という日本一の森の王国。土佐ヒノキと四万十川の清流を育む。"
      },
      {
        rank: 2,
        prefectureCode: "210003",
        prefectureName: "岐阜県",
        production: 81.2,
        share: 81.2,
        mainCities: [
          { code: "212032", name: "高山市", highlight: "日本一広い市・飛騨の木工家具の都" }
        ],
        notes: "飛騨の山々と美濃の清流。長良川の鵜飼や美濃和紙、飛騨家具の木工文化。"
      },
      {
        rank: 3,
        prefectureCode: "200003",
        prefectureName: "長野県",
        production: 78.8,
        share: 78.8,
        mainCities: [
          { code: "204323", name: "木曽町", highlight: "伊勢神宮御神木の郷・木曽ヒノキ" }
        ],
        notes: "日本アルプスの山岳県。伊勢神宮の式年遷宮に用いられる高級木曽ヒノキの産地。"
      },
      {
        rank: 4,
        prefectureCode: "190003",
        prefectureName: "山梨県",
        production: 77.9,
        share: 77.9,
        mainCities: [
          { code: "192015", name: "甲府市", highlight: "富士山と南アルプスの天然水源林" }
        ],
        notes: "富士山と南アルプスが磨く地下水。日本のミネラルウォーター生産量約4割を供給。"
      },
      {
        rank: 5,
        prefectureCode: "030003",
        prefectureName: "岩手県",
        production: 76.7,
        share: 76.7,
        mainCities: [
          { code: "032026", name: "宮古市", highlight: "広大な北上山地の天然林と木材産業" }
        ],
        notes: "本州最大の県土面積を誇り、広大な広葉樹林・針葉樹林が豊かな木炭・木材を産出。"
      }
    ]
  },
  {
    id: "remote-islands",
    name: "島嶼・離島数（海洋国家の島々日本一）",
    kana: "リトウスウ",
    englishName: "Number of Islands & Remote Islands",
    category: "nature",
    categoryLabel: "自然・気候・文化日本一",
    unit: "島",
    icon: "🏝️",
    summary: "国土地理院「日本の島嶼調査」（周囲100m以上の島）による都道府県別島数。長崎県が1,479島で全国1位。対馬・壱岐・五島列島など有人離島数も日本一を誇り、日本の広大な排他的経済水域（EEZ）を支える。",
    season: "通年（青い海・ダイビング・固有生態系）",
    nationalTotalProduction: 14125,
    nationalOutputValue: 5200,
    mainVarieties: [
      "五島列島（長崎・世界文化遺産潜伏キリシタン）",
      "壱岐・対馬（長崎・古代航路と国境の島）",
      "奄美群島・屋久島（鹿児島・世界自然遺産）",
      "慶良間・宮古・八重山諸島（沖縄・サンゴ礁）",
      "小笠原諸島（東京・東洋のガラパゴス）"
    ],
    growingConditions: "日本列島はユーラシア大陸東縁の沈降や地殻変動、火山活動によって形成された複雑な弧状列島です。長崎県沿岸は典型的なリアス海岸と沈水カルスト地形が広がり、五島列島や九十九島（くじゅうくしま）など無数の島々が密集しています。鹿児島県や沖縄県は南西諸島孤として亜熱帯海洋に弧を描いて連なり、独自の進化を遂げた固有種（アマミノクロウサギ、ヤンバルクイナ等）が生息する世界自然遺産の宝庫です。",
    trivia: "2023年に国土地理院が35年ぶりに最新デジタル地図で測量し直した結果、日本の島の数は従来の6,852島から倍以上の「14,125島」へと大幅更新され世界的なニュースとなりました。東京都に属する小笠原諸島（父島・母島・南鳥島・沖ノ鳥寺）は、本州から1,000km離れた絶海の孤島群であり、日本の広大な排他的経済水域（世界第6位の広さ）を確保する重要な国益拠点です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "420003",
        prefectureName: "長崎県",
        production: 1479,
        share: 10.5,
        mainCities: [
          { code: "422118", name: "五島市", highlight: "五島列島の中枢・世界遺産潜伏キリシタンの島" },
          { code: "422100", name: "壱岐市", highlight: "『魏志倭人伝』の原の辻遺跡・歴史の島" }
        ],
        notes: "島数1,479島、有人島数約72島でともに日本一。対馬・壱岐・五島など歴史ある島々。"
      },
      {
        rank: 2,
        prefectureCode: "010003",
        prefectureName: "北海道",
        production: 1473,
        share: 10.4,
        mainCities: [
          { code: "012238", name: "根室市", highlight: "北方四島近接・利尻礼文などの海洋拠点" }
        ],
        notes: "利尻島・礼文島・奥尻島・天売島・焼尻島および千島列島近接の広大な島嶼群。"
      },
      {
        rank: 3,
        prefectureCode: "460003",
        prefectureName: "鹿児島県",
        production: 1256,
        share: 8.9,
        mainCities: [
          { code: "462225", name: "奄美市", highlight: "奄美大島・世界自然遺産の島" },
          { code: "465054", name: "屋久島町", highlight: "縄文杉・洋上アルプスの世界自然遺産" }
        ],
        notes: "南北600kmに広がる薩南諸島。屋久島・種子島・奄美大島・徳之島など世界的自然遺産。"
      },
      {
        rank: 4,
        prefectureCode: "470003",
        prefectureName: "沖縄県",
        production: 693,
        share: 4.9,
        mainCities: [
          { code: "472077", name: "石垣市", highlight: "八重山諸島の中枢・西表島自然遺産ゲートウェイ" }
        ],
        notes: "宮古諸島・八重山諸島・慶良間諸島などサンゴ礁のエメラルドグリーンの島々。"
      },
      {
        rank: 5,
        prefectureCode: "130003",
        prefectureName: "東京都",
        production: 635,
        share: 4.5,
        mainCities: [
          { code: "134210", name: "小笠原村", highlight: "世界自然遺産・絶海の孤島・広大なEEZの要" }
        ],
        notes: "伊豆大島から八丈島、小笠原諸島まで。都心から南へ1,000kmに伸びる日本の生命線。"
      }
    ]
  },
  {
    id: "cultural-treasures",
    name: "国宝・重要文化財（歴史と文化財指定件数）",
    kana: "コクホウ・ジュウヨウブンカザイ",
    englishName: "National Treasures & Cultural Properties",
    category: "nature",
    categoryLabel: "自然・気候・文化日本一",
    unit: "件",
    icon: "⛩️",
    summary: "文化庁統計による国宝および国指定重要文化財（建造物・美術工芸品）の指定件数。千年の都・京都府と、世界最古の木造建築群を誇る古代日本の中心地・奈良県、国立博物館や各大名コレクションが集積する東京都が圧倒的三強。",
    season: "通年（春・秋の特別公開・社寺拝観）",
    nationalTotalProduction: 13500,
    nationalOutputValue: 8500,
    mainVarieties: [
      "古都京都の文化財（清水寺・金閣寺・二条城等17資産）",
      "法隆寺地域の仏教建造物（世界最古木造建築）",
      "古都奈良の文化財（東大寺大仏殿・興福寺阿修羅像）",
      "東京国立博物館（国宝89件・日本最大の博物館）",
      "近江の古仏・比叡山延暦寺（滋賀）"
    ],
    growingConditions: "奈良時代（平城京）から平安時代、そして明治維新に至るまで、1000年以上にわたり日本の政治・文化・宗教の中心であり続けた京都と奈良に、仏教寺院や神社、皇室ゆかりの宝物が破壊を免れて奇跡的に保存・継承されてきました。また東京都は明治以降に帝室博物館（現・東京国立博物館）をはじめとする近代国家の文化中枢機関が整備され、全国の大名家伝来の刀剣や絵画、茶道具が集約されたことで全国トップの指定数を誇ります。",
    trivia: "奈良県斑鳩町（いかるがちょう）の法隆寺は、1993年に姫路城とともに「日本初の世界文化遺産」に登録された世界最古の木造建築群です。また京都府は神社仏閣だけでなく、祇園祭や西陣織などの無形文化財と一体となった生きた伝統文化が街全体に息づいています。自治体カルテの「観光消費額」や「ふるさと納税文化財保護基金」とも密接に結びついています。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "130003",
        prefectureName: "東京都",
        production: 2845,
        share: 21.1,
        mainCities: [
          { code: "131067", name: "台東区", highlight: "上野・東京国立博物館（国宝89件所蔵）" }
        ],
        notes: "東京国立博物館や静嘉堂文庫など国立・私立の超一級美術館・大名家コレクションが集積。"
      },
      {
        rank: 2,
        prefectureCode: "260003",
        prefectureName: "京都府",
        production: 2210,
        share: 16.4,
        mainCities: [
          { code: "261009", name: "京都市", highlight: "世界遺産古都京都の文化財・国宝建造物の宝庫" },
          { code: "262048", name: "宇治市", highlight: "平等院鳳凰堂・宇治上神社" }
        ],
        notes: "千年の都。清水寺、金閣寺、東寺五重塔など国宝建造物・仏像が街中に密集。"
      },
      {
        rank: 3,
        prefectureCode: "290003",
        prefectureName: "奈良県",
        production: 1345,
        share: 10.0,
        mainCities: [
          { code: "292010", name: "奈良市", highlight: "東大寺盧舎那仏・興福寺阿修羅像・春日大社" },
          { code: "293440", name: "斑鳩町", highlight: "法隆寺・世界最古の木造建築群" }
        ],
        notes: "シルクロードの終着点・古代飛鳥・白鳳・天平美術の聖地。建造物国宝数は全国一。"
      },
      {
        rank: 4,
        prefectureCode: "250003",
        prefectureName: "滋賀県",
        production: 830,
        share: 6.1,
        mainCities: [
          { code: "252018", name: "大津市", highlight: "比叡山延暦寺・三井寺・石山寺" }
        ],
        notes: "「祈りの国」近江。琵琶湖畔に延暦寺をはじめとする天台密教寺院や国宝古仏が点在。"
      },
      {
        rank: 5,
        prefectureCode: "270003",
        prefectureName: "大阪府",
        production: 675,
        share: 5.0,
        mainCities: [
          { code: "271004", name: "大阪市", highlight: "住吉大社本殿・四天王寺・中之島公会堂" }
        ],
        notes: "日本最古の官寺・四天王寺や住吉大社、商人文化が守り伝えた美術工芸品が多数。"
      }
    ]
  },
  {
    id: "hot-springs",
    name: "温泉源泉数・湧出量（おんせん県日本一）",
    kana: "オンセン",
    englishName: "Hot Springs / Onsen (Sources & Volume)",
    category: "nature",
    categoryLabel: "自然・気候・文化日本一",
    unit: "本",
    icon: "♨️",
    summary: "環境省「温泉利用状況調査」による源泉総数および毎分湧出量。大分県が源泉数5,090本、湧出量毎分28万リットルで全国ダントツ1位（「おんせん県おおいた」別府・由布院）。日本列島の火山帯がもたらす大地の恵み。",
    season: "通年（秋〜冬の湯治・温泉旅行）",
    nationalTotalProduction: 27900,
    nationalOutputValue: 9800,
    mainVarieties: [
      "別府八湯（大分・源泉数世界一の温泉都市）",
      "由布院温泉（大分・憧れの高原温泉保養地）",
      "指宿砂むし温泉・霧島温泉郷（鹿児島）",
      "熱海・伊東温泉（静岡・徳川家康ゆかりの名湯）",
      "登別温泉・定山渓温泉（北海道・地獄谷の湯）"
    ],
    growingConditions: "日本列島は環太平洋火山帯（プレート沈降帯）に位置し、地下深くに活発なマグマだまりが存在します。火山ガスや地下熱水が地下水と混ざり合うことで、日本全国に多種多様な泉質（単純温泉、硫黄泉、炭酸水素塩泉、酸性泉など）の温泉が湧出します。大分県は別府・島原地溝帯（巨大断層崖）の地殻活動により地下深くの地熱エネルギーが極めて豊富で、地球上でも有数のメガ温泉地帯を形成しています。",
    trivia: "大分県別府市は「街のあちこちからもうもうと湯煙が立ち上る」唯一無二の景観で国の重要文化的景観に選定されています。別府では温泉熱を利用した「地獄蒸し料理」や温泉発電、泥湯・砂湯など多彩な入浴文化が発達。また群馬県草津温泉は自然湧出量日本一（毎分3万L超・湯畑）、北海道登別温泉は9種類もの泉質が一堂に会する「温泉のデパート」として有名です。",
    rankings: [
      {
        rank: 1,
        prefectureCode: "440003",
        prefectureName: "大分県",
        production: 5090,
        share: 18.2,
        mainCities: [
          { code: "442020", name: "別府市", highlight: "源泉数世界一の温泉都市・別府八湯・湯けむり" },
          { code: "442135", name: "由布市", highlight: "湯布院温泉・金鱗湖と由布岳の温泉保養地" }
        ],
        notes: "源泉数5,090本、毎分湧出量28万Lでともに日本一。「おんせん県おおいた」の圧倒的頂点。"
      },
      {
        rank: 2,
        prefectureCode: "460003",
        prefectureName: "鹿児島県",
        production: 2750,
        share: 9.9,
        mainCities: [
          { code: "462101", name: "指宿市", highlight: "世界唯一の天然砂むし温泉の郷" }
        ],
        notes: "桜島・霧島火山の恵み。県内全域に温泉が湧き、指宿の砂むしや霧島温泉郷が有名。"
      },
      {
        rank: 3,
        prefectureCode: "220003",
        prefectureName: "静岡県",
        production: 2150,
        share: 7.7,
        mainCities: [
          { code: "222054", name: "熱海市", highlight: "徳川家康が愛した名湯・熱海温泉" }
        ],
        notes: "伊豆半島の豊かな火山活動。熱海・伊東・修善寺など首都圏屈指の温泉リゾート群。"
      },
      {
        rank: 4,
        prefectureCode: "010003",
        prefectureName: "北海道",
        production: 2080,
        share: 7.5,
        mainCities: [
          { code: "012301", name: "登別市", highlight: "9つの泉質が湧く登別地獄谷・名湯の都" }
        ],
        notes: "登別温泉、定山渓、十勝川モール温泉、洞爺湖など広大な大地に名湯が点在。"
      },
      {
        rank: 5,
        prefectureCode: "430003",
        prefectureName: "熊本県",
        production: 1320,
        share: 4.7,
        mainCities: [
          { code: "434281", name: "南小国町", highlight: "黒川温泉・入湯手形と風情ある露天風呂" }
        ],
        notes: "阿蘇火山の巨大カルデラが育む温泉。黒川温泉の里山情緒と露天風呂巡りが全国区。"
      }
    ]
  }
];

// 自治体コード検証
console.log('Verifying municipality codes for nature items...');
for (const item of natureItems) {
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

for (const item of natureItems) {
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
console.log(`Done! Added ${addedCount} nature items. Total items: ${data.items.length}`);
