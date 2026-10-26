import { useSystemState, isTrusted } from "./SystemState";
import TrustEditor from "./TrustEditor";

import { useEffect, useState, type ReactNode } from 'react'
import QRCode from 'qrcode'
import './alert-details.css'
import './alert-reference.css'
import "./interaction-updates.css";

type Target = { type: string; serial: string; source: string; frequency: string; speed: string; altitude: string; distance: string; angle: string; signal: number }
const locations = [
  { name: '无人机位置', lon: '121.523191', lat: '31.083889', bearing: '23°', distance: '', icon: '⌖' },
  { name: '飞手位置', lon: '121.522887', lat: '31.084101', bearing: '331°', distance: '45 m', icon: '♙' },
]

export default function AlertDetails({ target, trusted, icon, onClose, children, showTrust=true }: { target: Target; trusted: boolean; icon: ReactNode; onClose: () => void; children?:ReactNode; showTrust?:boolean }) {

  const { rows, setRows, threshold } = useSystemState();
  const [trustEditorOpen, setTrustEditorOpen] = useState(false);
  const trustedNow = isTrusted(rows, target.serial);
  const altitude = Number.parseFloat(target.altitude) * (target.altitude.includes('ft') ? .3048 : 1);
  const tooHigh = Number.isFinite(altitude) && altitude > threshold;
  const [codes, setCodes] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [view, setView] = useState<'qr' | 'route'>('qr')

  useEffect(() => {
    let active = true
    Promise.all(locations.map(location => QRCode.toDataURL(`geo:${location.lat},${location.lon}`, { width: 256, margin: 3 }))).then(result => { if (active) setCodes(result) }).catch(() => { if (active) setCodes([]) })
    return () => { active = false }
  }, [])
  const selected = selectedLocation === null ? null : locations[selectedLocation]
  return <section className="alert-detail-dialog alert-detail-inline target-inline-detail" aria-label={target.source === "FPV" ? "FPV 告警详情" : "无人机信息"} onClick={event => event.stopPropagation()}>
    <div className="alert-sheet-handle" />

    <div className="alert-dialog-body">
      <div className="alert-location-list">{locations.map((location, index) => <section className="alert-location" key={location.name}>
        <div className="alert-location-icon" aria-hidden="true">{location.icon}</div>
        <div className="alert-location-copy"><h4>{location.name}</h4><strong>{location.lon},<br/>{location.lat}</strong></div>
        <div className="alert-location-distance"><span>{index === 0 ? target.angle : location.bearing}</span><strong>{index === 0 ? target.distance : location.distance}</strong></div>
        <button className="alert-qr" aria-label={`查看${location.name}二维码`} onClick={() => { setSelectedLocation(index); setView('qr') }}>{codes[index] ? <img src={codes[index]} alt={`${location.name}坐标二维码`} /> : <span>二维码</span>}</button>
        <a className="alert-route" aria-label={`查看${location.name}路线`} href={`https://uri.amap.com/navigation?to=${location.lon},${location.lat},${encodeURIComponent(location.name)}&mode=walk&coordinate=gaode&src=sky-shield&callnative=1`} target="_blank" rel="noopener noreferrer">路线</a>
      </section>)}</div>
      {selected && <section className="alert-location-expanded" aria-label={view === 'qr' ? '位置二维码' : '路线指引'}><header><h4>{selected.name} · {view === 'qr' ? '位置二维码' : '路线指引'}</h4><button aria-label="收起位置指引" onClick={() => setSelectedLocation(null)}>×</button></header>
        {view === 'qr' ? <>{codes[selectedLocation!] && <img src={codes[selectedLocation!]} alt="可扫描的位置二维码" />}<p>扫码查看位置坐标</p></> : <><div className="alert-route-preview"><span>设备当前位置</span><i/><strong>{selected.name}</strong></div><p>方位 {selectedLocation === 0 ? target.angle : selected.bearing} · 距离 {selectedLocation === 0 ? target.distance : selected.distance}</p><p>地图导航服务尚未接入，请依据坐标定位。</p></>}
        <strong className="alert-expanded-coordinates">{selected.lon}, {selected.lat}</strong>
      </section>}
      <section className="alert-metrics"><h3>详细信息</h3><dl>{[['飞行速度',target.speed],['飞行高度',target.altitude],['高度阈值',`${Number(threshold.toFixed(2))} m`],['无人机重量','—'],['飞行时间','—'],['控制距离','—'],['近48h出现','5 次']].map(([label,value]) => <div key={label}><dt>{label}</dt><dd className={label === "飞行高度" && tooHigh ? "altitude-alert" : undefined}>{value}{label === "飞行高度" && tooHigh && <span className="altitude-warning-icon" role="img" aria-label="超过高度阈值" title="飞行高度超过报警阈值">⚠</span>}</dd></div>)}</dl></section>
      {children}
      {showTrust && <footer className="alert-trust"><div className={trustedNow ? 'trusted' : 'untrusted'}>{trustedNow ? <><button className="cancel-trust" onClick={() => setRows(current => current.map(row => row.serial === target.serial ? {...row, enabled:false} : row))}>取消信任</button></> : <button className="add-trust" onClick={() => setTrustEditorOpen(true)}>添加信任</button>}</div><time>更新于 2 秒前</time></footer>}
      {trustEditorOpen && <TrustEditor model={target.type} serial={target.serial} onClose={() => setTrustEditorOpen(false)}/>}
    </div>
  </section>
}
