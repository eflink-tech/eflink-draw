import { shapeRegistry } from '../registry'
import { basicShapes } from './basic'
import { textShapes } from './text'
import { flowShapes } from './flow'
import { bpmnShapes } from './bpmn'
import { laneShapes } from './lane'
// UML 图形
import { umlCommonShapes } from './umlCommon'
import { umlUsecaseShapes } from './umlUsecase'
import { umlSequenceShapes } from './umlSequence'
import { umlClassShapes } from './umlClass'
import { umlStateShapes } from './umlState'
import { umlDeploymentShapes } from './umlDeployment'
import { umlComponentShapes } from './umlComponent'

// 注册所有基础图形
for (const shape of basicShapes) {
  shapeRegistry.addShape(shape)
}

// 注册文本类图形（自由文本，不进左侧面板）
for (const shape of textShapes) {
  shapeRegistry.addShape(shape)
}

// 注册流程图图形
for (const shape of flowShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 BPMN 图形
for (const shape of bpmnShapes) {
  shapeRegistry.addShape(shape)
}

// 注册泳池/泳道图形
for (const shape of laneShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 通用图形
for (const shape of umlCommonShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 用例图图形
for (const shape of umlUsecaseShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 时序图图形
for (const shape of umlSequenceShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 类图图形
for (const shape of umlClassShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 状态/活动图图形
for (const shape of umlStateShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 部署图图形
for (const shape of umlDeploymentShapes) {
  shapeRegistry.addShape(shape)
}

// 注册 UML 组件图图形
for (const shape of umlComponentShapes) {
  shapeRegistry.addShape(shape)
}
