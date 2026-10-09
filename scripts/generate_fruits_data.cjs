const fs = require('fs');
const path = require('path');

const handbookData = {
  title: "都道府県便覧【農林水産・特産品編】",
  subtitle: "農林水産省「作物統計調査」「畜産統計」「生産農業所得統計」確定値に基づく全国47都道府県・産地自治体データ",
  description: "日本全国の主要農畜産物（果実・野菜・米・酪農・畜産）全20品目の都道府県別シェアと主産地市町村を完全網羅。地理・気候的背景から産地自治体の財政・暮らしカルテまでシームレスに探究できます。",
  lastUpdated: "2026年10月",
  source: "農林水産省「作物統計調査」「畜産統計」「生産農業所得統計」最新確定値",
  items: [
    // ----------------------------------------------------
    // 【果実編】（10品目）
    // ----------------------------------------------------
    {
      id: "apple",
      name: "りんご",
      kana: "リンゴ",
      englishName: "Apple",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍎",
      summary: "日本を代表する落葉果樹。全国収穫量の約6割を青森県、約2割を長野県が占め、上位2県で8割強を占有します。甘みと酸味のバランスに優れた「ふじ」は世界で最も多く生産されている品種です。",
      season: "10月〜2月（貯蔵品は通年）",
      nationalTotalProduction: 675000,
      nationalOutputValue: 1420,
      mainVarieties: ["ふじ", "つがる", "王林", "シナノスイート", "トキ", "秋映", "シナノゴールド"],
      growingConditions: "年平均気温が6〜12℃の冷涼な気候が適しています。特に秋の収穫期における昼夜の寒暖差がりんごの着色と糖度蓄積に不可欠です。また、岩木山麓や千曲川流域の扇状地など、排水性の良い火山灰・砂礫質土壌が根腐れを防ぎ健全な樹勢を支えます。",
      trivia: "世界で最も多く栽培されている品種「ふじ」は、1930年代に青森県藤崎町（農林省園芸試験場東北支場）で「国光」と「デリシャス」を交配して育成されました。藤崎町の地名や富士山にちなんで命名されました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "020003",
          prefectureName: "青森県",
          production: 414700,
          share: 61.4,
          mainCities: [
            { code: "022021", name: "弘前市", highlight: "日本一のりんご生産自治体（全国収穫量の約2割）" },
            { code: "022101", name: "平川市", highlight: "津軽平野南部の名産地・高糖度サンふじ" },
            { code: "022012", name: "青森市", highlight: "浪岡地区を中心とする一大りんご園地" },
            { code: "022047", name: "黒石市", highlight: "八甲田山麓の扇状地を活かした果樹地帯" }
          ],
          notes: "津軽平野の火山灰土壌と冷涼な気候、高度な剪定・袋掛け技術が集積する日本最大のりんご王国。"
        },
        {
          rank: 2,
          prefectureCode: "200003",
          prefectureName: "長野県",
          production: 141600,
          share: 21.0,
          mainCities: [
            { code: "202011", name: "長野市", highlight: "善光寺平・千曲川流域のりんご地帯" },
            { code: "202070", name: "須坂市", highlight: "内陸性気候と扇状地を活かした多品種産地" },
            { code: "202118", name: "中野市", highlight: "志賀高原山麓の昼夜寒暖差を活かした高糖度果実" },
            { code: "202029", name: "松本市", highlight: "安曇野に隣接する梓川流域のりんご畑" }
          ],
          notes: "日照時間の長さと降水量の少なさ、標高差を活かした「りんご三兄弟（秋映・シナノスイート・シナノゴールド）」など独自品種が隆盛。"
        },
        {
          rank: 3,
          prefectureCode: "030003",
          prefectureName: "岩手県",
          production: 42600,
          share: 6.3,
          mainCities: [
            { code: "032018", name: "盛岡市", highlight: "盛岡りんご（旧都南村地域など）の伝統産地" },
            { code: "032158", name: "奥州市", highlight: "江刺りんご（無袋ふじの高級ブランド）" },
            { code: "032051", name: "花巻市", highlight: "北上川流域の肥沃な段丘果樹地帯" }
          ],
          notes: "「江刺りんご」に代表される徹底した光センサー選果と高糖度・無袋栽培による高級贈答用ブランドが強み。"
        },
        {
          rank: 4,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 36500,
          share: 5.4,
          mainCities: [
            { code: "062103", name: "天童市", highlight: "将棋駒の街・村山盆地の中核果樹産地" },
            { code: "063223", name: "朝日町", highlight: "「無袋ふじ」発祥の地・蜜入りりんご" },
            { code: "062111", name: "東根市", highlight: "果樹王国ひがしねの多様な複合経営" }
          ],
          notes: "袋をかけずに太陽光をたっぷり浴びせる「無袋（サンふじ）」栽培の先駆け。盆地特有の熱気と寒暖差で蜜入りが良い。"
        },
        {
          rank: 5,
          prefectureCode: "070003",
          prefectureName: "福島県",
          production: 17800,
          share: 2.6,
          mainCities: [
            { code: "072010", name: "福島市", highlight: "「フルーツライン」沿いに広がる吾妻山麓の果樹園" },
            { code: "072133", name: "伊達市", highlight: "阿武隈川沿いの温暖な盆地性気候" }
          ],
          notes: "南限に近い産地ならではの強い日照量により、完熟期まで木の上でじっくり熟成させる「樹上完熟」が特徴。"
        }
      ]
    },
    {
      id: "mandarin",
      name: "みかん（温州みかん）",
      kana: "ミカン",
      englishName: "Mandarin / Satsuma Orange",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍊",
      summary: "日本の冬の風物詩であり、国内で最も親しまれている常緑果樹。和歌山県、愛媛県、静岡県が「みかん三大産地」として長年トップを争っています。ビタミンCやβ-クリプトキサンチンが豊富です。",
      season: "10月〜1月（極早生・早生は9月から、晩生は3月まで）",
      nationalTotalProduction: 682000,
      nationalOutputValue: 1350,
      mainVarieties: ["宮川早生", "興津早生", "田口早生", "青島温州", "南柑20号", "ゆら早生"],
      growingConditions: "年平均気温が15〜18℃、冬期氷点下5℃以下にならない温暖な気候が必要です。海に面した南向きの急傾斜地に段々畑を築くことで、①直射日光、②海面からの反射光、③石垣からの照り返しの「3つの太陽」を受け、水はけを極限まで高めて濃厚な甘みを凝縮させます。",
      trivia: "温州（うんしゅう）みかんの名は中国浙江省の柑橘名所「温州」に由来しますが、実際には中国から伝わった柑橘の種から鹿児島県長島町で偶発実生として約400〜500年前に誕生した日本固有の品種です。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "300003",
          prefectureName: "和歌山県",
          production: 148000,
          share: 21.7,
          mainCities: [
            { code: "302040", name: "有田市", highlight: "450年の歴史を誇る「有田みかん」の中心地" },
            { code: "303666", name: "有田川町", highlight: "有田川上流山間部の高品質みかん園" },
            { code: "302066", name: "田辺市", highlight: "黒潮の温暖な気候を生かした南紀の主産地" },
            { code: "302082", name: "紀の川市", highlight: "紀の川流域の多様な柑橘・果樹農業" }
          ],
          notes: "20年連続収穫量日本一。「有田みかん」ブランドは日本農業遺産にも認定。急傾斜地の石垣階段畑とマルチ栽培で極めて高糖度。"
        },
        {
          rank: 2,
          prefectureCode: "380003",
          prefectureName: "愛媛県",
          production: 117100,
          share: 17.2,
          mainCities: [
            { code: "382043", name: "八幡浜市", highlight: "「日の丸」「真穴」「川上」の最高峰ブランド" },
            { code: "382035", name: "宇和島市", highlight: "リアス海岸の急傾斜に広がる段々畑" },
            { code: "382019", name: "松山市", highlight: "道後平野周辺の温暖な島嶼部柑橘産地" },
            { code: "382141", name: "西予市", highlight: "三瓶地区などの宇和海に面した海風園地" }
          ],
          notes: "「柑橘王国えひめ」。温州みかんだけでなく、紅まどんな・甘平・せとか・伊予柑など中晩柑類を含めた柑橘全体の産出額は全国断トツ1位。"
        },
        {
          rank: 3,
          prefectureCode: "220003",
          prefectureName: "静岡県",
          production: 92400,
          share: 13.5,
          mainCities: [
            { code: "221309", name: "浜松市", highlight: "「三ヶ日みかん」の産地（浜名湖北岸）" },
            { code: "222038", name: "沼津市", highlight: "「西浦みかん」駿河湾を臨む温暖傾斜地" },
            { code: "222101", name: "富士市", highlight: "富士山南陵の温暖な日照地帯" }
          ],
          notes: "大玉でコクのある「青島温州」が主力。収穫後に木造ロッカー等でじっくり貯蔵して酸味を抜き甘みを引き出す「貯蔵みかん」の技術が発達。"
        },
        {
          rank: 4,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 81200,
          share: 11.9,
          mainCities: [
            { code: "431001", name: "熊本市", highlight: "河内町地区（有明海を臨む金峰山山麓）" },
            { code: "432067", name: "玉名市", highlight: "温暖な有明海沿岸の「天水みかん」" },
            { code: "432130", name: "宇城市", highlight: "不知火海を臨む三角町・不知火町（デコポン発祥地）" }
          ],
          notes: "有明海を臨む金峰山系や宇土半島の温暖な斜面。高級柑橘「不知火（デコポン）」の育成・主産地としても有名。"
        },
        {
          rank: 5,
          prefectureCode: "420003",
          prefectureName: "長崎県",
          production: 43800,
          share: 6.4,
          mainCities: [
            { code: "422045", name: "諫早市", highlight: "「出雲」「高来」多良岳山麓と有明海沿岸" },
            { code: "422011", name: "長崎市", highlight: "茂木びわと並ぶ伝統柑橘地帯" },
            { code: "422029", name: "佐世保市", highlight: "針尾島などの大村湾・西海沿岸園地" }
          ],
          notes: "大村湾や橘湾を取り囲むリアス海岸地帯。高糖度みかん「味ホープ」「出島ホワイト」など糖度保証ブランドを展開。"
        }
      ]
    },
    {
      id: "grape",
      name: "ぶどう",
      kana: "ブドウ",
      englishName: "Grape",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍇",
      summary: "生食用からワイン醸造用まで世界中で愛される果樹。近年は種なしで皮ごと食べられる「シャインマスカット」の大ヒットにより栽培体系と市場価値が一変しました。山梨県と長野県が全国の2強です。",
      season: "7月〜10月（シャインマスカット・巨峰は8〜10月が最盛期）",
      nationalTotalProduction: 161000,
      nationalOutputValue: 1280,
      mainVarieties: ["シャインマスカット", "巨峰", "ピオーネ", "デラウェア", "甲州", "ナガノパープル", "クイーンルージュ"],
      growingConditions: "降水量が少なく日照時間が極めて長い内陸盆地が最適です。開花・結実期から成熟期にかけての雨は病害（べと病・晩腐病）の原因となるため、雨除けハウス栽培が発達。甲府盆地や長野盆地の扇状地にある砂礫質土壌は水はけが抜群で、根に余分な水分を与えず果実の糖度を高めます。",
      trivia: "日本固有のワイン用ぶどう「甲州」は、シルクロードを経て奈良時代〜平安時代に日本へ伝来した東洋系欧州種が野生種と自然交雑しながら山梨の風土に定着したもので、約1000年以上の栽培歴史を持ちます。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "190003",
          prefectureName: "山梨県",
          production: 35100,
          share: 21.8,
          mainCities: [
            { code: "192112", name: "笛吹市", highlight: "日本一のぶどう・桃の生産地（一宮・御坂地区）" },
            { code: "192139", name: "甲州市", highlight: "勝沼ぶどう郷・日本ワイン発祥の地" },
            { code: "192058", name: "山梨市", highlight: "笛吹川沿いの扇状地に広がる果樹園地" }
          ],
          notes: "「フルーツ王国やまなし」の中心。甲府盆地東部の勝沼・一宮地区は、日本農業遺産「甲州扇状地に適応した果樹農業システム」に認定。"
        },
        {
          rank: 2,
          prefectureCode: "200003",
          prefectureName: "長野県",
          production: 33400,
          share: 20.7,
          mainCities: [
            { code: "202070", name: "須坂市", highlight: "千曲川扇状地・全国屈指の巨峰・シャインマスカット産地" },
            { code: "202118", name: "中野市", highlight: "内陸冷涼気候を活かした種なし高糖度ぶどう" },
            { code: "202151", name: "塩尻市", highlight: "桔梗ヶ原ワインバレー（メルロー等の世界的銘醸地）" },
            { code: "202011", name: "長野市", highlight: "長野盆地北部の果樹園地帯" }
          ],
          notes: "独自開発品種「ナガノパープル」「クイーンルージュ」とシャインマスカットの『ぶどう三姉妹』が市場を席巻。山梨県に迫る猛烈な勢い。"
        },
        {
          rank: 3,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 14700,
          share: 9.1,
          mainCities: [
            { code: "062138", name: "南陽市", highlight: "赤湯ぶどう・東北最古のぶどう産地" },
            { code: "063819", name: "高畠町", highlight: "デラウェア日本一の生産地・高畠ワイナリー" },
            { code: "062103", name: "天童市", highlight: "村山盆地の多品種栽培" }
          ],
          notes: "置賜盆地の寒暖差を活かした小粒ぶどう「デラウェア」の生産量は全国1位。高級大粒品種への転換も進展。"
        },
        {
          rank: 4,
          prefectureCode: "330003",
          prefectureName: "岡山県",
          production: 14000,
          share: 8.7,
          mainCities: [
            { code: "332089", name: "総社市", highlight: "高梁川流域のピオーネ・マスカット産地" },
            { code: "332135", name: "赤磐市", highlight: "吉井川流域・晴れの国の恵みを受けた果樹地帯" },
            { code: "332020", name: "倉敷市", highlight: "船穂地区の温室マスカット・オブ・アレキサンドリア" }
          ],
          notes: "「晴れの国おかやま」。明治時代からガラス温室による超高級「マスカット・オブ・アレキサンドリア」や大粒「ニューピオーネ」を確立。"
        },
        {
          rank: 5,
          prefectureCode: "400003",
          prefectureName: "福岡県",
          production: 8400,
          share: 5.2,
          mainCities: [
            { code: "402257", name: "うきは市", highlight: "耳納連山の麓・「巨峰開闢の地」田主丸に隣接" },
            { code: "402036", name: "久留米市", highlight: "田主丸町（巨峰観光ぶどう狩り発祥の地）" },
            { code: "402109", name: "八女市", highlight: "筑後平野南部の温暖な中山間果樹園" }
          ],
          notes: "久留米市田主丸町は「巨峰」の商業栽培を日本で初めて成功させた聖地。西日本最大の巨峰・ピオーネ供給基地。"
        }
      ]
    },
    {
      id: "peach",
      name: "もも（桃）",
      kana: "モモ",
      englishName: "Peach",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍑",
      summary: "初夏から盛夏にかけて果汁あふれる甘美な味覚。白肉系生食用の品種改良が日本独自に極限まで進み、世界最高峰の糖度と柔らかさを誇ります。山梨県と福島県の2県で全国収穫量の約6割を寡占しています。",
      season: "6月中旬〜9月（7月〜8月が最盛期）",
      nationalTotalProduction: 98000,
      nationalOutputValue: 680,
      mainVarieties: ["白鳳", "あかつき", "日川白鳳", "川中島白桃", "まどか", "黄金桃"],
      growingConditions: "成熟期の降水量が少なく日照が多いこと、開花期の霜害がないことが必須です。甲府盆地や福島盆地は四方を山に囲まれ夏の熱気がこもるため、日中の光合成が極大化し、夜間は気温が下がることで呼吸による糖分消耗が防がれます。扇状地の砂礫質土壌により根の過湿が防がれます。",
      trivia: "桃の代表品種「あかつき」は、農林水産省果樹試験場で「白桃」と「白鳳」を交配して誕生しました。名前の由来は福島市の伝統神事「信夫三山暁まいり（暁祭り）」にちなんで命名された、福島を象徴する品種です。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "190003",
          prefectureName: "山梨県",
          production: 31400,
          share: 32.0,
          mainCities: [
            { code: "192112", name: "笛吹市", highlight: "日本一の桃の郷・春には一面のピンクの絨毯" },
            { code: "192058", name: "山梨市", highlight: "日川白鳳発祥の地・甲府盆地東部" },
            { code: "192139", name: "甲州市", highlight: "勝沼・塩山地区の標高差を活かしたリレー出荷" }
          ],
          notes: "収穫量日本一。春の開花期には甲府盆地が一面ピンク色に染まる「桃源郷」。極早生から晩生種まで途切れのない安定供給体制。"
        },
        {
          rank: 2,
          prefectureCode: "070003",
          prefectureName: "福島県",
          production: 25200,
          share: 25.7,
          mainCities: [
            { code: "072010", name: "福島市", highlight: "「あかつき」の主産地・飯坂・信夫山山麓" },
            { code: "072133", name: "伊達市", highlight: "阿武隈川沿いの盆地平野・高糖度桃の宝庫" },
            { code: "073016", name: "桑折町", highlight: "皇室献上桃の郷・光センサー選果糖度12度以上" }
          ],
          notes: "福島盆地の猛烈な暑さが生み出す高糖度。「あかつき」は肉質が緻密で果汁が多く、全国の市場関係者から絶大な評価。"
        },
        {
          rank: 3,
          prefectureCode: "200003",
          prefectureName: "長野県",
          production: 11800,
          share: 12.0,
          mainCities: [
            { code: "202011", name: "長野市", highlight: "川中島白桃の発祥地（川中島地区）" },
            { code: "202070", name: "須坂市", highlight: "北信濃の千曲川扇状地" },
            { code: "202185", name: "千曲市", highlight: "あんずの里に隣接する桃地帯" }
          ],
          notes: "大玉で硬く日持ちが良い晩生種の最高峰「川中島白桃」の発祥地。標高の高さによる冷涼な気候を活かした8月後半以降の出荷が強み。"
        },
        {
          rank: 4,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 7900,
          share: 8.1,
          mainCities: [
            { code: "062111", name: "東根市", highlight: "さくらんぼと並ぶ果樹の二刀流" },
            { code: "062103", name: "天童市", highlight: "盆地の気候を活かした大玉栽培" },
            { code: "062081", name: "村山市", highlight: "最上川中流の段丘園地" }
          ],
          notes: "東北の冷涼気候を活かし、8月下旬から9月にかけての晩生種（川中島白桃、伊達白桃）のリレー出荷で市場を支える。"
        },
        {
          rank: 5,
          prefectureCode: "300003",
          prefectureName: "和歌山県",
          production: 6400,
          share: 6.5,
          mainCities: [
            { code: "302082", name: "紀の川市", highlight: "「あら川の桃」桃山町地区・西日本最大の産地" },
            { code: "303411", name: "かつらぎ町", highlight: "フルーツ王国かつらぎの紀ノ川沿岸畑" }
          ],
          notes: "「あら川の桃」ブランドで名高い。紀の川流域の水はけの良い砂礫土壌と温暖な気候により、6月中旬から西日本で最も早く出荷。"
        }
      ]
    },
    {
      id: "strawberry",
      name: "いちご（苺）",
      kana: "イチゴ",
      englishName: "Strawberry",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍓",
      summary: "冬から春の果実女王。日本の施設園芸技術の結晶であり、都道府県ごとの独自ブランド品種開発競争が最も熾烈な品目です。「とちおとめ」「とちあいか」の栃木県が50年以上連続で収穫量日本一を誇ります。",
      season: "12月〜5月（クリスマス需要から春の観光農園まで）",
      nationalTotalProduction: 160000,
      nationalOutputValue: 1850,
      mainVarieties: ["とちあいか", "あまおう", "とちおとめ", "紅ほっぺ", "ゆうべに", "さがほのか", "章姫"],
      growingConditions: "促成栽培（ハウス栽培）が主流のため、冬期（11月〜2月）の日照時間が極めて長い太平洋側地域が有利です。冬晴れが続く関東平野や九州・東海では、日中の太陽熱と豊富な地下水熱を活用して高品質ないちごを効率よく生産できます。",
      trivia: "いちごの赤い部分は実は「果実」ではなく、茎の先端が肥大化した「花托（かたく）」と呼ばれる偽果です。表面についているゴマのような小さなツブツブの一つひとつが真の「果実（痩果）」で、中に種が入っています。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "090003",
          prefectureName: "栃木県",
          production: 25400,
          share: 15.9,
          mainCities: [
            { code: "092096", name: "真岡市", highlight: "日本一のいちご生産自治体（いちご王国の中核）" },
            { code: "092011", name: "宇都宮市", highlight: "大消費地近郊の最新鋭ハウス栽培" },
            { code: "092037", name: "栃木市", highlight: "渡良瀬川・思川水系の豊富な地下水" },
            { code: "092053", name: "鹿沼市", highlight: "日光山麓の水はけの良い黒ボク土壌" }
          ],
          notes: "昭和43年（1968年）以来、半世紀以上にわたり収穫量日本一を堅持。新品種「とちあいか」（ハート型断面と高糖度）への急速な品種更新でシェア拡大。"
        },
        {
          rank: 2,
          prefectureCode: "400003",
          prefectureName: "福岡県",
          production: 17200,
          share: 10.8,
          mainCities: [
            { code: "402109", name: "八女市", highlight: "「あまおう」の主要産地・筑後平野南部" },
            { code: "402036", name: "久留米市", highlight: "筑後川の肥沃な土壌と広大な平野" },
            { code: "402117", name: "筑後市", highlight: "温暖な気候と高設ベンチ栽培の先進地" }
          ],
          notes: "「赤い・丸い・大きい・うまい」の頭文字をとった「あまおう」の県内限定栽培を徹底。大玉・超高価格帯のプレミアムギフト市場を席巻。"
        },
        {
          rank: 3,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 13100,
          share: 8.2,
          mainCities: [
            { code: "432067", name: "玉名市", highlight: "熊本県最大のいちご産地（横島地区など）" },
            { code: "431001", name: "熊本市", highlight: "飽託平野・地下水が豊富な園芸農業" },
            { code: "432130", name: "宇城市", highlight: "不知火海沿岸の温暖地帯" }
          ],
          notes: "県オリジナル品種「ゆうべに」を開発。有明海沿岸の温暖な干拓平野や阿蘇の伏流水を活かした大規模施設園芸が強み。"
        },
        {
          rank: 4,
          prefectureCode: "220003",
          prefectureName: "静岡県",
          production: 12100,
          share: 7.6,
          mainCities: [
            { code: "221007", name: "静岡市", highlight: "久能山東照宮下の「石垣いちご」伝統産地" },
            { code: "222259", name: "伊豆の国市", highlight: "韮山地区・温泉熱や豊富な日照を活用" },
            { code: "222135", name: "掛川市", highlight: "遠州地域の温暖な冬晴れ気候" }
          ],
          notes: "コクと酸味のバランスが良い「紅ほっぺ」や甘みの強い「章姫」の生まれ故郷。駿河湾沿いの傾斜地を利用した石垣栽培の歴史を持つ。"
        },
        {
          rank: 5,
          prefectureCode: "420003",
          prefectureName: "長崎県",
          production: 10300,
          share: 6.4,
          mainCities: [
            { code: "422037", name: "島原市", highlight: "島原半島の豊富な湧水と温暖気候" },
            { code: "422142", name: "南島原市", highlight: "有明海を臨む日照豊富な平坦地" },
            { code: "422134", name: "雲仙市", highlight: "雲仙岳山麓の火山灰土壌" }
          ],
          notes: "島原半島を中心とする冬期の日照量と温暖な海洋性気候を背景に「ゆめのか」等を安定生産。西日本屈指の出荷量を誇る。"
        }
      ]
    },
    {
      id: "melon",
      name: "メロン",
      kana: "メロン",
      englishName: "Melon",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍈",
      summary: "高級フルーツの代名詞。緑肉・赤肉・白肉、ネット系・ノーネット系など多彩なバリエーションが存在します。茨城県が長年収穫量全国1位を誇り、熊本県、北海道が続きます。贈答用温室アールスから大衆向け露地まで幅広い構造です。",
      season: "5月〜8月（春メロンは5〜6月、夏秋メロンは7〜8月）",
      nationalTotalProduction: 140000,
      nationalOutputValue: 560,
      mainVarieties: ["アンデスメロン", "クインシーメロン", "アールス（マスクメロン）", "夕張キング", "肥後グリーン", "イームスメロン"],
      growingConditions: "メロンは過湿に極めて弱いため、水はけ（排水性）の良い砂質土壌または火山灰土壌が不可欠です。また、着果期から登熟期にかけて豊富な日照と昼夜の温度差（昼間の光合成による糖生成と夜間の気温低下）が網目（ネット）の美しさと甘みを決定づけます。",
      trivia: "大衆向けメロンの金字塔「アンデスメロン」は、南米アンデス山脈とは一切関係がありません。「生産者は作って安心、流通は売って安心、消費者は買って安心」の『安心ですメロン』を略して「アンデス」と名付けられました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "080003",
          prefectureName: "茨城県",
          production: 34800,
          share: 24.9,
          mainCities: [
            { code: "082341", name: "鉾田市", highlight: "市町村別メロン産出額日本一（全国シェア約2割）" },
            { code: "082333", name: "行方市", highlight: "霞ヶ浦と北浦に挟まれた温暖な台地" },
            { code: "085219", name: "八千代町", highlight: "県西部の白菜・メロン複合産地" }
          ],
          notes: "20年以上連続で収穫量日本一。鹿島灘沿岸の温暖な気候と水はけ抜群の砂質土壌。春のイバラキング・アンデス、初夏のクインシーとリレー出荷。"
        },
        {
          rank: 2,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 20200,
          share: 14.4,
          mainCities: [
            { code: "431001", name: "熊本市", highlight: "城南町・植木町地区などの主要ハウス産地" },
            { code: "432130", name: "宇城市", highlight: "松橋地区など不知火海沿岸平野" },
            { code: "432024", name: "八代市", highlight: "八代平野の施設園芸地帯" }
          ],
          notes: "春メロン（4〜6月出荷）の全国トップ産地。大玉で糖度が高い「肥後グリーン」やアールスメロンなど、熊本の強い日照を活かした栽培。"
        },
        {
          rank: 3,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 19400,
          share: 13.9,
          mainCities: [
            { code: "012092", name: "夕張市", highlight: "世界的ブランド「夕張メロン（夕張キング）」" },
            { code: "012297", name: "富良野市", highlight: "富良野盆地の激しい寒暖差・ふらのメロン" },
            { code: "014052", name: "共和町", highlight: "らいでんメロン（積丹半島付け根の砂丘地）" }
          ],
          notes: "北の大地の寒暖差が生む濃厚な赤肉メロンの宝庫。「夕張メロン」は地理的表示（GI）保護制度の登録第1号。"
        },
        {
          rank: 4,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 12800,
          share: 9.1,
          mainCities: [
            { code: "062049", name: "酒田市", highlight: "庄内砂丘メロンの中心地（日本海沿岸）" },
            { code: "062031", name: "鶴岡市", highlight: "湯野浜沿岸の砂丘畑・アンデスメロン" },
            { code: "064289", name: "庄内町", highlight: "庄内平野の砂質土壌園地" }
          ],
          notes: "日本海沿いに連なる広大な「庄内砂丘」の砂地で栽培。水はけが極限まで高く、地下水と海風が育む爽やかな甘みが特徴。"
        },
        {
          rank: 5,
          prefectureCode: "220003",
          prefectureName: "静岡県",
          production: 7600,
          share: 5.4,
          mainCities: [
            { code: "222160", name: "袋井市", highlight: "「クラウンメロン」の主産地（1木1果の極致）" },
            { code: "222119", name: "磐田市", highlight: "遠州平野の最高峰ガラス温室地帯" },
            { code: "221309", name: "浜松市", highlight: "アローマメロンとクラウンメロンの温室拠点" }
          ],
          notes: "数量ではなく単価・品質で圧倒的日本一。1本の木に1つの実だけを残す「一木一果」とガラス温室コンピュータ制御による至高のマスクメロン。"
        }
      ]
    },
    {
      id: "japanese-pear",
      name: "日本なし（和梨）",
      kana: "ニホンナシ",
      englishName: "Japanese Pear",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍐",
      summary: "シャリシャリとした独特の食感とあふれ出る瑞々しい果汁。赤梨（幸水・豊水・新高）と青梨（二十世紀）の2系統に大別されます。千葉県、茨城県、栃木県など関東平野が主要産地を形成しています。",
      season: "8月〜10月（幸水は8月上旬、豊水は9月上旬、新高は10月）",
      nationalTotalProduction: 185000,
      nationalOutputValue: 820,
      mainVarieties: ["幸水", "豊水", "新高", "二十世紀", "あきづき", "新興", "にっこり"],
      growingConditions: "開花期の4月に温暖で晩霜がなく、夏季（果実肥大期）に十分な日照と適度な降雨があることが望まれます。関東平野の火山灰質土壌（関東ローム層）は保水性と排水性のバランスに優れ、根が深く伸びる梨の樹体に最適です。",
      trivia: "梨特有の「シャリシャリ」とした歯ごたえの正体は、細胞壁にリグニンやペントザンという硬い成分が沈着してできる「石細胞（せきさいぼう）」です。食物繊維と同様に腸内環境を整える効果があります。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 23700,
          share: 12.8,
          mainCities: [
            { code: "122327", name: "白井市", highlight: "市町村別収穫量日本一・「しろいの梨」" },
            { code: "122033", name: "市川市", highlight: "市川のなし（地域団体商標登録）" },
            { code: "122246", name: "鎌ケ谷市", highlight: "東葛地域の伝統梨地帯" },
            { code: "122041", name: "船橋市", highlight: "「船橋のなし」都市近郊直売の強み" }
          ],
          notes: "収穫量・産出額ともに日本一。三方を海に囲まれた温暖な気候と火山灰ローム層。江戸時代（八幡地区）からの歴史と首都圏直売網。"
        },
        {
          rank: 2,
          prefectureCode: "080003",
          prefectureName: "茨城県",
          production: 17600,
          share: 9.5,
          mainCities: [
            { code: "082279", name: "筑西市", highlight: "県内最大の梨産地（旧下館地区・下妻に隣接）" },
            { code: "082104", name: "下妻市", highlight: "鬼怒川沿いの肥沃な土壌・幸水の名産地" },
            { code: "082309", name: "かすみがうら市", highlight: "霞ヶ浦湖畔の観光梨園" }
          ],
          notes: "鬼怒川や小貝川沿いの肥沃な土壌。全国に先駆けて収穫できるハウス幸水から晩生種まで一大産地を形成。"
        },
        {
          rank: 3,
          prefectureCode: "090003",
          prefectureName: "栃木県",
          production: 17200,
          share: 9.3,
          mainCities: [
            { code: "092011", name: "宇都宮市", highlight: "大玉品種「にっこり」の開発・主産地" },
            { code: "093459", name: "芳賀町", highlight: "県東部・芳賀台地の広大な梨園" },
            { code: "092100", name: "大田原市", highlight: "那須野が原扇状地の水はけを活かした産地" }
          ],
          notes: "栃木県オリジナル超大玉品種「にっこり」（重さ1kg近くになり12月〜正月まで貯蔵可能）を核に高付加価値化を推進。"
        },
        {
          rank: 4,
          prefectureCode: "310003",
          prefectureName: "鳥取県",
          production: 13100,
          share: 7.1,
          mainCities: [
            { code: "312011", name: "鳥取市", highlight: "鳥取砂丘周辺の傾斜果樹園" },
            { code: "313700", name: "湯梨浜町", highlight: "東郷湖畔の二十世紀梨・日本農業遺産候補地" },
            { code: "313718", name: "琴浦町", highlight: "大山山麓の黒ボク土壌地帯" }
          ],
          notes: "青梨の王者「二十世紀梨」の代名詞。明治37年に導入されて以来120年の歴史。近年は高糖度赤梨「新甘泉（しんかんせん）」が大ブレイク。"
        },
        {
          rank: 5,
          prefectureCode: "070003",
          prefectureName: "福島県",
          production: 12500,
          share: 6.8,
          mainCities: [
            { code: "072036", name: "郡山市", highlight: "あさか野平野の広大な果樹園" },
            { code: "072010", name: "福島市", highlight: "フルーツライン沿いの複合経営" },
            { code: "072028", name: "会津若松市", highlight: "盆地の昼夜寒暖差を活かしたみずみずしい梨" }
          ],
          notes: "桃に続く阿武隈川流域および会津盆地の果樹柱。晩夏から秋にかけて強い甘みとみずみずしさを兼ね備えた「萱場梨」ブランドが著名。"
        }
      ]
    },
    {
      id: "cherry",
      name: "さくらんぼ（桜桃）",
      kana: "サクランボ",
      englishName: "Cherry",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍒",
      summary: "「果物の宝石」「初夏のルビー」。全国収穫量の約4分の3（75%以上）を山形県が占める、日本農業で最も特定地域への集中度が高い果樹です。「佐藤錦」が全国的人気を誇ります。",
      season: "6月中旬〜7月上旬（わずか約3週間の超短期集中）",
      nationalTotalProduction: 15500,
      nationalOutputValue: 310,
      mainVarieties: ["佐藤錦", "紅秀峰", "紅さやか", "やまがた紅王", "ナポレオン", "高砂"],
      growingConditions: "さくらんぼの果実は皮が非常に薄く、成熟期（6月）に雨に当たると実が割れる「裂果」を起こします。山形県の村山盆地は奥羽山脈と出羽山地に囲まれて梅雨期の降水量が少なく、初夏に日照が多いという奇跡的な気候条件を備えています。さらに水はけの良い扇状地が根腐れを防ぎます。",
      trivia: "さくらんぼの絶対的王者「佐藤錦」は、山形県東根市の篤農家・佐藤栄助氏が「日持ちが良いが酸っぱいナポレオン」と「甘いが日持ちしない黄玉」を15年以上の歳月をかけて交配育成し、1928年に完成させました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 11800,
          share: 76.1,
          mainCities: [
            { code: "062111", name: "東根市", highlight: "「佐藤錦」発祥の地・生産量日本一のさくらんぼタウン" },
            { code: "062103", name: "天童市", highlight: "将棋駒とさくらんぼの共演・村山盆地の中核" },
            { code: "062065", name: "寒河江市", highlight: "日本初の観光サクランボ園開園の地" },
            { code: "062014", name: "山形市", highlight: "馬見ヶ崎川扇状地の伝統産地" }
          ],
          notes: "日本シェア76%の圧倒的帝国。雨除けビニールハウスの普及と、500円玉大の極大玉新品種「やまがた紅王」で世界最高峰の地位を確立。"
        },
        {
          rank: 2,
          prefectureCode: "020003",
          prefectureName: "青森県",
          production: 1450,
          share: 9.4,
          mainCities: [
            { code: "024457", name: "南部町", highlight: "青森県一の果樹の里（名川地区など）" },
            { code: "024414", name: "三戸町", highlight: "馬淵川流域の冷涼気候を活かした果樹園" }
          ],
          notes: "山形県産が終わる7月上旬〜中旬に出荷ピークを迎える「遅出し」が強み。ブランド「ジュノハート」（ハート型超大玉）が超高額で取引。"
        },
        {
          rank: 3,
          prefectureCode: "190003",
          prefectureName: "山梨県",
          production: 880,
          share: 5.7,
          mainCities: [
            { code: "192082", name: "南アルプス市", highlight: "白根地区・釜無川扇状地の早出しさくらんぼ" },
            { code: "192139", name: "甲州市", highlight: "勝沼・塩山地区の温室観光農園" }
          ],
          notes: "全国で最も早い5月上旬からのハウス加温出荷および5月下旬の露地出荷が可能。首都圏に一番近い観光さくらんぼ狩りスポット。"
        },
        {
          rank: 4,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 670,
          share: 4.3,
          mainCities: [
            { code: "014079", name: "仁木町", highlight: "「フルーツ王国にき」道内最大のさくらんぼ産地" },
            { code: "014087", name: "余市町", highlight: "積丹半島付け根の温暖な果樹地帯" },
            { code: "012165", name: "芦別市", highlight: "空知地方の内陸性気候を活かした果樹園" }
          ],
          notes: "梅雨のない北海道の爽やかな夏を活かし、7月中旬〜8月上旬まで収穫が続く日本最晩期の産地。"
        },
        {
          rank: 5,
          prefectureCode: "050003",
          prefectureName: "秋田県",
          production: 320,
          share: 2.1,
          mainCities: [
            { code: "052078", name: "湯沢市", highlight: "三関（みつせき）さくらんぼ・雄物川上流扇状地" },
            { code: "052035", name: "横手市", highlight: "横手盆地の果樹地帯" }
          ],
          notes: "奥羽山脈の西麓・三関地区は水はけの良い急傾斜地。「三関さくらんぼ」として知られる。"
        }
      ]
    },
    {
      id: "watermelon",
      name: "スイカ（西瓜）",
      kana: "スイカ",
      englishName: "Watermelon",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍉",
      summary: "日本の夏を彩る代表的果実（園芸分類上は果菜類）。水分補給とカリウム・リコピン摂取に優れます。春出荷の熊本県と夏出荷の山形県・千葉県が、季節ごとのリレー出荷で全国の消費を支えています。",
      season: "5月〜8月（熊本などの春スイカは4〜6月、東北の夏スイカは7〜8月）",
      nationalTotalProduction: 290000,
      nationalOutputValue: 710,
      mainVarieties: ["祭りばやし", "羅皇（らおう）", "金色羅皇", "紅まくら", "すいか小玉（ひとりじめ等）"],
      growingConditions: "極度の多湿を嫌い、日照時間が長く昼夜の寒暖差が大きい乾燥気味の気候を好みます。熊本では阿蘇の火山灰土壌と春の強い日照、尾花沢（山形）では奥羽山脈に挟まれた盆地の強烈な昼の猛暑と夜の冷え込みが、果肉の細胞壁を引き締め「シャリ感」と糖度を極限まで高めます。",
      trivia: "スイカの原産地はアフリカ南部のカラハリ砂漠周辺とされています。砂漠を旅する先住民や野生動物にとって、乾季の貴重な「水がめ（水分補給源）」として重宝された野生種がシルクロードを経て日本へ伝わりました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 47800,
          share: 16.5,
          mainCities: [
            { code: "431001", name: "熊本市", highlight: "旧植木町地区（日本一のスイカ産地）" },
            { code: "432164", name: "合志市", highlight: "阿蘇外輪山麓の火山灰台地" },
            { code: "432105", name: "菊池市", highlight: "菊池渓谷の清らかな名水と日照" }
          ],
          notes: "収穫量日本一。「すいかの名産地・植木町」。春のビニールハウス栽培を中心とし、初夏（4〜6月）の全国市場を圧倒的シェアで牽引。"
        },
        {
          rank: 2,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 34100,
          share: 11.8,
          mainCities: [
            { code: "122335", name: "富里市", highlight: "「富里スイカ」皇室献上の名産地" },
            { code: "122301", name: "八街市", highlight: "落花生と並ぶ北総台地の名産" },
            { code: "122378", name: "山武市", highlight: "九十九里平野の内陸寄り火山灰土壌" }
          ],
          notes: "初夏（5月下旬〜7月）の主力産地。北総台地の水はけが良い火山灰土壌（黒ボク土）。首都圏近郊の鮮度を生かした「富里すいか」ブランド。"
        },
        {
          rank: 3,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 31200,
          share: 10.8,
          mainCities: [
            { code: "062120", name: "尾花沢市", highlight: "「尾花沢スイカ」夏スイカ日本一の聖地" },
            { code: "063410", name: "大石田町", highlight: "最上川中流の河岸段丘・盆地性気候" },
            { code: "062081", name: "村山市", highlight: "村山盆地北部の夏産地" }
          ],
          notes: "夏（7月下旬〜8月）の全国収穫量ナンバーワン。盆地特有の強烈な寒暖差が生む驚異的な「シャリ感」と濃厚な甘み。"
        },
        {
          rank: 4,
          prefectureCode: "310003",
          prefectureName: "鳥取県",
          production: 18400,
          share: 6.3,
          mainCities: [
            { code: "313718", name: "琴浦町", highlight: "東伯（とうはく）スイカ・大山山麓の黒ボク土" },
            { code: "313726", name: "北栄町", highlight: "「大栄西瓜（だいえいすいか）」GI登録ブランド" },
            { code: "312037", name: "倉吉市", highlight: "倉吉平野の施設・露地複合栽培" }
          ],
          notes: "西日本屈指の夏スイカ産地。北栄町の「大栄西瓜」は西日本で初めて国の地理的表示（GI）に登録された最高峰ブランド。"
        },
        {
          rank: 5,
          prefectureCode: "150003",
          prefectureName: "新潟県",
          production: 16200,
          share: 5.6,
          mainCities: [
            { code: "151009", name: "新潟市", highlight: "西区赤塚・日本海砂丘地の「砂丘すいか」" },
            { code: "152269", name: "南魚沼市", highlight: "八色（やいろ）原の火山灰砂礫地・「八色すいか」" }
          ],
          notes: "日本海沿岸の砂丘地帯と、南魚沼の八色原段丘。魚沼コシヒカリの産地で育つ「八色すいか」は激しい寒暖差により糖度12度超を誇る。"
        }
      ]
    },
    {
      id: "persimmon",
      name: "かき（柿）",
      kana: "カキ",
      englishName: "Persimmon",
      category: "fruit",
      categoryLabel: "果実",
      unit: "t",
      icon: "🍂",
      summary: "「柿が赤くなれば医者が青くなる」と謳われる秋の健康果樹。渋柿を炭酸ガスやアルコールで脱渋した「たねなし柿（平核無）」と、そのまま甘い「富有柿」が2大勢力です。和歌山県と奈良県が紀ノ川・吉野川流域で全国シェアの4割近くを占めます。",
      season: "9月下旬〜12月（たねなし柿は10月、富有柿は11月が最盛期）",
      nationalTotalProduction: 195000,
      nationalOutputValue: 470,
      mainVarieties: ["富有", "平核無（ひらたねなし）", "刀根早生", "次郎", "西村早生", "太秋"],
      growingConditions: "年平均気温13〜15℃の地域が適します。日照が多く秋の降雨が少ない傾斜地が理想的です。紀ノ川・吉野川流域の中山間傾斜地は、水はけが良く霧が発生しやすいため果実の急激な乾燥を防ぎつつ、秋の冷え込みで鮮やかな柿色への着色と脱渋が進みます。",
      trivia: "柿は学名を「Diospyros kaki（ディオスピロス・カキ）」といい、属名のDiospyrosはギリシャ語で『神の食べ物』を意味します。日本の「kaki」がそのまま世界共通の学名や英名として採用された数少ない果物です。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "300003",
          prefectureName: "和歌山県",
          production: 44200,
          share: 22.7,
          mainCities: [
            { code: "303411", name: "かつらぎ町", highlight: "日本一の柿の町・「四郷の串柿」伝統玉手箱" },
            { code: "302082", name: "紀の川市", highlight: "たねなし柿・紀の川柿（黒あま）の聖地" },
            { code: "302031", name: "橋本市", highlight: "紀ノ川上流の傾斜地柿園" }
          ],
          notes: "収穫量日本一。種がなく食べやすい「刀根早生」「平核無」が中心。樹上で渋抜きし果肉が黒糖のように黒くなる高級品「紀の川柿」も人気。"
        },
        {
          rank: 2,
          prefectureCode: "290003",
          prefectureName: "奈良県",
          production: 26100,
          share: 13.4,
          mainCities: [
            { code: "292079", name: "五條市", highlight: "日本一の市町村別柿収穫量（西吉野地区）" },
            { code: "292044", name: "天理市", highlight: "山の辺の道沿いに広がる富有柿の古木" },
            { code: "292087", name: "御所市", highlight: "葛城山麓の温暖な丘陵地" }
          ],
          notes: "「御所柿」「刀根早生」の発祥地。吉野川流域の五條市西吉野地区は山全体が柿畑。ハウス柿から富有柿まで長期出荷体制。"
        },
        {
          rank: 3,
          prefectureCode: "400003",
          prefectureName: "福岡県",
          production: 19300,
          share: 9.9,
          mainCities: [
            { code: "402257", name: "うきは市", highlight: "耳納連山の山麓・西日本屈指の富有柿産地" },
            { code: "402281", name: "朝倉市", highlight: "杷木（はき）地区・志波柿のブランド園" },
            { code: "402036", name: "久留米市", highlight: "田主丸町などの果樹ベルト地帯" }
          ],
          notes: "甘柿の王様「富有柿」の西日本最大の産地。耳納連山の南向き山麓と筑後川の肥沃な土壌で栽培される「志波柿」は濃厚な甘みで知られる。"
        },
        {
          rank: 4,
          prefectureCode: "210003",
          prefectureName: "岐阜県",
          production: 14500,
          share: 7.4,
          mainCities: [
            { code: "212181", name: "本巣市", highlight: "「富有柿」発祥の地（旧真正町・居倉地区）" },
            { code: "214035", name: "大野町", highlight: "濃尾平野北西部の富有柿一大産地" },
            { code: "214019", name: "揖斐川町", highlight: "揖斐川扇状地の水はけの良い畑" }
          ],
          notes: "世界に誇る完全甘柿「富有柿」の発祥の地。原木（記念碑）が本巣市に現存。果肉の緻密さと甘みは贈答用の最高峰。"
        },
        {
          rank: 5,
          prefectureCode: "150003",
          prefectureName: "新潟県",
          production: 12800,
          share: 6.6,
          mainCities: [
            { code: "152242", name: "佐渡市", highlight: "「おけさ柿」海風と寒暖差で育つ名品" },
            { code: "151009", name: "新潟市", highlight: "秋葉区・江南区の越後平野果樹園" }
          ],
          notes: "「おけさ柿」として全国的に知られる「平核無（ひらたねなし）」の主産地。種がなくとろけるような滑らかな食感が特徴。"
        }
      ]
    },

    // ----------------------------------------------------
    // 【野菜・米・穀物・畜産編】（10品目）新規追加！
    // ----------------------------------------------------
    {
      id: "rice",
      name: "米（主食用米・水稲）",
      kana: "コメ",
      englishName: "Rice (Paddy Rice)",
      category: "grain",
      categoryLabel: "主食・米",
      unit: "t",
      icon: "🌾",
      summary: "日本人の主食であり、国土保全や水循環を支える農業の根幹。収穫量は新潟県、北海道、秋田県が3強を形成。「コシヒカリ」に加え、各産地が育成した「ゆめぴりか」「あきたこまち」「つや姫」など極良食味品種が群雄割拠しています。",
      season: "9月〜10月（新米の出荷最盛期）",
      nationalTotalProduction: 6610000,
      nationalOutputValue: 14500,
      mainVarieties: ["コシヒカリ", "ひとめぼれ", "ヒノヒカリ", "あきたこまち", "ななつぼし", "ゆめぴりか", "つや姫"],
      growingConditions: "出穂から登熟期にかけての豊富な日照、清らかな雪解け水や河川水、そして昼夜の寒暖差（昼に光合成でデンプンを作り、夜の冷え込みで消耗を防ぐ）が食味を極限まで高めます。越後平野や庄内平野、秋田平野などの肥沃な沖積土壌が米づくりを支えます。",
      trivia: "日本で最も有名な品種「コシヒカリ」は、1956年に福井県農業試験場で誕生（農林2号と農林1号の交配）し、新潟県や千葉県で適応性が認められて命名されました。「越の国（北陸）に光り輝く米」という願いが込められています。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "150003",
          prefectureName: "新潟県",
          production: 602300,
          share: 9.1,
          mainCities: [
            { code: "151009", name: "新潟市", highlight: "市町村別収穫量日本一・広大な越後平野" },
            { code: "152021", name: "長岡市", highlight: "信濃川中流の大穀倉地帯" },
            { code: "152269", name: "南魚沼市", highlight: "最高峰ブランド「魚沼産コシヒカリ」" },
            { code: "152226", name: "上越市", highlight: "頸城平野の清らかな雪解け水" }
          ],
          notes: "米どころ日本の象徴。信濃川・阿賀野川水系の豊かな沖積平野と豪雪地帯の清らかな水資源。「魚沼」「佐渡」「岩船」の三大銘柄。"
        },
        {
          rank: 2,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 512400,
          share: 7.8,
          mainCities: [
            { code: "012041", name: "旭川市", highlight: "上川盆地・冷涼地帯の米づくり中核" },
            { code: "012106", name: "岩見沢市", highlight: "石狩平野・空知地方の広大な水田地帯" },
            { code: "012289", name: "深川市", highlight: "石狩川水系の高品質米産地" }
          ],
          notes: "かつての「厄介道米」から品種改良で大逆転。「ゆめぴりか」「ななつぼし」が特Aランクの常連となり、大区画圃場による高い生産性を誇る。"
        },
        {
          rank: 3,
          prefectureCode: "050003",
          prefectureName: "秋田県",
          production: 457800,
          share: 6.9,
          mainCities: [
            { code: "052124", name: "大仙市", highlight: "仙北平野・秋田屈指の穀倉地帯" },
            { code: "052035", name: "横手市", highlight: "横手盆地の豊かな土壌と寒暖差" },
            { code: "053686", name: "大潟村", highlight: "八郎潟干拓地・大規模近代化農業の聖地" },
            { code: "052019", name: "秋田市", highlight: "雄物川下流の水田地帯" }
          ],
          notes: "「美の国あきた」。名品種「あきたこまち」のふるさとであり、新品種「サキホコレ」でトップブランド市場を攻める。大潟村のメガ干拓農場。"
        },
        {
          rank: 4,
          prefectureCode: "060003",
          prefectureName: "山形県",
          production: 368200,
          share: 5.6,
          mainCities: [
            { code: "062031", name: "鶴岡市", highlight: "庄内平野南部・伝統在来種と近代米の郷" },
            { code: "062049", name: "酒田市", highlight: "最上川河口・山居倉庫の歴史を継ぐ港町穀倉" }
          ],
          notes: "出羽三山と鳥海山に囲まれた庄内平野の豊かな雪解け水。「つや姫」「雪若丸」など際立つ食味と美しい炊き上がりで高級外食・料亭から高評価。"
        },
        {
          rank: 5,
          prefectureCode: "040003",
          prefectureName: "宮城県",
          production: 345000,
          share: 5.2,
          mainCities: [
            { code: "042129", name: "登米市", highlight: "「みやぎの米どころ」北上川流域の肥沃地" },
            { code: "042153", name: "大崎市", highlight: "世界農業遺産「大崎耕土」・ひとめぼれの主産地" }
          ],
          notes: "「ひとめぼれ」「ササニシキ」のふるさと。世界農業遺産「大崎耕土の巧みな水管理」に見られる伝統的な水田生態系と近代農業が共存。"
        }
      ]
    },
    {
      id: "cabbage",
      name: "キャベツ",
      kana: "キャベツ",
      englishName: "Cabbage",
      category: "vegetable",
      categoryLabel: "野菜",
      unit: "t",
      icon: "🥬",
      summary: "日本の食卓で最も消費量が多い重量野菜の代表格。冬キャベツ（愛知・千葉）、春キャベツ（千葉銚子・神奈川三浦）、夏秋キャベツ（群馬嬬恋）と、季節ごとに産地がリレー出荷することで通年供給が維持されています。",
      season: "通年（春:3〜5月、夏秋:7〜10月、冬:11〜3月）",
      nationalTotalProduction: 1350000,
      nationalOutputValue: 880,
      mainVarieties: ["冬藍（寒玉）", "春波（春系）", "初秋", "サボイキャベツ"],
      growingConditions: "キャベツは冷涼な気候（適温15〜20℃）を好みます。夏秋期は標高800〜1,400mの浅間山麓（群馬嬬恋）の高冷地気候と朝霧が朝露を与え柔らかく甘いキャベツを育てます。一方、冬期は黒潮の恩恵を受ける温暖な渥美半島や房総半島・三浦半島の無霜地帯が活躍します。",
      trivia: "群馬県嬬恋村の夏秋キャベツ出荷量は日本一で、最盛期の8〜9月には東京大田市場のキャベツの約8割が嬬恋産で占められます。「愛妻家の聖地」としても知られ、広大なキャベツ畑の中心で妻への愛を叫ぶイベントが有名です。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "230003",
          prefectureName: "愛知県",
          production: 251000,
          share: 18.6,
          mainCities: [
            { code: "232319", name: "田原市", highlight: "日本一の農業産出額を誇る渥美半島の中心" },
            { code: "232017", name: "豊橋市", highlight: "豊川用水の恩恵を受けた東三河の大農業地帯" }
          ],
          notes: "冬キャベツ全国1位。黒潮がもたらす温暖な海洋性気候と豊川用水の整備により、冬でも凍らない強固な露地露地野菜供給基地。"
        },
        {
          rank: 2,
          prefectureCode: "100003",
          prefectureName: "群馬県",
          production: 242000,
          share: 17.9,
          mainCities: [
            { code: "104256", name: "嬬恋村", highlight: "日本一の夏秋キャベツ産地（見渡す限りの緑の絨毯）" },
            { code: "104485", name: "昭和村", highlight: "赤城高原の肥沃な火山灰土壌野菜地帯" }
          ],
          notes: "夏秋キャベツ全国1位。浅間山麓・標高1,000mの高冷地冷涼気候と朝霧。夏でも昼夜の寒暖差で葉が柔らかく甘みが極めて強い。"
        },
        {
          rank: 3,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 151000,
          share: 11.2,
          mainCities: [
            { code: "122025", name: "銚子市", highlight: "「灯台キャベツ」春キャベツの東日本拠点" },
            { code: "122157", name: "旭市", highlight: "九十九里浜沿いの温暖な一大露地野菜地帯" }
          ],
          notes: "春キャベツの代名詞。黒潮と利根川河口の海洋性無霜地帯を活かし、葉が柔らかく生食サラダに最適な春キャベツを大量供給。"
        },
        {
          rank: 4,
          prefectureCode: "140003",
          prefectureName: "神奈川県",
          production: 85200,
          share: 6.3,
          mainCities: [
            { code: "142107", name: "三浦市", highlight: "「三浦キャベツ」早春キャベツのブランド産地" },
            { code: "142018", name: "横須賀市", highlight: "三浦半島台地の多肥栽培" }
          ],
          notes: "大消費地・首都圏に隣接する三浦半島の早春キャベツ。三方を海に囲まれた温暖気候と、冬でも日照が多い気象条件。"
        },
        {
          rank: 5,
          prefectureCode: "080003",
          prefectureName: "茨城県",
          production: 79500,
          share: 5.9,
          mainCities: [
            { code: "082341", name: "鉾田市", highlight: "鹿島灘沿岸の温暖な平坦砂地" },
            { code: "082333", name: "行方市", highlight: "県東部台地の野菜複合生産" }
          ],
          notes: "春・秋・冬と幅広い作型を展開。首都圏近郊の利便性を活かした鮮度保持出荷。"
        }
      ]
    },
    {
      id: "onion",
      name: "玉ねぎ（たまねぎ）",
      kana: "タマネギ",
      englishName: "Onion",
      category: "vegetable",
      categoryLabel: "野菜",
      unit: "t",
      icon: "🧅",
      summary: "あらゆる料理のベースとなる万能野菜。北海道が全国収穫量の約65%を占める圧倒的シェアを誇り、佐賀県（白石平野）と兵庫県（淡路島）が春〜初夏の出荷を支えます。貯蔵性が高く、日本の食料安全保障の要です。",
      season: "通年（春:佐賀・兵庫 4〜6月、秋〜翌春:北海道 8〜翌4月）",
      nationalTotalProduction: 1220000,
      nationalOutputValue: 950,
      mainVarieties: ["北もみじ", "オホーツク222", "七宝", "ターザン", "淡路島中生"],
      growingConditions: "過湿を嫌い、日照時間が長く乾燥した気候を好みます。北海道オホーツク地域（北見平野）は初夏から秋にかけて降水量が少なく日照に恵まれ、寒暖差が玉のしまりと糖度を凝縮させます。一方、淡路島や佐賀平野ではミネラル豊富な粘土質土壌と温暖な瀬戸内・有明海気候が柔らかく甘い新玉ねぎを育てます。",
      trivia: "玉ねぎを切ると涙が出る原因は、細胞が壊れた際に「アリシン」の前駆物質と酵素が反応して生じる揮発性の催涙成分（硫化アリル）です。冷やしてから切るか、よく切れる包丁を使うと細胞が破壊されず涙が出にくくなります。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 801000,
          share: 65.7,
          mainCities: [
            { code: "012084", name: "北見市", highlight: "生産量日本一の玉ねぎ王国（オホーツクの心臓部）" },
            { code: "014290", name: "栗山町", highlight: "空知南部の大規模たまねぎ地帯" },
            { code: "011002", name: "札幌市", highlight: "丘珠地区・「札幌黄」（日本の玉ねぎ栽培発祥地）" }
          ],
          notes: "全国シェア約66%の絶対的王者。降水量が少なく秋晴れが続くオホーツク海沿岸で乾燥・追熟され、コンテナ倉庫で翌春まで全国へ安定供給。"
        },
        {
          rank: 2,
          prefectureCode: "410003",
          prefectureName: "佐賀県",
          production: 124500,
          share: 10.2,
          mainCities: [
            { code: "414255", name: "白石町", highlight: "有明海干拓地・重粘土質が生む高糖度新玉ねぎ" },
            { code: "412015", name: "佐賀市", highlight: "佐賀平野の広大な水田裏作たまねぎ" }
          ],
          notes: "春玉ねぎ全国1位。有明海沿岸のミネラル豊富な重粘土質土壌が、みずみずしく辛みの少ない極上の新玉ねぎを育てる。"
        },
        {
          rank: 3,
          prefectureCode: "280003",
          prefectureName: "兵庫県",
          production: 94800,
          share: 7.8,
          mainCities: [
            { code: "282243", name: "南あわじ市", highlight: "世界的ブランド「淡路島たまねぎ」の本拠地" },
            { code: "282057", name: "洲本市", highlight: "淡路島中部のたまねぎ小屋と天日干し文化" }
          ],
          notes: "「淡路島たまねぎ」。瀬戸内海の温暖少雨な気候と長い日照時間。収穫後に「たまねぎ小屋」で自然風に当ててじっくり乾燥させ甘みを極大化。"
        },
        {
          rank: 4,
          prefectureCode: "420003",
          prefectureName: "長崎県",
          production: 40200,
          share: 3.3,
          mainCities: [
            { code: "422045", name: "諫早市", highlight: "諫早湾干拓地および中央丘陵部" },
            { code: "422142", name: "南島原市", highlight: "島原半島南部の温暖早出し産地" }
          ],
          notes: "暖地気候を活かした3月〜4月の極早生玉ねぎの出荷で端境期（品薄期）の全国市場をカバー。"
        },
        {
          rank: 5,
          prefectureCode: "220003",
          prefectureName: "静岡県",
          production: 35100,
          share: 2.9,
          mainCities: [
            { code: "221309", name: "浜松市", highlight: "日本一早く出荷される「白たまねぎ」篠原地区" }
          ],
          notes: "浜松市西区篠原地区の砂地で栽培される「白たまねぎ」は、年明け1月から出荷される日本一早い新玉ねぎとして名高い。"
        }
      ]
    },
    {
      id: "tomato",
      name: "トマト",
      kana: "トマト",
      englishName: "Tomato",
      category: "vegetable",
      categoryLabel: "野菜",
      unit: "t",
      icon: "🍅",
      summary: "野菜の中で最も産出額が高く、国民的人気を誇る緑黄色野菜の王様。冬春トマトは温暖な熊本県が全国断トツ1位、夏秋トマトは冷涼な北海道・東北・高原地域が担うリレー体制です。ミニトマトや高糖度塩トマトなど高付加価値化が進展しています。",
      season: "通年（冬春:11〜6月 熊本など、夏秋:7〜10月 北海道・東北など）",
      nationalTotalProduction: 715000,
      nationalOutputValue: 2450,
      mainVarieties: ["桃太郎", "りんか409", "CF千果（ミニ）", "アイコ", "フルティカ（中玉）"],
      growingConditions: "多湿を嫌い、豊富な日照と昼夜の温度差を必要とします。冬春期の熊本（八代平野・不知火海沿岸）は干拓地の塩分を含んだミネラル土壌と強い冬日照により、水分吸収を抑えられて糖度が凝縮した「塩トマト」が誕生。夏秋期は北海道日高山麓などの涼しく雨の少ない気候が病気を防ぎ高品質を保ちます。",
      trivia: "19世紀末のアメリカで「トマトは果物か野菜か」を巡って最高裁判所で裁判が行われました。輸入関税が野菜にのみ課されていたため争われましたが、判決は「デザートではなく主菜（サラダ・スープ）として食されるため法律上は野菜」と下されました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 130200,
          share: 18.2,
          mainCities: [
            { code: "432024", name: "八代市", highlight: "冬春トマト・ミニトマト日本一（巨大ハイテクハウス）" },
            { code: "432067", name: "玉名市", highlight: "有明海沿岸の温暖な大規模施設園芸" },
            { code: "432130", name: "宇城市", highlight: "不知火海沿岸の「塩トマト」発祥の地" }
          ],
          notes: "冬春トマト収穫量日本一。不知火海沿岸の干拓平野における高度環境制御ハウス栽培。塩分ストレスで極限まで甘い「塩トマト」は全国の高級料亭で愛用。"
        },
        {
          rank: 2,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 60100,
          share: 8.4,
          mainCities: [
            { code: "016071", name: "平取町", highlight: "「ニシパの恋人」夏秋トマト道内一のメガ産地" },
            { code: "015814", name: "むかわ町", highlight: "日高山麓の涼風と清流が育む高糖度トマト" }
          ],
          notes: "夏秋トマトの主産地。梅雨のない涼しい夏と激しい昼夜寒暖差を活かした「ニシパの恋人」ブランドは、全国の百貨店で絶大な人気。"
        },
        {
          rank: 3,
          prefectureCode: "230003",
          prefectureName: "愛知県",
          production: 48200,
          share: 6.7,
          mainCities: [
            { code: "232319", name: "田原市", highlight: "渥美半島の最先端スマート農業施設" },
            { code: "232017", name: "豊橋市", highlight: "豊川用水を活用したハウスミニトマト" }
          ],
          notes: "東三河地域の温暖な気候と豊富な冬日照。環境モニタリングやCO2施用を駆使したデータ駆動型施設園芸が発達。"
        },
        {
          rank: 4,
          prefectureCode: "080003",
          prefectureName: "茨城県",
          production: 44100,
          share: 6.2,
          mainCities: [
            { code: "082341", name: "鉾田市", highlight: "メロンと並ぶハウス園芸の柱" },
            { code: "085219", name: "八千代町", highlight: "県西部の高度複合施設園芸" }
          ],
          notes: "鹿島灘沿岸の海洋性温暖気候を活かした冬春・夏秋の二期作栽培。首都圏への当日配送の鮮度アドバンテージ。"
        },
        {
          rank: 5,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 38100,
          share: 5.3,
          mainCities: [
            { code: "122157", name: "旭市", highlight: "飯岡地区の潮風トマト（九十九里沿岸）" },
            { code: "122025", name: "銚子市", highlight: "海洋性気候のハウス産地" }
          ],
          notes: "九十九里浜沿いの無霜地帯と豊富な日照時間。ミニトマトや高濃度フルーツトマトへの特化が進む。"
        }
      ]
    },
    {
      id: "potato",
      name: "じゃがいも（馬鈴薯）",
      kana: "ジャガイモ",
      englishName: "Potato",
      category: "vegetable",
      categoryLabel: "野菜",
      unit: "t",
      icon: "🥔",
      summary: "ポテトチップスからコロッケ、肉じゃがまで日本の食卓に不可欠な地下塊茎野菜。全国収穫量の約8割を北海道（十勝平野・羊蹄山麓等）が圧倒的規模で独占。長崎県や鹿児島県が春の新じゃがとして供給します。",
      season: "通年（春:九州 4〜6月、秋:北海道 8〜11月・貯蔵品通年）",
      nationalTotalProduction: 2420000,
      nationalOutputValue: 1120,
      mainVarieties: ["男爵薯", "メークイン", "キタアカリ", "トヨシロ（加工用）", "インカのめざめ", "ぽろしり"],
      growingConditions: "冷涼で乾燥した気候と、水はけが極めて良い火山灰質・砂礫質土壌を好みます。十勝平野や網走、羊蹄山山麓は火山灰土壌（黒ボク土）が広大に広がり、1戸あたり数十ヘクタールの大規模機械化体系（大型トラクター・ハーベスター）による超高効率生産が実現されています。",
      trivia: "「男爵薯（だんしゃく）」の名は、明治41年（1908年）に函館の篤農家・川田龍吉男爵がイギリスからアイリッシュ・コブラーという品種の種いもを自費で輸入し、北海道の風土に適応させ普及させたことに感謝して命名されました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 1899000,
          share: 78.5,
          mainCities: [
            { code: "012076", name: "帯広市", highlight: "十勝平野の集散地・ポテト加工メガクラスター" },
            { code: "016373", name: "芽室町", highlight: "日本一のスイートコーン・馬鈴薯生産タウン" },
            { code: "013994", name: "倶知安町", highlight: "「羊蹄山麓の男爵いも」日本農業遺産的ブランド" }
          ],
          notes: "全国シェア約8割の超メガ帝国。十勝・オホーツク・羊蹄山麓の大区画圃場。ポテトチップス用・デンプン用・生食用を網羅。"
        },
        {
          rank: 2,
          prefectureCode: "420003",
          prefectureName: "長崎県",
          production: 95400,
          share: 3.9,
          mainCities: [
            { code: "422134", name: "雲仙市", highlight: "島原半島・春と秋の年2回栽培（赤土新じゃが）" },
            { code: "422142", name: "南島原市", highlight: "有明海を臨む段々畑のマルチ栽培" }
          ],
          notes: "全国2位の「新じゃが」主産地。雲仙岳山麓のミネラル豊かな火山灰土壌と温暖気候を活かし、春（5〜6月）と冬（12〜1月）の二期作。"
        },
        {
          rank: 3,
          prefectureCode: "460003",
          prefectureName: "鹿児島県",
          production: 85200,
          share: 3.5,
          mainCities: [
            { code: "465356", name: "伊仙町", highlight: "徳之島の赤土新じゃが「春一番」" },
            { code: "464040", name: "長島町", highlight: "不知火海に浮かぶ「赤土じゃがいも」の島" }
          ],
          notes: "冬から早春（2〜4月）にかけて日本で最も早く出荷される新じゃが「春一番」。赤土粘土質が皮を薄く滑らかに育てる。"
        },
        {
          rank: 4,
          prefectureCode: "080003",
          prefectureName: "茨城県",
          production: 34800,
          share: 1.4,
          mainCities: [
            { code: "082333", name: "行方市", highlight: "霞ヶ浦・北浦台地の水はけの良い畑地" },
            { code: "082368", name: "小美玉市", highlight: "県中央部の加工用馬鈴薯契約栽培" }
          ],
          notes: "関東大消費地向けの加工用および青果用馬鈴薯。北海道産が端境期となる初夏（6〜7月）のリレー出荷。"
        },
        {
          rank: 5,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 28500,
          share: 1.2,
          mainCities: [
            { code: "122360", name: "香取市", highlight: "利根川下流域・北総台地の火山灰土壌" },
            { code: "122157", name: "旭市", highlight: "東総地域の水田転作馬鈴薯" }
          ],
          notes: "北総台地の水はけが良い黒ボク土壌。初夏出荷の生食用・ポテトチップス加工用原料。"
        }
      ]
    },
    {
      id: "daikon",
      name: "だいこん（大根）",
      kana: "ダイコン",
      englishName: "Japanese Radish (Daikon)",
      category: "vegetable",
      categoryLabel: "野菜",
      unit: "t",
      icon: "🥢",
      summary: "日本人が古くから親しんできた最重要の根菜。煮物、おでん、刺身のツマ、漬物、大根おろしと用途は無限大です。北海道の夏秋大根、千葉県・神奈川県の冬春大根が二大勢力を形成しています。",
      season: "通年（冬春:12〜5月 千葉・神奈川、夏秋:6〜11月 北海道・青森）",
      nationalTotalProduction: 1160000,
      nationalOutputValue: 790,
      mainVarieties: ["青首大根（耐病総太り等）", "三浦大根", "桜島大根", "源助大根", "聖護院大根"],
      growingConditions: "大根は根が地下深くまで真っ直ぐ伸びるため、土中に小石や硬い層がない深く柔らかな土壌（火山灰土壌や沖積砂質土）が必須です。冷涼な気候を好み、夏は北海道・青森の涼しい台地、冬は温暖な三浦半島や房総半島の潮風が霜を防ぐ環境が選ばれます。",
      trivia: "世界で最も重い大根は鹿児島県の「桜島大根」（重さ20〜30kg、ギネス記録は31.1kg）、世界で最も長い大根は愛知県・岐阜県の「守口大根」（長さ1.5〜2m）です。日本列島各地の土壌と風土に応じて驚異的な多様性が進化しました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 180200,
          share: 15.5,
          mainCities: [
            { code: "012114", name: "網走市", highlight: "オホーツク沿岸の夏秋大根一大産地" },
            { code: "015431", name: "美幌町", highlight: "網走川流域の火山灰肥沃畑" }
          ],
          notes: "夏秋大根全国1位。オホーツクや羊蹄山麓の冷涼な気候を活かし、真夏（7〜9月）の東京市場の過半を北海道産が供給。"
        },
        {
          rank: 2,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 145000,
          share: 12.5,
          mainCities: [
            { code: "122025", name: "銚子市", highlight: "「銚子大根」海洋性温暖気候の冬春大根" },
            { code: "122157", name: "旭市", highlight: "東総平野の深耕砂質土壌" }
          ],
          notes: "冬春大根全国1位。利根川下流の温暖な無霜地帯と水はけの良い黒ボク土壌。おでんや鍋物需要がピークの冬に大量出荷。"
        },
        {
          rank: 3,
          prefectureCode: "020003",
          prefectureName: "青森県",
          production: 119500,
          share: 10.3,
          mainCities: [
            { code: "022063", name: "十和田市", highlight: "十和田火山灰台地の「十和田だいこん」" },
            { code: "024015", name: "野辺地町", highlight: "陸奥湾沿いの冷涼やませ気候を活かした夏大根" }
          ],
          notes: "初夏から秋にかけての重要産地。八甲田山麓の柔らかな火山灰土壌（黒ボク土）が根の伸長を助け肌の美しい大根を育成。"
        },
        {
          rank: 4,
          prefectureCode: "140003",
          prefectureName: "神奈川県",
          production: 104800,
          share: 9.0,
          mainCities: [
            { code: "142107", name: "三浦市", highlight: "「三浦大根」の聖地・冬大根の代名詞" }
          ],
          notes: "「三浦大根」ブランド。三浦半島の温暖な潮風と関東ローム層の火山灰土。煮崩れせず味が染み込む最高のおでん大根。"
        },
        {
          rank: 5,
          prefectureCode: "460003",
          prefectureName: "鹿児島県",
          production: 65100,
          share: 5.6,
          mainCities: [
            { code: "462233", name: "南九州市", highlight: "頴娃地区などのシラス台地・大根畑" },
            { code: "462101", name: "指宿市", highlight: "薩摩半島南端の温泉熱と温暖気候" }
          ],
          notes: "南九州のシラス台地の水はけを活かした冬大根。桜島大根や漬物（たくあん）原料の加工大根も盛ん。"
        }
      ]
    },
    {
      id: "lettuce",
      name: "レタス",
      kana: "レタス",
      englishName: "Lettuce",
      category: "vegetable",
      categoryLabel: "野菜",
      unit: "t",
      icon: "🥗",
      summary: "サラダ需要の拡大とともに日本人の食生活に定着したキク科の葉菜。全国収穫量の約3分の1を長野県（八ヶ岳山麓・浅間山麓の高原）が占め、冬は茨城県や群馬県、兵庫県淡路島、香川県がリレーします。",
      season: "通年（夏秋:6〜10月 長野・群馬、冬春:11〜5月 茨城・兵庫・香川）",
      nationalTotalProduction: 569000,
      nationalOutputValue: 870,
      mainVarieties: ["結球レタス（サリナス系等）", "サニーレタス", "グリーンリーフ", "ロメインレタス"],
      growingConditions: "レタスは高温に極めて弱く、気温25℃を超えると花芽ができて苦くなり結球しません。八ヶ岳山麓の長野県川上村（標高1,100〜1,500m）は、真夏でも冷涼で霧が発生し、夜間の気温が急低下するためシャキシャキとした瑞々しいレタス栽培の絶対的聖地となっています。",
      trivia: "長野県川上村は「奇跡の農村」と呼ばれ、かつて冷害に苦しむ日本最貧の村から、高原レタス栽培への特化と真空予冷装置・コールドチェーンの導入により、現在では農家1戸あたりの平均年収が2,500万円を超える日本屈指の高所得自治体となりました。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "200003",
          prefectureName: "長野県",
          production: 185000,
          share: 32.5,
          mainCities: [
            { code: "203076", name: "川上村", highlight: "レタス日本一の高原村（農家平均年収2,500万円超）" },
            { code: "203050", name: "南牧村", highlight: "野辺山高原・標高1,300mの高冷地巨大産地" },
            { code: "202151", name: "塩尻市", highlight: "松本盆地南部の高冷地レタス" }
          ],
          notes: "夏秋レタス全国1位（シェア3割超）。八ヶ岳山麓・野辺山高原の冷涼気候と真空予冷システム。深夜2時からの朝採り出荷で首都圏へ鮮度直行。"
        },
        {
          rank: 2,
          prefectureCode: "080003",
          prefectureName: "茨城県",
          production: 87800,
          share: 15.4,
          mainCities: [
            { code: "085219", name: "八千代町", highlight: "春・秋レタスの大集積地（鬼怒川流域）" },
            { code: "082287", name: "坂東市", highlight: "利根川沿いの施設・露地複合野菜" },
            { code: "082112", name: "常総市", highlight: "鬼怒川沖積平野の肥沃な畑" }
          ],
          notes: "春（4〜5月）および秋（10〜11月）の全国最大供給地。長野県産が途切れる季節の変わり目を完璧にカバー。"
        },
        {
          rank: 3,
          prefectureCode: "100003",
          prefectureName: "群馬県",
          production: 48100,
          share: 8.4,
          mainCities: [
            { code: "104485", name: "昭和村", highlight: "赤城高原の夏秋高原レタス" },
            { code: "102083", name: "渋川市", highlight: "榛名山麓の準高原地帯" }
          ],
          notes: "赤城高原の標高差を活かした夏秋レタス。利根沼田地域の冷涼気候と火山灰土壌。"
        },
        {
          rank: 4,
          prefectureCode: "280003",
          prefectureName: "兵庫県",
          production: 38200,
          share: 6.7,
          mainCities: [
            { code: "282243", name: "南あわじ市", highlight: "「淡路島レタス」冬春レタスの西日本拠点" }
          ],
          notes: "冬レタスの名産地。淡路島南部の温暖な瀬戸内海気候と、水田裏作による輪作体系で病害虫を防ぐ。"
        },
        {
          rank: 5,
          prefectureCode: "220003",
          prefectureName: "静岡県",
          production: 30100,
          share: 5.3,
          mainCities: [
            { code: "221309", name: "浜松市", highlight: "遠州平野の温暖な冬レタス" },
            { code: "222135", name: "掛川市", highlight: "冬の強い日照を活かした栽培" }
          ],
          notes: "遠州地域の「遠州からっ風」と全国屈指の日照時間を活かした真冬の露地レタス。"
        }
      ]
    },
    {
      id: "raw-milk",
      name: "生乳（酪農・乳牛）",
      kana: "セイニュウ",
      englishName: "Raw Milk (Dairy Farming)",
      category: "livestock",
      categoryLabel: "畜産・酪農",
      unit: "t",
      icon: "🥛",
      summary: "牛乳・バター・チーズ・ヨーグルトの原料となる生乳。全国生産量の半分以上（約56%）を北海道が占める圧倒的構造です。都府県では栃木県（那須塩原）や岩手県、熊本県が都市近郊の飲用牛乳供給基地として重要な役割を担っています。",
      season: "通年（春〜初夏が乳牛の分泌最盛期）",
      nationalTotalProduction: 7440000,
      nationalOutputValue: 7900,
      mainVarieties: ["ホルスタイン種（白黒）", "ジャージー種（高乳脂肪）", "ブラウンスイス種"],
      growingConditions: "乳牛（ホルスタイン種）は原産地が北欧のため暑さに極めて弱く、気温20℃以上で熱ストレスにより乳量が減少します。北海道根釧台地（別海町・中標津町）は夏でも涼しい冷涼気候と濃霧が広がり、広大な牧草地放牧とグラスサイレージ飼料による持続可能な酪農に最適です。",
      trivia: "北海道別海町（べつかいちょう）は「人口約1万4千人に対し、乳牛が11万頭以上」飼養されており、人間よりも牛の数が8倍近く多い日本一の酪農ワンダーランドです。生乳生産量は年間約48万トンで町単独で全国の約6.5%を誇ります。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 4150000,
          share: 55.8,
          mainCities: [
            { code: "016918", name: "別海町", highlight: "生乳生産量日本一（牛の数が人口の8倍・11万頭）" },
            { code: "016926", name: "中標津町", highlight: "根釧台地の格子状防風林と近代酪農" },
            { code: "016641", name: "標茶町", highlight: "釧路湿原上流の広大な草地型酪農" }
          ],
          notes: "全国シェア約56%のメガ酪農地帯。冷涼な根釧台地・十勝平野・オホーツク海沿岸。飲用乳から加工用（バター・チーズ）まで日本の乳製品を完全支える。"
        },
        {
          rank: 2,
          prefectureCode: "090003",
          prefectureName: "栃木県",
          production: 341000,
          share: 4.6,
          mainCities: [
            { code: "092134", name: "那須塩原市", highlight: "本州一の生乳生産自治体・那須野が原扇状地" },
            { code: "094072", name: "那須町", highlight: "那須高原の観光牧場とジャージー牛" }
          ],
          notes: "本州第1位の生乳産地。首都圏巨大消費地に直結する飲用牛乳供給基地。那須山麓の冷涼な気候と豊富な地下水。"
        },
        {
          rank: 3,
          prefectureCode: "030003",
          prefectureName: "岩手県",
          production: 298000,
          share: 4.0,
          mainCities: [
            { code: "033022", name: "葛巻町", highlight: "「ミルクとワインとクリーンエネルギーのまち」" },
            { code: "033031", name: "岩手町", highlight: "北上高地の広大な放牧地" }
          ],
          notes: "北上高地の冷涼な山間傾斜地を活用した放牧型酪農。くずまき高原牧場などの循環型バイオマス酪農が先進的。"
        },
        {
          rank: 4,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 261000,
          share: 3.5,
          mainCities: [
            { code: "432105", name: "菊池市", highlight: "西日本最大の生乳産地・阿蘇外輪山麓" },
            { code: "432148", name: "阿蘇市", highlight: "阿蘇カルデラ・千年の草原放牧文化" }
          ],
          notes: "西日本第1位の酪農県。阿蘇カルデラ草原の湧水と冷涼な高冷地。西日本全域への飲用乳供給を担う。"
        },
        {
          rank: 5,
          prefectureCode: "100003",
          prefectureName: "群馬県",
          production: 211000,
          share: 2.8,
          mainCities: [
            { code: "102016", name: "前橋市", highlight: "赤城山南麓の酪農団地" },
            { code: "102083", name: "渋川市", highlight: "榛名山麓の生乳生産" }
          ],
          notes: "赤城山や榛名山の山麓に広がる酪農ベルト。首都圏向け生乳の重要拠点。"
        }
      ]
    },
    {
      id: "beef-cattle",
      name: "肉用牛・和牛",
      kana: "ニクヨウギュウ",
      englishName: "Beef Cattle (Wagyu)",
      category: "livestock",
      categoryLabel: "畜産・酪農",
      unit: "頭",
      icon: "🥩",
      summary: "世界で絶賛される日本の最高峰ブランド「和牛（黒毛和種等）」。全国飼養頭数は鹿児島県と宮崎県が2大巨頭として全体の3割強を占め、北海道が続きます。繁殖農家（子牛生産）と肥育農家の地域分業体制が確立されています。",
      season: "通年（年末年始・ギフト需要期にピーク）",
      nationalTotalProduction: 1740000,
      nationalOutputValue: 7800,
      mainVarieties: ["黒毛和種（鹿児島黒牛・宮崎牛等）", "褐毛和種（あか牛）", "日本短角種", "無角和種"],
      growingConditions: "広大な牧草地と綺麗な水、冬でも暖かい気候（子牛の呼吸器病を防ぐ）が繁殖に最適です。南九州（鹿児島・宮崎）はシラス台地で畑作よりも畜産に適した地形であり、繁殖から肥育・食肉加工・輸出用認定と畜場までの一貫体制が集積しています。",
      trivia: "「全国和牛能力共進会」（通称：和牛のオリンピック）は5年に一度開催される日本最高峰の品評会です。鹿児島県（第12回大会で内閣総理大臣賞など日本一）と宮崎県（史上初の内閣総理大臣賞4大会連続受賞）が激しい頂上決戦を繰り広げています。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "460003",
          prefectureName: "鹿児島県",
          production: 341000,
          share: 19.6,
          mainCities: [
            { code: "462179", name: "曽於市", highlight: "市町村別肉用牛飼養頭数全国トップクラス" },
            { code: "462233", name: "南九州市", highlight: "薩摩半島南部の畜産・茶複合地帯" },
            { code: "462217", name: "志布志市", highlight: "輸出港を控えた大規模肥育団地" }
          ],
          notes: "飼養頭数日本一。「鹿児島黒牛」は和牛五輪で日本一を獲得。温暖な気候とシラス台地の広大な敷地、最新鋭の輸出ハラール対応と畜場。"
        },
        {
          rank: 2,
          prefectureCode: "450003",
          prefectureName: "宮崎県",
          production: 259000,
          share: 14.9,
          mainCities: [
            { code: "452017", name: "都城市", highlight: "市町村別農業産出額日本一・「肉と焼酎のまち」" },
            { code: "452050", name: "小林市", highlight: "霧島山麓の清らかな名水と肥育牧場" }
          ],
          notes: "「宮崎牛」ブランド。和牛オリンピックで前人未到の4大会連続内閣総理大臣賞。都城市はふるさと納税受入額日本一の原動力。"
        },
        {
          rank: 3,
          prefectureCode: "010003",
          prefectureName: "北海道",
          production: 251000,
          share: 14.4,
          mainCities: [
            { code: "016331", name: "士幌町", highlight: "十勝平野の大規模肉牛肥育センター" },
            { code: "015784", name: "白老町", highlight: "「白老牛」洞爺湖サミット晩餐会で供された名牛" }
          ],
          notes: "広大な十勝平野やオホーツクの飼料自給力を活かした大規模肥育。酪農から生まれるホルスタイン去勢牛・交雑種（F1）の肥育も盛ん。"
        },
        {
          rank: 4,
          prefectureCode: "430003",
          prefectureName: "熊本県",
          production: 130000,
          share: 7.5,
          mainCities: [
            { code: "432148", name: "阿蘇市", highlight: "「熊本あか牛」阿蘇草原放牧の健康赤身肉" },
            { code: "432105", name: "菊池市", highlight: "黒毛和牛「和王」の主要肥育地" }
          ],
          notes: "ヘルシーな赤身肉ブームで脚光を浴びる「褐毛和種（あか牛）」の全国一大産地。阿蘇の広大な草原放牧景観を保全。"
        },
        {
          rank: 5,
          prefectureCode: "030003",
          prefectureName: "岩手県",
          production: 98500,
          share: 5.7,
          mainCities: [
            { code: "032158", name: "奥州市", highlight: "最高級ブランド「前沢牛」の本拠地" },
            { code: "033014", name: "雫石町", highlight: "岩手山麓の肥育団地" }
          ],
          notes: "東日本屈指の高級和牛産地。「前沢牛」「いわて牛」の極上霜降り肉に加え、赤身の「日本短角種」も名高い。"
        }
      ]
    },
    {
      id: "pork",
      name: "豚（養豚）",
      kana: "ブタ",
      englishName: "Pork (Swine / Pig)",
      category: "livestock",
      categoryLabel: "畜産・酪農",
      unit: "頭",
      icon: "🐖",
      summary: "生姜焼き、とんかつ、豚汁など国民食として日本人に最も食される食肉。鹿児島県（かごしま黒豚）と宮崎県が南九州の二大巨頭を誇り、東日本では千葉県、群馬県、愛知県が都市近郊の供給を支えます。",
      season: "通年（ビタミンB1豊富で夏バテ防止や冬の鍋需要に通年消費）",
      nationalTotalProduction: 8720000,
      nationalOutputValue: 6400,
      mainVarieties: ["三元豚（LWD交雑種）", "かごしま黒豚（バークシャー種）", "イベリコ交雑", "金華豚"],
      growingConditions: "豚は暑熱に弱く、伝染病（豚熱等）を防ぐための厳重な衛生管理（バイオセキュリティ）と換気・排水設備が必須です。南九州のシラス台地は水はけが良く大規模なウインドウレス（無窓）豚舎を建設しやすい利点があり、サツマイモ粕や焼酎粕を活用した良質な飼料給与が行われています。",
      trivia: "鹿児島の「かごしま黒豚」は、サツマイモを飼料に約10〜20%混ぜて肥育されます。サツマイモに含まれる良質なデンプン質が豚肉の脂肪の融点を引き上げ、白身（脂身）がベタつかずサッパリとして甘みとうま味が増す科学的効果があります。",
      rankings: [
        {
          rank: 1,
          prefectureCode: "460003",
          prefectureName: "鹿児島県",
          production: 1205000,
          share: 13.8,
          mainCities: [
            { code: "462039", name: "鹿屋市", highlight: "大隅半島・日本屈指の大規模養豚クラスター" },
            { code: "462233", name: "南九州市", highlight: "「かごしま黒豚」サツマイモ飼育の伝統郷" }
          ],
          notes: "養豚頭数日本一（全国シェア約14%）。世界的名声を持つ「かごしま黒豚」。サツマイモ給与による甘い脂身と徹底した衛生管理。"
        },
        {
          rank: 2,
          prefectureCode: "450003",
          prefectureName: "宮崎県",
          production: 855000,
          share: 9.8,
          mainCities: [
            { code: "452017", name: "都城市", highlight: "市町村別豚出荷頭数日本一（巨大食肉加工団地）" },
            { code: "454052", name: "川南町", highlight: "児湯郡の先進的共同バイオセキュリティ豚舎" }
          ],
          notes: "都城市を中心とする南九州の一大ポーク拠点。最新鋭の食肉センターと加工技術で高品質豚肉を全国のスーパーへ供給。"
        },
        {
          rank: 3,
          prefectureCode: "120003",
          prefectureName: "千葉県",
          production: 602000,
          share: 6.9,
          mainCities: [
            { code: "122157", name: "旭市", highlight: "東日本最大の養豚自治体（チバザポークの中核）" },
            { code: "122360", name: "香取市", highlight: "北総地域の銘柄豚肥育" }
          ],
          notes: "東日本第1位の養豚県。旭市は市町村別頭数で全国トップ争い。首都圏直結のチルド鮮度配送が強み。"
        },
        {
          rank: 4,
          prefectureCode: "100003",
          prefectureName: "群馬県",
          production: 585000,
          share: 6.7,
          mainCities: [
            { code: "102016", name: "前橋市", highlight: "「赤城ポーク」「えばらハーブ豚」のふるさと" },
            { code: "102083", name: "渋川市", highlight: "榛名山麓の清冷な水と風" }
          ],
          notes: "赤城山麓の清らかな水と澄んだ空気。「上州麦豚」など麦類を配合した飼料でクセのないあっさりとした肉質を実現。"
        },
        {
          rank: 5,
          prefectureCode: "230003",
          prefectureName: "愛知県",
          production: 349000,
          share: 4.0,
          mainCities: [
            { code: "232319", name: "田原市", highlight: "渥美半島の野菜残渣や食品循環飼料活用" },
            { code: "232017", name: "豊橋市", highlight: "東三河の食肉供給センター" }
          ],
          notes: "中京大都市圏の供給拠点。食品リサイクル飼料（エコフィード）を活用した先進的なサーキュラーアグリカルチャー。"
        }
      ]
    }
  ]
};

const outputDir = path.join(__dirname, '..', 'src', 'data', 'handbook');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'fruits.json');
fs.writeFileSync(outputPath, JSON.stringify(handbookData, null, 2), 'utf8');
console.log('Successfully written to:', outputPath);
console.log('Total items count:', handbookData.items.length);

const categories = {};
handbookData.items.forEach(it => {
  categories[it.category] = (categories[it.category] || 0) + 1;
});
console.log('Category breakdown:', categories);
