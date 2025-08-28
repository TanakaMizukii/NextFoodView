import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/Addons.js';
import type { ThreeCtx } from './ThreeInit';

export type LoadCtx = {
    nowModel?: null|THREE.Group<THREE.Object3DEventMap>;
    detailNum?: number;
    detailDiv?: null|HTMLElement;
}

export type ModelProps = {
    modelPath?: string;
    modelDetail?: string;
}

export async function loadModel(Model: ModelProps, ctx: ThreeCtx, prevModel: THREE.Group<THREE.Object3DEventMap> | null): Promise<THREE.Group<THREE.Object3DEventMap> | null> {
    const {
        modelPath = 'models/tongue_raw.glb',
        modelDetail =  'タンの中の上質な部分を選別 程よい油が口の中に広がります',
    } = Model;

    let detailDiv = null;
    try {
        if (prevModel) {
            ctx.scene.remove(prevModel);
            // 変更する前に今まで映していたモデルのメモリの解放
            disposeModel(prevModel);
            // オブジェクトのリストをクリア
            ctx.objectList = [];
        }

        // ローディングインジケーターの表示
        const loadingOverlay = document.getElementById('loading');
        if (loadingOverlay) {
            loadingOverlay.classList.add('visible');
        }

        // 今回表すモデルの表示
        const objects = await ctx.loader.loadAsync(modelPath);

        const model = objects.scene;
        model.scale.set(1, 1, 1);
        // 詳細オブジェクトの表示状態をboolean値で設定
        model.userData.isDetail = true;
        ctx.scene.add(model);
        // 配列に保存
        ctx.objectList.push(model);
        const nowModel = model;

        // 詳細情報を設定
        const detailElement = document.querySelector('.detail');
        if (detailElement) {
            detailElement.remove();
        }
        detailDiv = document.createElement('div');
        detailDiv.className = 'detail';
        detailDiv.textContent = modelDetail;

        // 作成したdiv情報をオブジェクトとして作成
        const detail = new CSS2DObject(detailDiv);
        detail.position.set(0.01, 0.08, -0.03);
        detail.center.set(0, 0.8);
        model.add(detail);
        detail.layers.set(1);

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
export function disposeModel(targetModel: THREE.Group<THREE.Object3DEventMap>) {
    targetModel.traverse(function (obj) {
        // objにはtargetModelが入る
        if (obj instanceof THREE.Mesh) {
            obj.geometry.dispose(); // ジオメトリの解放
            if (obj.material.isMaterial) {
                obj.material.dispose(); // 単一マテリアルの解放
            } else {
                for (const material of obj.material) {
                    material.dispose(); // マルチマテリアルの解放
                }
            }
            if (obj.material.map) {
                obj.material.map.dispose(); // テクスチャの解放
            }
        }
    });
};