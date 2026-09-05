// 图形样式组：填充（FillSection）与线条（LineSection）
// 图形与连线共用线条组；连线模式额外提供线型/箭头图形化下拉（切换重算路由）
import type { ArrowStyle, ElementInstance, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { ColorButton } from '@/components/common/ColorPicker'
import { LineStyleDropdown, type LineStyleValue } from '@/components/common/LineStyleDropdown'
import { LineTypeDropdown } from '@/components/common/LineTypeDropdown'
import { ArrowStyleDropdown } from '@/components/common/ArrowStyleDropdown'
import { getLinkerPoints } from '@/core/editor/linker'
import { makeStoreRectGetter } from '@/core/editor/interaction'
import { applyLinkerPatch, applyShapePatch, convertFillStyle } from '@/core/editor/styleOps'
import { NumField, Row, Section, SliderField } from '../fields'

/** 面板内 select 统一样式（FillSection 填充类型下拉用） */
const SELECT_CLS = 'w-24 h-6 px-1.5 border border-[#ddd] rounded text-xs bg-white'

export function FillSection({ first }: { first: ElementInstance }) {
  const fill = first.fillStyle
  // 项目无渐变：gradient 回显为纯色（切换类型时 convertFillStyle 补默认值）
  const fillType = fill.type === 'none' ? 'none' : 'solid'

  return (
    <Section title="填充">
      <Row label="类型">
        <select
          value={fillType}
          onChange={(e) =>
            applyShapePatch((el) => ({
              fillStyle: convertFillStyle(el.fillStyle, e.target.value as 'none' | 'solid'),
            }))
          }
          className={SELECT_CLS}
        >
          <option value="none">无</option>
          <option value="solid">纯色</option>
        </select>
      </Row>
      <Row label="颜色">
        <ColorButton
          value={fill.type === 'solid' ? fill.color ?? '255,255,255' : null}
          disabled={fillType === 'none'}
          onSelect={(rgb) =>
            applyShapePatch(() => ({
              fillStyle: { type: 'solid', color: rgb ?? '255,255,255' },
            }))
          }
        />
      </Row>
      <Row label="透明度">
        <SliderField
          value={Math.round(first.shapeStyle.alpha * 100)}
          min={0}
          max={100}
          step={5}
          suffix="%"
          onChange={(v) => applyShapePatch(() => ({ shapeStyle: { alpha: v / 100 } }))}
        />
      </Row>
    </Section>
  )
}

export function LineSection({ first }: { first: ElementInstance | LinkerInstance }) {
  const linkerMode = isLinker(first)
  const lineColor = first.lineStyle.lineColor ?? '50,50,50'
  const lineWidth = first.lineStyle.lineWidth ?? 2
  const lineStyle = first.lineStyle.lineStyle ?? 'solid'

  const setCommon = (patch: {
    lineColor?: string
    lineWidth?: number
    lineStyle?: LineStyleValue
  }): void => {
    applyShapePatch((el) => ({ lineStyle: { ...el.lineStyle, ...patch } }))
    applyLinkerPatch((l) => ({ lineStyle: { ...l.lineStyle, ...patch } }))
  }

  // 连线专属操作
  const setLinkerType = (type: LinkerInstance['linkerType']): void => {
    applyLinkerPatch((l) => ({
      linkerType: type,
      points: getLinkerPoints(
        { ...l, linkerType: type },
        makeStoreRectGetter(),
      ),
    }))
  }
  const setBeginArrow = (style: ArrowStyle): void => {
    applyLinkerPatch((l) => ({
      lineStyle: { ...l.lineStyle, beginArrowStyle: style },
    }))
  }
  const setEndArrow = (style: ArrowStyle): void => {
    applyLinkerPatch((l) => ({
      lineStyle: { ...l.lineStyle, endArrowStyle: style },
    }))
  }

  return (
    <Section title="线条">
      <Row label="颜色">
        <ColorButton
          value={lineColor}
          onSelect={(rgb) => setCommon({ lineColor: rgb ?? '50,50,50' })}
        />
      </Row>
      <Row label="粗细">
        <NumField
          value={lineWidth}
          min={0}
          max={10}
          step={0.5}
          className="w-16"
          live
          onCommit={(v) => setCommon({ lineWidth: v })}
        />
      </Row>
      <Row label="样式">
        {/* 与顶部工具栏同款线型下拉（分体按钮 + 线型预览菜单） */}
        <LineStyleDropdown
          currentStyle={lineStyle}
          items={(['solid', 'dashed', 'dot', 'dotdash'] as const).map((value) => ({
            value,
            onClick: () => setCommon({ lineStyle: value }),
          }))}
        />
      </Row>
      {linkerMode && (
        <Row label="线型">
          <LineTypeDropdown
            currentType={(first as LinkerInstance).linkerType}
            items={([
              { value: 'broken', onClick: () => setLinkerType('broken') },
              { value: 'curve', onClick: () => setLinkerType('curve') },
              { value: 'line', onClick: () => setLinkerType('line') },
            ] as const)}
          />
        </Row>
      )}
      {linkerMode && (
        <>
          <Row label="起箭头">
            <ArrowStyleDropdown
              currentStyle={(first as LinkerInstance).lineStyle.beginArrowStyle ?? 'none'}
              direction="backward"
              items={([
                { value: 'none', onClick: () => setBeginArrow('none') },
                { value: 'solidArrow', onClick: () => setBeginArrow('solidArrow') },
                { value: 'dashedArrow', onClick: () => setBeginArrow('dashedArrow') },
                { value: 'normal', onClick: () => setBeginArrow('normal') },
                { value: 'solidDiamond', onClick: () => setBeginArrow('solidDiamond') },
                { value: 'dashedDiamond', onClick: () => setBeginArrow('dashedDiamond') },
                { value: 'solidCircle', onClick: () => setBeginArrow('solidCircle') },
                { value: 'dashedCircle', onClick: () => setBeginArrow('dashedCircle') },
                { value: 'cross', onClick: () => setBeginArrow('cross') },
              ] as const)}
            />
          </Row>
          <Row label="止箭头">
            <ArrowStyleDropdown
              currentStyle={(first as LinkerInstance).lineStyle.endArrowStyle ?? 'none'}
              items={([
                { value: 'none', onClick: () => setEndArrow('none') },
                { value: 'solidArrow', onClick: () => setEndArrow('solidArrow') },
                { value: 'dashedArrow', onClick: () => setEndArrow('dashedArrow') },
                { value: 'normal', onClick: () => setEndArrow('normal') },
                { value: 'solidDiamond', onClick: () => setEndArrow('solidDiamond') },
                { value: 'dashedDiamond', onClick: () => setEndArrow('dashedDiamond') },
                { value: 'solidCircle', onClick: () => setEndArrow('solidCircle') },
                { value: 'dashedCircle', onClick: () => setEndArrow('dashedCircle') },
                { value: 'cross', onClick: () => setEndArrow('cross') },
              ] as const)}
            />
          </Row>
        </>
      )}
    </Section>
  )
}

export function ShadowSection({ first }: { first: ElementInstance }) {
  const ss = first.shapeStyle
  const enabled = ss.shadowEnabled === true

  const patchShadow = (patch: Partial<ElementInstance['shapeStyle']>): void => {
    applyShapePatch((el) => ({ shapeStyle: { ...el.shapeStyle, ...patch } }))
  }

  return (
    <Section title="阴影">
      <Row label="启用">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => patchShadow({ shadowEnabled: e.target.checked })}
        />
      </Row>
      <Row label="颜色">
        <ColorButton
          value={ss.shadowColor ?? '0,0,0'}
          disabled={!enabled}
          onSelect={(rgb) => patchShadow({ shadowColor: rgb ?? '0,0,0' })}
        />
      </Row>
      <Row label="模糊">
        <NumField
          value={ss.shadowBlur ?? 0}
          min={0}
          max={50}
          step={1}
          disabled={!enabled}
          className="w-16"
          onCommit={(v) => patchShadow({ shadowBlur: v })}
        />
      </Row>
      <Row label="X 偏移">
        <NumField
          value={ss.shadowOffsetX ?? 0}
          min={-50}
          max={50}
          step={1}
          disabled={!enabled}
          className="w-16"
          onCommit={(v) => patchShadow({ shadowOffsetX: v })}
        />
      </Row>
      <Row label="Y 偏移">
        <NumField
          value={ss.shadowOffsetY ?? 0}
          min={-50}
          max={50}
          step={1}
          disabled={!enabled}
          className="w-16"
          onCommit={(v) => patchShadow({ shadowOffsetY: v })}
        />
      </Row>
    </Section>
  )
}
