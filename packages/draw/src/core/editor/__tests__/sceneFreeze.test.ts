import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  registerElementNode,
  registerLinkerNode,
} from '../nodeRegistry'
import { freezeStaticScene, unfreezeStaticScene } from '../sceneFreeze'

function mockNode() {
  return {
    cache: vi.fn(),
    clearCache: vi.fn(),
  }
}

afterEach(() => {
  unfreezeStaticScene()
  registerElementNode('static', null)
  registerElementNode('moving', null)
  registerLinkerNode('idle', null)
})

describe('freezeStaticScene', () => {
  it('只 cache 未移动的图形，移动中的图形与连线都不 cache', () => {
    const staticEl = mockNode()
    const movingEl = mockNode()
    const idleLinker = mockNode()
    registerElementNode('static', staticEl as never)
    registerElementNode('moving', movingEl as never)
    registerLinkerNode('idle', idleLinker as never)

    freezeStaticScene({ movingShapeIds: ['moving'], liveLinkerIds: ['live'] })

    expect(staticEl.cache).toHaveBeenCalledTimes(1)
    expect(movingEl.cache).not.toHaveBeenCalled()
    expect(idleLinker.cache).not.toHaveBeenCalled()
  })

  it('第二次 freeze 不重复 cache（手势内幂等）', () => {
    const staticEl = mockNode()
    registerElementNode('static', staticEl as never)
    freezeStaticScene({ movingShapeIds: [], liveLinkerIds: [] })
    freezeStaticScene({ movingShapeIds: [], liveLinkerIds: [] })
    expect(staticEl.cache).toHaveBeenCalledTimes(1)
  })

  it('unfreeze 清除 cache', () => {
    const staticEl = mockNode()
    registerElementNode('static', staticEl as never)

    freezeStaticScene({ movingShapeIds: [], liveLinkerIds: [] })
    unfreezeStaticScene()

    expect(staticEl.clearCache).toHaveBeenCalledTimes(1)
  })
})
