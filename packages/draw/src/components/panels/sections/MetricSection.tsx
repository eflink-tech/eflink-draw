// 度量组：X/Y/宽/高/角度（Enter/blur 提交；位置尺寸走 moveElements/resizeElement 自动联动连线重路由）
import { useEditorStore } from '@/store/editorStore'
import type { ElementInstance } from '@/types'
import { selectedShapes } from '@/core/editor/styleOps'
import { NumField, Row, Section } from '../fields'

export function MetricSection({ first }: { first: ElementInstance }) {
  const moveElements = useEditorStore((s) => s.moveElements)
  const resizeElement = useEditorStore((s) => s.resizeElement)
  const updateElement = useEditorStore((s) => s.updateElement)
  const { x, y, w, h, angle } = first.props
  // 显示时归一化到 [0, 360)：画布旋转手柄存出的弧度无归一化，可能为负（如 -π/4 显示 -45）
  const deg = Math.round(((((angle * 180) / Math.PI) % 360) + 360) % 360)

  const applyAll = (fn: (el: ElementInstance) => void): void => {
    for (const el of selectedShapes()) fn(el)
  }

  return (
    <Section title="度量">
      <Row label="X">
        <NumField
          value={Math.round(x)}
          live
          onCommit={(v) => applyAll((el) => moveElements([el.id], v - el.props.x, 0))}
        />
      </Row>
      <Row label="Y">
        <NumField
          value={Math.round(y)}
          live
          onCommit={(v) => applyAll((el) => moveElements([el.id], 0, v - el.props.y))}
        />
      </Row>
      <Row label="宽">
        <NumField
          value={Math.round(w)}
          min={20}
          live
          onCommit={(v) =>
            applyAll((el) => resizeElement(el.id, el.props.x, el.props.y, v, el.props.h))
          }
        />
      </Row>
      <Row label="高">
        <NumField
          value={Math.round(h)}
          min={20}
          live
          onCommit={(v) =>
            applyAll((el) => resizeElement(el.id, el.props.x, el.props.y, el.props.w, v))
          }
        />
      </Row>
      <Row label="角度">
        {/* 已知例外：角度不走 moveElements/resizeElement，而是 updateElement 直改 props，
            不触发连线重路由——与画布旋转手柄一致的既有行为 */}
        <NumField
          value={deg}
          min={0}
          max={360}
          step={15}
          live
          onCommit={(v) =>
            applyAll((el) =>
              updateElement(el.id, {
                props: { ...el.props, angle: ((((v % 360) + 360) % 360) * Math.PI) / 180 },
              }),
            )
          }
        />
      </Row>
    </Section>
  )
}
