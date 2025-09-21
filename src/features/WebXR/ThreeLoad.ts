import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import type { ThreeCtx } from './ThreeInit';

export type LoadCtx = {
    nowModel?: null|THREE.Group<THREE.Object3DEventMap>;
    detailNum?: number;
    detailDiv?: null|HTMLElement;
}

export type ModelProps = {
    modelName?: string;
    modelPath?: string;
    modelDetail?: string;
    modelPrice?: string;
}

export async function loadModel(Model: ModelProps, ctx: ThreeCtx, prevModel: THREE.Group<THREE.Object3DEventMap> | null): Promise<THREE.Group<THREE.Object3DEventMap> | null> {
    const {
        modelName = '上タン塩（１人前）',
        modelPath = 'models/ton_tongue_comp3.glb',
        modelDetail = 'タンの中の上質な部分を選別\n程よい油が口の中に広がります',
        modelPrice = '980 (税込1,078)'
    } = Model;

    let detailDiv = null;
    try {
        // ローディングインジケーターの表示
        const loadingOverlay = document.getElementById('loading');
        if (loadingOverlay) {
            loadingOverlay.classList.add('visible');
        }

        // 詳細情報を設定
        const detailElement = document.querySelector('.detail');
        if (detailElement) {
            detailElement.remove();
        }
        detailDiv = document.createElement('div');
        detailDiv.className = 'detail';
        detailDiv.innerHTML = `
            <h3 class="panel__name">${modelName}</h3><hr>
            <p class="panel__desc">${modelDetail}</p>
            <div class="panel__price" aria-label="価格">
                <span class="food-panel__price-currency">￥</span>
                <span class="panel__price-value">${modelPrice} 円</span>
            </div>
        `;

        // 作成したdiv情報をオブジェクトとして作成
        const detail = new CSS2DObject(detailDiv);
        detail.position.set(4, 6, -7);
        detail.center.set(0, 0.8);
        detail.layers.set(1);

        // 今回表すモデルの表示
        const objects = await ctx.loader.loadAsync(modelPath);
        const model = objects.scene;
        const clone = model.clone(true);
        // 詳細オブジェクトの表示状態をboolean値で設定
        clone.userData.isDetail = true;
        ctx.reticle.matrix.decompose(clone.position, clone.quaternion, clone.scale);
        clone.scale.set(0.0085, 0.0085, 0.0085); // 改変されてしまうためdecomposeの後に記述
        clone.add(detail);
        ctx.scene.add(clone);
        // 配列に保存
        ctx.objectList.push(clone);
        const nowModel = clone;

        // ローディングインジケーターを非表示
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('visible');
                // 初回だけ無条件で表示を行う
                if (ctx.detailNum == 0) {
                ctx.camera.layers.enable(1);
                ctx.detailNum += 1;
                }
            }, 100);
        }

        return nowModel;
    } catch(error) {
        const loadingOverlay = document.getElementById('loading');
        if(loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.remove('visible');
            }, 100);
        }
        alert(error +'モデルの読み込みに失敗しました。');
        console.log(error);
        return null;
    }
}

// GLB・GLTFモデルの各要素事分解してメモリの解放を行う関数。
export function disposeModel(targetModel: THREE.Object3D) {
    targetModel.traverse(function (obj) {
        // objにはtargetModelが入る
        if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose(); // ジオメトリの解放
            if (Array.isArray(obj.material)) {
                // マテリアルが配列の場合
                for (const material of obj.material) {
                    material.dispose();
                    if (material.map) {
                        material.map.dispose();
                    }
                }
            } else {
                // マテリアルが単一の場合
                obj.material.dispose();
                if (obj.material.map) {
                    obj.material.map.dispose();
                }
            }
        }
    });
};