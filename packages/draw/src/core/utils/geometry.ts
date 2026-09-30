// 基础几何模块：无业务依赖的通用几何类型与函数。
// 供 linker（连线业务）与 shapeContour（轮廓采样）等共用，避免业务模块间循环导入。
// 迁自 linker.ts，linker 侧保持再导出以兼容既有消费方。

/** 世界坐标点 */
export interface Point {
  x: number
  y: number
}

/** 角度归一化到 [0, 2π) */
export function normAngle(a: number): number {
  return (a + Math.PI * 2) % (Math.PI * 2)
}
