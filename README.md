# 小说电子签高保真原型

基于现有作者投稿后台和内部绿台小说管理，演示接入腾讯电子签后的完整线上签约流程。

## 在线访问

- GitHub Pages：<https://hongjuan303.github.io/html-prototypes/novel-esign-demos/>
- Sites 备用地址：<https://novel-esign-demos.hj844860.chatgpt.site/>

## 原型范围

- 作者投稿后台：作品管理、创建小说、内容编辑、申请签约、签约资料、合同核对与签署、收益记录。
- 内部绿台：买断/保底模板匹配、双财务无顺序审核与批量审核、作者先签、法务内部确认经办人并手动选章、签约进度、合同和证据报告归档。

## 流程图

- 主流程图：`public/diagrams/novel-esign-main-flow-dual-finance.png`
- 角色泳道图：`public/diagrams/novel-esign-swimlane-dual-finance.png`
- 可编辑主流程图：https://www.figma.com/board/WXZndQPTYF8xQr63GiFub7
- 可编辑角色泳道图：https://www.figma.com/board/GvdS39VmSCC4k8Wq8DTXvC
- 历史兼容：旧 E签宝合同由业务手动上传；切换日前未完成的流程继续线下完成。

完整需求见 [`小说电子签接入PRD-V1.3.md`](./小说电子签接入PRD-V1.3.md)。

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm ci
npm run dev
```

## 构建

```bash
# Sites / vinext 构建
npm run build

# GitHub Pages 静态构建，输出到 out/
npm run build:pages
```

GitHub Pages 成品发布在 `hongjuan303/html-prototypes` 仓库的
`novel-esign-demos/` 目录；该仓库沿用现有的 `main` 分支 Pages 发布方式。
