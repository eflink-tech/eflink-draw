import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '@/core/schema/registry'
import { traceActions } from '@/core/utils/pathActions'
import '@/core/schema/shapes'

describe('BPMN 路径可执行性', () => {
  const bpmnNames = [
    'startEvent', 'intermediateEvent', 'boundaryEvent', 'endEvent',
    'task', 'callActivity', 'subProcess', 'bpmnGateway',
    'dataObject', 'dataStore', 'message', 'group',
    'textAnnotation', 'conversation', 'choreographyTask',
  ]

  const dummyContext = {
    moveTo: () => {},
    lineTo: () => {},
    bezierCurveTo: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
  }

  for (const name of bpmnNames) {
    it(`${name} 路径可在 {w:100,h:100} 下执行`, () => {
      const schema = shapeRegistry.getShape(name)!
      expect(schema).toBeDefined()
      expect(() => {
        traceActions(dummyContext, schema.path, { w: 100, h: 100 })
      }).not.toThrow()
    })
  }
})
