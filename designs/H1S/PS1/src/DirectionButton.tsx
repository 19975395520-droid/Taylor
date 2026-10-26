import {useState} from 'react'
import CompassCalibration from './CompassCalibration'
import './direction-button.css'
export default function DirectionButton() {
 const [open,setOpen]=useState(false)
 return <><button className="map-compass-button electronic-compass" aria-label="电子罗盘，打开校准引导" title="电子罗盘校准演示" onClick={()=>setOpen(true)}>
  <span className="compass-card-label">电子罗盘 <small>示意</small></span>
  <svg width="136" height="136" viewBox="0 0 160 160" aria-hidden="true">
   <defs><radialGradient id="compass-face"><stop stopColor="#20435d"/><stop offset="1" stopColor="#091b2c"/></radialGradient></defs>
   <circle cx="80" cy="80" r="75" fill="url(#compass-face)" stroke="#446c89" strokeWidth="2"/>
   <circle cx="80" cy="80" r="58" fill="none" stroke="#284c68"/>
   {Array.from({length:36},(_,i)=><path key={i} d={i%3===0?'M80 8v9':'M80 9v5'} stroke={i%9===0?'#80d7f0':'#54768e'} strokeWidth={i%3===0?2:1} transform={`rotate(${i*10} 80 80)`}/>)}
   <g fill="#a6c3d8" fontSize="16" textAnchor="middle" fontFamily="sans-serif"><text x="80" y="37" fill="#fb7185">N</text><text x="127" y="86">E</text><text x="80" y="135">S</text><text x="33" y="86">W</text></g>
   <path d="m80 44 13 46-13-7Z" fill="#fb7185"/><path d="m80 44-13 46 13-7Z" fill="#d3eaf5"/><path d="m80 116 13-26-13-7-13 7Z" fill="#42627a"/>
   <circle cx="80" cy="83" r="5" fill="#19394f" stroke="#8cbed8"/>
  </svg><span className="compass-digital-reading">N <b>000°</b></span>
 </button>{open&&<CompassCalibration onClose={()=>setOpen(false)}/>}</>
}