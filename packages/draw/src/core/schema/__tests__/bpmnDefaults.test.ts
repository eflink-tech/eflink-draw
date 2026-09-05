import { describe, it, expect } from 'vitest'
import { shapeRegistry } from '../registry'
import { bpmnShapes } from '../shapes/bpmn'
import '@/core/schema/shapes'

describe('BPMN 形状默认样式', () => {
  it('bpmnShapes 共 15 个', () => {
    expect(bpmnShapes).toHaveLength(15)
  })

  it('registry 已注册全部 BPMN 形状', () => {
    for (const s of bpmnShapes) {
      expect(shapeRegistry.getShape(s.name), `missing: ${s.name}`).toBeDefined()
    }
  })

  it('所有 BPMN 形状 category 均为 bpmn', () => {
    for (const s of bpmnShapes) {
      expect(s.category, `${s.name}.category`).toBe('bpmn')
      expect(s.title, `${s.name}.title`).toBeTruthy()
    }
  })

  it('BPMN 形状默认尺寸', () => {
    const expected: Record<string, [number, number]> = {
      startEvent:         [40, 40],
      intermediateEvent:  [40, 40],
      boundaryEvent:      [40, 40],
      endEvent:           [40, 40],
      task:               [100, 70],
      callActivity:       [100, 70],
      subProcess:         [400, 280],
      bpmnGateway:        [50, 50],
      dataObject:         [70, 90],
      dataStore:          [70, 70],
      message:            [60, 40],
      group:              [200, 140],
      textAnnotation:     [100, 70],
      conversation:       [45, 40],
      choreographyTask:   [120, 120],
    }
    for (const [name, [w, h]] of Object.entries(expected)) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.props.w, `${name}.w`).toBe(w)
      expect(el.props.h, `${name}.h`).toBe(h)
    }
  })

  it('container 标记的形状', () => {
    const containers = [
      'subProcess', 'dataObject', 'dataStore', 'message',
      'group', 'textAnnotation', 'choreographyTask',
    ]
    for (const name of containers) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.attribute.container, `${name}.container`).toBe(true)
    }
  })

  it('无填充形状（fillStyle.type === none）', () => {
    const noFill = ['group', 'textAnnotation', 'choreographyTask']
    for (const name of noFill) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.fillStyle.type, `${name}.fillStyle.type`).toBe('none')
    }
  })

  it('endEvent / callActivity 粗边框 lineWidth 3.5', () => {
    for (const name of ['endEvent', 'callActivity']) {
      const el = shapeRegistry.createElement(name, 0, 0)!
      expect(el.lineStyle.lineWidth, `${name}.lineWidth`).toBe(3.5)
    }
  })

  it('startEvent 复用 round 路径', () => {
    const startEvent = shapeRegistry.getShape('startEvent')!
    const round = shapeRegistry.getShape('round')!
    expect(startEvent.path).toEqual(round.path)
  })

  it('task 复用 roundRectangle 路径', () => {
    const task = shapeRegistry.getShape('task')!
    const roundRectangle = shapeRegistry.getShape('roundRectangle')!
    expect(task.path).toEqual(roundRectangle.path)
  })

  it('subProcess rotatable=false', () => {
    const el = shapeRegistry.createElement('subProcess', 0, 0)!
    expect(el.attribute.rotatable, 'subProcess.rotatable').toBe(false)
  })

  it('group 虚线 lineStyle', () => {
    const el = shapeRegistry.createElement('group', 0, 0)!
    expect(el.lineStyle.lineStyle, 'group.lineStyle').toBe('dashed')
    expect(el.lineStyle.lineWidth, 'group.lineWidth').toBe(2)
  })

  it('choreographyTask 三个 textBlock（顺序与旧系统一致：中/上/下）', () => {
    const el = shapeRegistry.createElement('choreographyTask', 0, 0)!
    expect(el.textBlock).toHaveLength(3)
    expect(el.textBlock[0]?.text).toBe('编排任务')
    expect(el.textBlock[1]?.text).toBe('参与者 A')
    expect(el.textBlock[2]?.text).toBe('参与者 B')
  })

  it('所有显式 textBlock 均含 text 字段（choreographyTask 保留旧系统占位文案）', () => {
    for (const s of bpmnShapes) {
      if (s.textBlock) {
        for (const tb of s.textBlock) {
          if (s.name === 'choreographyTask') continue
          expect(tb.text, `${s.name}.textBlock.text`).toBe('')
        }
      }
    }
  })
})
