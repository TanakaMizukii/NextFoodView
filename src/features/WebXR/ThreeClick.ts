import type { ThreeCtx } from './ThreeInit';

// マウスをクリックしたときのイベント
export function handleClick(ctx: ThreeCtx) {
    return(event: MouseEvent) => {
        const element = event.currentTarget as HTMLElement | null;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        ctx.mouse.x = (x / w) * 2 - 1;
        ctx.mouse.y = -(y / h) * 2 + 1;

        ctx.raycaster.setFromCamera(ctx.mouse, ctx.camera);
        const intersects = ctx.raycaster.intersectObjects(ctx.objectList, true);

        if (intersects.length > 0) {
            let clickedObject = intersects[0].object;
            // グループ化されている場合、最上位の親を選択する
            while (clickedObject.parent && clickedObject.parent !== ctx.scene) {
                clickedObject = clickedObject.parent;
            }

            // すでに選択されているオブジェクトを再度クリックしたら選択解除
            if (ctx.transControls.object === clickedObject) {
                ctx.gizmo.visible = false;
                ctx.transControls.detach();
                // isDetailの表示をオンにする
                clickedObject.userData.isDetail = true;
                ctx.camera.layers.enable(1);
            } else {
                // 新しいオブジェクトを選択
                ctx.transControls.attach(clickedObject);
                ctx.gizmo.visible = true;

                // isDetailのロジック
                if (clickedObject.userData.isDetail === undefined) {
                    clickedObject.userData.isDetail = false; // 初期値
                }
                clickedObject.userData.isDetail = !clickedObject.userData.isDetail;

                if (clickedObject.userData.isDetail) {
                    ctx.camera.layers.enable(1);
                } else {
                    ctx.camera.layers.disable(1);
                }
            }
        } else {
            // 何もない空間をクリックした場合、選択を解除
            if (ctx.transControls.object) {
                ctx.transControls.detach();
                ctx.gizmo.visible = false;
            }
        }
    }
}