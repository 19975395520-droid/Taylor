import { useEffect, useRef, useState } from 'react'
import './preview.css'

const devices = {
  shield: { name: '反制盾', width: 1920, height: 1200 },
  handheld: { name: '手持', width: 720, height: 1600 },
}

export default function DevicePreview() {
  const [device, setDevice] = useState<keyof typeof devices>('shield')
  const [scale, setScale] = useState(1)
  const stage = useRef<HTMLDivElement>(null)
  const selected = devices[device]

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setScale(Math.max(0.05, Math.min((width - 40) / selected.width, (height - 40) / selected.height, 1)))
    })
    if (stage.current) observer.observe(stage.current)
    return () => observer.disconnect()
  }, [selected])

  return <div className="device-preview">
    <header className="preview-toolbar">
      <div className="preview-title"><strong>反制盾 · 设备预览</strong><span>同一套界面 · 双端适配</span></div>
      <div className="device-switch" role="group" aria-label="预览设备">
        {(Object.entries(devices) as [keyof typeof devices, typeof selected][]).map(([id, item]) =>
          <button key={id} aria-pressed={device === id} onClick={() => setDevice(id)}>{item.name}<small>{item.width} × {item.height}</small></button>)}
      </div>
      <div className="preview-meta"><span>{selected.width} × {selected.height} px</span><small>适合窗口 {Math.round(scale * 100)}%</small></div>
    </header>
    <div className="preview-stage" ref={stage}>
      <div className="device-frame" style={{ width: selected.width * scale, height: selected.height * scale }}>
        <iframe title={`${selected.name}设备预览`} src={`?device=${device}`} style={{ width: selected.width, height: selected.height, transform: `scale(${scale})` }} />
      </div>
    </div>
  </div>
}
