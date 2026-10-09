const fs = require('fs');
const path = require('path');

const industryItems = [
  {
    id: 'manufacturing',
    name: '製造品出荷額等（ものづくり総合）',
    kana: 'セイゾウヒンシュッカガク',
    englishName: 'Manufacturing Output (Overall)',
    category: 'industry',
    categoryLabel: '鉱工業・先端産業',
    unit: '兆円',
    icon: '🏭',
    summary: '日本の基幹産業である「ものづくり（製造業）」の総合規模。愛知県が約48兆円で40年以上連続で全国断トツの日本一を独走し、2位以下の大阪府、静岡県、神奈川県、兵庫県を大きく引き離しています。',
    season: '通年（年間統計確定値）',
    nationalTotalProduction: 340,
    nationalOutputValue: 3400000,
    mainVarieties: ['輸送用機械', '化学工業', '電子部品・デバイス', '生産用機械', '鉄鋼・金属', '食料品'],
    growingConditions: '港湾インフラ（名古屋港、神戸港、横浜港等の国際拠点港湾）、豊富な工業用水、電力インフラ、高速道路網、そして下請け・中小加工企業から完成品組立メーカーまでの緊密なサプライチェーン集積が絶対条件です。',
    trivia: '愛知県の製造品出荷額約48兆円は、スウェーデンやオーストリアなど欧州先進国の国家GDP全体に匹敵する巨大規模です。また、愛知県飛島村は名古屋港臨海工業地帯の固定資産税により「財政力指数全国1位（1.94）」の日本一裕福な村となっています。',
    rankings: [
      {
        rank: 1,
        prefectureCode: '230003',
        prefectureName: '愛知県',
        production: 48.3,
        share: 14.2,
        mainCities: [
          { code: '232114', name: '豊田市', highlight: '世界のトヨタ自動車・日本一の製造品出荷額都市' },
          { code: '231002', name: '名古屋市', highlight: '中京工業地帯の中枢管理機能・港湾ハブ' },
          { code: '232106', name: '刈谷市', highlight: 'デンソー・アイシンなど世界大手自動車部品メガハブ' },
          { code: '234273', name: '飛島村', highlight: '名古屋港輸出入基地・財政力指数1.94（日本一の富豪村）' }
        ],
        notes: '中京工業地帯の中核。45年連続製造品出荷額日本一。自動車・航空宇宙・工作機械が集積する世界屈指のものづくりメガクラスター。'
      },
      {
        rank: 2,
        prefectureCode: '270003',
        prefectureName: '大阪府',
        production: 17.2,
        share: 5.1,
        mainCities: [
          { code: '272272', name: '東大阪市', highlight: '「ものづくりの街」超高度金属加工・人工衛星まいど1号' },
          { code: '271403', name: '堺市', highlight: '堺泉北臨海工業地帯・シャープ液晶・機械金属' },
          { code: '271004', name: '大阪市', highlight: '阪神工業地帯中枢・化学・金属・製薬' }
        ],
        notes: '阪神工業地帯の心臓部。東大阪の高度な町工場ネットワークと臨海部重化学工業、製薬・化学の複合基盤。'
      },
      {
        rank: 3,
        prefectureCode: '220003',
        prefectureName: '静岡県',
        production: 16.6,
        share: 4.9,
        mainCities: [
          { code: '221309', name: '浜松市', highlight: '「やらまいか精神」スズキ・ヤマハ・ローランド・ホンダ発祥地' },
          { code: '222119', name: '磐田市', highlight: 'ヤマハ発動機・ジュビロ磐田の企業城下町' },
          { code: '222101', name: '富士市', highlight: '富士山の豊富な地下水を活かした製紙・化学ベルト' }
        ],
        notes: '東海工業地域。浜松の輸送機械・楽器・光電子、富士・富士宮の製紙・医薬品。東西大消費地の中間立地。'
      },
      {
        rank: 4,
        prefectureCode: '140003',
        prefectureName: '神奈川県',
        production: 16.2,
        share: 4.8,
        mainCities: [
          { code: '141003', name: '横浜市', highlight: '日産自動車・京浜臨海工業地帯の大規模重化学' },
          { code: '141305', name: '川崎市', highlight: '先端研究開発型産業・臨海部カーボンニュートラル拠点' },
          { code: '142051', name: '藤沢市', highlight: 'いすゞ自動車・先端機械金属工業' }
        ],
        notes: '京浜工業地帯の中枢。巨大港湾と首都圏消費地に直結。近年は先端研究開発（R&D）拠点への高度化が加速。'
      },
      {
        rank: 5,
        prefectureCode: '280003',
        prefectureName: '兵庫県',
        production: 15.5,
        share: 4.6,
        mainCities: [
          { code: '281000', name: '神戸市', highlight: '川崎重工・三菱重工の造船・航空・鉄道車両' },
          { code: '282014', name: '姫路市', highlight: '播磨臨海工業地帯・日本製鉄瀬戸内製鉄所' },
          { code: '282103', name: '加古川市', highlight: '神戸製鋼所加古川製鉄所・重厚長大産業の拠点' }
        ],
        notes: '阪神臨海および播磨臨海工業地帯。鉄鋼・重機械・造船・鉄道車両から灘の酒造まで極めて多彩な製造業が集積。'
      }
    ]
  },
  {
    id: 'automobile',
    name: '自動車・輸送用機械',
    kana: 'ジドウシャ',
    englishName: 'Automotive & Transport Equipment',
    category: 'industry',
    categoryLabel: '鉱工業・先端産業',
    unit: '兆円',
    icon: '🚗',
    summary: '日本の輸出と雇用を牽引する最大基幹産業。愛知県が全国出荷額の約4割を占める超寡占構造を持ち、スズキ・ヤマハの静岡県、SUBARU（スバル）の群馬県、マツダの広島県、日産・いすゞの神奈川県など、世界的自動車メーカーの企業城下町が列島各地に栄えています。',
    season: '通年（年間生産・輸出）',
    nationalTotalProduction: 70,
    nationalOutputValue: 700000,
    mainVarieties: ['乗用車（ガソリン・HV・EV）', '商用車（トラック・バス）', '車載電装部品（デンソー等）', '変速機・駆動系（アイシン等）', '二輪車（バイク）'],
    growingConditions: '約3万点に及ぶ部品をジャストインタイム（かんばん方式）で調達するため、完成車工場の周囲数十キロ圏内に一次・二次・三次サプライチェーンが重層的に立地できる広大な平野部と道路網、輸出専用自動車運搬船（PCC）が接岸できる深水水深港湾が必須です。',
    trivia: '愛知県豊田市は、もともと「挙母（ころも）市」という名前でしたが、トヨタ自動車の飛躍的発展に伴い、1959年に自治体名を「豊田市」へ変更しました。世界でも企業名がそのまま自治体名になった極めて稀な例です。',
    rankings: [
      {
        rank: 1,
        prefectureCode: '230003',
        prefectureName: '愛知県',
        production: 28.4,
        share: 40.6,
        mainCities: [
          { code: '232114', name: '豊田市', highlight: 'トヨタ自動車本社・元町工場など中枢クラスター' },
          { code: '232106', name: '刈谷市', highlight: 'デンソー・アイシン・トヨタ自動織機の本拠地' },
          { code: '232017', name: '豊橋市', highlight: '三河港（日本一の自動車輸出入港）' },
          { code: '232122', name: '安城市', highlight: 'アイシン主要工場・ハイブリッド駆動装置' }
        ],
        notes: '全国シェア40%超の絶対的メガハブ。三河港は輸入車・輸出車取扱高日本一。世界最高峰のモビリティ開発・生産集積地。'
      },
      {
        rank: 2,
        prefectureCode: '220003',
        prefectureName: '静岡県',
        production: 5.5,
        share: 7.9,
        mainCities: [
          { code: '221309', name: '浜松市', highlight: 'スズキ本社・本田技研工業創業の地（二輪・軽自動車）' },
          { code: '222119', name: '磐田市', highlight: 'ヤマハ発動機本社・スズキ磐田工場' },
          { code: '222208', name: '裾野市', highlight: 'トヨタWoven City（ウーブン・シティ実験都市）' }
        ],
        notes: '「バイクのふるさと浜松」。軽自動車・二輪車・船外機の世界的大手企業が集積。東名・新東名直結の高度サプライチェーン。'
      },
      {
        rank: 3,
        prefectureCode: '100003',
        prefectureName: '群馬県',
        production: 4.8,
        share: 6.9,
        mainCities: [
          { code: '102059', name: '太田市', highlight: 'SUBARU（スバル）本工場・矢島工場・企業城下町' },
          { code: '102041', name: '伊勢崎市', highlight: 'サンデン・スバル関連部品サプライヤー集積' }
        ],
        notes: '中島飛行機のDNAを継ぐ「SUBARU（スバル）の街・太田」。北関東道整備により常陸那珂港や首都圏へのアクセスが劇的進化。'
      },
      {
        rank: 4,
        prefectureCode: '340003',
        prefectureName: '広島県',
        production: 4.2,
        share: 6.0,
        mainCities: [
          { code: '343021', name: '府中町', highlight: 'マツダ（MAZDA）本社・宇品工場（全周を広島市に囲まれた町）' },
          { code: '341002', name: '広島市', highlight: '南区宇品地区の専用船積岸壁・自動車産業集積' }
        ],
        notes: '「マツダの城下町」。安芸郡府中町はマツダ本社が存在するため財政力が極めて高く、周囲を広島市に囲まれながら単独町制を堅持。'
      },
      {
        rank: 5,
        prefectureCode: '140003',
        prefectureName: '神奈川県',
        production: 3.8,
        share: 5.4,
        mainCities: [
          { code: '141003', name: '横浜市', highlight: '日産自動車グローバル本社・横浜工場' },
          { code: '142123', name: '厚木市', highlight: '日産先進技術開発センター（NATC）' },
          { code: '142018', name: '横須賀市', highlight: '日産追浜工場・EV（リーフ）専用組立ライン' }
        ],
        notes: '日産自動車のグローバル中枢。EV（電気自動車）開発・量産の先駆地であり、首都圏市場直結の研究開発メガハブ。'
      }
    ]
  },
  {
    id: 'semiconductor',
    name: '半導体・電子部品・デバイス',
    kana: 'ハンドウタイ',
    englishName: 'Semiconductors & Electronic Components',
    category: 'industry',
    categoryLabel: '鉱工業・先端産業',
    unit: '億円',
    icon: '⚡',
    summary: 'デジタル社会とAI・経済安全保障の生命線「産業のコメ」。世界最大手TSMC（台湾積体電路製造）が進出した熊本県が急成長し「シリコンアイランド九州」が完全復活。長崎県（ソニーのイメージセンサー）、三重県・岩手県（キオクシアのメモリ）、北海道（Rapidas千歳）など国家戦略クラスターが躍動しています。',
    season: '通年（世界需要連動）',
    nationalTotalProduction: 162000,
    nationalOutputValue: 162000,
    mainVarieties: ['ロジック半導体（TSMC等）', 'CMOSイメージセンサー（ソニー）', 'NAND型フラッシュメモリ（キオクシア）', 'パワー半導体（SiC/GaN）', '半導体製造装置（東京エレクトロン等）'],
    growingConditions: '半導体製造（メガファブ）には、①不純物のない膨大な「超純水（清らかな地下水・伏流水）」、②瞬時電圧低下（瞬低）のない極めて安定した「高品質電力」、③振動のない強固な地盤、④成田や福岡など世界へ直行できる「空港アクセス」が必須です。阿蘇の地下水に恵まれた熊本や、北上川水系の岩手県が選ばれる理由です。',
    trivia: '熊本県菊陽町（人口約4.4万人）は、TSMCの進出により関連企業が殺到し、地価上昇率が全国トップを記録。町内の工業地帯では時給3,000円超の求人や、新設国際学校・巨大道路アクセス整備が急ピッチで進み、日本の地方創生・国家投資の象徴となっています。',
    rankings: [
      {
        rank: 1,
        prefectureCode: '430003',
        prefectureName: '熊本県',
        production: 24800,
        share: 15.3,
        mainCities: [
          { code: '434043', name: '菊陽町', highlight: 'TSMC子会社JASM第1・第2メガファブ（投資額3兆円超）' },
          { code: '432164', name: '合志市', highlight: '東京エレクトロン九州・半導体製造装置メガ拠点' },
          { code: '434035', name: '大津町', highlight: '関連サプライチェーン・物流ハブの急拡大' },
          { code: '431001', name: '熊本市', highlight: '熊本空港・都市機能インフラ中枢' }
        ],
        notes: '「新生シリコンアイランド」の頂点。阿蘇の豊かな地下水と阿蘇くまもと空港。TSMCの進出により関連投資が波及し税収・経済効果が急騰。'
      },
      {
        rank: 2,
        prefectureCode: '420003',
        prefectureName: '長崎県',
        production: 18500,
        share: 11.4,
        mainCities: [
          { code: '422045', name: '諫早市', highlight: 'ソニーセミコンダクタマニュファクチャリング長崎TEC' },
          { code: '422053', name: '大村市', highlight: '長崎空港直結の電子部品・クリーンファブ' }
        ],
        notes: 'スマートフォンカメラの世界シェア過半を握る「ソニーCMOSイメージセンサー」の世界最大供給拠点。諫早中核工業団地の拡張が継続。'
      },
      {
        rank: 3,
        prefectureCode: '240003',
        prefectureName: '三重県',
        production: 17200,
        share: 10.6,
        mainCities: [
          { code: '242021', name: '四日市市', highlight: 'キオクシア四日市工場（世界最大級NANDフラッシュメモリ）' },
          { code: '242055', name: '桑名市', highlight: '東芝・アドバンテスト等半導体関連企業' }
        ],
        notes: '四日市工場は世界で生産されるフラッシュメモリの数割を担う巨大クリーンルーム群。米国ウエスタンデジタルとの合弁巨額投資。'
      },
      {
        rank: 4,
        prefectureCode: '030003',
        prefectureName: '岩手県',
        production: 13800,
        share: 8.5,
        mainCities: [
          { code: '032069', name: '北上市', highlight: 'キオクシア岩手北上工場・新メガ製造棟' },
          { code: '032093', name: '一関市', highlight: '東北自動車道沿いの電子デバイス集積' }
        ],
        notes: '「シリコンロード東北」の中心地。北上川水系の清冽な水資源と強固な岩盤。3次元フラッシュメモリの最先端量産棟が稼働。'
      },
      {
        rank: 5,
        prefectureCode: '010003',
        prefectureName: '北海道',
        production: 9800,
        share: 6.0,
        mainCities: [
          { code: '012246', name: '千歳市', highlight: 'Rapidas（ラピダス）最先端2nmファブ建設地（IIM）' },
          { code: '012131', name: '苫小牧市', highlight: '苫東工業地帯・水資源とグリーン電力供給地' }
        ],
        notes: '次世代2ナノメートル半導体の国産化に挑む国家プロジェクト「ラピダス」が千歳市に進出。新千歳空港と再生可能エネルギーの優位性。'
      }
    ]
  },
  {
    id: 'pharmaceutical',
    name: '医薬品・製薬・バイオ',
    kana: 'イヤクヒン',
    englishName: 'Pharmaceuticals & Bio-Healthcare',
    category: 'industry',
    categoryLabel: '鉱工業・先端産業',
    unit: '億円',
    icon: '💊',
    summary: '国民の健康・医療費と高齢化社会を支える高付加価値ヘルスケア産業。「くすりの富山」として300年以上の歴史を誇る富山県が受託製造・ジェネリック医薬品でトップ級を誇り、近江売薬の滋賀県、道修町（どしょうまち）の大阪府、富士山麓ファルマバレーの静岡県が続きます。',
    season: '通年（高付加価値型）',
    nationalTotalProduction: 105000,
    nationalOutputValue: 105000,
    mainVarieties: ['医療用医薬品', '後発医薬品（ジェネリック）', 'OTC一般用医薬品', 'バイオ抗体医薬', '配置家庭薬（伝統薬）'],
    growingConditions: '立山連峰や富士山、鈴鹿山脈がもたらす豊富な「高品質な名水・地下水（医薬品の注射用水・精製水）」と、湿度が保たれ空気の澄んだ環境が不可欠です。また、江戸時代からの配置薬行商人制度によって全国津々浦々に張り巡らされた信頼と流通ネットワークが基礎を形成しています。',
    trivia: '富山県では江戸時代、2代藩主・前田正甫が江戸城腹痛事件で名薬「反魂丹（はんごんたん）」を差し出し他藩の大名を驚かせたことから、全国への「配置薬（先用後利：先に薬を預けて後から使った分だけ集金する）」システムが公認され、製薬産業の礎となりました。',
    rankings: [
      {
        rank: 1,
        prefectureCode: '160003',
        prefectureName: '富山県',
        production: 15200,
        share: 14.5,
        mainCities: [
          { code: '162019', name: '富山市', highlight: '「くすりの富山」中枢・日医工・富山化学・広貫堂' },
          { code: '162116', name: '射水市', highlight: '臨海部医薬品メガファクトリー' },
          { code: '162060', name: '滑川市', highlight: '東亜薬品・眼科点眼薬・バイオ医薬' }
        ],
        notes: '配置薬300年の歴史。製薬企業数・製造受託数全国一。立山連峰の豊富な雪解け地下水。近年は品質管理とサプライチェーン再構築を推進。'
      },
      {
        rank: 2,
        prefectureCode: '250003',
        prefectureName: '滋賀県',
        production: 11200,
        share: 10.7,
        mainCities: [
          { code: '252093', name: '甲賀市', highlight: '「甲賀売薬」伝統の地・製薬工場の大集積' },
          { code: '252018', name: '大津市', highlight: '琵琶湖岸のバイオ研究所・外資系製薬' }
        ],
        notes: '近江商人の「三方よし」に基づく甲賀売薬の伝統。名神高速沿いで関西・中京双方へのアクセスが良く製薬工場の新設が活発。'
      },
      {
        rank: 3,
        prefectureCode: '270003',
        prefectureName: '大阪府',
        production: 10500,
        share: 10.0,
        mainCities: [
          { code: '271004', name: '大阪市', highlight: '中央区道修町（どしょうまち）武田薬品・塩野義・田辺三菱' },
          { code: '272051', name: '吹田市', highlight: '北大阪健康医療都市（健都）・循環器・バイオ医療ハブ' }
        ],
        notes: '日本のくすりの街「道修町」。神農祭で知られる少彦名神社を擁し、日本の大手製薬メーカーの創業地が集結。研究開発・創薬ベンチャーを牽引。'
      },
      {
        rank: 4,
        prefectureCode: '220003',
        prefectureName: '静岡県',
        production: 8800,
        share: 8.4,
        mainCities: [
          { code: '222071', name: '富士宮市', highlight: 'テルモ・富士フイルム・富士山伏流水の医療器具・製薬' },
          { code: '222101', name: '富士市', highlight: '製薬化学コンビナート' },
          { code: '223425', name: '長泉町', highlight: '静岡がんセンター・ファルマバレープロジェクト中核' }
        ],
        notes: '「ファルマバレー（医療の谷）構想」。富士山麓の無菌的清冽地下水と県立静岡がんセンターを軸とする医療健康産業クラスター。'
      },
      {
        rank: 5,
        prefectureCode: '110003',
        prefectureName: '埼玉県',
        production: 8100,
        share: 7.7,
        mainCities: [
          { code: '112020', name: '熊谷市', highlight: '関越道沿いの大型受託製造ファブ' },
          { code: '112119', name: '本庄市', highlight: 'エーザイ等の主要研究・生産拠点' }
        ],
        notes: '首都圏大消費地に隣接する受託製造・ジェネリック医薬品の供給ハブ。関越道・圏央道沿いの物流利便性を活かした立地。'
      }
    ]
  },
  {
    id: 'chemical-petroleum',
    name: '石油化学・石油コンビナート',
    kana: 'セキユカガク',
    englishName: 'Petrochemicals & Heavy Chemical Complexes',
    category: 'industry',
    categoryLabel: '鉱工業・先端産業',
    unit: '兆円',
    icon: '🧪',
    summary: 'プラスチック、合成ゴム、合成繊維、塗料など現代社会のあらゆる基礎素材を生み出す巨大装置産業。東京湾の「京葉臨海工業地帯（千葉県）」を筆頭に、瀬戸内海の山口県（周南）、三重県（四日市）、岡山県（水島）に巨大コンビナートが連なり、パイプラインで有機的に結合しています。',
    season: '通年（連続24時間稼働）',
    nationalTotalProduction: 32,
    nationalOutputValue: 320000,
    mainVarieties: ['エチレン・プロピレン', 'プラスチック樹脂（ポリエチレン等）', '合成ゴム', '機能性化学品', '電子材料用高純度ケミカル'],
    growingConditions: '大型原油タンカー（VLCC）が直接接岸できる大型深水航路港湾、原油精製所（リファイナリー）からナフサを受け取り近隣の誘導品工場へ送る相互パイプライン網、膨大な冷却海水・工業用水、そして広大な埋立地が必須条件です。',
    trivia: '千葉県市原市の京葉臨海工業地帯は、単一の石油化学コンビナートとしては極東最大級の規模を誇ります。夜間には無数の配管や蒸留塔が照らし出される「工場夜景」の聖地としても全国的な人気を集めています。',
    rankings: [
      {
        rank: 1,
        prefectureCode: '120003',
        prefectureName: '千葉県',
        production: 4.5,
        share: 14.1,
        mainCities: [
          { code: '122190', name: '市原市', highlight: '日本最大のエチレン生産能力・京葉臨海コンビナート中核' },
          { code: '122297', name: '袖ケ浦市', highlight: '石油精製・天然ガス（LNG）受入基地' },
          { code: '121002', name: '千葉市', highlight: '中央区臨海部・JFEスチールと隣接する化学帯' }
        ],
        notes: '日本最強の石油化学メガクラスター。市原市は全国トップのエチレン生産シェア。首都圏大消費地に隣接しプラスチック・電子材料を供給。'
      },
      {
        rank: 2,
        prefectureCode: '350003',
        prefectureName: '山口県',
        production: 3.2,
        share: 10.0,
        mainCities: [
          { code: '352152', name: '周南市', highlight: '徳山下松港沿岸・出光興産・東ソーなど周南コンビナート' },
          { code: '352021', name: '宇部市', highlight: 'UBE（旧宇部興産）の総合無機・有機化学' },
          { code: '352080', name: '岩国市', highlight: '三井化学・瀬戸内海最東端の石油化学' }
        ],
        notes: '瀬戸内工業地域西部の化学王国。周南・宇部・岩国にコンビナートが連立。苛性ソーダや機能性樹脂など川上から川下まで完備。'
      },
      {
        rank: 3,
        prefectureCode: '240003',
        prefectureName: '三重県',
        production: 2.8,
        share: 8.8,
        mainCities: [
          { code: '242021', name: '四日市市', highlight: '日本初の石油化学コンビナート・公害克服の環境先進都市' },
          { code: '242071', name: '鈴鹿市', highlight: '化学品輸送・自動車用樹脂部品' }
        ],
        notes: '昭和30年代に日本で初めて建設された四日市コンビナート。四日市ぜんそくを乗り越え、現在は世界最高水準の環境・脱炭素コンビナートへ変貌。'
      },
      {
        rank: 4,
        prefectureCode: '330003',
        prefectureName: '岡山県',
        production: 2.6,
        share: 8.1,
        mainCities: [
          { code: '332020', name: '倉敷市', highlight: '水島臨海工業地帯・ENEOS水島製油所・三菱ケミカル' }
        ],
        notes: '「水島コンビナート」。瀬戸内海の中央に位置し、石油精製・石油化学・鉄鋼（JFE）が緊密に連携する日本屈指の複合コンビナート。'
      },
      {
        rank: 5,
        prefectureCode: '270003',
        prefectureName: '大阪府',
        production: 2.1,
        share: 6.6,
        mainCities: [
          { code: '272256', name: '高石市', highlight: '堺泉北臨海工業地帯の中核・三井化学大阪工場' },
          { code: '271403', name: '堺市', highlight: 'ENEOS堺製油所・臨海部コンビナート' },
          { code: '272060', name: '泉大津市', highlight: '港湾物流・化学品タンクヤード' }
        ],
        notes: '堺泉北臨海工業地帯。高石市は面積が小さいながらコンビナートの固定資産税で極めて高い財政力を誇る。関西圏のプラスチック供給基地。'
      }
    ]
  },
  {
    id: 'steel-metals',
    name: '鉄鋼・金属材料',
    kana: 'テッコウ',
    englishName: 'Steel & Advanced Metals',
    category: 'industry',
    categoryLabel: '鉱工業・先端産業',
    unit: '兆円',
    icon: '🔩',
    summary: 'ビル、橋梁、自動車、造船、鉄道など社会インフラを骨格から支える「産業の母」。臨海部にそびえる巨大高炉（銑鋼一貫製鉄所）を中心に、兵庫県（日本製鉄・神戸製鋼所）、千葉県（JFEスチール）、愛知県（日本製鉄名古屋）、広島県（JFE福山）が圧倒的シェアを誇ります。',
    season: '通年（高炉連続燃焼）',
    nationalTotalProduction: 20,
    nationalOutputValue: 200000,
    mainVarieties: ['自動車用高張力鋼板（ハイテン）', '厚板（造船・橋梁用）', '電磁鋼板（EVモーター用）', '特殊鋼・ステンレス', '電炉鋼材（リサイクル鉄筋）'],
    growingConditions: 'オーストラリアやブラジルから鉄鉱石・原料炭を積んだ大型ばら積み船（ケープサイズバルカー）が接岸できる水深15m以上の深水岸壁と、広大な原料ヤード・高炉・熱延ミル用地、そして大量の冷却水が不可欠なため、全製鉄所が臨海埋立地に集中立地しています。',
    trivia: '広島県福山市にあるJFEスチール西日本製鉄所（福山地区）は、敷地面積が約1,420万㎡（東京ドーム約300個分）に達し、単一の製鉄所としては世界最大級の威容を誇ります。福山市の市街地から一望できる巨大な煙突群は街のシンボルです。',
    rankings: [
      {
        rank: 1,
        prefectureCode: '280003',
        prefectureName: '兵庫県',
        production: 2.9,
        share: 14.5,
        mainCities: [
          { code: '282014', name: '姫路市', highlight: '日本製鉄瀬戸内製鉄所（広畑地区）' },
          { code: '282103', name: '加古川市', highlight: '神戸製鋼所加古川製鉄所・高炉一貫製鉄所' },
          { code: '281000', name: '神戸市', highlight: '神戸製鋼所本社・先端金属材料開発' }
        ],
        notes: '鉄鋼出荷額日本一。瀬戸内海沿岸の姫路・加古川に巨大高炉が集積。自動車用ハイテン材や線材・特殊鋼で世界最高水準の技術力。'
      },
      {
        rank: 2,
        prefectureCode: '120003',
        prefectureName: '千葉県',
        production: 2.6,
        share: 13.0,
        mainCities: [
          { code: '122254', name: '君津市', highlight: '日本製鉄東日本製鉄所君津地区・巨大臨海製鉄所' },
          { code: '121002', name: '千葉市', highlight: 'JFEスチール東日本製鉄所（千葉地区・日本初戦後臨海製鉄所）' }
        ],
        notes: '東京湾沿岸の東西2大高炉（君津・千葉）。首都圏の巨大建設需要と自動車産業を直結する強固な供給網。'
      },
      {
        rank: 3,
        prefectureCode: '230003',
        prefectureName: '愛知県',
        production: 2.3,
        share: 11.5,
        mainCities: [
          { code: '232220', name: '東海市', highlight: '日本製鉄名古屋製鉄所・「鉄のまち東海市」' },
          { code: '231002', name: '名古屋市', highlight: '大同特殊鋼本社・特殊鋼世界大手' }
        ],
        notes: '知多半島の東海市にある名古屋製鉄所は、トヨタ自動車など中部モビリティ産業の鋼板需要を一手に引き受ける最強のパートナー。'
      },
      {
        rank: 4,
        prefectureCode: '340003',
        prefectureName: '広島県',
        production: 1.9,
        share: 9.5,
        mainCities: [
          { code: '342076', name: '福山市', highlight: 'JFEスチール西日本製鉄所福山地区（世界最大級のメガファブ）' }
        ],
        notes: '福山港に面した世界最大級の銑鋼一貫製鉄所。自動車用電磁鋼板など高機能鋼材をアジア・世界へ大量輸出。'
      },
      {
        rank: 5,
        prefectureCode: '400003',
        prefectureName: '福岡県',
        production: 1.4,
        share: 7.0,
        mainCities: [
          { code: '401005', name: '北九州市', highlight: '官営八幡製鐵所・世界遺産「明治日本の産業革命遺産」' },
          { code: '406210', name: '苅田町', highlight: '日産自動車九州に隣接する自動車用鋼材加工拠点' }
        ],
        notes: '近代日本の産業発展を切り拓いた「八幡製鐵所（現・日本製鉄九州製鉄所八幡地区）」の伝統。電炉鉄鋼や環境リサイクル製鉄へ進化。'
      }
    ]
  }
];

const fruitsJsonPath = path.join(__dirname, '..', 'src', 'data', 'handbook', 'fruits.json');
const currentData = JSON.parse(fs.readFileSync(fruitsJsonPath, 'utf8'));

currentData.title = '都道府県便覧【産業・特産品編】';
currentData.subtitle = '農林水産省・経済産業省・総務省の最新確定統計に基づく全国47都道府県・主要自治体データ';
currentData.description = '日本全国の主要産業・特産品（果実・野菜・米・酪農・畜産・自動車・半導体・医薬品・化学・鉄鋼等）全26品目の都道府県別シェアと主要自治体を完全網羅。地理・立地背景から自治体決算カルテまでシームレスに探究できます。';
currentData.source = '農林水産省「作物統計・畜産統計」、経済産業省「経済構造実態調査（製造業）」「工業統計」、総務省公的確定値';

// 重複チェックして追加
for (const item of industryItems) {
  const existingIdx = currentData.items.findIndex(it => it.id === item.id);
  if (existingIdx >= 0) {
    currentData.items[existingIdx] = item;
  } else {
    currentData.items.push(item);
  }
}

fs.writeFileSync(fruitsJsonPath, JSON.stringify(currentData, null, 2), 'utf8');
console.log('Successfully updated fruits.json with industry items!');
console.log('Total items now:', currentData.items.length);

const categories = {};
currentData.items.forEach(it => {
  categories[it.category] = (categories[it.category] || 0) + 1;
});
console.log('Categories breakdown:', categories);
