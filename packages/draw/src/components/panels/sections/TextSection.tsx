// 文本组：字体/字号/颜色/B/I/U/水平对齐/垂直对齐（图形作用于 fontStyle；连线作用于 linker.fontStyle）
import { useI18n } from '@eflink-tech/office-kit'
import type { ElementInstance, FontStyle, LinkerInstance } from '@/types'
import { DEFAULT_FONT_SIZE, isLinker } from '@/types'
import { ColorButton } from '@/components/common/ColorPicker'
import { applyFontPatch, applyLinkerPatch, applyShapePatch, effectiveFont, linkerFont } from '@/core/editor/styleOps'
import { FONT_OPTIONS, DEFAULT_FONT_VALUE } from '@/core/editor/fontMap'
import { NumField, Row, Section, ToggleButton } from '../fields'

const SELECT_CLS = 'w-24 h-6 px-1.5 border border-[#ddd] rounded text-xs bg-white'

const H_ALIGN_KEYS = ['draw.prop.alignLeft', 'draw.prop.alignCenter', 'draw.prop.alignRight'] as const
const V_ALIGN_KEYS = ['draw.prop.alignTop', 'draw.prop.alignMiddle', 'draw.prop.alignBottom'] as const

export function TextSection({ first }: { first: ElementInstance | LinkerInstance }) {
  const { t } = useI18n()
  const linkerMode = isLinker(first)
  // 连线无对齐概念（恒居中）→ 隐藏对齐两行；
  // 泳道族：当前文字目标（标题/二级标题）有块级覆盖时回显合并值
  const font: FontStyle = linkerMode ? linkerFont(first) : effectiveFont(first)

  const patchFont = (patch: Partial<FontStyle>): void => {
    // 泳道族当前文字目标 → 写块级样式（独立控制）；其余 → 图形级 fontStyle
    applyShapePatch((el) => applyFontPatch(el, patch))
    applyLinkerPatch((l) => ({ fontStyle: { ...linkerFont(l), ...patch } }))
  }

  return (
    <Section title={t('draw.prop.section.text')}>
      <Row label={t('draw.prop.fontFamily')}>
        <select
          value={font.fontFamily ?? DEFAULT_FONT_VALUE}
          onChange={(e) => patchFont({ fontFamily: e.target.value })}
          className={SELECT_CLS}
        >
          {FONT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.labelKey ? t(o.labelKey) : o.label}</option>
          ))}
        </select>
      </Row>
      {!linkerMode && (
        <Row label={t('draw.prop.direction')}>
          <div className="flex flex-wrap gap-1">
            <ToggleButton
              label={t('draw.prop.horizontalText')}
              active={(font.orientation ?? 'horizontal') === 'horizontal'}
              onClick={() => patchFont({ orientation: 'horizontal' })}
            />
            <ToggleButton
              label={t('draw.prop.verticalText')}
              active={font.orientation === 'vertical'}
              onClick={() => patchFont({ orientation: 'vertical' })}
            />
          </div>
        </Row>
      )}
      <Row label={t('draw.prop.fontSize')}>
        <NumField
          value={font.size ?? DEFAULT_FONT_SIZE}
          min={8}
          max={72}
          onCommit={(v) => patchFont({ size: v })}
          className="w-16"
          live
        />
      </Row>
      <Row label={t('draw.prop.color')}>
        <ColorButton
          value={font.color ?? '50,50,50'}
          onSelect={(rgb) => patchFont({ color: rgb ?? '50,50,50' })}
        />
      </Row>
      <Row label={t('draw.prop.style')}>
        <div className="flex gap-1">
          <ToggleButton label="B" active={!!font.bold} onClick={() => patchFont({ bold: !font.bold })} />
          <ToggleButton
            label="I"
            active={!!font.italic}
            onClick={() => patchFont({ italic: !font.italic })}
          />
          <ToggleButton
            label="U"
            active={!!font.underline}
            onClick={() => patchFont({ underline: !font.underline })}
          />
        </div>
      </Row>
      {!linkerMode && (
        <>
          <Row label={t('draw.prop.alignH')}>
            <div className="flex flex-wrap gap-1">
              {(['left', 'center', 'right'] as const).map((a, i) => (
                <ToggleButton
                  key={a}
                  label={t(H_ALIGN_KEYS[i]!)}
                  active={(font.textAlign ?? 'center') === a}
                  onClick={() => patchFont({ textAlign: a })}
                />
              ))}
            </div>
          </Row>
          <Row label={t('draw.prop.alignV')}>
            <div className="flex flex-wrap gap-1">
              {(['top', 'middle', 'bottom'] as const).map((a, i) => (
                <ToggleButton
                  key={a}
                  label={t(V_ALIGN_KEYS[i]!)}
                  active={(font.vAlign ?? 'middle') === a}
                  onClick={() => patchFont({ vAlign: a })}
                />
              ))}
            </div>
          </Row>
        </>
      )}
    </Section>
  )
}
