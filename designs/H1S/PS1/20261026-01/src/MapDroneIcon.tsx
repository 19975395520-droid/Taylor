import './map-drone-icon.css'
export default function MapDroneIcon() {
  return <svg className="map-drone-symbol" width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 17-7-7m15 7 7-7M16 23l-7 7m15-7 7 7" strokeWidth="3"/>
      <circle cx="8" cy="8" r="5.5"/><circle cx="32" cy="8" r="5.5"/><circle cx="8" cy="32" r="5.5"/><circle cx="32" cy="32" r="5.5"/>
      <path d="M18 13h4l3 5v6l-3 3h-4l-3-3v-6l3-5Z" fill="currentColor" fillOpacity=".18"/>
      <path d="M18 19h4m-3 9v3h2v-3"/><circle cx="20" cy="23" r="1" fill="currentColor"/>
    </g>
  </svg>
}
