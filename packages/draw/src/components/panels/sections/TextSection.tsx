// 文本组：字体/字号/颜色/B/I/U/水平对齐/垂直对齐（图形作用于 fontStyle；连线作用于 linker.fontStyle）
import type { ElementInstance, FontStyle, LinkerInstance } from '@/types'
import { DEFAULT_FONT_SIZE, isLinker } from '@/types'
import { ColorButton } from '@/components/common/ColorPicker'
import { applyLinkerPatch, applyShapePatch, linkerFont } from '@/core/editor/styleOps'
import { FONT_OPTIONS, DEFAULT_FONT_VALUE } from '@/core/editor/fontMap'
import { NumField, Row, Section, ToggleButton } from '../fields'

const SELECT_CLS = 'w-24 h-6 px-1.5 border border-[#ddd] rounded text-xs bg-white'

const H_ALIGN_LABEL = ['左', '中', '右'] as const
const V_ALIGN_LABEL = ['顶', '中', '底'] as const

export function TextSection({ first }: { first: ElementInstance | LinkerInstance }) {
  const linkerMode = isLinker(first)
  // 连线无对齐概念（恒居中）→ 隐藏对齐两行
  const font: FontStyle = linkerMode ? linkerFont(first) : first.fontStyle

  const patchFont = (patch: Partial<FontStyle>): void => {
    applyShapePatch((el) => ({ fontStyle: { ...el.fontStyle, ...patch } }))
    applyLinkerPatch((l) => ({ fontStyle: { ...linkerFont(l), ...patch } }))
  }

  return (
    <Section title="文本">
      <Row label="字体">
        <select
          value={font.fontFamily ?? DEFAULT_FONT_VALUE}
          onChange={(e) => patchFont({ fontFamily: e.target.value })}
          className={SELECT_CLS}
        >
          {FONT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Row>
      {!linkerMode && (
        <Row label="方向">
          <div className="flex gap-1">
            <ToggleButton
              label="横"
              active={(font.orientation ?? 'horizontal') === 'horizontal'}
              onClick={() => patchFont({ orientation: 'horizontal' })}
            />
            <ToggleButton
              label="竖"
              active={font.orientation === 'vertical'}
              onClick={() => patchFont({ orientation: 'vertical' })}
            />
          </div>
        </Row>
      )}
      <Row label="字号">
        <NumField
          value={font.size ?? DEFAULT_FONT_SIZE}
          min={8}
          max={72}
          onCommit={(v) => patchFont({ size: v })}
          className="w-16"
          live
        />
      </Row>
      <Row label="颜色">
        <ColorButton
          value={font.color ?? '50,50,50'}
          onSelect={(rgb) => patchFont({ color: rgb ?? '50,50,50' })}
        />
      </Row>
      <Row label="样式">
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
          <Row label="水平">
            <div className="flex gap-1">
              {(['left', 'center', 'right'] as const).map((a, i) => (
                <ToggleButton
                  key={a}
                  label={H_ALIGN_LABEL[i]}
                  active={(font.textAlign ?? 'center') === a}
                  onClick={() => patchFont({ textAlign: a })}
                />
              ))}
            </div>
          </Row>
          <Row label="垂直">
            <div className="flex gap-1">
              {(['top', 'middle', 'bottom'] as const).map((a, i) => (
                <ToggleButton
                  key={a}
                  label={V_ALIGN_LABEL[i]}
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
