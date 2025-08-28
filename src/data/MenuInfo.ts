// 配列に対して型エイリアスを作成
export type productModelsProps = Array<{
    name: string,
    image: string,
    model: string,
    minDetail?: string,
    description: string,
    category: string,
    price: string,
}>;

export const productCategory : string[] =[
    'メインメニュー',
    '盛り合わせ',
    'タン・カルビ',
    'ホルモン',
    'サイドメニュー',
    'その他',
]


// 商品とモデルの関連付け
export const productModels : productModelsProps = [
        {
            name: '特上カルビ',
            image: './images/特上カルビ.jpg',
            model: './models/',
            minDetail: 'カルビの中の最高級部位',
            description: 'カルビの最高級部位。\n口の中でとろけだす上質な油をご堪能ください。',
            category: 'カルビ',
            price: '1500 (税込1650)', // 文字列形式に変更
        },
        {
            name: '上カルビ',
            image: './images/上カルビ.jpg',
            model: './models/上カルビ1人前3編集済.glb',
            minDetail:'カルビの中の上級部位',
            description: '上質な脂の旨味が楽しめる人気のカルビ。',
            category: 'カルビ',
            price: '1080 (税込1188)', // 文字列形式に変更
        },
        {
            name: 'ファミリーセット',
            image: './images/ファミリーセット.jpg',
            model: './models/family_s_set_raw.glb',
            minDetail :'リーズナブルな大判カルビ',
            description : '焼肉の定番！お手頃価格で楽しめる大判カルビ。',
            category : '盛り合わせ',
            price : '880 (税込968)', // 文字列形式に変更
        },
        {
            name: '九種盛り',
            image: './images/九種盛り.jpg',
            model: './models/9hormone__set_raw.glb',
            description: '様々な部位を少しずつ楽しめるお得な盛り合わせ。',
            category: '盛り合わせ',
            price: '3500', // 文字列形式に変更 (税込不明)
        },
        {
            name: 'カルビ盛り',
            image: './images/カルビ盛り.jpg',
            model: './models/calbee_set_raw.glb',
            description: 'カルビ好きにはたまらない！\n4種類のカルビ盛り合わせ!',
            category: '盛り合わせ',
            price: '2300 (税込2530)', // 文字列形式に変更
        },
        {
            name: 'コプチャン',
            image: './images/コプチャン.jpg',
            model: './models/copchan_raw2.glb',
            description: 'ぷりぷり食感の牛の小腸。味噌ダレがよく合います。',
            category: 'ホルモン',
            price: '490 (税込539)', // 文字列形式に変更
        },
        {
            name: 'テッチャン',
            image: './images/テッチャン.jpg',
            model: './models/techan†_raw.glb',
            description: 'シマチョウとも呼ばれる牛の大腸\n脂の甘みが特徴',
            category: 'ホルモン',
            price: '580 (税込638)', // 文字列形式に変更
        },
        {
            name: 'ギアラ',
            image: './images/ギアラ.jpg',
            model: './models/giara3_raw.glb',
            description: '牛の横隔膜の部位\n柔らかくてヘルシーなため人気メニュー！',
            category: 'ホルモン',
            price: '1030 (税込1133)', // 文字列形式に変更
        },
        {
            name: 'ご飯大',
            image: './images/ご飯大.jpg',
            model: './models/ご飯大.glb',
            description: '焼肉のお供に！大盛りご飯。',
            category: 'サイドメニュー',
            price: '300 (税込330)', // 文字列形式に変更
        },
        {
            name: '上タン塩',
            image: './images/上タン塩.jpg',
            model: './models/tongue_raw.glb',
            description: 'タンの中でも上質な部分。レモンで食べると \n程よい油が口の中に広がります。',
            category: 'タン',
            price: '980 (税込1078)', // 文字列形式に変更
        },
        {
            name: '盛岡冷麺',
            image: './images/盛岡冷麺.jpg',
            model: './models/cold_noodle_clean.glb',
            description: 'シメにぴったり！つるつる食感の本格冷麺。\nさっぱりとおいしく頂けます！',
            category: 'サイドメニュー',
            price: '900 (税込990)', // 文字列形式に変更
        },
        {
            name: 'クッパ',
            image: './images/クッパ.jpg',
            model: './models/koopa_with_bowl_clean.glb',
            description: '新鮮でヘルシーな馬刺し。生姜醤油でどうぞ。',
            category: 'サイドメニュー',
            price: '1300', // 文字列形式に変更 (税込不明)
        },
];
export default productModels;

    // 商品のカテゴリごとの情報を格納した連想配列
export const recMenuItems: Array<string> = [
        '盛岡冷麺',
        'サンチュ',
        '特上カルビ',
        '上カルビ',
        '並カルビ',
        '豚トロ',
    ]
