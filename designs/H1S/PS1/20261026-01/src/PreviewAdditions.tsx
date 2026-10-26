import {useEffect,useRef,useState,type ReactNode} from 'react';
import './preview-additions.css';
export function PreviewDialog({title,onClose,children,className=""}:{title:string;onClose:()=>void;children?:ReactNode;className?:string}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{ref.current?.showModal()},[]);
 return <dialog ref={ref} className={`preview-dialog ${className}`} aria-label={title} onCancel={e=>{e.preventDefault();onClose()}}><header><h2>{title}</h2><button aria-label="关闭弹窗" onClick={onClose}>×</button></header><div className="preview-dialog-body">{children}</div></dialog>;
}
export function DateRangeDialog({start,end,onClose,onApply}:{start:string;end:string;onClose:()=>void;onApply:(start:string,end:string)=>void}) {
 const [error,setError]=useState('');
 return <PreviewDialog title="自定义时间范围" onClose={onClose}><form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);const from=String(data.get('start')),to=String(data.get('end'));if(from>to){setError('结束日不能早于开始日');return;}onApply(from,to)}}><label>开始日<input name="start" required type="date" defaultValue={start}/></label><label>结束日<input name="end" required type="date" defaultValue={end}/></label>{error&&<p role="alert">{error}</p>}<footer><button type="button" onClick={onClose}>取消</button><button type="submit">应用</button></footer></form></PreviewDialog>;

}
export function FpvMedia({mode,onClose,imageSrc='',videoSrc='',videoName='fpv-video.mp4'}:{mode:'image'|'video';onClose:()=>void;imageSrc?:string;videoSrc?:string;videoName?:string}) {
 if(mode==='image'?!imageSrc:!videoSrc)return null;
 return <PreviewDialog title={mode==='image'?'FPV 图片':'FPV 视频'} onClose={onClose}>{mode==='image'?<img className="fpv-full-image" src={imageSrc} alt="FPV 接收画面"/>:<video className="fpv-video" controls playsInline poster={imageSrc||undefined} src={videoSrc}/>}<div className="media-download-bar"><a className="media-download" href={mode==='image'?imageSrc:videoSrc} download={mode==='image'?'fpv-image.png':videoName}>{mode==='image'?'下载图片':'下载视频'}</a></div></PreviewDialog>;
}
export function FpvDetails({frequency,signal,eventId,mediaOnly=false,imageSrc='',videoSrc=''}:{frequency:string;signal:number;eventId?:string;mediaOnly?:boolean;imageSrc?:string;videoSrc?:string}){
 const [media,setMedia]=useState<'image'|'video'|null>(null);
 const [imageFailed,setImageFailed]=useState(false),[videoFailed,setVideoFailed]=useState(false);
 useEffect(()=>setImageFailed(false),[imageSrc]);useEffect(()=>setVideoFailed(false),[videoSrc]);
 const hasImage=Boolean(imageSrc)&&!imageFailed,hasVideo=Boolean(videoSrc)&&!videoFailed;
 if(mediaOnly&&!hasImage&&!hasVideo)return null;
 return <section className="fpv-details" aria-label="FPV 详情">{!mediaOnly&&<><h3>FPV 告警详情</h3><dl className="fpv-detail-fields">{eventId&&<div><dt>事件编号</dt><dd>{eventId}</dd></div>}<div><dt>告警类型</dt><dd>FPV</dd></div><div><dt>接收频率</dt><dd>{frequency}</dd></div><div><dt>信号强度</dt><dd>{signal} / 4 格</dd></div></dl></>}{(hasImage||hasVideo)&&<div className="fpv-preview-grid">{hasVideo&&<button className="fpv-preview-tile" aria-label="预览 FPV 视频" onClick={()=>setMedia('video')}><video muted playsInline preload="metadata" poster={hasImage?imageSrc:undefined} src={videoSrc} onError={()=>{setVideoFailed(true);setMedia(null)}}/><span className="media-play" aria-hidden="true">▷</span><span className="media-caption">视频预览</span></button>}{hasImage&&<button className="fpv-preview-tile" aria-label="预览 FPV 图片" onClick={()=>setMedia('image')}><img src={imageSrc} alt="FPV 图片预览" onError={()=>{setImageFailed(true);setMedia(null)}}/><span className="media-caption">图片预览</span></button>}</div>}{media&&<FpvMedia mode={media} imageSrc={hasImage?imageSrc:''} videoSrc={hasVideo?videoSrc:''} onClose={()=>setMedia(null)}/>}</section>;
}
