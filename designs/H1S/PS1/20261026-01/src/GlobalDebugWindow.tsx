import {useEffect,useRef,useState} from 'react';
import {useSystemState} from './SystemState';
import './global-debug.css';
export default function GlobalDebugWindow({page}:{page:string}){
 const {debugEnabled,setDebugEnabled}=useSystemState();
 const [entries,setEntries]=useState<string[]>([]),[small,setSmall]=useState(false),[large,setLarge]=useState(false);
 const [position,setPosition]=useState(()=>({x:16,y:window.innerHeight*.15}));const panel=useRef<HTMLElement>(null);
 const drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 const append=(text:string)=>setEntries(rows=>[...rows.slice(-199),`[${new Date().toLocaleTimeString('zh-CN',{hour12:false})}] ${text}`]);
 useEffect(()=>{if(debugEnabled)append(`页面：${({detect:'探测',history:'历史',analytics:'统计',whitelist:'白名单',settings:'设置'} as Record<string,string>)[page]||page}`)},[page,debugEnabled]);
 useEffect(()=>{if(!debugEnabled)return;append('日志已开启');const click=(e:MouseEvent)=>{const el=(e.target as HTMLElement).closest('button');if(el&&!el.closest('.global-debug-window'))append(`点击：${(el.getAttribute('aria-label')||el.textContent||'按钮').trim().slice(0,60)}`)};document.addEventListener('click',click);return()=>document.removeEventListener('click',click)},[debugEnabled]);
 useEffect(()=>{const keepInView=()=>setPosition(p=>({x:Math.max(0,Math.min(p.x,window.innerWidth-100)),y:Math.max(0,Math.min(p.y,window.innerHeight-56))}));window.addEventListener('resize',keepInView);return()=>window.removeEventListener('resize',keepInView)},[]);
 if(!debugEnabled)return null;
 return <section ref={panel} className={`global-debug-window ${small?'minimized':''} ${large?'expanded':''}`} aria-label="全局调试日志" style={{left:position.x,top:position.y}}>
 <header onPointerDown={e=>{if((e.target as HTMLElement).closest('button'))return;e.preventDefault();const rect=panel.current!.getBoundingClientRect();drag.current={x:e.clientX,y:e.clientY,left:rect.left,top:rect.top};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(!drag.current)return;const d=drag.current;setPosition({x:Math.max(0,Math.min(window.innerWidth-100,d.left+e.clientX-d.x)),y:Math.max(0,Math.min(window.innerHeight-56,d.top+e.clientY-d.y))})}} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}}><div><strong>调试日志</strong></div><div className="debug-actions"><button aria-label={small?'展开日志':'最小化日志'} onClick={()=>setSmall(v=>!v)}>{small?'▣':'−'}</button><button aria-label={large?'缩小日志窗口':'放大日志窗口'} onClick={()=>{setSmall(false);panel.current?.style.removeProperty("width");panel.current?.style.removeProperty("height");setLarge(v=>!v);setPosition({x:16,y:window.innerHeight*.15})}}>{large?'▱':'□'}</button><button aria-label="关闭调试日志" onClick={()=>setDebugEnabled(false)}>×</button></div></header>
 {!small&&<><div className="debug-log-lines" role="log" aria-label="日志内容">{entries.map((line,index)=><div key={index}>{line}</div>)}</div><footer><span>{entries.length} 条</span><button onClick={()=>setEntries([])}>清空显示</button></footer></>}
 </section>;
}
