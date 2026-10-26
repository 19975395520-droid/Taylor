import {useEffect,useRef,useState} from 'react'
import './compass-calibration.css'

export default function CompassCalibration({onClose}:{onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null)
  const [replay,setReplay]=useState(0)
  const [paused,setPaused]=useState(false)
  useEffect(()=>{dialog.current?.showModal()},[])
  return <dialog ref={dialog} className="compass-calibration" aria-label="指南针校准演示" onCancel={event=>{event.preventDefault();onClose()}}>
    <header><div><span>COMPASS</span><h2>指南针校准</h2></div><button aria-label="关闭指南针校准" onClick={onClose}>×</button></header>
    <div className="compass-body"><span className="compass-demo-badge">动作演示</span>
      <div key={replay} className={`compass-animation ${paused?'paused':''}`} role="img" aria-label="设备沿横向八字形缓慢移动的动画">
        <svg viewBox="0 0 560 320" aria-hidden="true">
          <defs><linearGradient id="compass-trail"><stop stopColor="#3b82f6"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
          <ellipse cx="280" cy="270" rx="180" ry="16" fill="#0a1527"/>
          <path d="M280 160 C80 -30 20 350 280 160 C540 -30 480 350 280 160" fill="none" stroke="#1f3b54" strokeWidth="28"/>
          <path d="M280 160 C80 -30 20 350 280 160 C540 -30 480 350 280 160" fill="none" stroke="url(#compass-trail)" strokeWidth="3" strokeDasharray="10 10"/>
          <g className="compass-moving-device"><rect x="-24" y="-42" width="48" height="84" rx="10" fill="#152c44" stroke="#9deaff" strokeWidth="3"/><rect x="-17" y="-29" width="34" height="52" rx="3" fill="#24618a"/><circle cy="32" r="3" fill="#9deaff"/><path d="M0-15 8 7 0 3-8 7Z" fill="#b4f4ff"/>
          </g>
        </svg>
      </div>
      <h3>缓慢做“∞”字形移动</h3><p>握稳设备，按动画节奏轻缓移动。</p>
      <ol><li><b>1</b><span>远离磁性物体与大型金属设备</span></li><li><b>2</b><span>按横向“8”字形连续、平稳移动</span></li><li><b>3</b><span>完成后返回，查看设备指南针状态</span></li></ol>
      <p className="compass-caption">此动画仅演示校准动作，不代表传感器校准结果。</p>
    </div>
    <footer><button onClick={()=>setPaused(value=>!value)}>{paused?'继续播放':'暂停动画'}</button><button onClick={()=>{setReplay(value=>value+1);setPaused(false)}}>重播</button><button className="compass-done" onClick={onClose}>关闭演示</button></footer>
  </dialog>
}
