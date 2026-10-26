type Target={type:string;serial:string;source:string;frequency:string;signal:number;longitude?:string;latitude?:string;x?:number};
export default function MapTargetTooltip({target}:{target:Target}) {
 const lon=target.longitude||'121.523191',lat=target.latitude||'31.083889';
 return <span className={`map-target-tooltip ${(target.x??0)>=50?'tooltip-left':''}`} aria-label="无人机位置信息"><span className="map-tooltip-heading"><strong>{target.type}</strong><span className="signal-bars" aria-label={`信号强度 ${target.signal} 格`}>{[1,2,3,4].map(bar=><i className={bar<=target.signal?'on':''} key={bar}/>)}</span></span><span className="map-tooltip-fields"><span><i>SN</i><b>{target.source==='探测'||target.source==='FPV'?'—':target.serial}</b></span><span><i>频率</i><b>{target.frequency}</b></span><span><i>经纬度</i><b>{lon},<br/>{lat}</b></span></span></span>;
}
