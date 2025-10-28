export interface Category {
    id: number;
    name: string;
    count: number;
    description: string;
}

export const categories: Category[] = [
    {
        id: 1,
        name: 'メインメニュー',
        count: 13,
        description: '上質な部位をレモンと共に'
    },
    {
        id: 2,
        name: '盛り合わせ',
        count: 3,
        description: '様々な部位を一度に楽しめるお得なセット'
    },
    {
        id: 3,
        name: 'カルビ',
        count: 4,
        description: '特上から切り落としまで多彩な品揃え'
    },
    {
        id: 4,
        name: 'ホルモン',
        count: 4,
        description: 'コリコリ食感と旨味が自慢の新鮮ホルモン'
    },
    {
        id: 5,
        name: '締めの一品',
        count: 2,
        description: '食事の最後を飾る冷麺とクッパ'
    },
];

export const productCategory : string[] =[
    'メインメニュー',
    '盛り合わせ',
    'カルビ',
    'ホルモン',
    '締めの一品',
];

export type ProductModel = {
    id: number;
    name: string;
    shortName: string;
    category: string;
    price: string;
    description: string;
    image: string;
    model: string;
    minDetail?: string;  // オプショナル（一部のアイテムのみ）
    weight: string;
    calories: string;
    origin: string;
    recommended: string;
    tags: string[];
};

// 配列型（= 既存の ProductModelsProps）
export type ProductModelsProps = ProductModel[];

// 商品とモデルの関連付け
export const productModels : ProductModelsProps = [
    {
        id: 1,
        name: 'カルビ盛り（2,3人前）',
        shortName: 'カルビ盛り',
        category: '盛り合わせ',
        price: '2,300 (税込 2,530)',
        description: '特上カルビ・上カルビ・並みカルビ・切り落としカルビがワンプレートでまとめて食べられます！！',
        image: './images/カルビ盛り.jpg',
        model: './models/calbee_set_comp.glb',
        minDetail: 'カルビ好きにはたまらない！4種類のカルビ盛り合わせ!',
        weight: '約540g',
        calories: '1720kcal',
        origin: '国産牛',
        recommended: 'タレ・塩両方',
        tags: ['カルビ尽くし', '食べ比べ', '4種類', 'おすすめ']
    },
    {
        id: 2,
        name: '九種盛り（2,3人前）',
        shortName: '九種盛り',
        category: '盛り合わせ',
        price: '1720 (税込 1,892)',
        description: '厳選した９種類のホルモンをお楽しみにしていただけます。セットの特製塩だれにつけて存分にお楽しみください。',
        image: './images/九種盛り.jpg',
        model: './models/9hormone_set_comp2.glb',
        minDetail: '様々な部位をお楽しみいただけます。',
        weight: '約450g',
        calories: '900kcal',
        origin: '国産',
        recommended: '特製塩ダレ',
        tags: ['ホルモン', 'バラエティ', '厳選', '9種類']
    },
    {
        id: 3,
        name: 'ファミリーセット（4,5人前）',
        shortName: 'ファミリーセット',
        category: '盛り合わせ',
        price: '5,800 (税込 6,380)',
        description: '人気なタン・ハラミを始め、並みカルビ・コプチャン・地鶏・ウインナーが特性の味噌ダレ味とセットで存分にお楽しみ頂けます',
        image: './images/ファミリーセット.jpg',
        model: './models/family_s_set_comp2.glb',
        minDetail: '様々なお肉がセットになったお得な一皿！',
        weight: '約800g',
        calories: '2400kcal',
        origin: '国産',
        recommended: '味噌ダレ',
        tags: ['ファミリー向け', 'バラエティ', 'お得', 'セット']
    },
    {
        id: 4,
        name: '上タン塩（1人前）',
        shortName: '上タン塩',
        category: 'タン',
        price: '980 (税込 1,078)',
        description: 'タンの中でも上質な部分。レモンで食べると程よい油が口の中に広がります。',
        image: './images/上タン塩.jpg',
        model: './models/ton_tongue_comp3.glb',
        weight: '100g',
        calories: '270kcal',
        origin: '国産牛',
        recommended: '塩・レモン',
        tags: ['上質', 'さっぱり', '人気']
    },
    {
        id: 5,
        name: '特上カルビ（1人前）',
        shortName: '特上カルビ',
        category: 'カルビ',
        price: '1,500 (税込 1,650)',
        description: 'カルビの最高級部位。口の中でとろけだす上質な油をご堪能ください',
        image: './images/特上カルビ.jpg',
        model: './models/calbee_toku_comp.glb',
        minDetail: 'カルビの中の最高級部位',
        weight: '150g',
        calories: '520kcal',
        origin: '国産黒毛和牛',
        recommended: 'タレ・塩両方',
        tags: ['高級', '霜降り', 'おすすめ', 'とろける']
    },
    {
        id: 6,
        name: '上カルビ（1人前）',
        shortName: '上カルビ',
        category: 'カルビ',
        price: '1,080 (税込 1,188)',
        description: '上質な脂の旨味が楽しめる人気のカルビ。',
        image: './images/上カルビ.jpg',
        model: './models/calbee_jyou_comp.glb',
        minDetail: 'カルビの中の上級部位',
        weight: '140g',
        calories: '450kcal',
        origin: '国産牛',
        recommended: 'タレ',
        tags: ['上質', '人気', '脂の旨味']
    },
    {
        id: 7,
        name: '並カルビ（1人前）',
        shortName: '並カルビ',
        category: 'カルビ',
        price: '880 (税込 968)',
        description: '薄く大判にスライスされたカルビ。カルビ独特の旨味と甘みをバランスよく味わえます。',
        image: './images/並カルビ.jpg',
        model: './models/calbee_nami_raw_comp.glb',
        minDetail: '大判による貴重な一品',
        weight: '130g',
        calories: '390kcal',
        origin: '国産牛',
        recommended: 'タレ',
        tags: ['大判', 'バランス良好', 'コスパ']
    },
    {
        id: 8,
        name: '切り落としカルビ（1人前）',
        shortName: '切落しカルビ',
        category: 'カルビ',
        price: '690（税込 759)',
        description: 'リーズナブルにカルビのおいしさを味わえます。切り込みが入っているため軟らかくおいしく頂けます。',
        image: './images/切り落としカルビ.jpg',
        model: './models/calbee_kiri_raw_comp.glb',
        minDetail: 'カルビの旨味を贅沢に',
        weight: '120g',
        calories: '360kcal',
        origin: '国産牛',
        recommended: 'タレ',
        tags: ['リーズナブル', '柔らか', 'お得']
    },
    {
        id: 9,
        name: '上ミノ（1人前）',
        shortName: '上ミノ',
        category: 'ホルモン',
        price: '790 (税込 869)',
        description: '牛の第一胃袋の一部。コリコリとした小気味よい歯ごたえと弾力で脂肪が少なくさっぱりとお楽しみ頂けます。',
        image: './images/上ミノ.jpg',
        model: './models/hor_mino_raw_comp.glb',
        weight: '100g',
        calories: '180kcal',
        origin: '国産牛',
        recommended: '塩',
        tags: ['コリコリ', 'さっぱり', 'ヘルシー', '食感']
    },
    {
        id: 10,
        name: 'テッチャン（1人前）',
        shortName: 'テッチャン',
        category: 'ホルモン',
        price: '580 (税込 638)',
        description: 'シマチョウとも呼ばれる牛の大腸。口の中で脂の甘みと旨味が広がります',
        image: './images/テッチャン.jpg',
        model: './models/hor_techan_comp.glb',
        weight: '100g',
        calories: '290kcal',
        origin: '国産牛',
        recommended: 'タレ・味噌',
        tags: ['シマチョウ', '甘み', '旨味', '人気']
    },
    {
        id: 11,
        name: 'コプチャン（1人前）',
        shortName: 'コプチャン',
        category: 'ホルモン',
        price: '490 (税込 539)',
        description: 'ぷりぷり食感の牛の小腸。味噌味のコプチャンとお酒がよく合います',
        image: './images/コプチャン.jpg',
        model: './models/hor_copchan_comp.glb',
        weight: '100g',
        calories: '280kcal',
        origin: '国産牛',
        recommended: '味噌ダレ',
        tags: ['ぷりぷり', '味噌味', 'お酒に合う']
    },
    {
        id: 12,
        name: 'ギアラ（1人前）',
        shortName: 'ギアラ',
        category: 'ホルモン',
        price: '490 (税込 539)',
        description: '赤センマイとも呼ばれる牛の第４胃です。塩味で召し上がると旨味を強く感じられます',
        image: './images/ギアラ.jpg',
        model: './models/hor_giara_comp.glb',
        weight: '100g',
        calories: '200kcal',
        origin: '国産牛',
        recommended: '塩',
        tags: ['赤センマイ', '旨味', 'さっぱり']
    },
    {
        id: 13,
        name: '盛岡冷麺',
        shortName: '盛岡冷麺',
        category: '締めの一品',
        price: '900 (税込 990)',
        description: 'シメにぴったり！つるつる食感の本格冷麺。さっぱりとおいしく頂けます！',
        image: './images/盛岡冷麺.jpg',
        model: './models/bowl_coldnoodle_comp.glb',
        minDetail: '商品の大きさにご注意ください！！',
        weight: '約400g',
        calories: '420kcal',
        origin: '盛岡直送',
        recommended: 'そのまま',
        tags: ['シメ', 'さっぱり', 'つるつる', '本格派']
    },
    {
        id: 14,
        name: 'クッパ',
        shortName: 'クッパ',
        category: '締めの一品',
        price: '530 (税込 583)',
        description: 'タマゴスープにご飯が入った心温まる一品。お食事の締めに最適です。',
        image: './images/クッパ.jpg',
        model: './models/bowl_koopa_comp.glb',
        minDetail: '商品の大きさにご注意ください！！',
        weight: '約350g',
        calories: '380kcal',
        origin: '国産米使用',
        recommended: 'そのまま',
        tags: ['シメ', '温まる', '優しい味', '卵スープ']
    },
    // {
    //     id: 15,
    //     name: 'ご飯大',
    //     shortName: 'ご飯大',
    //     category: 'ご飯',
    //     price: '300 (税込 330)',
    //     description: '焼肉のお供に大盛りご飯！毎日想いを込めて丁寧に炊き上げております！',
    //     image: './images/ご飯大.jpg',
    //     model: './models/ご飯大.glb',
    //     weight: '300g',
    //     calories: '504kcal',
    //     origin: '国産米',
    //     recommended: 'そのまま',
    //     tags: ['大盛り', '丁寧炊き', 'お供に']
    // },
];
export default productModels;