import {createContext,useContext,useEffect,useState,type ReactNode,type Dispatch,type SetStateAction} from 'react'
export type WhitelistRow={id:string;model:string;serial:string;note:string;valid:string;startsAt?:string;enabled:boolean}
const seed:WhitelistRow[]=[
{id:'WL-00218',model:'DJI Mavic 3',serial:'1581F5FJD2398K',note:'物流园巡检无人机',valid:'永久有效',enabled:true},
{id:'WL-00176',model:'Autel EVO II',serial:'AUT-EVO2-009816',note:'园区安防巡逻',valid:'2027-12-31 23:59',enabled:true},
{id:'WL-00132',model:'DJI Matrice 30',serial:'1581F6GKD7732P',note:'应急测绘专用',valid:'2026-11-30 18:00',enabled:true},
{id:'WL-00098',model:'DJI Air 3',serial:'1581F4XCA0087L',note:'合作单位备案',valid:'已过期',enabled:false}]
type State={debugEnabled:boolean;setDebugEnabled:Dispatch<SetStateAction<boolean>>;deletedHistory:string[];setDeletedHistory:Dispatch<SetStateAction<string[]>>;rows:WhitelistRow[];setRows:Dispatch<SetStateAction<WhitelistRow[]>>;threshold:number;setThreshold:Dispatch<SetStateAction<number>>}
const Context=createContext<State|null>(null)
export function SystemStateProvider({children}:{children:ReactNode}) {
const [debugEnabled,setDebugEnabled]=useState(false);
const [deletedHistory,setDeletedHistory]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("sky-shield-history-deleted")||"[]")}catch{return []}});
useEffect(()=>{try{localStorage.setItem("sky-shield-history-deleted",JSON.stringify(deletedHistory))}catch{}},[deletedHistory]);
const [rows,setRows]=useState<WhitelistRow[]>(()=>{try{const data=JSON.parse(localStorage.getItem('sky-shield-whitelist')||'null');return Array.isArray(data)&&data.every(row=>typeof row.serial==='string'&&typeof row.enabled==='boolean')?data:seed}catch{return seed}})
const [threshold,setThreshold]=useState(()=>{try{const value=localStorage.getItem('sky-shield-altitude');const number=Number(value);return value!==null&&Number.isFinite(number)&&number>=0&&number<=1000?number:120}catch{return 120}})
useEffect(()=>{try{localStorage.setItem('sky-shield-whitelist',JSON.stringify(rows))}catch{}},[rows])
useEffect(()=>{try{localStorage.setItem('sky-shield-altitude',String(threshold))}catch{}},[threshold])
return <Context.Provider value={{rows,setRows,threshold,setThreshold,debugEnabled,setDebugEnabled,deletedHistory,setDeletedHistory}}>{children}</Context.Provider>
}
export function useSystemState(){const value=useContext(Context);if(!value)throw new Error('SystemStateProvider required');return value}
export function isTrusted(rows:WhitelistRow[],serial:string){return rows.some(row=>row.serial===serial&&row.enabled&&(!row.startsAt||new Date(row.startsAt).getTime()<=Date.now())&&(row.valid==='永久有效'||new Date(row.valid.replace(' ','T')).getTime()>Date.now()))}
