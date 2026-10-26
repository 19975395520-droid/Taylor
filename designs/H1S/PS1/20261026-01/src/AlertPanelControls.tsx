import DisclosureChevron from "./DisclosureChevron";
import {useEffect,useRef,useState} from 'react'
import './alert-panel-controls.css'
const choices=[5,10,20,30,60] as const
export default function AlertPanelControls({collapsed,onToggle}:{collapsed:boolean;onToggle:()=>void}) {
 const [open,setOpen]=useState(false)
 const [until,setUntil]=useState(()=>{try{return Number(localStorage.getItem('sky-shield-dnd')||0)}catch{return 0}})
 const [now,setNow]=useState(Date.now())
 const area=useRef<HTMLDivElement>(null)
 const muted=until===-1||until>now
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),15000);return()=>clearInterval(timer)},[])
 useEffect(()=>{try{localStorage.setItem('sky-shield-dnd',String(until))}catch{};document.documentElement.dataset.alarmsMuted=String(muted)},[until,muted])
 useEffect(()=>{if(!open)return;const close=(event:PointerEvent)=>{if(!area.current?.contains(event.target as Node))setOpen(false)};const key=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('pointerdown',close);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',key)}},[open])
 const choose=(minutes:number)=>{const time=Date.now();setNow(time);setUntil(minutes===-1?-1:minutes===0?0:time+minutes*60000);setOpen(false)}
 return <div className="alert-panel-controls" ref={area}>
  <button className={`alert-mute-button ${muted?'muted':''}`} aria-label="报警免打扰" aria-expanded={open} title={muted?until===-1?'免打扰：永不结束':`免打扰：剩余${Math.ceil((until-now)/60000)}分钟`:'设置报警免打扰时长'} onClick={()=>setOpen(value=>!value)}>
   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>{muted&&<path d="M3 3l18 18"/>}</svg>
  </button>
  <button className="alert-collapse-button" aria-label={collapsed?'展开告警事件列表':'收起告警事件列表'} aria-expanded={!collapsed} aria-controls="drone-alert-list" onClick={onToggle}><DisclosureChevron expanded={!collapsed}/></button>
  {open&&<section className="alert-mute-menu" aria-label="报警免打扰时长"><h3>报警免打扰</h3><p>保留目标监测和告警记录</p><div>{choices.map(minutes=><button key={minutes} onClick={()=>choose(minutes)}>{minutes}分钟</button>)}<button onClick={()=>choose(-1)} title="永不结束，持续免打扰">永不</button></div><small role="status">{muted?until===-1?'当前：持续免打扰':`当前：剩余${Math.ceil((until-now)/60000)}分钟`:'当前：未开启'}</small>{muted&&<button className="unmute-action" onClick={()=>choose(0)}>关闭免打扰</button>}</section>}
 </div>
}
