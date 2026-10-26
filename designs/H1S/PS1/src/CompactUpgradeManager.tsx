import {useState} from 'react';
import {PreviewDialog} from './PreviewAdditions';
import './management-refinements.css';
export default function CompactUpgradeManager(){
 const [feedback,setFeedback]=useState(''),[offline,setOffline]=useState(false);
 const [files,setFiles]=useState<Record<string,string>>({});
 return <div className="compact-upgrade-manager"><div className="compact-upgrade-toolbar"><strong>升级管理</strong><button onClick={()=>setOffline(true)}>离线升级</button></div>{['软件','固件','RID','机型库'].map((name,index)=><div className="compact-upgrade-row" key={name}><span className="upgrade-row-icon" aria-hidden="true">{['↓','↑','▥','↓'][index]}</span><div className="upgrade-row-copy"><strong>{name}</strong><small>{files[name]?`已选择 ${files[name]} · 待校验`:`当前版本 ${index===0?'v3.6.2':`2026.10.${18-index}`}`}</small></div><div className="upgrade-row-actions"><button aria-label={`${name}检查新包`} onClick={()=>setFeedback(`${name}：升级服务尚未连接，暂不能检查新包。`)}>检查新包</button><label>本地上传<input aria-label={`${name}本地上传`} type="file" accept=".zip,.bin,.img,.apk,.dat" onChange={e=>{const file=e.target.files?.[0];if(file){setFiles(current=>({...current,[name]:file.name}));setFeedback(`${name}：已选择本地文件，尚未上传或安装。`)}}}/></label></div></div>)}{feedback&&<p className="management-feedback" role="status">{feedback}</p>}{offline&&<PreviewDialog title="离线升级" onClose={()=>setOffline(false)}><div className="offline-pc-address"><span>▤ 同一局域网 PC 访问地址</span><strong>http://192.168.10.217:8088</strong></div></PreviewDialog>}</div>;
}
