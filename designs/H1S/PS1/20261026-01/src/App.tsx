import MapTargetTooltip from "./MapTargetTooltip";
import RuntimePrograms from "./RuntimePrograms";
import DisclosureChevron from "./DisclosureChevron";
import {exportReports} from "./exportReports";
import {buildTrendAxis,limitTrendBuckets} from "./trendAxis";
import BatteryStatus from "./BatteryStatus";
import AndroidStatusBar from "./AndroidStatusBar";
import AppearanceSettings from "./AppearanceSettings";
import AlarmSettings from "./AlarmSettings";
import ThirdPartyPlatform from "./ThirdPartyPlatform";
import StorageSettings from "./StorageSettings";
import DisplayModes from "./DisplayModes";
import LibraryPreview from "./LibraryPreview";
import GlobalDebugWindow from "./GlobalDebugWindow";
import CompactUpgradeManager from "./CompactUpgradeManager";
import CustomPlanPreview from "./CustomPlanPreview";
import TrustEditor from "./TrustEditor";
import {DateRangeDialog,FpvDetails,FpvMedia,PreviewDialog} from "./PreviewAdditions";
import MapDroneIcon from "./MapDroneIcon";
import AlertPanelControls from "./AlertPanelControls";
import DirectionButton from "./DirectionButton";
import { useSystemState, isTrusted } from "./SystemState";
import AlertDetails from "./AlertDetails";
import NetworkAdvancedSettings from "./NetworkAdvancedSettings";
import { createContext, useContext, useState } from "react";

type Page = "detect" | "history" | "analytics" | "whitelist" | "settings";
type IconName =
  | "radar"
  | "history"
  | "settings"
  | "shield"
  | "bell"
  | "search"
  | "layers"
  | "locate"
  | "drone"
  | "chevron"
  | "battery"
  | "signal"
  | "temperature"
  | "play"
  | "pause"
  | "download"
  | "calendar"
  | "database"
  | "document"
  | "chart"
  | "list"
  | "upload"
  | "plus"
  | "trash"
  | "droneTrack"
  | "pilotTrack";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<IconName, React.ReactNode> = {
    radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="m12 12 6.3-6.3M12 3v2M3 12h2M12 19v2" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    shield: <><path d="M12 3 4.5 6v5.5c0 4.7 3.2 7.8 7.5 9.5 4.3-1.7 7.5-4.8 7.5-9.5V6L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    locate: <><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
    drone: <><path d="M8 12h8M10 9h4l2 6h-8l2-6ZM5 8l5 3M19 8l-5 3" /><circle cx="4" cy="7" r="2" /><circle cx="20" cy="7" r="2" /><path d="M7 16h10" /></>,
    chevron: <path d="m9 6 6 6-6 6" />,
    battery: <><rect x="3" y="7" width="17" height="10" rx="2" /><path d="M21 10v4M6 10h8" /></>,
    signal: <><path d="M4 18v2M9 14v6M14 10v10M19 4v16" /></>,
    temperature: <><path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0Z" /><path d="M12 9v7" /></>,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
    document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /><path d="m3 7 6-4 6 5 6-5" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r=".8" fill="currentColor" /><circle cx="3.5" cy="12" r=".8" fill="currentColor" /><circle cx="3.5" cy="18" r=".8" fill="currentColor" /></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5M4 20h16" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
    droneTrack: <><path d="M3 18c3-5 5-1 8-5s5-1 10-7" strokeDasharray="2 2"/><path d="M8 8h8M10 6h4l1.5 4h-7L10 6Z"/><circle cx="6" cy="7" r="1.5"/><circle cx="18" cy="7" r="1.5"/></>,
    pilotTrack: <><path d="M4 20c2-4 5-2 7-6s5-2 9-6" strokeDasharray="2 2"/><circle cx="12" cy="5" r="2.5"/><path d="M8 14c.5-3 2-5 4-5s3.5 2 4 5M12 9v6"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

const targets = [
  { id: "UAV-0712", type: "DJI Mavic 3", serial: "67897654567876545678", source: "探测", frequency: "2477 MHz", level: "高危", distance: "1.24 km", speed: "30 m/s", altitude: "126 m", bearing: "东北 36.7°", angle: "36.7°", signal: 4, x: 62, y: 37 },
  { id: "UAV-0708", type: "DJI Mavic 3", serial: "67897654567876540708", source: "解析", frequency: "2477 MHz", level: "中危", distance: "2.86 km", speed: "30 m/s", altitude: "89 m", bearing: "西北 36.7°", angle: "36.7°", signal: 3, x: 33, y: 55 },
  { id: "UAV-0699", type: "DJI Mavic 3", serial: "67897654567876540699", source: "RID", frequency: "2477 MHz", level: "白名单", distance: "4.12 km", speed: "30 m/s", altitude: "204 m", bearing: "东南 36.7°", angle: "36.7°", signal: 3, x: 72, y: 70 },
  { id: "UAV-FPV-01", type: "FPV 无人机", serial: "FPV-0001", source: "FPV", frequency: "5800 MHz", level: "中危", distance: "2.86 km", speed: "30 m/s", altitude: "89 m", bearing: "东北 36.7°", angle: "36.7°", signal: 3, x: 45, y: 66 },
].map(target=>({...target,imageSrc:target.source === "FPV" ? "/fpv-preview.png" : undefined,videoSrc:undefined as string|undefined}));

const navItems: { id: Page; label: string; sub: string; icon: IconName }[] = [
  { id: "detect", label: "探测", sub: "实时监测", icon: "radar" },
  { id: "history", label: "历史", sub: "事件回溯", icon: "history" },
  { id: "analytics", label: "统计", sub: "态势分析", icon: "chart" },
  { id: "whitelist", label: "白名单", sub: "可信目标", icon: "list" },
  { id: "settings", label: "设置", sub: "系统配置", icon: "settings" },
];

const NavigationContext = createContext<{ page: Page; setPage: (page: Page) => void } | null>(null);

function Header() {
  const navigation = useContext(NavigationContext);
  return (
    <>
    <AndroidStatusBar/>
    {navigation && <nav className="primary-nav" aria-label="主导航">
      {navItems.map(item => <button key={item.id} className={navigation.page === item.id ? "active" : ""} onClick={() => navigation.setPage(item.id)}><span>{item.label}</span></button>)}
    </nav>}
    </>
  );
}

function ControlSidebar() {
  const [selectedControl, setSelectedControl] = useState("反制-FPV");
  const [controlCollapsed,setControlCollapsed]=useState(false);
  const customVisible = selectedControl === "自定义" || selectedControl.startsWith("方案-");
  const option = (group: string, name: string) => {
    const key = group + "-" + name;
    return <button key={key} className={selectedControl === key ? "selected" : ""} role="radio" aria-checked={selectedControl === key} onClick={() => setSelectedControl(key)}><span className="control-radio"/><strong>{name}</strong></button>;
  };
  return <aside className={`sidebar control-sidebar reference-control-sidebar ${controlCollapsed?"controls-collapsed":""}`}>
    <div className="handheld-control-heading"><strong>反制控制</strong><button aria-label={controlCollapsed?"展开反制面板":"折叠反制面板"} aria-expanded={!controlCollapsed} onClick={()=>setControlCollapsed(v=>!v)}><DisclosureChevron expanded={!controlCollapsed}/></button></div>
    <div className="brand"><div className="brand-mark"><Icon name="shield" size={27}/></div><div><strong>反制盾</strong></div></div>
    <div className="reference-control-groups" role="radiogroup" aria-label="反制控制模式">
      <section className="control-group"><h3 className="control-panel-title">反制</h3><div className="control-options">{["驱离","迫降","FPV"].map(name=>option("反制",name))}</div>
      <div className="custom-control"><button className={`custom-control-heading ${customVisible ? "selected" : ""}`} aria-expanded={customVisible} onClick={()=>setSelectedControl(customVisible ? "反制-FPV" : "自定义")}>自定义打击<DisclosureChevron expanded={customVisible}/></button><div className="control-options custom-plan-options">{[{name:"方案一",bands:["400M-600M","600M-4000M","1200M-5000M","5600M-6000M"]},{name:"方案二",bands:["100M-200M","600M-5000M"]}].map(plan=><div className="custom-plan-row control-options" key={plan.name}>{option("方案",plan.name)}{customVisible && <aside className="static-plan-strip" aria-label={plan.name+"说明"}><strong>打击频段:</strong>{plan.bands.map(band=><span key={band}><i aria-hidden="true">✓</i>{band}</span>)}</aside>}</div>)}</div></div></section>
      <section className="control-group deception-group"><h3 className="control-panel-title">诱骗</h3><div className="control-options">{["驱离","迫降"].map(name=>option("诱骗",name))}</div></section>
    </div>
  </aside>;
}

function StatCard({ icon, label, value, suffix, tone, note }: { icon: IconName; label: string; value: string; suffix?: string; tone: string; note: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon name={icon} size={22} /></div><div><span>{label}</span><strong>{value}<small>{suffix}</small></strong><p>{note}</p></div></div>;
}

// Stable colors keep the same drone identifiable across labels and replay.
function droneColor(identity: string, source: string, trusted: boolean) {
  let hash = 0;
  for (const character of identity) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const greens = ["#16a34a", "#0d9488", "#65a30d", "#059669", "#15803d"];
  const colors = ["#dc5245", "#d97706", "#9333ea", "#db2777", "#0891b2", "#c2410c"];
  return trusted ? greens[hash % greens.length] : source === "探测" ? "#3569ef" : colors[hash % colors.length];
}

function Detection() {
  const [selected, setSelected] = useState(targets[0]);
  const [showDirection,setShowDirection] = useState(false);
  const [fpvImage,setFpvImage] = useState(false);
  const [ignored, setIgnored] = useState<string[]>(() => { try { return JSON.parse(sessionStorage.getItem("sky-shield-ignored") || "[]"); } catch { return []; } });
  const [detailTarget, setDetailTarget] = useState<(typeof targets)[number] | null>(null);
  const [mapStyle, setMapStyle] = useState("高德地图");
  const [showMapSettings, setShowMapSettings] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapRevision, setMapRevision] = useState(0);
  const [range, setRange] = useState(6.6);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(18);
  const [sortBy, setSortBy] = useState("威胁等级");
  const [pinned, setPinned] = useState<string[]>([]);
  const [striking, setStriking] = useState<string[]>([]);
  const [swipedTarget, setSwipedTarget] = useState<string | null>(null);
  const [swipeStart, setSwipeStart] = useState<{ id: string; x: number } | null>(null);
  const { rows } = useSystemState();
  const trusted = targets.filter(target => isTrusted(rows, target.serial)).map(target => target.id);
  const trustColor = (target: (typeof targets)[number]) => droneColor(target.serial, target.source, trusted.includes(target.id));
  const [statusExpanded, setStatusExpanded] = useState(false);
  const [alertsCollapsed, setAlertsCollapsed] = useState(false);

  const mapStyles = ["高德地图", "高德卫星", "谷歌地图", "谷歌卫星", "矢量地图"];
  const visibleTargets = [...targets].sort((a, b) => {
    if (pinned.includes(a.id) !== pinned.includes(b.id)) return pinned.includes(a.id) ? -1 : 1;
    if (sortBy === "距离") return Number.parseFloat(a.distance) - Number.parseFloat(b.distance);
    if (sortBy === "时间") return b.id.localeCompare(a.id);
    const rank: Record<string, number> = { "高危": 3, "中危": 2, "白名单": 0 };
    return rank[b.level] - rank[a.level];
  });
  return (
    <>
      <Header />

      <main className="content detection">
        <ControlSidebar />
        <section className="detection-layout">
          <div className="detection-main">
          <div className="map-card">
            <div className={`map ${mapStyle.includes("卫星") ? "satellite" : ""} ${mapStyle === "矢量地图" ? "vector" : ""}`}>
              <div key={mapRevision} className="map-world" style={{ transform: `scale(${mapZoom})` }}>
              <div className="grid" /><div className="road r1" /><div className="road r2" /><div className="road r3" />
              <div className="zone z1">物流园区</div><div className="zone z2">云谷科技园</div><div className="water">青浦河</div>
              <div className="radar-zone" style={{ width: `${180 + range * 45}px`, height: `${180 + range * 45}px` }}><div className="radius-label">{range.toFixed(1)} km 探测半径</div><div className="radar-distance-scale">{[range, range * 2 / 3, range / 3, 0].map(value => <span key={value}><b>{value === 0 ? "0" : value.toFixed(1)}</b><i/></span>)}</div><div className="sweep" /><div className="ring ring-1" /><div className="ring ring-2" /><div className="ring ring-3" /><div className="base"><Icon name="shield" size={18} /></div></div>
              {targets.map((target) => <button key={target.id} onClick={() => setSelected(target)} style={{ left: `${target.x}%`, top: `${target.y}%`, ...(trustColor(target) ? { "--drone-source": trustColor(target), "--drone-tint": "#123c2d" } : {}) } as React.CSSProperties} className={`target-pin map-source-${target.source} ${selected.id === target.id ? "selected" : ""} ${ignored.includes(target.id) ? "alert-suppressed" : ""} ${trusted.includes(target.id) ? "trusted" : target.level === "高危" ? "danger" : target.level === "中危" ? "warning" : ""}`}><span><MapDroneIcon /></span><MapTargetTooltip target={target}/></button>)}
              </div>
              <div className="device-runtime-status map-runtime-status runtime-disclosure"><button className="runtime-trigger" aria-expanded={statusExpanded} aria-controls="runtime-programs" onClick={() => setStatusExpanded(value => !value)}><i/><span>设备状态：</span><strong>运行中</strong><DisclosureChevron expanded={statusExpanded}/></button>{statusExpanded && <div id="runtime-programs" className="runtime-programs">{["探测","反制","解码"].map(name => <div key={name}><span>{name}程序</span><strong><i/>运行中</strong></div>)}</div>}</div>
              <div className="map-controls"><button className={showMapSettings ? "active" : ""} onClick={() => setShowMapSettings(!showMapSettings)} aria-label="地图设置"><Icon name="layers" size={17} /></button><button aria-label="地图居中" title="地图居中" onClick={() => setMapZoom(1)}><Icon name="locate" size={17} /></button><button aria-label="刷新地图" title="刷新地图" onClick={() => { setMapZoom(1); setMapRevision(value => value + 1); setShowMapSettings(false); }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5M20 12 17 8"/></svg></button></div>
              {showMapSettings && <div className="map-settings">
                <div className="map-settings-head"><div><strong>地图设置</strong><span>选择地图来源与显示范围</span></div><button onClick={() => setShowMapSettings(false)}>×</button></div>
                <div className="map-source-list">
                  {mapStyles.map((style, index) => <button className={mapStyle === style ? "selected" : ""} onClick={() => setMapStyle(style)} key={style}>
                    <span className={`map-preview preview-${index + 1}`}><i /></span><strong>{style}</strong>
                  </button>)}
                </div>
                <div className="radius-setting"><label><span>探测半径</span><b>{range.toFixed(1)} km</b></label><input type="range" min="1" max="10" step=".1" value={range} onChange={(e) => setRange(Number(e.target.value))} style={{ "--range": `${(range - 1) / 9 * 100}%` } as React.CSSProperties} /></div>
                <div className="download-settings">
                  <div className="download-title"><div><strong>地图下载</strong><span>下载区域（默认当前视图区域）</span></div><Icon name="download" size={20} /></div>
                  <div className="download-grid">
                    <label>东 <span>121.530396</span></label><label>内存空间 <b>229032M</b></label>
                    <label>西 <span>121.524605</span></label><label>文件大小 <b>20M</b></label>
                    <label>南 <span>31.076254</span></label><label>瓦片数量 <b>82</b></label>
                    <label>北 <span>31.085350</span></label><label>预计用时 <b>0分钟</b></label>
                  </div>
                  <div className="zoom-setting"><label>最小层级 <b>{minZoom}</b></label><input type="range" min="1" max="18" value={minZoom} onChange={(e) => setMinZoom(Number(e.target.value))} /></div>
                  <div className="zoom-setting"><label>最大层级 <b>{maxZoom}</b></label><input type="range" min="1" max="20" value={maxZoom} onChange={(e) => setMaxZoom(Number(e.target.value))} /></div>
                  <button className="download-map"><Icon name="download" size={15} /> 下载当前区域</button>
                </div>
              </div>}
              <DirectionButton /><button className="floating-direction" onClick={()=>setShowDirection(true)}>⌖ 测向</button>{showDirection&&<PreviewDialog title="测向" onClose={()=>setShowDirection(false)}/>}<div className="map-scale"><span />2.0 km</div>
            </div>
          </div>
          </div>
          <aside className={`target-panel ${alertsCollapsed ? "alerts-collapsed" : ""}`}>
            <div className="panel-title"><div><strong>告警事件列表</strong><span>{targets.length} 条告警</span></div><AlertPanelControls collapsed={alertsCollapsed} onToggle={() => setAlertsCollapsed(value => !value)} /></div>
            <div id="drone-alert-list" className="target-list">{visibleTargets.map((target) => (
              <div className="target-swipe-shell" key={target.id}>
              <button className={`pin-reveal-action ${pinned.includes(target.id) ? "cancel" : ""}`} onClick={() => { setPinned(ids => ids.includes(target.id) ? ids.filter(id => id !== target.id) : [...ids, target.id]); setSwipedTarget(null); }}><Icon name="chevron" size={16}/><strong>{pinned.includes(target.id) ? "取消置顶" : "置顶"}</strong></button>
              <article className={`${selected.id === target.id ? "active" : ""} ${ignored.includes(target.id) ? "ignored" : ""} ${swipedTarget === target.id ? "swiped" : ""} ${pinned.includes(target.id) ? "pinned" : ""} ${detailTarget?.id === target.id ? "expanded" : ""}`} onClick={() => setSelected(target)} onPointerDown={event => { if ((event.target as HTMLElement).closest(".target-card-actions, .target-inline-detail")) return; setSwipeStart({ id: target.id, x: event.clientX }); }} onPointerUp={event => { if (swipeStart?.id !== target.id) return; const distance = event.clientX - swipeStart.x; if (distance < -35) setSwipedTarget(target.id); if (distance > 35) setSwipedTarget(null); setSwipeStart(null); }} onPointerCancel={() => setSwipeStart(null)}>
                <div className="target-card-main">
                  {target.source === "FPV" ? <button className="drone-thumb fpv-thumbnail" aria-label="放大 FPV 图片" onClick={e=>{e.stopPropagation();setFpvImage(true)}}><img src="/fpv-preview.png" alt="FPV 接收画面"/><span className="source-tag" style={{backgroundColor:trustColor(target)}}>FPV</span></button> : <div className="drone-thumb"><img className="alert-drone-thumbnail" src="/wurenji.png" alt={target.type} /><span className={`source-tag ${target.source}`} style={{ backgroundColor: trustColor(target) }}>{target.source}</span></div>}
                  <div className="target-card-info">
                    <div className="target-model"><strong>{target.type}</strong><span className="signal-bars" aria-label={`信号强度 ${target.signal} 格`}>{[1,2,3,4].map(bar => <i className={bar <= target.signal ? "on" : ""} key={bar} />)}</span></div>
                    {target.source !== "探测" && target.source !== "FPV" && <span className="serial">SN · {target.serial}</span>}
                    <div className="target-meta"><span>↯ {target.frequency}</span><span className="uom">UOM</span></div>
                  </div>
                </div>
                <div className="target-card-actions">
                  <button onClick={(e) => { e.stopPropagation(); setIgnored(ids => { const next = ids.includes(target.id) ? ids.filter(id => id !== target.id) : [...ids, target.id]; sessionStorage.setItem("sky-shield-ignored", JSON.stringify(next)); return next; }); setDetailTarget(current => current?.id === target.id ? null : current); }}><span className="eye-mark" />{ignored.includes(target.id) ? "取消忽略" : "忽略"}</button>
                  <i />
                  <button className={`strike-action ${striking.includes(target.id) ? "running" : ""}`} onClick={(e) => { e.stopPropagation(); setStriking(ids => ids.includes(target.id) ? ids.filter(id => id !== target.id) : [...ids, target.id]); }}><Icon name="shield" size={13}/>{striking.includes(target.id) ? "取消打击" : "打击"}</button>
                  {target.source !== "探测" && <><i />
                  <button className={`detail-action ${detailTarget?.id === target.id ? "open" : ""}`} onClick={(e) => { e.stopPropagation(); setSelected(target); setDetailTarget(current => current?.id === target.id ? null : target); }}><b>i</b>{detailTarget?.id === target.id ? "收起" : "详情"}</button></>}
                </div>{detailTarget?.id === target.id && target.source === "FPV" && <AlertDetails target={target} trusted={false} icon={null} onClose={()=>setDetailTarget(null)} showTrust={false}><FpvDetails mediaOnly imageSrc={target.imageSrc} videoSrc={target.videoSrc} frequency={target.frequency} signal={target.signal}/></AlertDetails>}{detailTarget?.id === target.id && target.source !== "FPV" && target.source !== "探测" && <AlertDetails target={target} trusted={trusted.includes(target.id)} icon={<Icon name="drone" size={64}/>} onClose={() => setDetailTarget(null)} />}</article>
              </div>
            ))}</div>{fpvImage&&<FpvMedia mode="image" imageSrc="/fpv-preview.png" onClose={()=>setFpvImage(false)}/>}
          </aside>
        </section>
      </main>
    </>
  );
}

const historySeed = [
  { id: "EVT-20250717-152207", mode: "RID", model: "Autel Robotics Nano+", identity: "SN:NA0983596NAN", time: "2025-07-17 15:22:07", duration: 12.7, count: 101, points: 101, occurrences: 22 },
  { id: "EVT-20250717-152210", mode: "RID", model: "Autel Robotics Nano+", identity: "SN:NA098359645678", time: "2025-07-17 15:22:10", duration: 12.6, count: 83, points: 121, occurrences: 18 },
  { id: "EVT-20250717-152212", mode: "RID", model: "Autel Robotics Nano+", identity: "SN:NA0983596BT4", time: "2025-07-17 15:22:12", duration: 12.5, count: 122, points: 121, occurrences: 16 },
  { id: "EVT-20250717-152214", mode: "RID", model: "Autel Robotics Nano+", identity: "SN:NA0983596BT5", time: "2025-07-17 15:22:14", duration: 12.7, count: 93, points: 93, occurrences: 12 },
  { id: "EVT-20250717-152811", mode: "探测", model: "DJI OcuSync V4", identity: "5800.0 MHz", time: "2025-07-17 15:28:11", duration: 1.3, count: 10, points: 64, occurrences: 11 },
  { id: "EVT-20250717-152846", mode: "探测", model: "DJI OcuSync V4", identity: "5805.0 MHz", time: "2025-07-17 15:28:46", duration: 0.87, count: 4, points: 32, occurrences: 8 },
  { id: "EVT-20250717-152848", mode: "解析", model: "DJI Drone", identity: "SN:00000000", time: "2025-07-17 15:28:48", duration: 1.5, count: 2, points: 0, occurrences: 5 },
  { id: "EVT-20250717-152918", mode: "解析", model: "DJI Drone", identity: "SN:43323531", time: "2025-07-17 15:29:18", duration: 0.02, count: 1, points: 0, occurrences: 3 },
];

const historyRows = [...historySeed, ...Array.from({length:42},(_,index)=>{
 const mode=["探测","解析","RID","FPV"][index%4];
 return {id:`EVT-DEMO-${index+9}`,mode,model:mode==="FPV"?"FPV 无人机":["DJI Mavic 3","DJI Air 3","Autel EVO II"][index%3],identity:mode==="探测"?`${[900,1400,2400,5200,5800][index%5]} MHz`:mode==="FPV"?"FPV 画面记录":`SN:DEMO2025${String(index+9).padStart(6,"0")}`,time:`2025-07-17 ${String(8+Math.floor(index/6)).padStart(2,"0")}:${String(index%6*9).padStart(2,"0")}:00`,duration:Number((.5+index*.3).toFixed(1)),count:10+index,points:mode==="FPV"?0:20+index*3,occurrences:1+index%12};
})].map(row=>({...row,originId:row.id,imageSrc:row.mode === "FPV" ? "/fpv-preview.png" : undefined,videoSrc:undefined as string|undefined}));

// Deterministic prior events for the existing demonstration history dataset.
function priorHistoryEvents(row:(typeof historyRows)[number]){
 const root=historyRows.find(item=>item.id===row.originId)??row;
 const count=Math.max(0,root.occurrences-1);
 const known=historyRows.filter(item=>item.id!==root.id&&root.identity.startsWith("SN:")&&item.identity===root.identity);
 const generated=Array.from({length:Math.max(0,count-known.length)},(_,index)=>({...root,id:root.id+"-H-"+(index+1),time:new Date(Date.parse(root.time.replace(" ","T")+"Z")-(index+1)*6*3600000).toISOString().slice(0,19).replace("T"," ")}));
 return [...known,...generated].slice(0,count).sort((a,b)=>b.time.localeCompare(a.time));
}

function HistoryPage() {
  const { rows: whitelistRows, deletedHistory:deletedIds, setDeletedHistory:setDeletedIds } = useSystemState();
  const historyColor = (row: (typeof historyRows)[number]) => droneColor(row.identity.replace(/^SN:/, ""), row.mode, isTrusted(whitelistRows, row.identity.replace(/^SN:/, "")));
  const [showDateRange,setShowDateRange] = useState(false);
  const [datePreset, setDatePreset] = useState("今日");
  const [startDate, setStartDate] = useState("2025-07-17");
  const [endDate, setEndDate] = useState("2025-07-17");
  const [playing, setPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [showDroneTrack, setShowDroneTrack] = useState(true);
  const [showPilotTrack, setShowPilotTrack] = useState(true);
  const [replayMap, setReplayMap] = useState("矢量地图");
  const [showReplayMapSettings, setShowReplayMapSettings] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("全部");
  const [minDuration, setMinDuration] = useState(0);
  const [minOccurrences, setMinOccurrences] = useState(0);
  const [historySN,setHistorySN] = useState("");
  const [historyDrilldown,setHistoryDrilldown]=useState<(typeof historyRows)[number]|null>(null);
  const [selectedId, setSelectedId] = useState(historyRows[0].id);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [detailEvent, setDetailEvent] = useState<(typeof historyRows)[number] | null>(null);
  const [historySidePanel, setHistorySidePanel] = useState<"detail" | "track" | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const rows = (historyDrilldown?priorHistoryEvents(historyDrilldown):historyRows).filter(row =>
    !deletedIds.includes(row.id) &&

    `${row.model} ${row.identity} ${row.id}`.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "全部" || row.mode === filterType) &&
    row.duration >= minDuration &&
    Math.max(0,row.occurrences-1) >= minOccurrences &&
    row.time.slice(0, 10) >= startDate &&
    row.time.slice(0, 10) <= endDate
  );
  const relatedHistory = detailEvent ? priorHistoryEvents(detailEvent).filter(row=>!deletedIds.includes(row.id)&&row.id!==detailEvent.id) : [];
  const selectedEvent = rows.find(row => row.id === selectedId) ?? rows[0] ?? historyRows[0];
  return <>
    <Header />
    <main className="content history-page">{showDateRange&&<DateRangeDialog start={startDate} end={endDate} onClose={()=>setShowDateRange(false)} onApply={(start,end)=>{setStartDate(start);setEndDate(end);setDatePreset("自定义时间范围");setShowDateRange(false)}}/>}
      <section className="filterbar history-toolbar"><select className="handheld-history-period" aria-label="历史记录周期" value={datePreset} onChange={event => { const item=event.target.value; if(item === "自定义时间范围"){setShowDateRange(true);return;} setDatePreset(item);setEndDate("2025-07-17");setStartDate(item === "今日" ? "2025-07-17" : item === "近7天" ? "2025-07-11" : item === "近1个月" ? "2025-06-18" : item === "近3个月" ? "2025-04-18" : "2025-01-01"); }}>{["今日","近7天","近1个月","近3个月","全部","自定义时间范围"].map(item => <option key={item}>{item}</option>)}</select><div className="search"><Icon name="search" size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索无人机型号和 SN" /></div><div className="date-presets">{["今日", "近7天", "近1个月", "近3个月", "全部", "自定义时间范围"].map(item => <button className={datePreset === item ? "active" : ""} onClick={() => { if(item === "自定义时间范围"){setShowDateRange(true);return;} setDatePreset(item); setEndDate("2025-07-17"); setStartDate(item === "今日" ? "2025-07-17" : item === "近7天" ? "2025-07-11" : item === "近1个月" ? "2025-06-18" : item === "近3个月" ? "2025-04-18" : "2025-01-01"); }} key={item}>{item}</button>)}</div><div className="history-filter-wrap"><button className={showFilter ? "active" : ""} aria-label="更多筛选条件" onClick={() => setShowFilter(!showFilter)}><Icon name="layers" size={16} /><span className="history-filter-label">更多条件</span></button>
        {showFilter && <div className="history-filter-panel">
          <div className="filter-types">{["全部", "探测", "RID", "解析", "FPV"].map(type => <button className={filterType === type ? "active" : ""} onClick={() => setFilterType(type)} key={type}>{type}</button>)}</div>
          <div className="filter-group"><strong>单次出现时长</strong><div>{[1,3,5,10].map(value => <button className={minDuration === value ? "active" : ""} onClick={() => setMinDuration(value)} key={value}>≥{value}min</button>)}</div></div>
          <div className="filter-group"><strong>历史出现次数</strong><div>{[3,5,10,20].map(value => <button className={minOccurrences === value ? "active" : ""} onClick={() => setMinOccurrences(value)} key={value}>≥{value}次</button>)}</div></div>
          <div className="filter-actions"><button onClick={() => { setFilterType("全部"); setMinDuration(0); setMinOccurrences(0); }}>重置</button><button onClick={() => setShowFilter(false)}>确定</button></div>
        </div>}
      </div><button className="batch-delete" disabled={!selectedRowIds.length} onClick={() => { if (window.confirm(`确认删除已选择的 ${selectedRowIds.length} 条记录？`)) { setDeletedIds(ids => [...ids, ...selectedRowIds]); setSelectedRowIds([]); } }}><Icon name="trash" size={17}/> 批量删除{selectedRowIds.length ? `（${selectedRowIds.length}）` : ""}</button><button className="export" onClick={() => {
 const cell = (value: string | number) => '"' + (/^[=+@-]/.test(String(value)) ? "'" : "") + String(value).replace(/"/g, '""') + '"';
 const csv = "\uFEFF" + [["类型","目标","标识","发现时间","时长（分钟）","历史出现次数","轨迹点"], ...rows.map(row => [row.mode,row.model,row.identity,row.time,row.duration,Math.max(0,row.occurrences-1),row.points])].map(line => line.map(cell).join(",")).join("\r\n");
 const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); const link=document.createElement("a");link.href=url;link.download="历史记录.csv";link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }}><Icon name="download" size={17} /><span>导出</span></button></section>
      <section className={`history-content ${historySidePanel ? "panel-open" : ""}`}>
        <div className="history-table">
          <div className="history-table-summary"><span><b>{rows.length}</b> 条相关记录</span>{historySN && <button className="history-clear-sn" onClick={() => {setHistorySN("");setHistoryDrilldown(null);setSelectedRowIds([]);setHistorySidePanel(null);}}>‹ 返回全部记录 · {historySN}</button>}</div>
          <div className="table-head"><span className="history-select-cell"><input aria-label="全选当前记录" type="checkbox" checked={rows.length > 0 && rows.every(row => selectedRowIds.includes(row.id))} onChange={event => setSelectedRowIds(event.target.checked ? rows.map(row => row.id) : [])}/></span><span>识别类型</span><span>目标信息</span><span>发现时间</span><span>出现时长</span><span>历史出现次数</span><span>轨迹点</span><span>操作</span></div>
          {rows.map(row => <div role="button" tabIndex={0} onClick={() => setSelectedId(row.id)} className={`history-row ${selectedEvent.id === row.id ? "selected" : ""}`} key={row.id}>
            <span className="history-select-cell"><input aria-label={`选择 ${row.model}`} type="checkbox" checked={selectedRowIds.includes(row.id)} onClick={event => event.stopPropagation()} onChange={event => setSelectedRowIds(ids => event.target.checked ? [...ids, row.id] : ids.filter(id => id !== row.id))}/></span>
            <span className="history-source-cell"><span className="drone-thumb history-source-thumb"><img className="alert-drone-thumbnail" src={row.mode === "FPV" ? "/fpv-preview.png" : "/wurenji.png"} alt=""/><span style={{backgroundColor: historyColor(row)}} className={`source-tag ${row.mode === "RID" ? "RTID" : row.mode}`}>{row.mode}</span></span></span>
            <span className="history-target"><span><strong>{row.model}</strong><small>{row.identity}</small></span></span>
            <span className="history-discovered">{row.time}</span><span className="history-duration">{row.duration >= 1 ? `${row.duration} 分钟` : `${Math.round(row.duration * 60)} 秒`}</span><span className="history-count-cell"><button className="history-count-link" disabled={row.occurrences<=2} title="逐条查看当前目标的历史记录" onClick={event => {event.stopPropagation();const root=historyRows.find(item=>item.id===row.originId)??row;setHistoryDrilldown(root);setHistorySN(root.identity.startsWith("SN:")?root.identity:root.model+" · "+root.id);setSelectedRowIds([]);setHistorySidePanel(null);setSearch("");setFilterType("全部");setMinDuration(0);setMinOccurrences(0);setStartDate("2025-01-01");setEndDate("2025-12-31");setDatePreset("全部");}}>{Math.max(0,row.occurrences-1)} 次</button></span><span className="history-point-cell">{row.points}<i className="handheld-point-label"> 个轨迹点</i></span>
            <span className="event-actions">
              {<button className="event-action detail" onClick={(e) => { e.stopPropagation(); setDetailEvent(row); setHistorySidePanel("detail"); }}><b>i</b>详情</button>}
              {row.points > 1 && <button className="event-action track" onClick={(e) => { e.stopPropagation(); setSelectedId(row.id); setPlaying(false); setHistorySidePanel("track"); }}><Icon name="locate" size={11} />轨迹</button>}
            </span>
          </div>)}
          {!rows.length && <div className="empty-history">没有符合当前筛选条件的记录</div>}
        </div>
        {historySidePanel === "track" && <div className="replay-card history-side-panel" style={{"--event-color": historyColor(selectedEvent)} as React.CSSProperties}>
          <button className="history-panel-close" aria-label="收起轨迹回放" onClick={() => setHistorySidePanel(null)}>×</button>
          <div className="section-title"><div><strong>轨迹回放</strong></div></div>
          <div className={`mini-map replay-${replayMap}`}>
            <div className="grid" /><div className="replay-road road-a" /><div className="replay-road road-b" /><span className="map-place place-a">青浦科技园</span><span className="map-place place-b">东港路</span>
            <div className="replay-map-tools"><button title="无人机轨迹" aria-label="切换无人机轨迹" aria-pressed={showDroneTrack} className={showDroneTrack ? "active drone" : ""} onClick={() => setShowDroneTrack(value => !value)}><Icon name="droneTrack" size={20}/></button><button title="飞手轨迹" aria-label="切换飞手轨迹" aria-pressed={showPilotTrack} className={showPilotTrack ? "active pilot" : ""} onClick={() => setShowPilotTrack(value => !value)}><Icon name="pilotTrack" size={20}/></button><button title="地图设置" aria-label="打开地图设置" className={showReplayMapSettings ? "active map-layer" : ""} onClick={() => setShowReplayMapSettings(value => !value)}><Icon name="layers" size={17}/></button></div>
            {showReplayMapSettings && <div className="replay-map-picker"><div className="replay-map-picker-head"><strong>地图设置</strong><button onClick={() => setShowReplayMapSettings(false)}>×</button></div><div className="map-source-list">{["高德地图","高德卫星","谷歌地图","谷歌卫星","矢量地图"].map((style,index) => <button className={replayMap === style ? "selected" : ""} onClick={() => { setReplayMap(style); setShowReplayMapSettings(false); }} key={style}><span className={`map-preview preview-${index + 1}`}><i/></span><strong>{style}</strong></button>)}</div></div>}
            {showDroneTrack && <><div className="track-path drone-track" /><div className="track-dot drone-start">发现点</div><div className="track-marker drone-marker"><Icon name="drone" size={16} /></div></>}
            {showPilotTrack && <><div className="track-path pilot-track" /><div className="track-dot pilot-start">飞手起点</div><div className="track-marker pilot-marker"><Icon name="locate" size={15} /></div></>}
            <div className="track-dot end">处置点</div><div className="replay-base"><Icon name="shield" size={18} /></div>
            <div className="replay-info-stack">
              {showDroneTrack && <div className="replay-target-info compact drone-info"><div className="replay-target-primary"><Icon name="droneTrack" size={24} /><span><strong>{selectedEvent.model}</strong><small>{selectedEvent.identity} · 2477 MHz</small></span></div><div className="replay-target-inline"><div><span>发现时间</span><strong>{selectedEvent.time}</strong></div><div><span>位置</span><strong>121.52352，31.105621</strong></div><div><span>高度</span><strong>126 m</strong></div><div><span>轨迹点</span><strong>{selectedEvent.points}</strong></div></div></div>}
              {showPilotTrack && <div className="replay-target-info compact pilot-info"><div className="replay-target-primary"><Icon name="pilotTrack" size={24} /><span><strong>飞手信息 · 张三</strong><small>19975391111 · 已核验身份</small></span></div><div className="replay-target-inline"><div><span>位置</span><strong>121.52352，31.105621</strong></div><div><span>方位</span><strong>20.2°</strong></div><div><span>距离</span><strong>300 m</strong></div><div><span>关联目标</span><strong>{selectedEvent.model}</strong></div></div></div>}
            </div>
            <div className="map-legend">{showDroneTrack && <span><i className="drone" />无人机轨迹</span>}{showPilotTrack && <span><i className="pilot" />飞手轨迹</span>}</div>
          </div>
          <div className="timeline"><div className="timeline-head" /><input className="timeline-range" type="range" min="0" max="100" defaultValue="42"/><div className="replay-controls"><button onClick={() => setPlaying(!playing)}><Icon name={playing ? "pause" : "play"} size={16} /></button><strong>{playing ? "回放中" : "已暂停"}</strong>{[1,2,4,8,16].map(speed => <button className={playbackSpeed === speed ? "active" : ""} onClick={() => setPlaybackSpeed(speed)} key={speed}>{speed}×</button>)}<button className="track-export"><Icon name="download" size={14}/> 导出轨迹 Excel</button></div></div>
        </div>}
        {historySidePanel === "detail" && detailEvent && <section className="event-detail-modal history-detail-panel">
          <div className="event-detail-head"><div><strong>事件详情</strong></div><button onClick={() => { setDetailEvent(null); setHistorySidePanel(null); }}>×</button></div>
          <div className="archive-identity"><span className="drone-thumb history-source-thumb"><img className="alert-drone-thumbnail" src={detailEvent.mode === "FPV" ? "/fpv-preview.png" : "/wurenji.png"} alt=""/><span className="source-tag" style={{backgroundColor:historyColor(detailEvent)}}>{detailEvent.mode}</span></span><div><strong>{detailEvent.model}</strong><small>{detailEvent.identity}</small><span>2477 MHz <Icon name="signal" size={22}/></span></div>{detailEvent.points>1 && <button onClick={() => {setSelectedId(detailEvent.id);setPlaying(false);setHistorySidePanel("track");}}><Icon name="history" size={16}/>轨迹回放</button>}</div>
          <div className="event-detail-grid archive-metrics">
            <div><span>发现时间</span><strong>{detailEvent.time}</strong></div>
            <div><span>飞行时长</span><strong>{Math.round(detailEvent.duration * 60)} 秒</strong></div><div><span>历史出现次数</span><strong>{Math.max(0,detailEvent.occurrences-1)} 次</strong></div>
            <div><span>{detailEvent.mode === "探测" ? "探测次数" : "解析次数"}</span><strong>{detailEvent.count} 次</strong></div><div><span>轨迹点数量</span><strong>{detailEvent.points} 个</strong></div>
            <div><span>最大飞行速度</span><strong>30 m/s</strong></div><div><span>最大飞行高度</span><strong>126 m</strong></div>
            <div><span>无人机重量</span><strong>210 g</strong></div><div><span>近 48 小时出现</span><strong>—</strong></div>
          </div>
          <section className="archive-location"><h4>最后定位数据</h4><div><span>无人机位置</span><strong>121.52352，31.105621</strong><span>36.7°</span></div><div><span>飞手位置</span><strong>121.52018，31.10142</strong><span>20.2°</span></div></section>
          {detailEvent.mode === "FPV" && <FpvDetails imageSrc={detailEvent.imageSrc} videoSrc={detailEvent.videoSrc} frequency="5800 MHz" signal={3}/>}
          <section className="archive-history"><h3>历史出现次数 <b>{Math.max(0,detailEvent.occurrences-1)} 次</b></h3><p>历史记录（{relatedHistory.length}）</p>{!relatedHistory.length && <p>暂无其他已归档记录</p>}<div className="archive-history-heading"><span>时间</span><span>出现时长</span><span>操作</span></div>{relatedHistory.map(record => <div className="archive-history-row" key={record.id}><time>{record.time}</time><span>{Math.round(record.duration*60)} 秒</span><div><button onClick={() => setDetailEvent(record)}>详情</button>{record.points>1 && <button onClick={() => {setSelectedId(record.id);setPlaying(false);setHistorySidePanel("track");}}>轨迹</button>}</div></div>)}</section>
        </section>}
      </section>
    </main>
  </>;
}

const whitelistSeed = [
  { id: "WL-00218", model: "DJI Mavic 3", serial: "1581F5FJD2398K", note: "物流园巡检无人机", valid: "永久有效", enabled: true },
  { id: "WL-00176", model: "Autel EVO II", serial: "AUT-EVO2-009816", note: "园区安防巡逻", valid: "2027-12-31 23:59", enabled: true },
  { id: "WL-00132", model: "DJI Matrice 30", serial: "1581F6GKD7732P", note: "应急测绘专用", valid: "2026-11-30 18:00", enabled: true },
  { id: "WL-00098", model: "DJI Air 3", serial: "1581F4XCA0087L", note: "合作单位备案", valid: "已过期", enabled: false },
];

function AnalyticsPage() {
  const [period, setPeriod] = useState("近7天");
  const [showDateRange,setShowDateRange] = useState(false);
  const [dateRange,setDateRange] = useState({start:"2025-07-11",end:"2025-07-17"});
  const [rankMode, setRankMode] = useState<"model" | "frequency">("model");
  const [exporting,setExporting]=useState(false);
  const [reportError,setReportError]=useState("");
  const multipliers: Record<string, number> = { "今日": .22, "近7天": 1, "近1个月": 3.8, "近3个月": 9.6, "全部": 18.4 };
  const multiplier = multipliers[period] ?? Math.max(1,(Date.parse(dateRange.end)-Date.parse(dateRange.start))/86400000+1)/7;
  const localToday = new Date().toLocaleDateString("sv-SE");
  const trendAxis = buildTrendAxis(period,dateRange,localToday,historyRows.reduce((first,row)=>row.time.slice(0,10)<first?row.time.slice(0,10):first,localToday));
  const trend = trendAxis.buckets.map((_,index) => Math.round([28,42,35,61,49,73,57][index%7]*multiplier*7/trendAxis.buckets.length));
  const trendPoints=limitTrendBuckets(trendAxis.buckets,trend,period==="今日"||period==="近7天"?trend.length:10);
  const trendMax=Math.max(1,...trendPoints.map(point=>point.value));
  const linePoints=trendPoints.map((point,index)=>[(index+.5)/trendPoints.length*1000,220-point.value/trendMax*180]);
  const linePath=linePoints.map(([x,y],index)=>(index?"L":"M")+x+","+y).join(" ");
  return <>
    <Header />
    <main className="content analytics-page">{reportError&&<PreviewDialog title="报告导出失败" onClose={()=>setReportError("")}><p>{reportError}</p><footer><button onClick={()=>setReportError("")}>知道了</button></footer></PreviewDialog>}{showDateRange&&<DateRangeDialog start={dateRange.start} end={dateRange.end} onClose={()=>setShowDateRange(false)} onApply={(start,end)=>{setDateRange({start,end});setPeriod("自定义时间范围");setShowDateRange(false)}}/>}
      <section className="analytics-toolbar">
        <div className="period-switch">{[...Object.keys(multipliers),"自定义时间范围"].map(item => <button className={period === item ? "active" : ""} onClick={() => item === "自定义时间范围" ? setShowDateRange(true) : setPeriod(item)} key={item}>{item}</button>)}</div>
        {period === "自定义时间范围" && <span className="analytics-date">{dateRange.start} 至 {dateRange.end}</span>}
        <button className="report-export" disabled={exporting} onClick={async()=>{setExporting(true);setReportError("");try{await exportReports({period,start:trendAxis.start,end:trendAxis.end,unit:trendAxis.unit,trend:trendPoints,total:Math.round(286*multiplier),detections:Math.round(1248*multiplier),responses:Math.round(42*multiplier),success:96.8,models:[["DJI Mavic 3",92],["DJI Air 3",76],["Autel EVO II",61],["DJI Mini 4 Pro",44],["未知机型",27],["DJI Matrice 30",24],["Parrot Anafi",19],["DJI Avata 2",15],["Skydio 2+",12],["FPV 自组机",9]],frequencies:[["400MHz",86],["900MHz",69],["1.4GHz",53],["2.4GHz",44],["5.2GHz",31],["5.8GHz",24],["其他",18]]});}catch(error){setReportError("导出失败："+(error as Error).message)}finally{setExporting(false)}}}><Icon name="download" size={18}/> {exporting?"正在导出…":"导出报告"}</button>
      </section>
      <section className="analytics-kpis">
        <StatCard icon="drone" label="探测总架次" value={String(Math.round(286 * multiplier))} suffix=" 架次" tone="blue" note="较上一周期 +12.5%" />
        <StatCard icon="signal" label="探测总次数" value={String(Math.round(1248 * multiplier))} suffix=" 次" tone="purple" note="日均 178.3 次" />
        <StatCard icon="radar" label="解析成功率" value="96.8" suffix=" %" tone="green" note="持续稳定运行" />
        <StatCard icon="shield" label="反制次数" value={String(Math.round(42 * multiplier))} suffix=" 次" tone="red" note="处置成功率 100%" />
      </section>
      <section className="analytics-grid">
        <article className="trend-panel">
          <div className="analytics-panel-title"><div><strong>探测趋势</strong><span>{period} · 按{trendAxis.unit}统计</span></div><em><i/>探测架次</em></div>
          <div className="trend-chart-scroll" key={period+trendAxis.start+trendAxis.end} aria-label={`探测趋势，按${trendAxis.unit}统计，${trendAxis.start}至${trendAxis.end}`}><div className="trend-line-chart" style={{minWidth:trendPoints.length*72}}><svg viewBox="0 0 1000 240" preserveAspectRatio="none" aria-label="探测折线趋势图" role="img"><path className="trend-line-area" d={linePath+` L${linePoints.at(-1)?.[0]??0},240 L${linePoints[0]?.[0]??0},240 Z`}/><path className="trend-line-path" d={linePath}/></svg>{trendPoints.map((point,index)=><div className="trend-line-node" key={point.start} title={`${point.start} 至 ${point.end}：${point.value} 架次`}><i style={{bottom:`${(240-linePoints[index][1])/240*100}%`}}/><b style={{bottom:`calc(${(240-linePoints[index][1])/240*100}% + 12px)`}}>{point.value}</b><span>{point.label}</span></div>)}</div></div>
        </article>
        <article className="model-panel">
          <div className="analytics-panel-title"><div><strong>{rankMode === "model" ? "机型排行榜" : "频段排行榜"}</strong><span>{rankMode === "model" ? "按探测次数降序" : "按频段探测次数统计"}</span></div><div className="rank-tabs"><button className={rankMode === "model" ? "active" : ""} onClick={() => setRankMode("model")}>机型</button><button className={rankMode === "frequency" ? "active" : ""} onClick={() => setRankMode("frequency")}>频率</button></div></div>
          <div className="model-ranking">{(rankMode === "model" ? [["DJI Mavic 3",92],["DJI Air 3",76],["Autel EVO II",61],["DJI Mini 4 Pro",44],["未知机型",27],["DJI Matrice 30",24],["Parrot Anafi",19],["DJI Avata 2",15],["Skydio 2+",12],["FPV 自组机",9]] : [["400MHz",86],["900MHz",69],["1.4GHz",53],["2.4GHz",44],["5.2GHz",31],["5.8GHz",24],["其他",18]]).map(([name,value], index) => <div key={name}><b>{index + 1}</b><span><strong>{name}</strong><i><em style={{ width: `${value}%` }}/></i></span><em>{value} 次</em></div>)}</div>
        </article>
        <article className="frequency-panel">
          <div className="analytics-panel-title"><div><strong>时段分布</strong><span>24 小时入侵活跃度</span></div></div>
          <div className="time-trend-chart"><svg viewBox="0 0 720 180" preserveAspectRatio="none" aria-label="24 小时无人机活动趋势"><defs><linearGradient id="timeTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#55dff2" stopOpacity=".38"/><stop offset="100%" stopColor="#55dff2" stopOpacity="0"/></linearGradient></defs><path className="trend-area" d="M0 150 L30 145 L60 148 L90 142 L120 138 L150 130 L180 125 L210 119 L240 108 L270 92 L300 104 L330 112 L360 118 L390 105 L420 91 L450 76 L480 53 L510 28 L540 38 L570 62 L600 85 L630 110 L660 128 L690 140 L720 145 L720 180 L0 180 Z"/><polyline points="0,150 30,145 60,148 90,142 120,138 150,130 180,125 210,119 240,108 270,92 300,104 330,112 360,118 390,105 420,91 450,76 480,53 510,28 540,38 570,62 600,85 630,110 660,128 690,140 720,145"/></svg><div className="time-axis">{["00:00","04:00","08:00","12:00","16:00","20:00","24:00"].map(time => <span key={time}>{time}</span>)}</div><div className="peak-label">18:00–22:00 高发时段</div></div>
        </article>
        <article className="ai-summary">
          <div className="ai-summary-head"><span><Icon name="chart" size={22}/></span><div><strong>AI 智能总结</strong><small>仅用于参考</small></div><b>实时更新</b></div>
          <div className="ai-summary-body"><p>本周期（2026.10.01-2026.10.07）共发现 <b>286</b> 架次无人机活动，其中DJI Mavic 3机型出现频率最高，占比30%，出现92次；DJI Air 3占比25%，出现76次；Autel EVO II占比20%；出现61次。无人机目标主要集中在每日 18:00–22:00，南侧物流园方向活动频次较上一周期明显上升。</p><div><strong>防控建议</strong><span>建议在晚间18:00-22:00飞行高发时段启用自动反制预案，并将南侧警戒半径由 3.0km 提升至 4.5km；持续核验 3 架高频未知目标身份。</span></div></div>
        </article>
      </section>

    </main>
  </>;
}

function WhitelistPage() {
  const { rows, setRows } = useSystemState();
  const [search, setSearch] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editorRow,setEditorRow] = useState<import("./SystemState").WhitelistRow|undefined>(undefined);
  const [showImport, setShowImport] = useState(false);
  const [importMode, setImportMode] = useState<"local" | "remote">("local");
  const [confirmClear, setConfirmClear] = useState(false);
  const [selectedWhitelistIds, setSelectedWhitelistIds] = useState<string[]>([]);
  const visibleRows = rows.filter(row => `${row.model}${row.serial}${row.note}`.toLowerCase().includes(search.toLowerCase()));

  return <>
    <Header />
    <main className="content whitelist-page">
      <section className="whitelist-summary">
        <div><span className="summary-icon"><Icon name="shield" size={25}/></span><p><strong>{rows.filter(row => row.enabled).length}</strong><span>已启用目标</span></p></div>
        <div><span className="summary-icon warning"><Icon name="history" size={25}/></span><p><strong>{rows.filter(row => row.valid === "已过期").length}</strong><span>已过期授权</span></p></div>
      </section>
      <section className="whitelist-console">
        <header className="whitelist-toolbar"><div><span>共 {rows.length} 条授权记录</span></div><label><Icon name="search" size={18}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="搜索机型、SN 或备注"/></label><button onClick={() => setShowImport(true)}><Icon name="upload" size={17}/> 批量导入</button><button className="danger-outline" disabled={!selectedWhitelistIds.length} onClick={() => setConfirmClear(true)}><Icon name="trash" size={17}/> 批量删除{selectedWhitelistIds.length ? `（${selectedWhitelistIds.length}）` : ""}</button><button className="primary-action" onClick={() => {setEditorRow(undefined);setShowEditor(true)}}><Icon name="plus" size={18}/> 新增白名单</button></header>
        <div className="whitelist-table">
          <div className="whitelist-table-head"><span className="whitelist-select-cell"><input aria-label="全选当前白名单" type="checkbox" checked={visibleRows.length > 0 && visibleRows.every(row => selectedWhitelistIds.includes(row.id))} onChange={event => setSelectedWhitelistIds(event.target.checked ? visibleRows.map(row => row.id) : [])}/></span><span>无人机信息</span><span>SN 序列号</span><span>备注</span><span>有效周期</span><span>状态</span><span>操作</span></div>
          {visibleRows.map(row => <div className={`whitelist-table-row ${selectedWhitelistIds.includes(row.id) ? "selected" : ""}`} key={row.id}><span className="whitelist-select-cell"><input aria-label={`选择 ${row.model}`} type="checkbox" checked={selectedWhitelistIds.includes(row.id)} onChange={event => setSelectedWhitelistIds(ids => event.target.checked ? [...ids, row.id] : ids.filter(id => id !== row.id))}/></span><span className="whitelist-model"><i><Icon name="drone" size={22}/></i><span><strong>{row.model}</strong><small>{row.id}</small></span></span><code>{row.serial}</code><span>{row.note}</span><span className={row.valid === "已过期" ? "expired" : ""}>{row.startsAt ? `${row.startsAt.replace("T"," ")} 至 ${row.valid}` : row.valid}</span><span><button className={`toggle ${row.enabled ? "on" : ""}`} onClick={() => setRows(current => current.map(item => item.id === row.id ? {...item, enabled: !item.enabled} : item))}><i/></button><em>{row.enabled ? "启用" : "停用"}</em></span><span className="row-actions"><button onClick={() => {setEditorRow(row);setShowEditor(true)}}>编辑</button><button onClick={() => { if (window.confirm("确认删除该白名单记录？")) { setRows(current => current.filter(item => item.id !== row.id)); setSelectedWhitelistIds(ids => ids.filter(id => id !== row.id)); } }}>删除</button></span></div>)}
          {!visibleRows.length && <div className="whitelist-empty"><Icon name="search" size={30}/><strong>未找到匹配目标</strong><span>请调整搜索关键词后重试</span></div>}
        </div>
      </section>
      {showEditor && <TrustEditor entry={editorRow} onClose={()=>setShowEditor(false)}/>}
      {showImport && <div className="event-detail-overlay" onClick={() => setShowImport(false)}><section className="whitelist-modal import-modal compact-import-modal" onClick={event => event.stopPropagation()}><div className="event-detail-head"><div><strong>批量导入白名单</strong></div><button onClick={() => setShowImport(false)}>×</button></div><div className="import-choice"><button className={importMode === "local" ? "active" : ""} onClick={() => setImportMode("local")}><i/>本地导入</button>{importMode === "local" && <div className="local-import-content"><label><Icon name="upload" size={17}/> 上传文件<input type="file" accept=".xlsx,.xls,.xlsm"/></label><small>支持 .xlsx、.xls、.xlsm 格式，单文件大小不超过10M。</small></div>}<button className={importMode === "remote" ? "active" : ""} onClick={() => setImportMode("remote")}><i/>离线导入</button><div className={`lan-address ${importMode === "remote" ? "active" : ""}`}><Icon name="signal" size={24}/><div><span>同一局域网 PC 访问地址</span><strong>http://192.168.10.217:8088</strong></div></div></div><div className="modal-actions"><button>下载模板</button><button onClick={() => setShowImport(false)}>完成</button></div></section></div>}
      {confirmClear && <div className="event-detail-overlay"><section className="confirm-dialog"><span><Icon name="trash" size={28}/></span><strong>确认删除所选白名单？</strong><p>将删除已选择的 {selectedWhitelistIds.length} 条授权记录，此操作不可撤销。</p><div><button onClick={() => setConfirmClear(false)}>取消</button><button onClick={() => { setRows(current => current.filter(row => !selectedWhitelistIds.includes(row.id))); setSelectedWhitelistIds([]); setConfirmClear(false); }}>确认删除</button></div></section></div>}
    </main>
  </>;
}

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return <button aria-label="切换设置" onClick={() => setOn(!on)} className={`toggle ${on ? "on" : ""}`}><i /></button>;
}

const settingsCategories: { name: string; desc: string; icon: IconName }[] = [
  { name: "通用设置", desc: "主题、网络与提醒", icon: "settings" },
  { name: "个性化设置", desc: "显示与数据偏好", icon: "layers" },
  { name: "参数设置", desc: "探测与设备参数", icon: "radar" },
  { name: "存储设置", desc: "容量与存储路径", icon: "database" },
  { name: "关于", desc: "设备、升级与工具", icon: "shield" },
];

function SettingItem({ icon, title, desc, children }: { icon: IconName; title: string; desc?: string; children?: React.ReactNode }) {
  return <div className="setting-item"><div className="setting-item-icon"><Icon name={icon} size={20} /></div><div className="setting-item-copy"><strong>{title}</strong>{desc && <span>{desc}</span>}</div><div className="setting-item-control">{children ?? <Icon name="chevron" size={17} />}</div></div>;
}

function SettingsPage() {
  const [category, setCategory] = useState("通用设置");
  const [brightness, setBrightness] = useState(72);
  const [coordinateType, setCoordinateType] = useState("十进制 DD");
  const [coordinateOrder, setCoordinateOrder] = useState("[经度，纬度]");
  const [apiProtocol, setApiProtocol] = useState("MQTT Protobuf API");
  const activeCategory = settingsCategories.find(item => item.name === category) ?? settingsCategories[0];
  const pageContent = (() => {
    if (category === "通用设置") return <div className="settings-sections">
      <section><h3>外观与语言</h3><SettingItem icon="layers" title="界面主题" desc="默认深色军警主题"><select><option>深色主题</option><option>浅色主题</option></select></SettingItem><SettingItem icon="settings" title="系统语言" desc="当前：简体中文"><select><option>简体中文</option><option>English</option></select></SettingItem><SettingItem icon="temperature" title="屏幕亮度" desc={`当前亮度 ${brightness}%`}><div className="brightness-control"><input type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}/><b>{brightness}%</b></div></SettingItem><SettingItem icon="battery" title="屏幕常亮" desc="执勤期间保持屏幕持续点亮"><Toggle/></SettingItem></section>
      <section><h3>网络连接</h3><SettingItem icon="signal" title="WiFi" desc="SKY-SHIELD-5G · 信号优"><Toggle/></SettingItem><SettingItem icon="signal" title="移动网络" desc="4G · 中国移动 · 已连接"><Toggle/></SettingItem><SettingItem icon="signal" title="以太网" desc="192.168.10.217 · DHCP"><button className="outline-setting-button">参数配置</button></SettingItem></section>
      <section><h3>声音与提醒</h3><SettingItem icon="bell" title="告警音量" desc="高危目标声音告警"><div className="brightness-control"><input type="range" min="0" max="100" defaultValue="80"/><b>80%</b></div></SettingItem><SettingItem icon="bell" title="振动提醒" desc="告警时同步触发设备振动"><Toggle/></SettingItem><SettingItem icon="bell" title="操作提示音" desc="触控与操作结果声音反馈"><Toggle/></SettingItem></section>
      <section><h3>位置设置</h3><SettingItem icon="locate" title="定位模式" desc="卫星与网络联合定位"><select><option>卫星+网络定位</option><option>卫星定位</option><option>网络定位</option></select></SettingItem><SettingItem icon="locate" title="定位方式" desc="自动获取当前位置"><select><option>自动定位</option><option>手动定位</option></select></SettingItem><SettingItem icon="locate" title="手动经纬度" desc="自动模式下不可编辑"><button className="outline-setting-button">121.52352，31.105621</button></SettingItem></section>
    </div>;
    if (category === "个性化设置") return <div className="settings-sections">
      <section><h3>目标数据展示</h3><SettingItem icon="database" title="设备 eID" desc="eID-CN-SH-0217"><button className="outline-setting-button">编辑 eID</button></SettingItem><SettingItem icon="locate" title="经纬度格式" desc={coordinateType}><select value={coordinateType} onChange={event => setCoordinateType(event.target.value)}><option>十进制 DD</option><option>度分秒 DMS</option></select></SettingItem><SettingItem icon="drone" title="显示 DJI 未解密数据" desc="将未解密信号纳入探测结果"><Toggle/></SettingItem></section>
      <section><h3>地图与控制</h3><SettingItem icon="layers" title="地图图标自动清除" desc="信号消失后自动移除地图目标"><Toggle/></SettingItem><SettingItem icon="history" title="自动清除时长" desc="范围 1–300 秒"><label className="number-input"><input defaultValue="180"/> 秒</label></SettingItem><SettingItem icon="radar" title="显示探测控制" desc="在首页显示探测模块总开关"><Toggle/></SettingItem></section>
    </div>;
    if (category === "显示设置") return <div className="settings-sections display-settings-stack">
      <section><h3>屏幕显示</h3><SettingItem icon="temperature" title="屏幕亮度" desc={`当前亮度 ${brightness}%`}><div className="brightness-control"><input type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /><b>{brightness}%</b></div></SettingItem><SettingItem icon="battery" title="屏幕常亮" desc="保持控制屏幕持续点亮"><Toggle /></SettingItem><SettingItem icon="radar" title="显示探测控制开关" desc="在探测首页展示运行控制"><Toggle /></SettingItem><SettingItem icon="layers" title="地图图标自动清除" desc="目标图标在离场后自动清除"><Toggle /></SettingItem><SettingItem icon="history" title="图标清除延时" desc="范围 1–300 秒，建议 180 秒"><label className="number-input"><input defaultValue="20" /> 秒</label></SettingItem></section>
      <section><h3>告警详情显示配置</h3><SettingItem icon="drone" title="显示未解密 DJI 结果" desc="未解密的 DJI 信号显示为无人机结果"><Toggle /></SettingItem><SettingItem icon="database" title="eID 展示" desc="侦测弹窗展示飞手 eID 信息"><Toggle /></SettingItem><SettingItem icon="locate" title="经纬度格式" desc={`${coordinateType} · ${coordinateOrder}`}><span className="status-link">在下方配置</span></SettingItem>
        <div className="coordinate-config"><div><strong>经纬度类型</strong>{["十进制 DD", "度分 DDM", "度分秒 DMS"].map(item => <button className={coordinateType === item ? "active" : ""} onClick={() => setCoordinateType(item)} key={item}><span>{item}</span><small>{item === "十进制 DD" ? "121.4737, 31.2304" : item === "度分 DDM" ? "E121°28.422′ N31°13.824′" : "E121°28′25.32″ N31°13′49.44″"}</small><b>✓</b></button>)}</div><div><strong>经纬度顺序</strong>{["[经度，纬度]", "[纬度，经度]"].map(item => <button className={coordinateOrder === item ? "active" : ""} onClick={() => setCoordinateOrder(item)} key={item}><span>{item}</span><b>✓</b></button>)}</div></div>
      </section>
    </div>;
    if (category === "网络设置") return <div className="settings-sections"><section><h3>网络连接</h3><SettingItem icon="signal" title="有线网络" desc="已连接 · 192.168.10.217"><span className="online-state">连接正常</span></SettingItem><SettingItem icon="signal" title="无线网络" desc="SKY-SHIELD-5G · 信号优"><Toggle /></SettingItem><SettingItem icon="settings" title="网络参数" desc="DHCP 自动获取"><button className="outline-setting-button">高级设置</button></SettingItem></section><section><h3>远程服务</h3><SettingItem icon="database" title="远程运维通道" desc="仅允许授权服务端访问"><Toggle initial={false} /></SettingItem><SettingItem icon="shield" title="连接加密" desc="TLS 1.3"><span className="online-state">已启用</span></SettingItem></section></div>;
    if (category === "告警设置") return <div className="settings-sections"><section><h3>告警策略</h3>{[["高危目标声音告警","发现高危目标后循环播放警报音"],["中危目标弹窗提醒","即时推送到当前操作终端"],["设备离线告警","模块离线超过 10 秒时告警"],["越界告警","目标进入核心防区时立即告警"]].map(([title,desc],i)=><SettingItem icon="bell" title={title} desc={desc} key={title}><Toggle initial={i !== 1} /></SettingItem>)}</section><section><h3>免打扰</h3><SettingItem icon="history" title="夜间免打扰" desc="22:00 至次日 07:00 仅保留高危告警"><Toggle initial={false} /></SettingItem></section></div>;
    if (category === "白名单设置") return <div className="settings-sections"><section><div className="section-heading-row"><h3>可信目标</h3><button className="add-setting-button">＋ 添加白名单</button></div>{[["WL-00218","物流园巡检无人机","DJI Mavic 3"],["WL-00176","园区安防无人机","Autel EVO II"],["WL-00132","应急测绘无人机","DJI Matrice 30"]].map(row=><div className="whitelist-row" key={row[0]}><div className="setting-item-icon"><Icon name="drone" size={20}/></div><div><strong>{row[1]}</strong><span>{row[0]} · {row[2]}</span></div><em>长期有效</em><button>编辑</button><button className="danger-text">移除</button></div>)}</section></div>;
    if (category === "位置设置") return <div className="settings-sections"><section><h3>设备位置</h3><SettingItem icon="locate" title="定位服务" desc="GPS / 北斗联合定位"><Toggle /></SettingItem><SettingItem icon="locate" title="当前坐标" desc="121.52352，31.105621"><span className="online-state">精度 ±1.2m</span></SettingItem><SettingItem icon="layers" title="地图基准" desc="GCJ-02"><select><option>GCJ-02</option><option>WGS-84</option></select></SettingItem></section><section><h3>核心防区</h3><SettingItem icon="shield" title="防区中心" desc="以上海青浦园区为中心"><button className="outline-setting-button">地图选点</button></SettingItem><SettingItem icon="radar" title="防区半径" desc="触发越界告警的核心范围"><label className="number-input"><input defaultValue="3.0"/> km</label></SettingItem></section></div>;
    if (category === "参数设置") return <div className="settings-sections"><section><h3>散热与工作模式</h3><SettingItem icon="temperature" title="自动散热模式" desc="机身达到 55°C 自动启动风扇"><Toggle/></SettingItem><SettingItem icon="temperature" title="风扇手动控制" desc="当前转速 0 RPM"><Toggle initial={false}/></SettingItem><SettingItem icon="radar" title="工作模式" desc="探测与解码协同运行"><select><option>双模式</option><option>解码模式</option><option>探测模式</option></select></SettingItem></section><section><h3>探测参数</h3><SettingItem icon="signal" title="探测增益" desc="接收信号放大等级"><select><option>高增益</option><option>中增益</option><option>低增益</option></select></SettingItem><SettingItem icon="radar" title="探测灵敏度" desc="弱信号目标识别灵敏度"><select><option>高</option><option>中</option><option>低</option></select></SettingItem><SettingItem icon="drone" title="飞行高度告警阈值" desc="低于阈值触发低空告警"><label className="number-input"><input defaultValue="120"/> m</label></SettingItem></section><section><h3>频率列表管理</h3><div className="frequency-tags">{["433M","915M","1.2G","1.5G","2.4G","5.2G","5.8G"].map(item => <button key={item}>{item}<b>×</b></button>)}<button className="add-frequency">＋ 添加频段</button></div></section><section><h3>机型库与忽略列表</h3><SettingItem icon="download" title="WiFi 机型库" desc="版本 2026.10.18"><button className="outline-setting-button">检查升级</button></SettingItem><SettingItem icon="download" title="无人机机型库" desc="12,842 个识别特征"><button className="outline-setting-button">升级机型库</button></SettingItem><SettingItem icon="list" title="探测忽略列表" desc="已配置 6 条忽略特征"><button className="outline-setting-button">管理列表</button></SettingItem></section></div>;
    if (category === "存储设置") return <div className="storage-page"><div className="storage-overview">{[["内置磁盘","256 GB","168 GB","88 GB",66],["SD 卡","512 GB","124 GB","388 GB",24]].map(([name,total,used,free,percent]) => <article key={String(name)}><div><Icon name="database" size={25}/><span><strong>{name}</strong><small>可用空间 {free}</small></span><b>{percent}%</b></div><i><em style={{width:`${percent}%`}}/></i><p><span>总空间 {total}</span><span>已使用 {used}</span></p></article>)}</div><section className="storage-categories"><h3>分类占用</h3>{[["地图数据","68.4 GB",42],["视频与图片","39.8 GB",25],["文档","8.2 GB",5],["数据记录","31.6 GB",19],["其他","20.0 GB",9]].map(([name,size,percent]) => <div key={String(name)}><span>{name}<b>{size}</b></span><i><em style={{width:`${percent}%`}}/></i></div>)}</section><section className="storage-config"><h3>存储策略与路径</h3><SettingItem icon="history" title="循环存储周期" desc="超期数据自动覆盖"><label className="number-input"><input defaultValue="365"/> 天</label></SettingItem>{[["地图","/storage/internal/maps"],["视频与图片","/storage/sdcard/media"],["文档","/storage/internal/documents"],["日志","/storage/internal/logs"]].map(([name,path]) => <SettingItem icon="database" title={`${name}存储路径`} desc={path} key={name}><button className="outline-setting-button">更改</button></SettingItem>)}</section></div>;
    if (category === "接口设置") return <div className="standalone-api-settings"><div className="api-panel"><div className="api-heading"><div><strong>接口设置</strong><span>数据推送 API</span></div><b>4 个协议</b></div><div className="api-protocols">{["MQTT Protobuf API","MQTT JSON API","HTTP API","ZMQ API"].map(protocol=><button className={apiProtocol === protocol ? "active" : ""} onClick={() => setApiProtocol(protocol)} key={protocol}><span>API</span><div><strong>{protocol}</strong><small>{protocol.includes("MQTT") ? "消息队列遥测传输" : "第三方平台数据接口"}</small></div><Icon name="chevron" size={17}/></button>)}</div><div className="api-config"><h3>{apiProtocol}</h3><SettingItem icon="signal" title="数据推送" desc="已开启"><Toggle /></SettingItem><SettingItem icon="search" title="显示平台数据" desc="在当前系统中展示平台数据"><Toggle /></SettingItem><SettingItem icon="database" title="目标平台" desc="当前：测试平台"><select><option>测试平台</option><option>生产平台</option></select></SettingItem><SettingItem icon="settings" title="主题" desc="xunuo"><button className="outline-setting-button">编辑</button></SettingItem><SettingItem icon="drone" title="启用无人机登记" desc="向平台同步实名登记信息"><Toggle /></SettingItem></div></div></div>;
    if (category === "应用管理") return <div className="application-settings apps-only"><div className="app-list-panel"><h3>应用与服务</h3>{[["相机与图库","图像与视频文件管理","drone"],["无线投屏","投射当前控制界面","signal"],["数据文件管理","导入、导出及清理数据","database"],["高德地图","地图服务与离线数据","layers"],["南山对讲","现场语音协同","signal"],["用户协议","服务条款","shield"],["隐私协议","数据与隐私说明","shield"]].map(([title,desc,icon])=><button key={title}><span className="setting-item-icon"><Icon name={icon as IconName} size={20}/></span><span><strong>{title}</strong><small>{desc}</small></span><Icon name="chevron" size={17}/></button>)}</div></div>;
    return <div className="about-page"><div className="about-brand"><div><Icon name="shield" size={44}/></div><span><strong>御穹反无人机防御系统</strong><small>SKY SHIELD CONTROL SYSTEM</small></span><b>PRO</b></div><div className="about-grid">{[["软件版本","v3.6.2"],["AID","e659bf29"],["设备 ID","300783419"],["SN","pz-5"],["VID","20303XH2LP-TV1.0"],["BID","AR-A118-V1.0-20260724"]].map(([key,value])=><div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div><div className="about-sections"><section className="about-actions"><h3>升级管理</h3><SettingItem icon="download" title="在线软件升级" desc="当前 v3.6.2 · 支持回滚上一版本"><button className="outline-setting-button">检查更新</button></SettingItem><SettingItem icon="bell" title="推送升级" desc="自动检测程序包，升级前需确认"><Toggle/></SettingItem><SettingItem icon="download" title="离线升级" desc="PC 访问 http://192.168.10.217:8080"><button className="outline-setting-button">启动服务</button></SettingItem><SettingItem icon="upload" title="本地升级包" desc="支持本地选择并校验升级包"><button className="outline-setting-button">选择文件</button></SettingItem><SettingItem icon="database" title="固件 / RID 库 / 机型库" desc="各组件独立升级与版本管理"><button className="outline-setting-button">升级管理</button></SettingItem></section><section className="about-actions system-tools"><h3>系统工具</h3><SettingItem icon="document" title="调试日志" desc="记录底层模块运行日志"><Toggle initial={false}/></SettingItem><SettingItem icon="trash" title="清空历史数据" desc="删除探测、轨迹及处置记录"><button className="danger-button" onClick={() => window.confirm("确认清空全部历史数据？此操作不可撤销。")}>清空数据</button></SettingItem><SettingItem icon="settings" title="恢复出厂设置" desc="重置全部配置并删除本地数据"><button className="danger-button" onClick={() => window.confirm("确认恢复出厂设置？")}>恢复出厂</button></SettingItem></section></div></div>;
  })();
  return <>
    <Header />
    <main className="content settings-page">
      <div className="settings-console">
        <aside className="settings-nav"><div className="settings-nav-head"><strong>系统设置</strong><small>设备与应用配置中心</small></div>{settingsCategories.map(item => <button className={category === item.name ? "active" : ""} onClick={() => setCategory(item.name)} key={item.name}><span><Icon name={item.icon} size={19}/></span><div><strong>{item.name}</strong><small>{item.desc}</small></div><Icon name="chevron" size={15}/>{item.name === "关于" && <i/>}</button>)}</aside>
        <section className="settings-workspace"><div className="workspace-heading"><div className="setting-icon"><Icon name={activeCategory.icon} size={23}/></div><div><strong>{activeCategory.name}</strong><span>{activeCategory.desc}</span></div></div><div className="settings-scroll">{pageContent}</div></section>
      </div>
    </main>
  </>;
}

const redesignedSettingsCategories: { name: string; desc: string; icon: IconName }[] = [
  { name: "通用", desc: "主题、显示与设备基础能力", icon: "settings" },
  { name: "网络", desc: "WLAN、VPN 与私人 DNS", icon: "signal" },
  { name: "界面展示设置", desc: "探测界面与详情展示参数", icon: "layers" },
  { name: "告警设置", desc: "各识别类型告警反馈", icon: "bell" },
  { name: "参数设置", desc: "服务器、增益与工作模式", icon: "radar" },
  { name: "配置列表", desc: "频率与机型特征库管理", icon: "list" },
  { name: "关于", desc: "版本、升级与系统工具", icon: "shield" },
];

function RedesignedSettingsPage() {
  const { threshold, setThreshold, debugEnabled, setDebugEnabled, setDeletedHistory } = useSystemState();
  const [category, setCategory] = useState("通用");
  const [mobileSettingsDetail,setMobileSettingsDetail]=useState(false);
  const [configModal,setConfigModal] = useState<string|null>(null);
  const [detailView, setDetailView] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(72);
  const [autoLocation, setAutoLocation] = useState(true);
  const [autoClear, setAutoClear] = useState(true);
  const [clearDelay, setClearDelay] = useState(180);
  const [coordinateType, setCoordinateType] = useState("十进制 DD");
  const [coordinateOrder, setCoordinateOrder] = useState("[经度，纬度]");
  const [customServer, setCustomServer] = useState(false);
  const [gain, setGain] = useState(35);
  const [altitudeUnit, setAltitudeUnit] = useState("米");
  const activeCategory = redesignedSettingsCategories.find(item => item.name === category) ?? redesignedSettingsCategories[0];
  const openCategory = (name: string) => {
    setCategory(name);
    setMobileSettingsDetail(true);
    setDetailView(null);
  };

  const networkView = <div className="settings-drilldown"><section className="network-status-card"><SettingItem icon="signal" title="WLAN" desc="Terjin_Guest · 已连接"><Toggle /></SettingItem><SettingItem icon="signal" title="移动网络" desc="SIM 卡未插入"><span className="muted-state">不可用</span></SettingItem><SettingItem icon="drone" title="飞行模式" desc="关闭全部无线通信"><Toggle initial={false} /></SettingItem></section><section><h3>高级网络</h3><NetworkAdvancedSettings /><SettingItem icon="signal" title="以太网" desc="192.168.10.217 · DHCP"><span className="online-state">已连接</span></SettingItem><SettingItem icon="signal" title="网口共存" desc="开启或关闭后需要重启设备"><Toggle initial={false} /></SettingItem></section></div>;

  const coordinateView = <div className="settings-drilldown coordinate-drilldown"><section><h3>经纬度类型</h3><div className="coordinate-choice-list">{[["十进制 DD","121.4737, 31.2304"],["度分 DDM","E121°28.422′ N31°13.824′"],["度分秒 DMS","E121°28′25.32″ N31°13′49.44″"]].map(([name,example]) => <button className={coordinateType === name ? "active" : ""} onClick={() => setCoordinateType(name)} key={name}><span><strong>{name}</strong><small>数据示例：{example}</small></span><b>✓</b></button>)}</div></section><section><h3>经纬度顺序</h3><div className="coordinate-choice-list compact">{["[经度，纬度]","[纬度，经度]"].map(item => <button className={coordinateOrder === item ? "active" : ""} onClick={() => setCoordinateOrder(item)} key={item}><strong>{item}</strong><b>✓</b></button>)}</div></section></div>;


  const upgradeView = <CompactUpgradeManager/>;

  const inlineSetting = (name: string, icon: IconName, desc: string, panel: React.ReactNode) => {
    const expanded = detailView === name;
    const panelId = 'settings-panel-' + name;
    return <div className="settings-accordion" key={name}>
      <SettingItem icon={icon} title={name} desc={desc}>
        <button className="setting-link accordion-trigger" aria-label={name + (expanded ? '收起' : '展开')} aria-expanded={expanded} aria-controls={panelId} onClick={() => setDetailView(current => current === name ? null : name)}>
          {expanded ? '收起' : '展开'}<DisclosureChevron expanded={expanded}/>
        </button>
      </SettingItem>
      <div id={panelId} className="settings-accordion-panel" hidden={!expanded}>{panel}</div>
    </div>;
  };

  const content = (() => {
    if (category === "网络") return <div className="settings-sections redesigned-settings"><section><h3>网络和互联网</h3>{networkView}</section></div>;
    if (category === "通用") return <div className="settings-sections redesigned-settings"><AppearanceSettings/><DisplayModes/><section><h3>音量</h3>{[["媒体音量",78],["通话音量",64],["铃声和通知音量",72],["闹钟音量",80]].map(([name,value]) => <SettingItem icon="bell" title={String(name)} key={String(name)}><div className="range-setting"><input type="range" min="0" max="100" defaultValue={Number(value)}/><b>{value}%</b></div></SettingItem>)}</section><section><h3>风扇</h3><SettingItem icon="temperature" title="自动散热" desc="根据设备温度自动调整风扇"><Toggle /></SettingItem></section><section><h3>位置</h3><SettingItem icon="locate" title="定位模式" desc="选择设备定位数据来源"><select><option>卫星+网络定位</option><option>卫星定位</option><option>网络定位</option></select></SettingItem><SettingItem icon="locate" title="自动定位" desc="自动获取当前设备位置"><button aria-label="自动定位开关" onClick={() => setAutoLocation(value => !value)} className={`toggle ${autoLocation ? "on" : ""}`}><i/></button></SettingItem>{!autoLocation && <div className="manual-location"><label>经度<input defaultValue="121.52352"/></label><label>纬度<input defaultValue="31.105621"/></label></div>}</section><StorageSettings/></div>;
    if (category === "界面展示设置") return <div className="settings-sections redesigned-settings"><section><h3>探测界面</h3><SettingItem icon="radar" title="反制面板显示" desc="在探测首页显示反制控制面板"><Toggle /></SettingItem><SettingItem icon="layers" title="地图图标自动清除" desc="目标离场后自动清除地图图标"><button aria-label="地图图标自动清除开关" onClick={() => setAutoClear(value => !value)} className={`toggle ${autoClear ? "on" : ""}`}><i/></button></SettingItem>{autoClear && <SettingItem icon="history" title="自动清除时长" desc="支持 0–180 秒"><div className="range-setting"><input type="range" min="0" max="180" value={clearDelay} onChange={event => setClearDelay(Number(event.target.value))}/><b>{clearDelay}s</b></div></SettingItem>}</section><section><h3>告警详情显示</h3><SettingItem icon="drone" title="显示未解密 DJI 结果" desc="开启后，未解密的 DJI 信号会显示为无人机结果"><Toggle initial={false}/></SettingItem><SettingItem icon="database" title="eID 展示" desc="开启后，告警详情展示飞手 eID 信息"><Toggle /></SettingItem>{inlineSetting("经纬度格式", "locate", `${coordinateType} · ${coordinateOrder}`, coordinateView)}</section><CustomPlanPreview/></div>;
    if (category === "告警设置") return <AlarmSettings/>;
    if (category === "参数设置") return <div className="settings-sections redesigned-settings"><section><h3>解密服务器</h3><SettingItem icon="signal" title="连接状态" desc="2026-10-22 12:00:00"><span className="online-state">已连接</span></SettingItem><SettingItem icon="database" title="服务器选择" desc={customServer ? "自定义服务器" : "默认服务器"}><select value={customServer ? "自定义服务器" : "默认服务器"} onChange={event => setCustomServer(event.target.value === "自定义服务器")}><option>默认服务器</option><option>自定义服务器</option></select></SettingItem>{customServer && <div className="server-fields"><label>服务器 IP<input defaultValue="192.168.10.88"/></label><label>端口号<input type="number" defaultValue="9080"/></label></div>}</section><section><h3>探测参数</h3><SettingItem icon="signal" title="增益" desc="范围 0–70"><div className="range-setting"><input type="range" min="0" max="70" value={gain} onChange={event => setGain(Number(event.target.value))}/><b>{gain}</b></div></SettingItem><SettingItem icon="drone" title="飞行高度报警阈值" desc="输入范围 0–1000"><div className="altitude-input"><input aria-label="飞行高度报警阈值" type="number" min="0" max={altitudeUnit === "米" ? 1000 : 3280.84} step="any" value={Number((altitudeUnit === "米" ? threshold : threshold / .3048).toFixed(2))} onChange={event => { if(event.target.value !== "") setThreshold(Math.max(0,Math.min(1000,Number(event.target.value) * (altitudeUnit === "米" ? 1 : .3048)))); }}/><select value={altitudeUnit} onChange={event => setAltitudeUnit(event.target.value)}><option>米</option><option>英尺</option></select></div></SettingItem><SettingItem icon="radar" title="工作模式" desc="设置探测与解码模块运行方式"><select><option>双模自动模式</option><option>仅解码模式</option><option>仅探测模式</option></select></SettingItem></section><RuntimePrograms/><ThirdPartyPlatform/></div>;
    if (category === "配置列表") return <div className="settings-sections redesigned-settings"><section><h3>配置与特征库</h3>{[["频率列表","探测频率与机型映射","signal"],["WiFi 机型库","WiFi 信号识别特征","database"],["无人机机型库","无人机型号与特征数据","drone"],["探测忽略列表","不参与告警的信号特征","list"]].map(([name,desc,icon])=><div className="settings-collection-row" key={name}><SettingItem icon={icon as IconName} title={name} desc={desc}><button className="setting-link" aria-label={name+"查看"} onClick={()=>setConfigModal(name)}>查看<Icon name="chevron" size={16}/></button></SettingItem></div>)}</section>{configModal&&<PreviewDialog title={configModal} className="library-dialog" onClose={()=>setConfigModal(null)}><LibraryPreview name={configModal}/></PreviewDialog>}</div>;
    return <div className="about-page redesigned-about"><div className="about-grid">{[["软件版本号","v3.6.2"],["ID","300783419"],["SN","pz-5"],["VID","20303XH2LP-TV1.0"],["BID","AR-A118-V1.0-20260724"],["AID","e659bf29"]].map(([key,value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div><div className="about-sections"><section className="about-actions about-upgrade-direct">{upgradeView}</section><section className="about-actions system-tools"><h3>系统工具</h3><SettingItem icon="document" title="调试日志" desc="显示全局前端交互日志"><button className={`toggle ${debugEnabled ? "on" : ""}`} role="switch" aria-label="调试日志开关" aria-checked={debugEnabled} onClick={()=>setDebugEnabled(value=>!value)}><i/></button></SettingItem><SettingItem icon="trash" title="清空数据" desc="本次操作将清空历史数据，但会为您保存相关配置"><button className="danger-button" onClick={() => {if(window.confirm("确认清空本地演示历史数据？相关配置将会保留。")){setDeletedHistory(historyRows.map(row=>row.id));window.alert("本地演示历史记录已清空");}}}>清空数据</button></SettingItem><SettingItem icon="settings" title="恢复出厂设置" desc="所有配置和历史数据都会清空"><button className="danger-button" onClick={() => window.alert("当前为前端预览，未连接设备恢复出厂服务。") }>恢复出厂</button></SettingItem></section><section className="about-actions about-manual"><h3>使用说明书</h3><SettingItem icon="document" title="使用说明书" desc="Handheld Drone Locator User Manual"><button className="outline-setting-button" onClick={() => window.open("/handheld-drone-locator-user-manual-en.pdf","_blank")}>查看说明书</button></SettingItem></section></div></div>;
  })();

  return <><Header/><main className="content settings-page redesigned-settings-page"><div className={`settings-console ${mobileSettingsDetail?"mobile-detail":""}`}><aside className="settings-nav"><div className="settings-nav-head"><strong>系统设置</strong><small>设备与应用配置中心</small></div>{redesignedSettingsCategories.map(item => <button className={category === item.name ? "active" : ""} onClick={() => openCategory(item.name)} key={item.name}><span><Icon name={item.icon} size={19}/></span><div><strong>{item.name}</strong><small>{item.desc}</small></div><Icon name="chevron" size={15}/>{item.name === "关于" && <i/>}</button>)}</aside><section className="settings-workspace"><div className="workspace-heading"><button className="mobile-settings-back" aria-label="返回设置列表" onClick={()=>setMobileSettingsDetail(false)}>‹</button><div className="setting-icon"><Icon name={activeCategory.icon} size={23}/></div><div><strong>{activeCategory.name}</strong><span>{activeCategory.desc}</span></div></div><div className="settings-scroll">{content}</div></section></div></main></>;
}

export default function App() {
  const [page, setPage] = useState<Page>("detect");
  return <BatteryStatus><NavigationContext.Provider value={{ page, setPage }}><div className={`app-shell page-${page}`}><div className="main-shell">{page === "detect" ? <Detection /> : page === "history" ? <HistoryPage /> : page === "analytics" ? <AnalyticsPage /> : page === "whitelist" ? <WhitelistPage /> : <RedesignedSettingsPage />}</div><GlobalDebugWindow page={page}/></div></NavigationContext.Provider></BatteryStatus>;
}
