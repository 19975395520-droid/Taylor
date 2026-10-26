import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {PreviewDialog} from './PreviewAdditions';
type BatteryManager=EventTarget & {level:number};
const BatteryContext=createContext(86);
export const useBatteryLevel=()=>useContext(BatteryContext);
export function batteryWarningTier(percent:number){return percent<10?10:percent<20?20:null;}
export default function BatteryStatus({children}:{children:React.ReactNode}){
 const [level,setLevel]=useState(86),[warning,setWarning]=useState<10|20|null>(null);const seen=useRef(new Set<number>());
 useEffect(()=>{
  let active=true;let manager:BatteryManager|undefined;
  const update=(value:number)=>{if(!active||!Number.isFinite(value)||value<0||value>100)return;setLevel(Math.floor(value));const tier=batteryWarningTier(value);if(tier===null){seen.current.clear();setWarning(null);return;}if(!seen.current.has(tier)){seen.current.add(tier);if(tier===10)seen.current.add(20);setWarning(tier)}};
  const hardware=(event:Event)=>update((event as CustomEvent<{percent:number}>).detail?.percent);
  const changed=()=>{if(manager)update(manager.level*100)};
  window.addEventListener('device-battery-level',hardware);
  const navigatorWithBattery=navigator as Navigator & {getBattery?:()=>Promise<BatteryManager>};
  navigatorWithBattery.getBattery?.().then(battery=>{if(!active)return;manager=battery;changed();manager.addEventListener('levelchange',changed)}).catch(()=>{});
  return()=>{active=false;window.removeEventListener('device-battery-level',hardware);manager?.removeEventListener('levelchange',changed)};
 },[]);
 return <BatteryContext.Provider value={level}>{children}{warning!==null&&<PreviewDialog title="低电量提醒" className="global-battery-warning" onClose={()=>setWarning(null)}><p role="alert">电池电量不足{warning}%。请尽快更换电池</p><footer><button autoFocus onClick={()=>setWarning(null)}>我知道了</button></footer></PreviewDialog>}</BatteryContext.Provider>
}
