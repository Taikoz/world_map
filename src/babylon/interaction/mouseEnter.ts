import { PointerEventTypes, PointerInfo, type Scene } from "@babylonjs/core";

const mouseEnter = (scene: Scene, action: () => any) => {
  scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
    if (pointerInfo.type === PointerEventTypes.POINTERMOVE) action();
  });
};

const mouseClick = (scene: Scene, action: () => any) => {
  scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
    if (pointerInfo.type === PointerEventTypes.POINTERPICK) action();
  });
};

export { mouseEnter, mouseClick };
