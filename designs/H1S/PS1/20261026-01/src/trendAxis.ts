export type TrendBucket={label:string;start:string;end:string};
const day=86400000;
const iso=(date:Date)=>date.toISOString().slice(0,10);
const parse=(value:string)=>new Date(value+'T00:00:00Z');
export function buildTrendAxis(period:string,range:{start:string;end:string},today:string,firstRecord:string){
 let end=parse(today),start=new Date(end);let unit:'小时'|'日'|'周'|'月'='日';
 if(period==='自定义时间范围'){start=parse(range.start);end=parse(range.end)}
 else if(period==='近7天')start=new Date(end.getTime()-6*day);
 else if(period==='近1个月')start=new Date(end.getTime()-29*day);
 else if(period==='近3个月')start=new Date(end.getTime()-89*day);
 else if(period==='全部')start=parse(firstRecord);
 const days=Math.round((end.getTime()-start.getTime())/day)+1;
 unit=days===1?'小时':days<=31?'日':days<=93?'周':'月';
 if(period==='全部')unit='月';
 const buckets:TrendBucket[]=[];
 if(unit==='小时'){for(let hour=0;hour<24;hour++){const label=String(hour).padStart(2,'0')+':00';buckets.push({label,start:iso(start)+' '+label,end:iso(start)+' '+String(hour).padStart(2,'0')+':59'})}}
 else if(unit==='月'){for(let cursor=new Date(Date.UTC(start.getUTCFullYear(),start.getUTCMonth(),1));cursor<=end;cursor=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()+1,1))){const last=new Date(Date.UTC(cursor.getUTCFullYear(),cursor.getUTCMonth()+1,0));buckets.push({label:iso(cursor).slice(0,7),start:iso(cursor<start?start:cursor),end:iso(last>end?end:last)})}}
 else {const step=unit==='周'?7:1;for(let cursor=new Date(start);cursor<=end;cursor=new Date(cursor.getTime()+step*day)){const last=new Date(Math.min(end.getTime(),cursor.getTime()+(step-1)*day));buckets.push({label:iso(cursor).slice(5).replace('-','/'),start:iso(cursor),end:iso(last)})}}
 return {unit,buckets,start:iso(start),end:iso(end)};
}
export function limitTrendBuckets(buckets:TrendBucket[],values:number[],limit:number){
 const count=Math.min(limit,buckets.length);
 return Array.from({length:count},(_,index)=>{const start=Math.floor(index*buckets.length/count),end=Math.floor((index+1)*buckets.length/count);const first=buckets[start],last=buckets[end-1];return {label:first.label,start:first.start,end:last.end,value:values.slice(start,end).reduce((sum,value)=>sum+value,0)}});
}
