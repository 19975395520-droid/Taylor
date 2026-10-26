import {useEffect,useRef,useState} from 'react';
import {PreviewDialog} from './PreviewAdditions';
type Entry={id:string;feature:string;model:string};
const defaults:Record<string,Entry[]>={'WiFi 机型库':['Terjin_Dev','Terjin_Mac_Auth','Terjin_Staff','Terjin_Guest'].map((feature,index)=>({id:`seed-${index}`,feature,model:['DJI Mavic 3','DJI Air 3','Autel EVO II','未知机型'][index]}))};
export default function LibraryPreview({name}:{name:string}){
 const [lists,setLists]=useState<Record<string,Entry[]>>(()=>{try{return JSON.parse(localStorage.getItem('sky-shield-library-preview')||'null')||defaults}catch{return defaults}});
 const [open,setOpen]=useState(false),[message,setMessage]=useState('');
 const rows=lists[name]||[];
 const [page,setPage]=useState(1);const viewport=useRef<HTMLDivElement>(null);const pageSize=10;const pageCount=Math.max(1,Math.ceil(rows.length/pageSize));const visibleRows=rows.slice((page-1)*pageSize,page*pageSize);
 useEffect(()=>setPage(1),[name]);
 useEffect(()=>setPage(current=>Math.min(current,pageCount)),[pageCount]);
 useEffect(()=>{viewport.current?.scrollTo({top:0})},[page]);
 useEffect(()=>{try{localStorage.setItem('sky-shield-library-preview',JSON.stringify(lists))}catch{}},[lists]);
 const update=(items:Entry[])=>setLists(current=>({...current,[name]:items}));
 return <div className="library-preview"><div className="library-preview-toolbar"><span>共 {rows.length} 条相关记录</span><div><button onClick={()=>setOpen(true)}>＋ 添加</button><button onClick={()=>setMessage('已刷新本地预览记录')}>刷新</button><button onClick={()=>{if(window.confirm(`将恢复${name}的本地预览数据，是否继续？`))update(defaults[name]||[])}}>恢复默认</button></div></div><div className="library-data-viewport" ref={viewport}><div className="library-preview-table"><div className="library-table-heading"><strong>频率 / 特征</strong><strong>机型</strong><strong>操作</strong></div>{visibleRows.map(row=><div key={row.id}><span>{row.feature}</span><span>{row.model}</span><button aria-label={`删除 ${row.feature}`} onClick={()=>{if(window.confirm('确认删除该本地预览记录？'))update(rows.filter(item=>item.id!==row.id))}}>删除</button></div>)}</div>{!rows.length&&<p className="library-preview-empty">暂无相关记录</p>}</div><div className="library-pagination"><span>每页10条 · 第 {page} / {pageCount} 页</span><div><button disabled={page===1} onClick={()=>setPage(v=>v-1)}>上一页</button><button disabled={page===pageCount} onClick={()=>setPage(v=>v+1)}>下一页</button></div></div>{message&&<p className="management-feedback" role="status">{message}</p>}{open&&<PreviewDialog title={`添加${name}记录`} onClose={()=>setOpen(false)}><form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const feature=String(data.get('feature')||'').trim(),model=String(data.get('model')||'').trim();if(!feature||!model)return;update([...rows,{id:`preview-${Date.now()}`,feature,model}]);setPage(Math.ceil((rows.length+1)/pageSize));setOpen(false)}}><label>频率 / 特征<input name="feature" required maxLength={100}/></label><label>机型<input name="model" required maxLength={100}/></label><p>仅保存本地预览记录。</p><footer><button type="button" onClick={()=>setOpen(false)}>取消</button><button type="submit">保存</button></footer></form></PreviewDialog>}</div>;
}
