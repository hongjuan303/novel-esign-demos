"use client";

import { useState } from "react";

type EsignState = "待发起" | "待作者签署" | "待平台签署" | "签署完成";
type ImportStage = "upload" | "preview";

const importedChapters = [
  { title: "第1章　雨夜来信", words: "1,426" },
  { title: "第2章　旧城重逢", words: "1,138" },
  { title: "第3章　被藏起来的真相", words: "1,287" },
  { title: "第4章　第七封信", words: "1,054" },
  { title: "第5章　潮水退去以后", words: "1,216" },
  { title: "第6章　没有寄出的答案", words: "1,108" },
  { title: "第7章　重回旧站台", words: "1,192" },
  { title: "第8章　雨停之后", words: "1,065" },
];

const importedGuide = "一封迟到七年的信，让她重新回到那座被雨困住的海港小城。";
const existingNovelGuide = "七年前离开的人在雨夜归来，一通没有归属地的电话，让被掩埋的旧事重新浮出水面。";
const chapterContentSamples = [
  "海港的雨下了整整三天。林知夏在关店前，从门缝里捡到一封没有寄件地址的信。信封已经被雨水洇湿，右下角却清晰地写着她七年前用过的名字。她站在昏黄的灯下拆开信封，看见第一行字时，窗外恰好响起一声闷雷。",
  "旧城的石板路被雨水洗得发亮。林知夏循着信里的地址，来到已经停运多年的车站。候车室门口站着一个熟悉的身影，他比记忆里更瘦，也更沉默。两个人隔着七年的光阴对望，谁都没有先说那句好久不见。",
  "第二封信藏在旧站台的时刻表后面。纸页上只有一串日期，恰好对应当年事故发生前的七天。林知夏终于意识到，那场被所有人认定为意外的离别，也许从一开始就是有人精心安排的结果。",
  "第七封信没有署名，却写着只有他们两个人知道的约定。她沿着字迹寻找线索，在海堤尽头发现一只生锈的铁盒。盒子里装着旧照片、作废的车票，以及一份迟到了七年的道歉。",
  "潮水退去后，礁石间露出一条隐蔽的小路。林知夏顺着路走到废弃灯塔，墙上仍留着少年时画下的刻度。那些被误解的沉默、没有送达的解释，也终于在这里拼成完整的答案。",
  "他把没有寄出的信一封封摊开，承认自己当年选择离开并不是因为背叛，而是为了替她挡下更危险的真相。林知夏听完没有立刻原谅，只是把最后一个问题重新交还给他。",
  "清晨第一班列车重新停靠旧站台。广播声穿过薄雾，两个人站在相反的方向。林知夏握着那张旧车票，终于决定不再替过去做选择，而是为今天的自己留下答案。",
  "雨在列车进站前停了。阳光落在积水里，也落在第七封信最后一句被反复涂改的话上。她合上信纸，穿过人群走向站台另一端，结束不是遗忘，而是终于能够重新开始。",
];

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
  const [view, setView] = useState<"works" | "income" | "profile" | "editors" | "content" | "draftContent">("works");
  const [signModal, setSignModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [signing, setSigning] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [createNovelModal, setCreateNovelModal] = useState(false);
  const [importNovelModal, setImportNovelModal] = useState(false);
  const [importStage, setImportStage] = useState<ImportStage>("upload");
  const [importFileName, setImportFileName] = useState("");
  const [draftCreated, setDraftCreated] = useState(false);
  const [draftImported, setDraftImported] = useState(false);
  const [novelName, setNovelName] = useState("");
  const [novelIntro, setNovelIntro] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [novelTags, setNovelTags] = useState<string[]>([]);
  const [category, setCategory] = useState<"男频" | "女频">("男频");
  const [novelType, setNovelType] = useState<"长篇" | "短篇">("短篇");
  const [customCover, setCustomCover] = useState(false);
  const [chapterEditor, setChapterEditor] = useState<{ mode: "add" | "edit"; index: number } | null>(null);
  const [chapterText, setChapterText] = useState("");
  const [addedChapter, setAddedChapter] = useState(false);
  const [deletedChapterIds, setDeletedChapterIds] = useState<number[]>([]);
  const [deleteChapterId, setDeleteChapterId] = useState<number | null>(null);

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

  const createNovelValid =
    novelName.trim().length > 0 &&
    finishDate.length > 0 &&
    novelTags.length > 0;

  function openCreateNovel() {
    setNovelName("");
    setNovelIntro("");
    setFinishDate("");
    setNovelTags([]);
    setCategory("男频");
    setNovelType("短篇");
    setCustomCover(false);
    setCreateNovelModal(true);
  }

  function toggleTag(tag: string) {
    setNovelTags(current =>
      current.includes(tag)
        ? current.filter(item => item !== tag)
        : [...current, tag],
    );
  }

  function createNovel() {
    if (!createNovelValid) return;
    setDraftCreated(true);
    setDraftImported(false);
    setAddedChapter(false);
    setDeletedChapterIds([]);
    setCreateNovelModal(false);
    setView("draftContent");
    notify("小说已创建，请继续导入正文");
  }

  function openImportNovel() {
    setImportStage("upload");
    setImportFileName("");
    setImportNovelModal(true);
  }

  function finishImport() {
    const introWasEmpty = novelIntro.trim().length === 0;
    if (introWasEmpty) setNovelIntro(importedGuide);
    setDraftImported(true);
    setImportNovelModal(false);
    notify(introWasEmpty ? "导入成功，已自动使用文档导语补充简介" : "小说正文导入成功");
  }

  const isNewDraftDetail = view === "draftContent";
  const detailNovelName = isNewDraftDetail ? (novelName || "未命名小说") : "声声已离商音近";
  const detailNovelIntro = isNewDraftDetail
    ? (novelIntro || "暂未填写。导入小说后，系统将自动使用文档导语补充简介。")
    : existingNovelGuide;
  const detailBaseChapters = isNewDraftDetail && !draftImported ? [] : importedChapters;
  const detailChapters = [
    ...detailBaseChapters.map((chapter, index) => ({
      ...chapter,
      id: 21001 + index,
      content: chapterContentSamples[index],
    })),
    ...(addedChapter
      ? [{
          id: 21009,
          title: `第${detailBaseChapters.length + 1}章　手动新增章节`,
          words: "328",
          content: chapterContentSamples[0],
        }]
      : []),
  ].filter(chapter => !deletedChapterIds.includes(chapter.id));

  function openChapterEditor(mode: "add" | "edit", index = 0) {
    setChapterEditor({ mode, index });
    setChapterText(mode === "add"
      ? ""
      : `${detailChapters[index]?.content || ""}\n\n本章正文示例已完整录入，作者可在此继续修改内容并保存。`);
  }

  function switchChapter(direction: -1 | 1) {
    if (!chapterEditor || chapterEditor.mode !== "edit") return;
    const nextIndex = chapterEditor.index + direction;
    if (nextIndex < 0 || nextIndex >= detailChapters.length) return;
    setChapterEditor({ mode: "edit", index: nextIndex });
    setChapterText(`${detailChapters[nextIndex]?.content || ""}\n\n本章正文示例已完整录入，作者可在此继续修改内容并保存。`);
  }

  function saveChapter() {
    if (!chapterEditor || chapterText.trim().length === 0) return;
    if (chapterEditor.mode === "add") {
      setAddedChapter(true);
      notify(`第${detailChapters.length + 1}章已保存`);
    } else {
      notify(`${detailChapters[chapterEditor.index]?.title || "章节"}已保存`);
    }
    setChapterEditor(null);
  }

  function confirmDeleteChapter() {
    if (deleteChapterId === null) return;
    const chapter = detailChapters.find(item => item.id === deleteChapterId);
    setDeletedChapterIds(current => [...current, deleteChapterId]);
    setDeleteChapterId(null);
    notify(`${chapter?.title || "章节"}已删除`);
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
          {menuItems.map(item => <button key={item.id} className={view === item.id || (item.id === "works" && (view === "content" || view === "draftContent")) ? "active" : ""} onClick={() => setView(item.id)}>
            <i>{item.icon}</i><span>{item.label}</span>
          </button>)}
        </aside>

        <main className="author-live-main">
          {view === "works" && <>
            <section className="author-live-filter">
              <select defaultValue="all"><option value="all">全部状态</option><option>草稿</option><option>审核中</option><option>待签约</option><option>签约完成</option><option>终止签约</option></select>
              <input placeholder="⌕ 查询小说名称" />
              <button className="mint-button">查 询</button>
              <button className="mint-button create" onClick={openCreateNovel}>⊕ 新建小说</button>
            </section>
            <section className="author-work-list">
              {draftCreated && <article className="author-work-row new-draft-row">
                <div className={`live-cover generated ${customCover ? "custom" : ""}`}><span>{novelName}</span></div>
                <div className="live-work-main">
                  <div className="live-work-title"><h2>{novelName}</h2><span className="live-status draft">草稿</span></div>
                  <p>溪源 著</p>
                  <small>{draftImported ? "9,486字" : "0字"}　｜　{category} · {novelType} · {novelTags.join("、")}</small>
                  <div className={`live-contract-line ${draftImported ? "plain" : ""}`}>{draftImported ? "正文已导入，可继续校对章节和申请签约" : "基础信息已保存，请导入 .doc / .docx 小说正文"}</div>
                </div>
                <div className="live-work-actions">
                  <button className="inline-mint" onClick={() => setView("draftContent")}>▱ 小说详情</button>
                  <button className="pill-action" onClick={() => {setView("draftContent"); if (!draftImported) openImportNovel();}}>{draftImported ? "查看作品" : "导入小说"}</button>
                </div>
              </article>}
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

          {(view === "draftContent" || view === "content") && <section className="author-page-card greenlike-detail-page">
            <div className="greenlike-breadcrumb">
              <button onClick={() => setView("works")}>作品管理</button><span>/</span><b>小说详情</b>
            </div>
            <div className="greenlike-detail-toolbar">
              <button className="mint-button" onClick={openImportNovel}>导入小说</button>
              <button className="mint-button" onClick={() => openChapterEditor("add")}>新增章节</button>
              <button className="mint-button" onClick={() => notify(`已下载《${detailNovelName}》.docx`)}>下载</button>
            </div>
            <div className="greenlike-novel-summary">
              <div className={`greenlike-cover generated ${customCover && isNewDraftDetail ? "custom" : ""}`}>
                <span>{detailNovelName}</span>
              </div>
              <div className="greenlike-summary-copy">
                <div className="greenlike-title-line">
                  <h1>{detailNovelName}</h1>
                  {isNewDraftDetail && <span className="live-status draft">草稿</span>}
                </div>
                <div className="greenlike-guide">
                  <b>导语</b>
                  <p>{detailNovelIntro}</p>
                  {isNewDraftDetail && !novelIntro && <small>导入正文后将自动使用文档导语补充</small>}
                </div>
              </div>
            </div>
            <div className="greenlike-chapter-table">
              <table>
                <thead><tr><th>id</th><th>章节</th><th>是否付费</th><th>字数</th><th>更新时间</th><th>操作</th></tr></thead>
                <tbody>
                  {detailChapters.map((chapter, index) => <tr key={chapter.id}>
                    <td>{chapter.id}</td>
                    <td><b>{chapter.title}</b></td>
                    <td><span className={index >= 4 ? "chapter-paid" : "chapter-free"}>{index >= 4 ? "付费" : "免费"}</span></td>
                    <td>{chapter.words}</td>
                    <td>2026-07-27 14:{18 + index}</td>
                    <td><button onClick={() => openChapterEditor("edit", index)}>编辑</button><button className="delete" onClick={() => setDeleteChapterId(chapter.id)}>删除</button></td>
                  </tr>)}
                </tbody>
              </table>
              {detailChapters.length === 0 && <div className="greenlike-empty-table">
                <div>DOCX</div>
                <b>暂无章节内容</b>
                <p>可导入 .doc、.docx 小说文件，或逐章新增内容</p>
                <button className="mint-button" onClick={openImportNovel}>导入小说</button>
              </div>}
            </div>
          </section>}
        </main>
      </div>

      {createNovelModal && <div className="overlay" onClick={() => setCreateNovelModal(false)}>
        <div className="author-novel-modal" onClick={event => event.stopPropagation()}>
          <div className="novel-modal-header"><div><h2>新建小说</h2><p>先创建作品信息，再进入详情导入小说正文</p></div><button className="close" onClick={() => setCreateNovelModal(false)}>×</button></div>
          <div className="novel-modal-body">
            <aside className="cover-builder">
              <div className={`generated-cover-preview ${customCover ? "custom" : ""}`}><span>{novelName || "小说名称"}</span><small>{customCover ? "自定义封面预览" : "默认封面预览"}</small></div>
              <button className="cover-upload-button" onClick={() => setCustomCover(!customCover)}>{customCover ? "恢复默认封面" : "上传封面"}</button>
              <p>非必填。不上传时使用默认底图，并自动叠加小说名称。</p>
            </aside>
            <div className="author-create-form">
              <section><h3>小说信息</h3>
                <label className="form-field"><span><b>*</b> 小说名称</span><div><input value={novelName} onChange={event => setNovelName(event.target.value)} placeholder="请输入小说名称" maxLength={50}/><small>{novelName.length}/50</small></div></label>
                <label className="form-field"><span>简介</span><div><textarea value={novelIntro} onChange={event => setNovelIntro(event.target.value)} placeholder="请输入简介（选填）" maxLength={500}/><small>{novelIntro.length}/500</small><em>若未填写，导入小说后自动使用文档导语补充</em></div></label>
                <label className="form-field"><span><b>*</b> 完结日期</span><div><input type="date" value={finishDate} onChange={event => setFinishDate(event.target.value)}/><em>精确到天</em></div></label>
              </section>
              <section><h3>内容信息</h3>
                <div className="form-field"><span><b>*</b> 标签</span><div className="tag-picker">{["都市情感","悬疑推理","现实生活","追妻火葬场","女性成长","爽文"].map(tag => <button type="button" key={tag} className={novelTags.includes(tag) ? "selected" : ""} onClick={() => toggleTag(tag)}>{novelTags.includes(tag) ? "✓ " : ""}{tag}</button>)}<em>至少选择 1 个标签</em></div></div>
                <div className="form-field"><span><b>*</b> 分类</span><div className="choice-cards"><button type="button" className={category === "男频" ? "selected" : ""} onClick={() => setCategory("男频")}>男频</button><button type="button" className={category === "女频" ? "selected" : ""} onClick={() => setCategory("女频")}>女频</button></div></div>
                <div className="form-field"><span><b>*</b> 小说类型</span><div className="choice-cards"><button type="button" className={novelType === "长篇" ? "selected" : ""} onClick={() => setNovelType("长篇")}>长篇</button><button type="button" className={novelType === "短篇" ? "selected" : ""} onClick={() => setNovelType("短篇")}>短篇</button></div></div>
              </section>
            </div>
          </div>
          <div className="novel-modal-footer"><span>{createNovelValid ? "信息已完整，可以创建" : "请填写小说名称、完结日期并至少选择 1 个标签"}</span><button className="soft-button" onClick={() => setCreateNovelModal(false)}>取消</button><button className="mint-button" disabled={!createNovelValid} onClick={createNovel}>确定创建</button></div>
        </div>
      </div>}

      {importNovelModal && <div className="overlay" onClick={() => setImportNovelModal(false)}>
        <div className="author-import-modal" onClick={event => event.stopPropagation()}>
          <div className="novel-modal-header"><div><h2>导入小说</h2><p>{novelName || "当前小说"} · 支持 .doc、.docx</p></div><button className="close" onClick={() => setImportNovelModal(false)}>×</button></div>
          {importStage === "upload" ? <div className="import-modal-content">
            <button className={`import-dropzone ${importFileName ? "has-file" : ""}`} onClick={() => setImportFileName("雨停之后的第七封信.docx")}>
              <i>{importFileName ? "DOCX" : "⇧"}</i>
              {importFileName ? <><b>{importFileName}</b><span>186 KB · 已选择</span><em>点击重新选择</em></> : <><b>将文件拖到此处，或点击上传</b><span>支持扩展名：.doc、.docx，单个文件不超过 20MB</span></>}
            </button>
            <div className="import-rules"><b>导入说明</b><ul><li>系统按“第1章 / 第一章”等标题自动拆分章节</li><li>导入前可预览章节名称、数量和字数</li><li>新建时未填写简介，将自动使用文档导语补充</li><li>已有简介不会被覆盖</li></ul></div>
          </div> : <div className="import-preview-content">
            <div className="preview-summary"><i>✓</i><div><b>文件解析完成</b><span>{importFileName} · 识别到 8 章，共 9,486 字</span></div></div>
            <div className="extracted-guide"><b>识别到文档导语</b><p>{importedGuide}</p><span>{novelIntro ? "当前小说已有简介，本次导入不会覆盖。" : "当前小说未填写简介，确认导入后将自动回填。"}</span></div>
            <div className="preview-chapters"><div><b>章节预览</b><span>共 8 章</span></div><table><thead><tr><th>序号</th><th>章节名称</th><th>字数</th><th>识别结果</th></tr></thead><tbody>{importedChapters.slice(0,4).map((chapter,index) => <tr key={chapter.title}><td>{index + 1}</td><td>{chapter.title}</td><td>{chapter.words}</td><td><span>正常</span></td></tr>)}</tbody></table><p>另有 4 章已识别，确认导入后将全部写入。</p></div>
          </div>}
          <div className="novel-modal-footer"><span>{importStage === "upload" ? "选择文件后可预览识别结果" : "请确认章节拆分和导语内容"}</span><button className="soft-button" onClick={() => importStage === "preview" ? setImportStage("upload") : setImportNovelModal(false)}>{importStage === "preview" ? "上一步" : "取消"}</button><button className="mint-button" disabled={importStage === "upload" && !importFileName} onClick={() => importStage === "upload" ? setImportStage("preview") : finishImport()}>{importStage === "upload" ? "预览" : "确认导入"}</button></div>
        </div>
      </div>}

      {chapterEditor && <div className="overlay" onClick={() => setChapterEditor(null)}>
        <div className="chapter-editor-modal" role="dialog" aria-label={chapterEditor.mode === "add" ? "新增章节" : "编辑章节"} onClick={event => event.stopPropagation()}>
          <div className="chapter-editor-header">
            <h2>{chapterEditor.mode === "add" ? "新增章节" : "编辑章节"}</h2>
            <button aria-label="Close" onClick={() => setChapterEditor(null)}>×</button>
          </div>
          <div className="chapter-editor-body">
            <input
              disabled
              value={chapterEditor.mode === "add"
                ? `第${detailChapters.length + 1}章`
                : (detailChapters[chapterEditor.index]?.title || "章节")}
              readOnly
            />
            <div className="chapter-textarea-wrap">
              <textarea
                value={chapterText}
                onChange={event => setChapterText(event.target.value)}
                placeholder="这里是小说章节内容，至少100，至多10000字"
                maxLength={10000}
              />
              <span>{chapterText.length}/10000</span>
            </div>
          </div>
          <div className="chapter-editor-footer">
            <button
              className="soft-button"
              disabled={chapterEditor.mode === "add" || chapterEditor.index === 0}
              onClick={() => switchChapter(-1)}
            >上一章</button>
            <button
              className="soft-button"
              disabled={chapterEditor.mode === "add" || chapterEditor.index >= detailChapters.length - 1}
              onClick={() => switchChapter(1)}
            >下一章</button>
            <i />
            <button className="soft-button" onClick={() => setChapterEditor(null)}>取消</button>
            <button className="mint-button" disabled={chapterText.trim().length < 100} onClick={saveChapter}>保存</button>
          </div>
        </div>
      </div>}

      {deleteChapterId !== null && <div className="overlay" onClick={() => setDeleteChapterId(null)}>
        <div className="author-delete-dialog" role="dialog" aria-label="删除章节" onClick={event => event.stopPropagation()}>
          <button className="close" aria-label="Close" onClick={() => setDeleteChapterId(null)}>×</button>
          <div className="delete-warning">!</div>
          <p>确认删除 {detailChapters.find(chapter => chapter.id === deleteChapterId)?.title || "该章节"}吗？</p>
          <span>删除后不可恢复，请谨慎操作。</span>
          <div><button className="soft-button" onClick={() => setDeleteChapterId(null)}>取消</button><button className="danger-button" onClick={confirmDeleteChapter}>确定</button></div>
        </div>
      </div>}

      {applyModal && <div className="overlay" onClick={() => setApplyModal(false)}><div className="author-confirm-modal" onClick={event => event.stopPropagation()}><button className="close" onClick={() => setApplyModal(false)}>×</button><i>♢</i><h2>确认申请签约</h2><p>提交后作品将进入编辑审核，审核期间不可修改正文。</p><ul><li>✓ 正文字数 8,832，符合 8,000～20,000 字要求</li><li>✓ 账号与签约资料已完整</li><li>✓ 小说名称、分类、标签、小说类型和完结日期已填写</li></ul><div className="modal-actions"><button className="soft-button" onClick={() => setApplyModal(false)}>取消</button><button className="mint-button" onClick={() => {setApplyModal(false);notify("申请签约已提交，作品进入审核中");}}>确认申请</button></div></div></div>}

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
