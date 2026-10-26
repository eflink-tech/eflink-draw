// 图形样式组：填充（FillSection）与线条（LineSection）
// 图形与连线共用线条组；连线模式额外提供线型/箭头图形化下拉（切换重算路由）
import { useI18n } from '@eflink-tech/office-kit'
import type { ArrowStyle, ElementInstance, LinkerInstance } from '@/types'
import { isLinker } from '@/types'
import { ColorButton } from '@/components/common/ColorPicker'
import { LineStyleDropdown, type LineStyleValue } from '@/components/common/LineStyleDropdown'
import { LineTypeDropdown } from '@/components/common/LineTypeDropdown'
import { ArrowStyleDropdown } from '@/components/common/ArrowStyleDropdown'
import { getLinkerPoints, matchStylePreset, SEQ_MESSAGE_PRESETS, UML_RELATION_PRESETS } from '@/core/editor/linker'
import { makeStoreRectGetter } from '@/core/editor/interaction'
import { applyLinkerPatch, applyShapePatch, convertFillStyle } from '@/core/editor/styleOps'
import { NumField, Row, Section, SliderField } from '../fields'

/** 面板内 select 统一样式（FillSection 填充类型下拉用） */
const SELECT_CLS = 'w-24 h-6 px-1.5 border border-[#ddd] rounded text-xs bg-white'

export function FillSection({ first }: { first: ElementInstance }) {
  const { t } = useI18n()
  const fill = first.fillStyle
  // 项目无渐变：gradient 回显为纯色（切换类型时 convertFillStyle 补默认值）
  const fillType = fill.type === 'none' ? 'none' : 'solid'

  return (
    <Section title={t('draw.prop.section.fill')}>
      <Row label={t('draw.prop.type')}>
        <select
          value={fillType}
          onChange={(e) =>
            applyShapePatch((el) => ({
              fillStyle: convertFillStyle(el.fillStyle, e.target.value as 'none' | 'solid'),
            }))
          }
          className={SELECT_CLS}
        >
          <option value="none">{t('draw.prop.none')}</option>
          <option value="solid">{t('draw.prop.solid')}</option>
        </select>
      </Row>
      <Row label={t('draw.prop.color')}>
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
      <Row label={t('draw.prop.opacity')}>
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
  const { t } = useI18n()
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
  const linker = linkerMode ? (first as LinkerInstance) : null
  const applyPreset = (patch: { lineStyle: LineStyleValue; beginArrowStyle: ArrowStyle; endArrowStyle: ArrowStyle }): void => {
    applyLinkerPatch((l) => ({
      lineStyle: { ...l.lineStyle, ...patch },
    }))
  }

  return (
    <Section title={t('draw.prop.section.line')}>
      <Row label={t('draw.prop.color')}>
        <ColorButton
          value={lineColor}
          onSelect={(rgb) => setCommon({ lineColor: rgb ?? '50,50,50' })}
        />
      </Row>
      <Row label={t('draw.prop.thickness')}>
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
      <Row label={t('draw.prop.style')}>
        {/* 与顶部工具栏同款线型下拉（分体按钮 + 线型预览菜单） */}
        <LineStyleDropdown
          currentStyle={lineStyle}
          items={(['solid', 'dashed', 'dot', 'dotdash'] as const).map((value) => ({
            value,
            onClick: () => setCommon({ lineStyle: value }),
          }))}
        />
      </Row>
      {linker && (
        <Row label={t('draw.prop.umlRelation')}>
          <select
            className={SELECT_CLS}
            value={matchStylePreset(UML_RELATION_PRESETS, linker)}
            onChange={(e) => {
              const preset = UML_RELATION_PRESETS.find((p) => p.value === e.target.value)
              if (preset) applyPreset(preset.patch)
            }}
          >
            <option value="">{t('draw.prop.custom')}</option>
            {UML_RELATION_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
            ))}
          </select>
        </Row>
      )}
      {linker?.seq && (
        <Row label={t('draw.prop.messageType')}>
          <select
            className={SELECT_CLS}
            value={matchStylePreset(SEQ_MESSAGE_PRESETS, linker)}
            onChange={(e) => {
              const preset = SEQ_MESSAGE_PRESETS.find((p) => p.value === e.target.value)
              if (preset) applyPreset(preset.patch)
            }}
          >
            <option value="">{t('draw.prop.custom')}</option>
            {SEQ_MESSAGE_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
            ))}
          </select>
        </Row>
      )}
      {linkerMode && (
        <Row label={t('draw.prop.lineType')}>
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
          <Row label={t('draw.prop.beginArrow')}>
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
          <Row label={t('draw.prop.endArrow')}>
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
  const { t } = useI18n()
  const ss = first.shapeStyle
  const enabled = ss.shadowEnabled === true

  const patchShadow = (patch: Partial<ElementInstance['shapeStyle']>): void => {
    applyShapePatch((el) => ({ shapeStyle: { ...el.shapeStyle, ...patch } }))
  }

  return (
    <Section title={t('draw.prop.section.shadow')}>
      <Row label={t('draw.prop.enabled')}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => patchShadow({ shadowEnabled: e.target.checked })}
        />
      </Row>
      <Row label={t('draw.prop.color')}>
        <ColorButton
          value={ss.shadowColor ?? '0,0,0'}
          disabled={!enabled}
          onSelect={(rgb) => patchShadow({ shadowColor: rgb ?? '0,0,0' })}
        />
      </Row>
      <Row label={t('draw.prop.blur')}>
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
      <Row label={t('draw.prop.xOffset')}>
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
      <Row label={t('draw.prop.yOffset')}>
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
