"use client";

import { useMemo, useState } from "react";

type ContractState = "待补充资料" | "待发起" | "待作者签署" | "签署完成";

const works = [
  { name: "雾港来信", author: "林夕禾", id: "NX-20260718-023", price: "¥12,000", state: "待发起" as ContractState },
  { name: "第七码头", author: "周舟", id: "NX-20260716-019", price: "¥8,600", state: "待作者签署" as ContractState },
  { name: "月光落在旧站台", author: "沈乔", id: "NX-20260713-011", price: "¥15,000", state: "签署完成" as ContractState },
];

const flowSteps = [
  ["合同参数确认", "主编确认作品、价格、权利范围与期限"],
  ["合同生成", "套用模板并等待腾讯电子签完成 PDF 合成"],
  ["平台方签署", "企业印章自动签署，写入操作人与时间"],
  ["作者签署", "作者实名核验并在腾讯电子签 H5 完成签署"],
  ["完成归档", "回调校验、下载合同与证据报告，解锁提现"],
];

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function AuthorDemo({ status, setStatus }: { status: ContractState; setStatus: (s: ContractState) => void }) {
  const [drawer, setDrawer] = useState(false);
  const [signing, setSigning] = useState(false);
  const [toast, setToast] = useState("");
  const step = status === "待补充资料" ? 0 : status === "待作者签署" ? 3 : status === "签署完成" ? 5 : 1;

  function beginSign() {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setStatus("签署完成");
      setToast("签署结果已同步，合同及证据文件正在归档");
      setTimeout(() => setToast(""), 3200);
    }, 1000);
  }

  return (
    <div className="product author">
      <header className="author-head">
        <div className="brand"><span className="logo">容</span><div>容量短篇<small>创作者中心</small></div></div>
        <nav><span>工作台</span><span>我的作品</span><span className="active">签约中心</span><span>收益提现</span></nav>
        <div className="user">林夕禾 <span className="avatar">林</span></div>
      </header>
      <main className="author-main">
        <div className="crumb">签约中心 / <b>《雾港来信》签约详情</b></div>
        <section className="hero">
          <div><Badge tone={status === "签署完成" ? "green" : "orange"}>{status}</Badge><h1>《雾港来信》作品签约</h1><p>合同编号：NX-20260718-023 · 买断合作</p></div>
          {status === "待作者签署" && <button className="primary" onClick={() => setDrawer(true)}>立即签署</button>}
          {status === "签署完成" && <button className="secondary" onClick={() => setToast("合同文件下载任务已创建")}>下载合同</button>}
        </section>
        <section className="progress-card">
          <div className="progress-line">
            {flowSteps.map((item, i) => <div className={`progress-step ${i < step ? "done" : i === step ? "now" : ""}`} key={item[0]}><i>{i < step ? "✓" : i + 1}</i><b>{item[0]}</b><small>{i < step ? "已完成" : i === step ? "进行中" : "待处理"}</small></div>)}
          </div>
        </section>
        <div className="two-col">
          <section className="panel">
            <div className="panel-title"><h2>合同信息</h2><span>关键条款</span></div>
            <dl className="details">
              <div><dt>签约作品</dt><dd>雾港来信</dd></div><div><dt>合作模式</dt><dd>作品著作权买断</dd></div>
              <div><dt>签约金额</dt><dd className="money">¥12,000.00</dd></div><div><dt>权利期限</dt><dd>永久</dd></div>
              <div><dt>授权范围</dt><dd>全球 · 全渠道 · 可转授权</dd></div><div><dt>付款方式</dt><dd>签署完成后申请提现</dd></div>
            </dl>
            <div className="notice">签署前请仔细核对姓名、证件号码及合同条款。如信息有误，请先联系责任编辑修改。</div>
          </section>
          <aside className="panel contact">
            <h2>签约帮助</h2><div className="editor"><span className="avatar large">陈</span><div><b>责任编辑 · 陈思</b><p>工作日 10:00–19:00</p></div></div>
            <button className="secondary wide">联系编辑</button>
            <hr/><h3>签署说明</h3><p>你将跳转至腾讯电子签安全页面完成实名核验与签名，签署结果会自动同步。</p>
          </aside>
        </div>
      </main>
      {drawer && <div className="overlay" onClick={() => setDrawer(false)}><div className="drawer" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setDrawer(false)}>×</button><Badge tone="green">腾讯电子签安全签署</Badge><h2>签署前确认</h2><p>本次签署将使用以下实名信息，请确认无误。</p><div className="verify"><span>签署人</span><b>林夕禾（林＊禾）</b><span>手机号</span><b>138 **** 6621</b><span>证件号</span><b>3301 **** **** 142X</b></div><label className="check"><input type="checkbox" defaultChecked/> 我已阅读并同意《雾港来信作品著作权转让协议》</label><button className="primary wide" onClick={beginSign} disabled={signing}>{signing ? "正在同步签署结果…" : "前往腾讯电子签"}</button><small className="security">全程实名认证 · 区块链存证 · 签署文件不可篡改</small></div></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function AdminDemo({ selected, setSelected, states, setStates }: { selected: number; setSelected: (n: number) => void; states: ContractState[]; setStates: (s: ContractState[]) => void }) {
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState("合同参数");
  const [toast, setToast] = useState("");
  const work = works[selected];
  const current = states[selected];
  const timeline = useMemo(() => current === "签署完成" ? ["作者完成签署 · 2026-07-22 16:48", "签署回调验签成功 · 16:48", "合同与证据报告已归档 · 16:49"] : ["主编提交签约申请 · 2026-07-22 10:20", "合同参数校验通过 · 10:24"], [current]);

  function launch() {
    const next = [...states]; next[selected] = "待作者签署"; setStates(next); setModal(false); setToast("合同已发起，作者端签署入口已开放"); setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="product admin">
      <aside className="sidebar"><div className="admin-logo">奇果<span>绿台</span></div><div className="side-item">⌂ 工作台</div><div className="side-item">◉ 内容管理</div><div className="side-group">◈ 小说管理 <b>⌃</b></div><div className="side-sub active">小说管理</div><div className="side-sub">小说标签管理</div><div className="side-sub">数据权限配置</div><div className="side-sub">小说送审库</div><div className="side-sub">CPA合作管理</div><div className="side-item">◫ 公众号管理</div></aside>
      <div className="admin-body">
        <header className="admin-head"><span>☰</span><div className="search">⌕ 搜索小说、作者或合同编号</div><span className="bell">◉</span><span>主编 · 洪娟</span></header>
        <main className="admin-main">
          <div className="page-title"><div><p>小说管理 / 电子签约</p><h1>签约管理</h1></div><button className="primary" onClick={() => setModal(true)}>＋ 发起签约</button></div>
          <div className="stats"><div><small>待发起</small><b>12</b><em>较昨日 +3</em></div><div><small>待作者签署</small><b>7</b><em className="orange-text">2 份即将超时</em></div><div><small>签署完成</small><b>86</b><em>本月完成</em></div><div><small>异常任务</small><b>2</b><em className="red-text">需要处理</em></div></div>
          <section className="table-panel">
            <div className="filters"><button className="filter active">全部 107</button><button className="filter">待补资料 4</button><button className="filter">待发起 12</button><button className="filter">签署中 7</button><button className="filter">已完成 82</button><div className="filter-input">状态：全部⌄</div><div className="filter-input">近 30 天⌄</div></div>
            <table><thead><tr><th>作品 / 合同编号</th><th>作者</th><th>签约金额</th><th>当前节点</th><th>更新时间</th><th>操作</th></tr></thead><tbody>{works.map((w, i) => <tr key={w.id} className={selected === i ? "selected" : ""} onClick={() => setSelected(i)}><td><b>{w.name}</b><small>{w.id}</small></td><td>{w.author}</td><td>{w.price}</td><td><Badge tone={states[i] === "签署完成" ? "green" : states[i] === "待作者签署" ? "orange" : "blue"}>{states[i]}</Badge></td><td>2026-07-22 16:48</td><td><button className="link" onClick={(e) => {e.stopPropagation(); setSelected(i); setModal(true)}}>{states[i] === "待发起" ? "发起签约" : "查看详情"}</button></td></tr>)}</tbody></table>
          </section>
          <section className="detail-panel"><div className="detail-head"><div><Badge>{current}</Badge><h2>{work.name}</h2><p>{work.id} · 作者 {work.author}</p></div><button className="secondary" onClick={() => setToast("已向作者发送签署提醒")}>催签</button><button className="primary" onClick={() => setModal(true)}>{current === "待发起" ? "发起签约" : "查看合同"}</button></div><div className="tabs">{["合同参数","签署进度","操作留痕","归档文件"].map(x => <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}</button>)}</div>{tab === "合同参数" ? <dl className="details compact"><div><dt>模板版本</dt><dd>小说买断合同 V3.2</dd></div><div><dt>签约金额</dt><dd className="money">{work.price}</dd></div><div><dt>企业签署</dt><dd>自动签署（容量文化）</dd></div><div><dt>作者签署</dt><dd>实名 + 人脸核验</dd></div></dl> : <div className="timeline">{timeline.map((x,i) => <div key={x}><i>{i+1}</i><span>{x}</span></div>)}</div>}</section>
        </main>
      </div>
      {modal && <div className="overlay" onClick={() => setModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setModal(false)}>×</button><h2>发起电子签约</h2><p>确认合同参数后，将调用腾讯电子签创建并启动签署流程。</p><div className="form-grid"><label>合同模板<select defaultValue="v32"><option value="v32">小说买断合同 V3.2</option></select></label><label>签约金额<input defaultValue="12000.00"/></label><label>权利范围<select><option>全球 · 全渠道 · 可转授权</option></select></label><label>权利期限<select><option>永久</option></select></label><label>企业签署方式<select><option>企业印章自动签署</option></select></label><label>作者认证方式<select><option>实名 + 人脸核验</option></select></label></div><div className="api-preview"><b>发起后系统自动执行</b><span>CreateFlow → CreateDocument → 等待文档合成回调 → StartFlow → 生成作者签署链接</span></div><div className="modal-actions"><button className="secondary" onClick={() => setModal(false)}>取消</button><button className="primary" onClick={launch}>确认并发起</button></div></div></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"author" | "admin">("author");
  const [selected, setSelected] = useState(0);
  const [states, setStates] = useState<ContractState[]>(works.map(w => w.state));
  return <><div className="demo-switch"><div><b>小说电子签全链路 Demo</b><span>PRD 交互验证版 · 数据均为模拟</span></div><div className="segmented"><button className={mode === "author" ? "active" : ""} onClick={() => setMode("author")}>作者投稿后台</button><button className={mode === "admin" ? "active" : ""} onClick={() => setMode("admin")}>内部绿台</button></div></div>{mode === "author" ? <AuthorDemo status={states[0]} setStatus={s => setStates([s, ...states.slice(1)])}/> : <AdminDemo selected={selected} setSelected={setSelected} states={states} setStates={setStates}/>}</>;
}
