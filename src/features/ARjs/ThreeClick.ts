import type { ThreeCtx } from './ThreeInit';


// マウスをクリックしたときのイベント
export function handleClick(ctx: ThreeCtx) {
    return(event: MouseEvent) => {
    const element = event.currentTarget as HTMLElement | null;
    if (!element) return;

    // canvas要素上のXY座標
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // canvas要素の幅高さ
    const w = rect.width;
    const h = rect.height;

    // クリックしたマウスの座標を-1~1の範囲で登録する
    ctx.mouse.x = (x / w) * 2 - 1;
    ctx.mouse.y = -(y / h) * 2 + 1;

    // マウス位置にまっすぐ伸びる光線ベクトルを作成
    ctx.raycaster.setFromCamera(ctx.mouse, ctx.camera);
    // その光線とぶつかったオブジェクトを取得
    const intersects = ctx.raycaster.intersectObjects(ctx.objectList);

    // クリックしたオブジェクトがそこに存在していれば値を変更
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        // この操作で今の値を反転させる
        if (clickedObject.userData.isDetail==undefined) {
            clickedObject.userData.isDetail = true;
        }
        clickedObject.userData.isDetail =! clickedObject.userData.isDetail;

        if (clickedObject.userData.isDetail) {
            ctx.camera.layers.enable(1);
        } else {
            ctx.camera.layers.disable(1);
        }
    };
}
}