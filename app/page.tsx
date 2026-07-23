"use client";

import { useState } from "react";

type EsignState = "待发起" | "待作者签署" | "签署完成";

const novels = [
  {
    id: "1048",
    name: "声声已离商音近",
    author: "溪源",
    editor: "富贵竹",
    owner: "吴鑫鑫",
    department: "钱行工作室",
    price: "12,000",
    createdAt: "2026-07-23 11:00:17",
  },
  {
    id: "1047",
    name: "消失的女儿",
    author: "猫耳朵",
    editor: "长青",
    owner: "柴文静",
    department: "钱行工作室",
    price: "8,600",
    createdAt: "2026-07-22 19:17:43",
  },
  {
    id: "1046",
    name: "月光落在旧站台",
    author: "赛罗奥特曼",
    editor: "豆奶",
    owner: "柴文静",
    department: "七月工作室",
    price: "15,000",
    createdAt: "2026-07-22 18:54:56",
  },
];

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "orange" | "gray" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function AuthorDemo({ state, setState }: { state: EsignState; setState: (state: EsignState) => void }) {
  const [signModal, setSignModal] = useState(false);
  const [signing, setSigning] = useState(false);
  const [toast, setToast] = useState("");
  const authorStatus = state === "签署完成" ? "签约完成" : "待签约";

  function completeSign() {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSignModal(false);
      setState("签署完成");
      setToast("签署成功，合同已同步至作品与收益记录");
      setTimeout(() => setToast(""), 3200);
    }, 900);
  }

  return (
    <div className="product author-app">
      <header className="author-header">
        <div className="author-brand"><span>容</span><b>容量短篇创作者后台</b></div>
        <nav><button className="active">作品管理</button><button>个人中心</button><button>收益管理</button></nav>
        <div className="author-user">溪源 <i>溪</i></div>
      </header>
      <main className="author-content">
        <div className="author-title">
          <div><p>我的创作</p><h1>作品管理</h1></div>
          <button className="primary">＋ 创建小说</button>
        </div>
        <section className="author-filters">
          <select defaultValue="all"><option value="all">全部状态</option><option>草稿</option><option>审核中</option><option>待签约</option><option>签约完成</option><option>终止签约</option></select>
          <input placeholder="搜索小说名称" />
          <button className="primary small">查询</button>
        </section>
        <section className="work-grid">
          <article className="work-card featured">
            <div className="book-cover purple"><span>声声已离<br/>商音近</span></div>
            <div className="work-info">
              <div className="work-heading"><h2>声声已离商音近</h2><Badge tone={state === "签署完成" ? "green" : "orange"}>{authorStatus}</Badge></div>
              <p>9,427字 ｜ 投稿时间：2026-07-23</p>
              <div className="contract-tip">
                {state === "待发起" && <>审核已通过，编辑正在准备电子合同</>}
                {state === "待作者签署" && <><b>电子合同待签署</b><span>请在 2026-07-30 前完成签署</span></>}
                {state === "签署完成" && <><b>电子合同已签署</b><span>合同编号：QS202607230018</span></>}
              </div>
              <div className="work-actions">
                {state === "待作者签署" && <button className="primary" onClick={() => setSignModal(true)}>查看并签署合同</button>}
                {state === "签署完成" && <button className="primary" onClick={() => setToast("已打开收益管理中的合同记录")}>查看收益</button>}
                {state === "签署完成" && <button className="secondary" onClick={() => setSignModal(true)}>查看合同</button>}
                {state === "待发起" && <button className="secondary">完善个人信息</button>}
                <button className="text-button">小说详情</button>
              </div>
            </div>
          </article>
          <article className="work-card">
            <div className="book-cover teal"><span>消失的<br/>女儿</span></div>
            <div className="work-info"><div className="work-heading"><h2>消失的女儿</h2><Badge>审核中</Badge></div><p>10,029字 ｜ 投稿时间：2026-07-22</p><div className="contract-tip muted">编辑正在审阅作品，请耐心等待审核结果</div><div className="work-actions"><button className="secondary">完善个人信息</button><button className="text-button">小说详情</button></div></div>
          </article>
          <article className="work-card">
            <div className="book-cover sand"><span>雾港<br/>来信</span></div>
            <div className="work-info"><div className="work-heading"><h2>雾港来信</h2><Badge tone="gray">草稿</Badge></div><p>8,832字</p><div className="contract-tip muted">标题、导语、正文与收费卡点均已完整</div><div className="work-actions"><button className="primary">申请签约</button><button className="secondary">修改作品</button><button className="text-button danger">删除</button></div></div>
          </article>
        </section>
      </main>
      {signModal && (
        <div className="overlay" onClick={() => setSignModal(false)}>
          <div className="author-contract-modal" onClick={event => event.stopPropagation()}>
            <button className="close" onClick={() => setSignModal(false)}>×</button>
            <div className="tencent-mark">✓ 腾讯电子签</div>
            <h2>{state === "签署完成" ? "电子合同详情" : "签署前确认"}</h2>
            <p>《声声已离商音近》小说版权合作协议</p>
            <div className="contract-summary">
              <div><span>签约方式</span><b>保底＋分成</b></div><div><span>税前签约稿费</span><b className="money">¥12,000.00</b></div>
              <div><span>甲方</span><b>杭州容量文化传媒有限公司</b></div><div><span>乙方</span><b>溪源（石＊京）</b></div>
              <div><span>手机号</span><b>138 **** 6621</b></div><div><span>签署截止</span><b>2026-07-30 23:59</b></div>
            </div>
            <div className="safe-note">签署将在腾讯电子签安全页面完成。返回本后台后，系统将以腾讯电子签回调结果更新状态。</div>
            {state !== "签署完成" ? <>
              <label className="agreement"><input type="checkbox" defaultChecked /> 我已核对合同主体与签约金额，并同意前往腾讯电子签完成实名认证与签名</label>
              <button className="primary wide" disabled={signing} onClick={completeSign}>{signing ? "正在同步签署结果…" : "前往腾讯电子签"}</button>
            </> : <button className="primary wide" onClick={() => setToast("已下载签署完成的合同 PDF")}>下载已签合同</button>}
          </div>
        </div>
      )}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function AdminDemo({ states, setStates }: { states: EsignState[]; setStates: (states: EsignState[]) => void }) {
  const [selected, setSelected] = useState(0);
  const [launchModal, setLaunchModal] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [toast, setToast] = useState("");
  const selectedState = states[selected];
  const selectedNovel = novels[selected];

  function launchFlow() {
    const next = [...states];
    next[selected] = "待作者签署";
    setStates(next);
    setLaunchModal(false);
    setToast("腾讯电子签流程已发起，作者端已出现签署入口");
    setTimeout(() => setToast(""), 3200);
  }

  function showContract(index: number) {
    setSelected(index);
    setDetailOpen(true);
  }

  return (
    <div className="product admin-app">
      <aside className="green-sidebar">
        <div className="green-logo">奇果绿台</div>
        <div className="green-menu-item">◉ 帆软BI入口</div>
        <div className="green-menu-item">◉ 内容管理</div>
        <div className="green-menu-group">◈ 小说管理 <span>⌃</span></div>
        <div className="green-sub active">小说管理</div><div className="green-sub">小说标签管理</div><div className="green-sub">数据权限配置</div><div className="green-sub">小说送审库</div><div className="green-sub">小说配置栏目</div><div className="green-sub">CP合作管理</div>
        <div className="green-menu-item">◉ 公众号管理</div>
      </aside>
      <div className="green-shell">
        <header className="green-header"><span>☰</span><b>小说管理　/　小说管理</b><span className="challenge">百日0故障挑战 第324天</span><span>洪娟⌄</span></header>
        <main className="green-content">
          <div className="green-tab">小说管理　×</div>
          <section className="green-filters">
            <label>小说ID<input placeholder="请输入"/></label><label>小说名称<input placeholder="请输入"/></label><label>作者笔名<input placeholder="请输入"/></label>
            <label>小说状态<select><option>全部</option></select></label><label>责编<select><option>请选择</option></select></label><label>签约状态<select><option>全部</option><option>待发起</option><option>待作者签署</option><option>签署完成</option></select></label>
            <label>部门<select><option>全部</option></select></label><label>创建日期<input placeholder="开始日期　至　结束日期"/></label>
            <div className="filter-actions"><button className="primary small">查询</button><button className="secondary small">重置</button><button className="secondary small">导出</button></div>
          </section>
          <div className="table-toolbar"><button className="primary small">新建小说</button><span>电子签约沿用小说数据权限：经理看部门、主编看下属责编、责编看本人小说</span></div>
          <section className="live-table-wrap">
            <table className="live-table"><thead><tr><th>小说ID</th><th>小说名称</th><th>封面</th><th>作者</th><th>编辑</th><th>责编</th><th>部门</th><th>上架类型</th><th>版权类型</th><th>版权文件</th><th>签约状态</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead>
              <tbody>{novels.map((novel, index) => <tr key={novel.id} className={selected === index ? "selected-row" : ""} onClick={() => setSelected(index)}>
                <td>{novel.id}</td><td><button className="novel-link">{novel.name}</button></td><td><span className={`tiny-cover cover-${index}`}>{novel.name.slice(0,2)}</span></td><td>{novel.author}</td><td>{novel.editor}</td><td>{novel.owner}</td><td>{novel.department}</td><td>签约</td><td>自有版权</td>
                <td>{states[index] === "签署完成" ? <button className="file-link" onClick={event => { event.stopPropagation(); setToast("已打开腾讯电子签回传的版权合同 PDF"); }}>QS-{novel.id}-已签合同.pdf</button> : "-"}</td>
                <td><Badge tone={states[index] === "签署完成" ? "green" : states[index] === "待作者签署" ? "orange" : "blue"}>{states[index]}</Badge></td><td><span className="online-dot"/>上架</td><td>{novel.createdAt}</td>
                <td><div className="row-actions"><button>修改</button><button>克隆</button>{states[index] === "待发起" ? <button className="sign-action" onClick={event => {event.stopPropagation();setSelected(index);setLaunchModal(true);}}>发起签约</button> : <button className="sign-action" onClick={event => {event.stopPropagation();showContract(index);}}>查看签约</button>}</div></td>
              </tr>)}</tbody>
            </table>
          </section>
          <div className="pagination">共 1020 条　 <span>10条/页⌄</span>　‹　<b>1</b>　2　3　4　5　…　102　›</div>
        </main>
      </div>
      {launchModal && (
        <div className="overlay" onClick={() => setLaunchModal(false)}>
          <div className="green-modal" onClick={event => event.stopPropagation()}>
            <button className="close" onClick={() => setLaunchModal(false)}>×</button><h2>发起腾讯电子签</h2><p>替代原“上传 E签宝合同编号与 PDF”操作。发起成功后由系统自动同步合同状态与文件。</p>
            <div className="form-section-title">作品与稿费（继承审核结果）</div>
            <div className="green-form-grid"><label>小说名称<input value={selectedNovel.name} readOnly/></label><label>作者笔名<input value={selectedNovel.author} readOnly/></label><label>签约方式<select><option>保底＋分成</option><option>买断</option></select></label><label>税前签约稿费<input value={selectedNovel.price} readOnly/></label></div>
            <div className="form-section-title">电子合同参数</div>
            <div className="green-form-grid"><label>合同模板<select><option>短篇小说版权合作协议 V3.2</option></select></label><label>签约主体<select><option>杭州容量文化传媒有限公司</option></select></label><label>企业签署方式<select><option>企业印章自动签署</option></select></label><label>签署顺序<select><option>平台先签 → 作者后签</option></select></label><label>作者实名<input value="石＊京" readOnly/></label><label>作者手机号<input value="138 **** 6621" readOnly/></label><label>签署截止日期<input value="2026-07-30 23:59" readOnly/></label><label>合同通知<select><option>投稿后台＋短信</option></select></label></div>
            <div className="launch-checks"><b>发起前校验</b><span>✓ 作者实名资料完整　✓ 合同模板已启用　✓ 企业印章可用　✓ 金额与审核结果一致</span></div>
            <div className="modal-actions"><button className="secondary" onClick={() => setLaunchModal(false)}>取消</button><button className="primary" onClick={launchFlow}>确认并发起</button></div>
          </div>
        </div>
      )}
      {detailOpen && (
        <div className="overlay side" onClick={() => setDetailOpen(false)}>
          <aside className="contract-drawer" onClick={event => event.stopPropagation()}>
            <button className="close" onClick={() => setDetailOpen(false)}>×</button>
            <Badge tone={selectedState === "签署完成" ? "green" : "orange"}>{selectedState}</Badge><h2>{selectedNovel.name}</h2><p>腾讯电子签流程 ID：yDwFmUUckp****3cqjkGm</p>
            <div className="drawer-actions">{selectedState === "待作者签署" && <button className="primary" onClick={() => {setToast("已发送催签提醒");setDetailOpen(false);}}>催签</button>}<button className="secondary">查看合同</button></div>
            <div className="contract-summary vertical"><div><span>合同编号</span><b>{selectedState === "签署完成" ? "QS202607230018" : "流程启动后生成"}</b></div><div><span>签约方式 / 金额</span><b>保底＋分成 / ¥{selectedNovel.price}</b></div><div><span>企业签署</span><b>自动签署 · 已完成</b></div><div><span>作者签署</span><b>{selectedState === "签署完成" ? "已完成 · 2026-07-23 16:48" : "待签署"}</b></div></div>
            <h3>流转留痕</h3><ol className="audit-list"><li><b>合同参数确认</b><span>洪娟 · 2026-07-23 15:20</span></li><li><b>腾讯电子签流程发起成功</b><span>FlowId 与 RequestId 已保存 · 15:21</span></li><li><b>企业印章自动签署</b><span>腾讯电子签回调 · 15:22</span></li><li><b>{selectedState === "签署完成" ? "作者签署完成并归档" : "等待作者签署"}</b><span>{selectedState === "签署完成" ? "合同 PDF 与证据报告已回写版权文件" : "截止 2026-07-30 23:59"}</span></li></ol>
          </aside>
        </div>
      )}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"author" | "admin">("author");
  const [states, setStates] = useState<EsignState[]>(["待发起", "待作者签署", "签署完成"]);
  return <>
    <div className="demo-switch"><div><b>小说电子签迭代 Demo</b><span>基于现有作者投稿后台与绿台小说管理</span></div><div className="segmented"><button className={mode === "author" ? "active" : ""} onClick={() => setMode("author")}>作者投稿后台</button><button className={mode === "admin" ? "active" : ""} onClick={() => setMode("admin")}>内部绿台</button></div></div>
    {mode === "author" ? <AuthorDemo state={states[0]} setState={state => setStates([state, ...states.slice(1)])}/> : <AdminDemo states={states} setStates={setStates}/>}
  </>;
}
