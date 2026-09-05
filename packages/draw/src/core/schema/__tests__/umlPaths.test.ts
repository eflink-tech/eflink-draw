import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '@/core/schema/registry'
import { traceActions } from '@/core/utils/pathActions'
import '@/core/schema/shapes'

const UML_SHAPES = [
  'package', 'combinedFragment', 'umlNote', 'umlText',
  'actor', 'useCase', 'ovalContainer', 'rectangleContainer',
  'sequenceObject', 'sequenceEntity', 'sequenceControl', 'sequenceBoundary',
  'sequenceTimerSignal', 'sequenceConstraint', 'sequenceActivation',
  'sequenceLifeLine', 'sequenceDeletion',
  'simpleClass', 'cls', 'interface', 'activeClass', 'multiplictyClass',
  'simpleInterface', 'constraint', 'port',
  'umlObject', 'umlState', 'umlStart', 'umlEnd', 'flowFinal',
  'simpleHistory', 'detialHistory', 'sendSignal', 'receiveSignal',
  'branchMerge', 'Synchronization', 'stateRectangleContainer',
  'swimlane', 'horizontalSwimlane',
  'devComponentNonInstance', 'devComponent', 'devNodeNonInstance',
  'devNodeInstance', 'uml_deploymentObject', 'uml_deploymentConstraint',
  'component', 'componentNodeNonInstance', 'componentStart',
] as const

const dummyContext = {
  moveTo: () => {},
  lineTo: () => {},
  bezierCurveTo: () => {},
  quadraticCurveTo: () => {},
  closePath: () => {},
}

describe('UML 路径可执行性', () => {
  for (const name of UML_SHAPES) {
    it(`${name} 路径可在默认尺寸下执行`, () => {
      const schema = shapeRegistry.getShape(name)
      expect(schema, `${name} 未注册`).toBeDefined()
      const w = schema!.props?.w ?? 100
      const h = schema!.props?.h ?? 100
      expect(() => traceActions(dummyContext, schema!.path, { w, h })).not.toThrow()
    })
  }
})

describe('UML 关键行为属性', () => {
  it('sequenceLifeLine 虚线仅作用于垂直线子路径', () => {
    const schema = shapeRegistry.getShape('sequenceLifeLine')!
    const dashed = schema.path[0]
    expect(dashed).toMatchObject({
      lineStyle: { lineStyle: 'dot' },
    })
    const rect = schema.path[1]
    expect(Array.isArray(rect)).toBe(true)
  })

  it('需 container 的图形已配置命中区', () => {
    const needContainer = [
      'actor', 'package', 'combinedFragment', 'cls', 'interface',
      'constraint', 'multiplictyClass', 'component', 'componentNodeNonInstance',
      'devComponentNonInstance', 'devComponent', 'devNodeNonInstance', 'devNodeInstance',
      'uml_deploymentConstraint', 'sequenceConstraint', 'sequenceTimerSignal',
      'sequenceDeletion', 'umlEnd', 'flowFinal', 'simpleHistory', 'detialHistory',
      'swimlane', 'horizontalSwimlane',
    ]
    for (const name of needContainer) {
      const schema = shapeRegistry.getShape(name)!
      expect(schema.attribute?.container, name).toBe(true)
    }
  })
})
