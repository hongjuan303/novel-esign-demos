"use client";

import { useState } from "react";

type EsignState = "待发起" | "待作者签署" | "待平台签署" | "签署完成";

const novels = [
  {
    id: "1048",
    name: "声声已离商音近",
    author: "溪源",
    editor: "富贵竹",
    owner: "吴鑫鑫",
    department: "钱行工作室",
    price: "12,000",
    contractType: "保底＋分成",
    legacy: false,
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
    contractType: "买断",
    legacy: false,
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
    contractType: "买断",
    legacy: true,
    createdAt: "2026-07-22 18:54:56",
  },
];

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "orange" | "gray" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function AuthorDemo({ state, setState }: { state: EsignState; setState: (state: EsignState) => void }) {
  const [view, setView] = useState<"works" | "income" | "profile" | "editors" | "create" | "content">("works");
  const [signModal, setSignModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [signing, setSigning] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState("");

  const stateCopy = {
    待发起: { label: "待签约", detail: "审核已通过，编辑正在准备电子合同", action: "查看进度" },
    待作者签署: { label: "待签约", detail: "电子合同待作者签署 · 截止 2026-07-30", action: "查看并签署" },
    待平台签署: { label: "待签约", detail: "作者已签署，等待平台方完成签署", action: "签署进度" },
    签署完成: { label: "签约完成", detail: "双方签署完成 · QS202607230018", action: "查看合同" },
  }[state];

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(""), 3200);
  }

  function completeAuthorSign() {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSignModal(false);
      setState("待平台签署");
      notify("作者签署已完成，合同正等待平台方签署");
    }, 900);
  }

  const menuItems = [
    { id: "works", label: "作品管理", icon: "▣" },
    { id: "income", label: "收益管理", icon: "¥" },
    { id: "profile", label: "个人中心", icon: "◎" },
    { id: "editors", label: "联系编辑", icon: "✉" },
  ] as const;

  return (
    <div className="product author-app-live">
      <header className="live-author-header">
        <button className="live-author-brand" onClick={() => setView("works")}><i>R</i><span><b>容量·短篇</b><small>RONGLIANG PLAYLET</small></span><em>创作者后台</em></button>
        <div className="live-author-user"><span>溪</span><b>189****4513</b><i>⌄</i></div>
      </header>
      <div className="author-live-layout">
        <aside className="author-live-sidebar">
          {menuItems.map(item => <button key={item.id} className={view === item.id || (item.id === "works" && (view === "create" || view === "content")) ? "active" : ""} onClick={() => setView(item.id)}>
            <i>{item.icon}</i><span>{item.label}</span>
          </button>)}
        </aside>

        <main className="author-live-main">
          {view === "works" && <>
            <section className="author-live-filter">
              <select defaultValue="all"><option value="all">全部状态</option><option>草稿</option><option>审核中</option><option>待签约</option><option>签约完成</option><option>终止签约</option></select>
              <input placeholder="⌕ 查询小说名称" />
              <button className="mint-button">查 询</button>
              <button className="mint-button create" onClick={() => {setCreateStep(1);setView("create");}}>⊕ 创建小说</button>
            </section>
            <section className="author-work-list">
              <article className="author-work-row contract-row">
                <div className="live-cover purple">声声已离<br/>商音近</div>
                <div className="live-work-main">
                  <div className="live-work-title"><h2>声声已离商音近</h2><span className={`live-status ${state === "签署完成" ? "done" : "waiting"}`}>{stateCopy.label}</span></div>
                  <p>溪源 著</p><small>9,427字　｜　女频 · 都市情感</small>
                  <div className="live-contract-line"><b>{stateCopy.detail}</b>{state === "待作者签署" && <span>请及时完成合同核对</span>}</div>
                </div>
                <div className="live-work-actions">
                  <button className="inline-mint" onClick={() => setView("content")}>▱ 小说详情</button>
                  <button className="pill-action" onClick={() => state === "待发起" ? notify("合同尚未发起，请等待编辑处理") : setSignModal(true)}>{stateCopy.action}</button>
                  {state === "签署完成" && <button className="inline-mint" onClick={() => setView("income")}>查看收益</button>}
                </div>
              </article>

              <article className="author-work-row">
                <div className="live-cover teal">消失的<br/>女儿</div>
                <div className="live-work-main"><div className="live-work-title"><h2>消失的女儿</h2><span className="live-status reviewing">审核中</span></div><p>溪源 著</p><small>10,029字　｜　女频 · 悬疑</small><div className="live-contract-line plain">编辑正在审阅作品，请耐心等待审核结果</div></div>
                <div className="live-work-actions"><button className="inline-mint" onClick={() => setView("content")}>▱ 小说详情</button></div>
              </article>

              <article className="author-work-row">
                <div className="live-cover sand">雾港<br/>来信</div>
                <div className="live-work-main"><div className="live-work-title"><h2>雾港来信</h2><span className="live-status draft">草稿</span></div><p>溪源 著</p><small>8,832字　｜　男频 · 都市</small><div className="live-contract-line plain">正文已达到 8,000～20,000 字申请要求，签约资料已完善</div></div>
                <div className="live-work-actions"><button className="inline-mint" onClick={() => setApplyModal(true)}>♢ 申请签约</button><button className="inline-mint danger" onClick={() => notify("Demo 中已保留作品，未执行删除")}>♧ 删除</button><button className="pill-action soft" onClick={() => setView("content")}>修改作品</button></div>
              </article>

              <article className="author-work-row">
                <div className="live-cover rose">月光落在<br/>旧站台</div>
                <div className="live-work-main"><div className="live-work-title"><h2>月光落在旧站台</h2><span className="live-status done">签约完成</span></div><p>溪源 著</p><small>12,604字　｜　女频 · 现实情感</small><div className="live-contract-line plain">历史线下合同已由业务上传</div></div>
                <div className="live-work-actions"><button className="inline-mint" onClick={() => notify("已打开历史线下合同")}>查看合同</button><button className="pill-action soft" onClick={() => setView("income")}>查看收益</button></div>
              </article>
            </section>
            <div className="author-pagination">共 4 条　‹　<b>1</b>　›　 <span>10 条/页⌄</span></div>
          </>}

          {view === "income" && <>
            <section className="author-page-card">
              <div className="author-income-filter"><input placeholder="开始日期"/><span>→</span><input placeholder="结束日期"/><input placeholder="小说名称"/><select><option>到账状态</option><option>待到账</option><option>已到账</option></select><button className="mint-button">查 询</button></div>
              <table className="author-income-table"><thead><tr><th>合同ID</th><th>小说名称</th><th>签约性质</th><th>税前收入(元)</th><th>到账状态</th><th>签约日期</th><th>操作</th></tr></thead>
                <tbody>
                  {state === "签署完成" && <tr><td><button onClick={() => setSignModal(true)}>QS202607230018</button></td><td>声声已离商音近</td><td>保底＋分成</td><td>12,000.00</td><td><span className="income-state pending">待到账</span></td><td>2026-07-23</td><td><button onClick={() => setSignModal(true)}>查看合同</button></td></tr>}
                  <tr><td><button onClick={() => notify("已打开业务手动上传的历史合同")}>ESIGN-2025-1046</button></td><td>月光落在旧站台</td><td>买断</td><td>15,000.00</td><td><span className="income-state paid">已到账</span></td><td>2025-12-31</td><td><button onClick={() => notify("已打开历史线下合同")}>查看合同</button></td></tr>
                </tbody>
              </table>
            </section>
          </>}

          {view === "profile" && <section className="author-page-card profile-card">
            <div className="profile-section-heading"><h2>账号信息</h2><button className="mint-button small" onClick={() => setProfileEditing(!profileEditing)}>{profileEditing ? "保存" : "修改信息"}</button></div>
            <div className="profile-fields compact">
              <label><span>姓名</span>{profileEditing ? <input defaultValue="石雨京"/> : <b>石雨京</b>}</label>
              <label><span>笔名</span>{profileEditing ? <input defaultValue="溪源"/> : <b>溪源</b>}</label>
              <label><span>手机号</span><b>189****4513</b></label>
              <label><span>签约编辑</span><b>长青</b></label>
            </div>
            <div className="profile-section-heading second"><h2>签约信息</h2><button className="mint-button small" onClick={() => setProfileEditing(!profileEditing)}>{profileEditing ? "保存" : "修改信息"}</button></div>
            <div className="profile-fields">
              {[
                ["微信号","xywriter"],["QQ号","9308****"],["电子邮箱","xiyuan@example.com"],["联系地址","浙江省杭州市余杭区＊＊路＊＊号"],["邮编","310000"],["身份证号","3301**********2416"],["性别","女生"],["开户银行","招商银行杭州分行"],["账户名称","石雨京"],["银行卡号","6225 **** **** 9132"]
              ].map(([label,value]) => <label key={label}><span>{label}</span>{profileEditing ? <input defaultValue={value}/> : <b>{value}</b>}</label>)}
              <label className="id-upload"><span>身份证照片</span><div><i>身份证正面<br/><b>已上传</b></i><i>身份证反面<br/><b>已上传</b></i><small>JPG / PNG / JPEG，单张不超过 4M</small></div></label>
            </div>
            <div className="profile-lock-note">✓ 签约资料已完整，可申请签约。合同发起后，姓名、证件号、手机号和收款账户将冻结。</div>
          </section>}

          {view === "editors" && <section className="author-page-card editor-page"><h1>联系编辑</h1><p>投稿、签约及收益问题可联系以下编辑</p><div className="editor-grid">
            {[["长青","930866698","青"],["泡芙","1007540407","芙"],["元元","3259515689","元"]].map(editor => <article key={editor[0]}><i>{editor[2]}</i><div><h3>{editor[0]}</h3><p>QQ：{editor[1]}</p></div><button onClick={() => notify(`已复制 ${editor[0]} 的 QQ`)}>复制</button></article>)}
          </div></section>}

          {view === "create" && <section className="author-page-card create-work-page">
            <button className="back-link" onClick={() => setView("works")}>‹　返回作品管理</button>
            <div className="create-heading"><div className="create-cover">书名<br/>示例</div><div><h1>创建小说</h1><p>溪源 著</p></div><span>步骤 {createStep} / 2</span></div>
            {createStep === 1 ? <div className="create-form">
              <label><span><b>*</b> 名称</span><input defaultValue="雨停之后的第七封信" maxLength={50}/><small>12 / 50</small></label>
              <label><span><b>*</b> 导语</span><textarea defaultValue="一封迟到七年的信，让她重新回到那座被雨困住的海港小城。"/><small>30 / 5000</small></label>
              <label><span>频道</span><div className="radio-line"><label><input type="radio" defaultChecked name="channel"/> 男频</label><label><input type="radio" name="channel"/> 女频</label></div></label>
              <label><span>标签</span><select defaultValue="city"><option value="city">都市情感</option><option>悬疑推理</option><option>现实生活</option></select></label>
              <label><span>完结日期</span><input defaultValue="2026-08-15"/></label>
            </div> : <div className="content-editor-mock"><div className="editor-toolbar"><button>B</button><button>I</button><button>段落</button><button>撤销</button><span>8,846字</span></div><textarea defaultValue={"第一章　雨夜来信\n\n海港的雨下了整整三天。林知夏在关店前，从门缝里捡到一封没有寄件地址的信。\n\n信封已经被雨水洇湿，右下角却清晰地写着她七年前用过的名字……"}/><p>小说内容需控制在 8,000～20,000 字内</p></div>}
            <div className="create-actions"><button className="soft-button" onClick={() => createStep === 1 ? setView("works") : setCreateStep(1)}>取消</button><button className="mint-button" onClick={() => createStep === 1 ? setCreateStep(2) : (notify("小说草稿已保存"),setView("works"))}>{createStep === 1 ? "下一步" : "保存草稿"}</button></div>
          </section>}

          {view === "content" && <section className="author-page-card content-page">
            <div className="content-heading"><button onClick={() => setView("works")}>‹</button><div><h1>声声已离商音近</h1><span>9,427字</span></div><button className="mint-button small" onClick={() => notify("已进入正文编辑模式")}>编辑</button><button className="soft-button small" onClick={() => setHistoryOpen(true)}>历史</button></div>
            <article className="novel-content"><h2>第一章　故人来电</h2><p>凌晨两点，商音近接到了一个没有号码归属地的电话。</p><p>听筒另一端只有雨声。她握紧手机，在那段漫长的沉默里，认出了七年前离开的人。</p><p>“声声。”那个人终于开口，“我回来了。”</p></article>
            <div className="content-footer"><span>正文符合 8,000～20,000 字申请要求</span><button className="mint-button" onClick={() => setApplyModal(true)}>申请签约</button></div>
            {historyOpen && <aside className="history-panel"><button onClick={() => setHistoryOpen(false)}>×</button><h3>历史记录</h3><p>保留最近 3 个版本</p><ol><li><b>版本 3</b><span>2026-07-23 10:42 · 9,427字</span></li><li><b>版本 2</b><span>2026-07-22 19:18 · 9,206字</span></li><li><b>版本 1</b><span>2026-07-21 14:06 · 8,811字</span></li></ol></aside>}
          </section>}
        </main>
      </div>

      {applyModal && <div className="overlay" onClick={() => setApplyModal(false)}><div className="author-confirm-modal" onClick={event => event.stopPropagation()}><button className="close" onClick={() => setApplyModal(false)}>×</button><i>♢</i><h2>确认申请签约</h2><p>提交后作品将进入编辑审核，审核期间不可修改正文。</p><ul><li>✓ 正文字数 8,832，符合 8,000～20,000 字要求</li><li>✓ 账号与签约资料已完整</li><li>✓ 作品名称、导语、频道、标签和完结日期已填写</li></ul><div className="modal-actions"><button className="soft-button" onClick={() => setApplyModal(false)}>取消</button><button className="mint-button" onClick={() => {setApplyModal(false);notify("申请签约已提交，作品进入审核中");}}>确认申请</button></div></div></div>}

      {signModal && <div className="overlay" onClick={() => setSignModal(false)}><div className="author-contract-modal live-style" onClick={event => event.stopPropagation()}>
        <button className="close" onClick={() => setSignModal(false)}>×</button><div className="tencent-mark">✓ 腾讯电子签</div><h2>{state === "待作者签署" ? "签署前确认" : "电子合同详情"}</h2><p>《声声已离商音近》短篇小说版权合同（保底）</p>
        <div className="contract-summary"><div><span>签约方式</span><b>保底＋分成</b></div><div><span>税前保底费用</span><b className="money">¥12,000.00</b></div><div><span>甲方</span><b>杭州宝茂（全称待确认）</b></div><div><span>乙方</span><b>石＊京（笔名：溪源）</b></div><div><span>签署顺序</span><b>作者先签 → 平台后签</b></div><div><span>签署截止</span><b>2026-07-30 23:59</b></div></div>
        <div className="signature-scope"><b>本次需完成 2 处签名</b><span>① 主合同签署页　② 附件《版权转让声明函》</span></div><div className="safe-note">签署将在腾讯电子签安全页面完成，返回后以服务端回调更新最终状态。</div>
        {state === "待作者签署" && <><label className="agreement"><input type="checkbox" defaultChecked/> 我已核对合同主体、保底费用和分成规则</label><button className="mint-button wide" disabled={signing} onClick={completeAuthorSign}>{signing ? "正在同步签署结果…" : "前往腾讯电子签"}</button></>}
        {state === "待平台签署" && <div className="waiting-platform"><i>✓</i><b>作者签署已完成</b><span>等待平台方完成第二顺位签署</span></div>}
        {state === "签署完成" && <div className="signed-file-actions"><button className="mint-button" onClick={() => notify("已下载签署完成的合同 PDF")}>下载已签合同</button><button className="soft-button" onClick={() => notify("已下载腾讯电子签证据报告")}>下载证据报告</button></div>}
      </div></div>}
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

  function completePlatformSign() {
    const next = [...states];
    next[selected] = "签署完成";
    setStates(next);
    setDetailOpen(false);
    setToast("平台方签署完成，合同 PDF 与证据报告已归档（占用 2 个版权文件名额）");
    setTimeout(() => setToast(""), 3600);
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
            <label>小说状态<select><option>全部</option></select></label><label>责编<select><option>请选择</option></select></label><label>签约状态<select><option>全部</option><option>待发起</option><option>待作者签署</option><option>待平台签署</option><option>签署完成</option><option>历史线下</option></select></label>
            <label>部门<select><option>全部</option></select></label><label>创建日期<input placeholder="开始日期　至　结束日期"/></label>
            <div className="filter-actions"><button className="primary small">查询</button><button className="secondary small">重置</button><button className="secondary small">导出</button></div>
          </section>
          <div className="table-toolbar"><button className="primary small">新建小说</button><span>电子签约沿用小说数据权限：经理看部门、主编看下属责编、责编看本人小说</span></div>
          <section className="live-table-wrap">
            <table className="live-table"><thead><tr><th>小说ID</th><th>小说名称</th><th>封面</th><th>作者</th><th>编辑</th><th>责编</th><th>部门</th><th>上架类型</th><th>版权类型</th><th>版权文件</th><th>签约状态</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead>
              <tbody>{novels.map((novel, index) => <tr key={novel.id} className={selected === index ? "selected-row" : ""} onClick={() => setSelected(index)}>
                <td>{novel.id}</td><td><button className="novel-link">{novel.name}</button></td><td><span className={`tiny-cover cover-${index}`}>{novel.name.slice(0,2)}</span></td><td>{novel.author}</td><td>{novel.editor}</td><td>{novel.owner}</td><td>{novel.department}</td><td>签约</td><td>自有版权</td>
                <td>{novel.legacy ? <button className="file-link" onClick={event => { event.stopPropagation(); setToast("已打开业务手动上传的历史线下合同"); }}>历史合同-{novel.id}.pdf</button> : states[index] === "签署完成" ? <span className="file-stack"><button className="file-link">已签合同.pdf</button><button className="file-link">证据报告.pdf</button><small>2 / 5</small></span> : "-"}</td>
                <td>{novel.legacy ? <Badge tone="gray">历史线下已上传</Badge> : <Badge tone={states[index] === "签署完成" ? "green" : states[index] === "待作者签署" || states[index] === "待平台签署" ? "orange" : "blue"}>{states[index]}</Badge>}</td><td><span className="online-dot"/>上架</td><td>{novel.createdAt}</td>
                <td><div className="row-actions"><button>修改</button><button>克隆</button>{novel.legacy ? <button className="sign-action" onClick={event => {event.stopPropagation();showContract(index);}}>查看线下合同</button> : states[index] === "待发起" ? <button className="sign-action" onClick={event => {event.stopPropagation();setSelected(index);setLaunchModal(true);}}>发起签约</button> : <button className="sign-action" onClick={event => {event.stopPropagation();showContract(index);}}>查看签约</button>}</div></td>
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
            <div className="green-form-grid"><label>小说名称<input value={selectedNovel.name} readOnly/></label><label>作者笔名<input value={selectedNovel.author} readOnly/></label><label>签约方式<input value={selectedNovel.contractType} readOnly/></label><label>{selectedNovel.contractType === "买断" ? "固定版权费用" : "保底费用"}<input value={`¥ ${selectedNovel.price}`} readOnly/></label></div>
            <div className="form-section-title">电子合同参数</div>
            <div className="green-form-grid">
              <label>合同模板（按签约方式自动匹配）<select disabled defaultValue={selectedNovel.contractType === "买断" ? "buyout" : "guarantee"}><option value="buyout">短篇小说版权合同（买断）</option><option value="guarantee">短篇小说版权合同（保底）</option></select></label>
              <label>签约主体<input value="杭州宝茂（企业全称待确认）" readOnly/></label>
              <label>企业签署方式<select><option>企业经办人签署（签署人待确认）</option></select></label>
              <label>签署顺序<input value="作者先签 → 平台后签" readOnly/></label>
              <label>作者实名<input value="石＊京" readOnly/></label><label>作者手机号<input value="138 **** 6621" readOnly/></label>
              <label>主合同作者签名控件<input value="签署页 · 乙方签字" readOnly/></label><label>声明函作者签名控件<input value="声明人签字" readOnly/></label>
              {selectedNovel.contractType !== "买断" && <><label>分账周期<input value="待业务填写（年）" readOnly/></label><label>结算频率<input value="待业务填写（月/季/年）" readOnly/></label></>}
              <label>签署截止日期<input value="2026-07-30 23:59" readOnly/></label><label>合同通知<select><option>投稿后台＋短信</option></select></label>
            </div>
            <div className="file-capacity"><b>版权文件容量：当前 1 / 5</b><span>签署完成后“已签合同 PDF＋证据报告”各占 1 个，预计变为 3 / 5。</span></div>
            <div className="launch-checks"><b>发起前校验</b><span>✓ 作者签约资料在申请前已完整　✓ 模板与签约方式一致　✓ 金额继承审核结果　✓ 至少剩余 2 个文件名额</span></div>
            <div className="config-warning"><b>生产上线阻塞</b><span>腾讯电子签企业认证、应用、印章及平台签署人尚未配置；此处仅模拟发起。</span></div>
            <div className="modal-actions"><button className="secondary" onClick={() => setLaunchModal(false)}>取消</button><button className="primary" onClick={launchFlow}>模拟发起（Demo）</button></div>
          </div>
        </div>
      )}
      {detailOpen && (
        <div className="overlay side" onClick={() => setDetailOpen(false)}>
          <aside className="contract-drawer" onClick={event => event.stopPropagation()}>
            <button className="close" onClick={() => setDetailOpen(false)}>×</button>
            {selectedNovel.legacy ? <>
              <Badge tone="gray">历史线下已上传</Badge><h2>{selectedNovel.name}</h2><p>签约来源：旧 E签宝 / 线下流程</p>
              <div className="legacy-note">该合同已由业务在线下完成，并按原流程手动上传至小说管理。切换日前未完成的旧合同继续线下签署，不迁移到腾讯电子签。</div>
              <div className="drawer-actions"><button className="secondary">查看已上传合同</button></div>
              <div className="contract-summary vertical"><div><span>合同文件</span><b>历史合同-{selectedNovel.id}.pdf（占 1 / 5）</b></div><div><span>签约方式 / 金额</span><b>{selectedNovel.contractType} / ¥{selectedNovel.price}</b></div><div><span>电子签流程 ID</span><b>无</b></div><div><span>归档方式</span><b>业务手动上传</b></div></div>
            </> : <>
              <Badge tone={selectedState === "签署完成" ? "green" : "orange"}>{selectedState}</Badge><h2>{selectedNovel.name}</h2><p>腾讯电子签流程 ID：yDwFmUUckp****3cqjkGm</p>
              <div className="drawer-actions">
                {selectedState === "待作者签署" && <button className="primary" onClick={() => {setToast("已发送催签提醒");setDetailOpen(false);}}>催签作者</button>}
                {selectedState === "待平台签署" && <button className="primary" onClick={completePlatformSign}>模拟平台签署完成</button>}
                <button className="secondary">查看合同</button>
              </div>
              <div className="contract-summary vertical">
                <div><span>合同编号</span><b>{selectedState === "签署完成" ? "QS202607230018" : "完成双方签署后生成"}</b></div>
                <div><span>合同模板 / 金额</span><b>短篇小说版权合同（{selectedNovel.contractType === "买断" ? "买断" : "保底"}） / ¥{selectedNovel.price}</b></div>
                <div><span>作者签署（第 1 顺位）</span><b>{selectedState === "待作者签署" ? "待签署" : "已完成 · 主合同＋声明函"}</b></div>
                <div><span>平台签署（第 2 顺位）</span><b>{selectedState === "签署完成" ? "已完成" : selectedState === "待平台签署" ? "待企业经办人签署" : "等待作者先签"}</b></div>
                <div><span>版权文件占用</span><b>{selectedState === "签署完成" ? "已签合同＋证据报告：2 / 5" : "完成后预计新增 2 个文件"}</b></div>
              </div>
              <h3>流转留痕</h3><ol className="audit-list">
                <li><b>合同参数确认</b><span>洪娟 · 模板、稿费与签署顺序已保存</span></li>
                <li><b>腾讯电子签流程发起成功</b><span>FlowId 与 RequestId 已保存</span></li>
                <li><b>{selectedState === "待作者签署" ? "等待作者签署" : "作者签署完成"}</b><span>{selectedState === "待作者签署" ? "截止 2026-07-30 23:59" : "主合同与声明函签名控件均完成"}</span></li>
                <li><b>{selectedState === "签署完成" ? "平台签署完成并归档" : "等待平台方签署"}</b><span>{selectedState === "签署完成" ? "合同 PDF 与证据报告已回写版权文件" : "企业签署方式与签署人待最终确认"}</span></li>
              </ol>
            </>}
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
