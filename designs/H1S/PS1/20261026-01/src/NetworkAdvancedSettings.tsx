import { useEffect, useRef, useState, type ReactNode } from 'react'
import './network-settings.css'

function NetworkDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { ref.current?.showModal() }, [])
  return <dialog ref={ref} className="network-dialog" aria-label={title} onCancel={event => { event.preventDefault(); onClose() }}>
    <header><div><small>网络和互联网</small><h2>{title}</h2></div><button type="button" aria-label="关闭配置" onClick={onClose}>×</button></header>
    {children}
  </dialog>
}

const initialVpn = { name: '', type: 'IKEv2/IPSec MSCHAPv2', server: '', identifier: '', ca: '不验证服务器', certificate: '来自服务器', username: '', password: '', dns: '', routes: '', proxy: '' }
type DnsMode = 'off' | 'auto' | 'hostname'

export default function NetworkAdvancedSettings() {
  const [modal, setModal] = useState<'vpn' | 'dns' | null>(null)
  const [vpn, setVpn] = useState(initialVpn)
  const [draft, setDraft] = useState(initialVpn)
  const [advanced, setAdvanced] = useState(false)
  const [dnsMode, setDnsMode] = useState<DnsMode>('off')
  const [dnsHost, setDnsHost] = useState('')
  const [draftMode, setDraftMode] = useState<DnsMode>('off')
  const [draftHost, setDraftHost] = useState('')
  const [message, setMessage] = useState('')
  const changeVpn = (key: keyof typeof initialVpn, value: string) => setDraft(current => ({ ...current, [key]: value }))
  const hostnameValid = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(draftHost.trim())
  return <>
    <div className="setting-item"><div className="setting-item-icon">◈</div><div className="setting-item-copy"><strong>VPN</strong><span>{vpn.name ? `${vpn.name} · 已配置，未连接` : '未配置'}</span></div><div className="setting-item-control"><button className="outline-setting-button" onClick={() => { setDraft({ ...vpn }); setAdvanced(false); setModal('vpn') }}>配置</button></div></div>
    <div className="setting-item"><div className="setting-item-icon">▤</div><div className="setting-item-copy"><strong>私人 DNS</strong><span>{dnsMode === 'off' ? '已关闭' : dnsMode === 'auto' ? '自动' : dnsHost}</span></div><div className="setting-item-control"><button className="outline-setting-button" onClick={() => { setDraftMode(dnsMode); setDraftHost(dnsHost); setModal('dns') }}>设置</button></div></div>
    <div className="network-feedback" role="status">{message}</div>
    {modal === 'vpn' && <NetworkDialog title="编辑 VPN 配置文件" onClose={() => setModal(null)}>
      <form onSubmit={event => { event.preventDefault(); setVpn({ ...draft, name: draft.name.trim(), server: draft.server.trim() }); setModal(null); setMessage('VPN 配置已保存，尚未连接') }}>
        <div className="network-form-grid">
          <label>名称<input autoFocus required maxLength={80} value={draft.name} onChange={event => changeVpn('name', event.target.value)} placeholder="例如：公司 VPN" /></label>
          <label>类型<select value={draft.type} onChange={event => changeVpn('type', event.target.value)}><option>IKEv2/IPSec MSCHAPv2</option><option>IKEv2/IPSec PSK</option><option>IKEv2/IPSec RSA</option></select></label>
          <label className="network-full">服务器地址<input required value={draft.server} onChange={event => changeVpn('server', event.target.value)} placeholder="输入服务器域名或 IP 地址" /></label>
          <label className="network-full">IPSec 标识符<input value={draft.identifier} onChange={event => changeVpn('identifier', event.target.value)} placeholder="未使用" /></label>
          {draft.type === 'IKEv2/IPSec PSK' ? <label className="network-full">IPSec 预共享密钥<input type="password" required autoComplete="off" value={draft.password} onChange={event => changeVpn('password', event.target.value)} /></label> : <>
            <label>IPSec CA 证书<select value={draft.ca} onChange={event => changeVpn('ca', event.target.value)}><option>不验证服务器</option><option>系统证书</option></select></label>
            <label>IPSec 服务器证书<select value={draft.certificate} onChange={event => changeVpn('certificate', event.target.value)}><option>来自服务器</option></select></label>
          </>}
          <label className="network-check network-full"><input type="checkbox" checked={advanced} onChange={event => setAdvanced(event.target.checked)} />显示高级选项</label>
          {advanced && <>
            <label>DNS 服务器<input value={draft.dns} onChange={event => changeVpn('dns', event.target.value)} placeholder="可选，以空格分隔" /></label>
            <label>转发路线<input value={draft.routes} onChange={event => changeVpn('routes', event.target.value)} placeholder="例如：10.0.0.0/8" /></label>
            <label className="network-full">代理服务器<input value={draft.proxy} onChange={event => changeVpn('proxy', event.target.value)} placeholder="可选，主机名:端口" /></label>
          </>}
          {draft.type === 'IKEv2/IPSec MSCHAPv2' && <>
            <label>用户名<input value={draft.username} autoComplete="off" onChange={event => changeVpn('username', event.target.value)} placeholder="输入用户名" /></label>
            <label>密码<input type="password" autoComplete="off" value={draft.password} onChange={event => changeVpn('password', event.target.value)} placeholder="输入密码" /></label>
          </>}
        </div>
        <footer><button type="button" onClick={() => setModal(null)}>取消</button><button type="submit" disabled={!draft.name.trim() || !draft.server.trim()}>保存</button></footer>
      </form>
    </NetworkDialog>}
    {modal === 'dns' && <NetworkDialog title="选择私人 DNS 模式" onClose={() => setModal(null)}>
      <form onSubmit={event => { event.preventDefault(); if (draftMode === 'hostname' && !hostnameValid) return; setDnsMode(draftMode); setDnsHost(draftHost.trim()); setModal(null); setMessage('私人 DNS 配置已保存') }}>
        <fieldset className="dns-options"><legend>私人 DNS 模式</legend>{([['off','已关闭'],['auto','自动'],['hostname','私人 DNS 提供商主机名']] as const).map(([value, label]) => <label key={value}><input type="radio" name="dns-mode" value={value} checked={draftMode === value} onChange={() => setDraftMode(value)} />{label}</label>)}</fieldset>
        <label className="dns-host">DNS 提供商主机名<input autoFocus={draftMode === 'hostname'} disabled={draftMode !== 'hostname'} required={draftMode === 'hostname'} value={draftHost} onChange={event => setDraftHost(event.target.value)} placeholder="例如：dns.example.com" aria-describedby="dns-host-hint" /></label>
        <p id="dns-host-hint" className="network-hint">填写提供商主机名，不包含 https://、端口或路径。</p>
        {draftMode === 'hostname' && draftHost && !hostnameValid && <p role="alert" className="network-error">请输入有效的 DNS 提供商主机名。</p>}
        <footer><button type="button" onClick={() => setModal(null)}>取消</button><button type="submit" disabled={draftMode === 'hostname' && !hostnameValid}>保存</button></footer>
      </form>
    </NetworkDialog>}
  </>
}
