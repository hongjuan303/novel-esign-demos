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
    /草稿[\s\S]*待签约[\s\S]*签约中[\s\S]*签约完成/,
  );
  assert.match(page, /申请签约/);
  assert.match(page, /查看进度/);
  assert.match(page, /小说详情/);
  assert.match(page, /签约日期/);
  assert.doesNotMatch(page, /到账状态/);
});
