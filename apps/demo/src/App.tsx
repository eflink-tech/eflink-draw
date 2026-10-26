import { useState } from 'react'
import { DrawEditor, type OfficeLocale } from '@eflink-tech/draw'

const LOCALES: { value: OfficeLocale; label: string }[] = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'pt-BR', label: 'Português' },
]

/** ?locale=en 直达指定语言，便于逐语言验收 */
function readLocale(): OfficeLocale {
  const value = new URLSearchParams(window.location.search).get('locale')
  return LOCALES.find((item) => item.value === value)?.value ?? 'zh-CN'
}

/** 独立 demo：整幅编辑器，自动打开上次文档（组件内行为） */
export default function App() {
  const [locale, setLocale] = useState<OfficeLocale>(readLocale)

  return (
    <>
      <DrawEditor key={locale} locale={locale} />
      <select
        value={locale}
        aria-label="Language"
        onChange={(e) => setLocale(e.target.value as OfficeLocale)}
        className="fixed bottom-9 right-3 z-[100000] rounded-md border border-black/10 bg-white px-2 py-1 text-xs text-[#1f2329] shadow-md outline-none"
      >
        {LOCALES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </>
  )
}
