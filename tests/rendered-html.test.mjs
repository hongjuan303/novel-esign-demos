import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const outputRoot = new URL("../out/", import.meta.url);
const pagesBase = "/html-prototypes/novel-esign-demos/";

async function readOutputAssets() {
  const files = await readdir(new URL("assets/", outputRoot));
  const jsFile = files.find((file) => file.endsWith(".js"));
  const cssFile = files.find((file) => file.endsWith(".css"));
  assert.ok(jsFile, "Pages build must emit a JavaScript bundle");
  assert.ok(cssFile, "Pages build must emit a CSS bundle");
  const [javascript, css] = await Promise.all([
    readFile(new URL(`assets/${jsFile}`, outputRoot), "utf8"),
    readFile(new URL(`assets/${cssFile}`, outputRoot), "utf8"),
  ]);
  return { files, javascript, css };
}

test("builds a GitHub Pages entry with the required repository base path", async () => {
  const html = await readFile(new URL("index.html", outputRoot), "utf8");
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>小说电子签全链路原型<\/title>/);
  assert.match(html, new RegExp(`${pagesBase}assets/[^"]+\\.js`));
  assert.match(html, new RegExp(`${pagesBase}assets/[^"]+\\.css`));
  assert.doesNotMatch(html, /src="\/assets\//);
  assert.doesNotMatch(html, /href="\/assets\//);
});

test("ships both author and internal-admin flows in the production bundle", async () => {
  const { javascript } = await readOutputAssets();
  for (const requiredText of [
    "作者投稿后台",
    "内部绿台",
    "作品管理",
    "收益管理",
    "签约管理",
    "拟定合同",
    "提交财务审核",
    "审核驳回",
    "审核通过",
    "法务选择印章",
    "签约管理选择",
    "设置付费",
  ]) {
    assert.match(javascript, new RegExp(requiredText));
  }
});

test("keeps the contract preview and control panel independently scrollable", async () => {
  const [{ css }, page] = await Promise.all([
    readOutputAssets(),
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
  ]);
  assert.match(page, /draft-page-stack/);
  assert.match(page, /合同填写控件，可上下滚动查看全部字段/);
  assert.match(page, /author-sync-heading/);
  assert.match(
    css,
    /\.contract-fill-panel\{[^}]*(?:overflow-y:scroll|overflow:hidden scroll)/,
  );
  assert.match(
    css,
    /\.draft-document-workspace>main\{[^}]*(?:overflow-y:auto|overflow:hidden auto)/,
  );
});

test("matches the confirmed author work and income rules", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  assert.match(
    page,
    /草稿[\s\S]*待签约[\s\S]*签约中[\s\S]*签约完成[\s\S]*签约终止/,
  );
  assert.match(page, /申请签约/);
  assert.match(page, /查看进度/);
  assert.match(page, /编辑小说信息/);
  assert.match(page, /work-cover-link/);
  assert.match(page, /责编正在拟定合同中，请稍后查看进度/);
  assert.match(page, /合同名称[\s\S]*签约税前金额/);
  assert.doesNotMatch(page, /state === "签署完成" \? "电子合同详情" : "签约进度"/);
  assert.match(page, /签约税前金额/);
  assert.match(page, /本次需完成 2 处签名/);
  assert.match(page, /请使用手机扫码签署/);
  assert.match(page, /复制签署链接/);
  assert.match(page, /二维码有效期 30 分钟/);
  assert.doesNotMatch(page, /前往腾讯电子签/);
  assert.match(page, />编辑<\/button>/);
  assert.match(page, />删除<\/button>/);
  assert.match(page, /确认删除该本小说吗\?/);
  assert.match(page, /小说一旦删除，将无法恢复/);
  assert.match(page, /小说《\$\{name\}》已删除/);
  assert.doesNotMatch(page, /溪源 著/);
  assert.doesNotMatch(page, />小说详情<\/button>/);
  assert.match(page, /live-status terminated">签约终止/);
  assert.match(page, /该小说签约终止，如有疑问请联系编辑确认/);
  assert.match(page, /小说详情/);
  assert.match(page, /签约日期/);
  assert.doesNotMatch(page, /到账状态/);
});

test("does not expose legal signer identities in the seal dialog", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  assert.match(page, /法务内部自行确认本次签章经办人/);
  assert.match(page, /当前账号具备用印权限/);
  assert.doesNotMatch(page, /法务人员A|法务人员B/);
  assert.doesNotMatch(page, /当前签章占用|取消并释放占用|先操作先占用/);
});

test("requires two unordered finance approvals and supports batch review", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  assert.match(page, /财务审核人A/);
  assert.match(page, /财务审核人B/);
  assert.match(page, /两名财务并行审核、无先后顺序/);
  assert.match(page, /两名财务全部通过后才同步给作者/);
  assert.match(page, /批量审核合同/);
  assert.match(page, /本次批量操作只记录当前财务的审核结果，不代替另一名财务/);
  assert.match(page, /本人已审核通过/);
  assert.match(page, /任一财务驳回后/);
});

test("selects an author from author management with a manual fallback", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  assert.match(page, /搜索并单选作者管理中的作者/);
  assert.match(page, /优先选择作者管理已有作者/);
  assert.match(page, /作者管理中没有？手动输入作者笔名/);
  assert.match(page, /已关联作者管理/);
  assert.match(page, /返回选择作者管理/);
  assert.match(page, /作者笔名：手动录入/);
});

test("configures a required editable nickname for data-permission users", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  assert.match(page, /adminView === "permissions"/);
  assert.match(page, /数据权限配置/);
  assert.match(page, /新增用户/);
  assert.match(page, /选择用户后，花名默认展示用户名，可直接修改/);
  assert.match(page, /existing\?\.nickname \|\| option\?\.username/);
  assert.match(page, /permissionNickname\.trim\(\)/);
  assert.match(page, /请输入花名/);
  assert.match(page, /花名用于业务展示，数据权限仍按用户ID判断/);
  assert.match(page, /同一用户跨部门共用一个花名/);
});

test("lets an author without a contract editor choose one", async () => {
  const page = await readFile(new URL("app/page.tsx", projectRoot), "utf8");
  assert.match(page, /请选择签约编辑/);
  assert.match(page, /aria-label="选择签约编辑"/);
  assert.match(page, /确认选择/);
  assert.match(page, /签约编辑已绑定为/);
  assert.match(page, /disabled=\{!pendingContractEditor\}/);
});
