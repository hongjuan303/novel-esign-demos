"use client";

import { useRef, useState } from "react";

type EsignState = "待拟定合同" | "待合同审核" | "待作者签署" | "待法务签章" | "签署完成" | "已拒绝签约";
type ImportStage = "upload" | "preview";
type SealName = "杭州宝茂网络科技有限公司合同专用章" | "杭州宝茂网络科技有限公司公章";
type FinanceReviewer = "财务审核人A" | "财务审核人B";
type AdminView = "novels" | "contracts" | "permissions";
type PermissionUser = {
  id: string;
  username: string;
  nickname: string;
  role: string;
  department: string;
};
type AuthorExistingNovelKey = "contract" | "pending" | "draft" | "completed";
type AuthorNovelEditValues = {
  name: string;
  intro: string;
  finishDate: string;
  tags: string[];
  category: "男频" | "女频";
  novelType: "长篇" | "短篇";
  customCover: boolean;
  coverClass: "purple" | "teal" | "sand" | "rose";
};

const authorNovelDefaults: Record<AuthorExistingNovelKey, AuthorNovelEditValues> = {
  contract: {
    name: "声声已离商音近",
    intro: "七年前离开的人在雨夜归来，一通没有归属地的电话，让被掩埋的旧事重新浮出水面。",
    finishDate: "2026-07-22",
    tags: ["都市情感", "女性成长"],
    category: "女频",
    novelType: "短篇",
    customCover: true,
    coverClass: "purple",
  },
  pending: {
    name: "消失的女儿",
    intro: "女儿失踪后的第七天，一张旧照片将母亲带回被所有人刻意回避的真相。",
    finishDate: "2026-07-21",
    tags: ["悬疑推理", "女性成长"],
    category: "女频",
    novelType: "短篇",
    customCover: true,
    coverClass: "teal",
  },
  draft: {
    name: "雾港来信",
    intro: "一封迟到七年的信，让她重新回到那座被雨困住的海港小城。",
    finishDate: "2026-07-20",
    tags: ["都市情感", "现实生活"],
    category: "男频",
    novelType: "短篇",
    customCover: true,
    coverClass: "sand",
  },
  completed: {
    name: "月光落在旧站台",
    intro: "旧站台重新启用的那天，她终于等到那列迟到了十年的火车。",
    finishDate: "2025-12-28",
    tags: ["现实生活", "都市情感"],
    category: "女频",
    novelType: "短篇",
    customCover: true,
    coverClass: "rose",
  },
};

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
    id: "1045",
    name: "雾港来信",
    author: "苏木",
    editor: "泡芙",
    owner: "吴鑫鑫",
    department: "七月工作室",
    price: "9,800",
    contractType: "保底＋分成",
    legacy: false,
    createdAt: "2026-07-22 17:31:08",
  },
  {
    id: "1044",
    name: "第七封信",
    author: "南乔",
    editor: "元元",
    owner: "柴文静",
    department: "钱行工作室",
    price: "11,000",
    contractType: "买断",
    legacy: false,
    createdAt: "2026-07-22 16:42:26",
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
  {
    id: "1043",
    name: "长夜告白",
    author: "鹿鸣",
    editor: "长青",
    owner: "吴鑫鑫",
    department: "钱行工作室",
    price: "10,500",
    contractType: "买断",
    legacy: false,
    createdAt: "2026-07-21 15:26:38",
  },
];

const financeReviewers: FinanceReviewer[] = ["财务审核人A", "财务审核人B"];

const managedAuthors = [
  { id: "AU1028", penName: "溪源", legalName: "石＊京", mobile: "138 **** 6621" },
  { id: "AU1031", penName: "猫耳朵", legalName: "陈＊然", mobile: "186 **** 5718" },
  { id: "AU1042", penName: "苏木", legalName: "苏＊", mobile: "159 **** 2036" },
  { id: "AU1057", penName: "南乔", legalName: "乔＊南", mobile: "137 **** 9042" },
  { id: "AU1063", penName: "鹿鸣", legalName: "陆＊明", mobile: "188 **** 1169" },
] as const;

const permissionUserOptions = [
  { id: "U1001", username: "王娅" },
  { id: "U1002", username: "赵婷婷" },
  { id: "U1003", username: "黄雅婕" },
  { id: "U1004", username: "唐娟" },
  { id: "U1005", username: "刘萌" },
  { id: "U1006", username: "洪娟" },
] as const;

const initialPermissionUsers: PermissionUser[] = [
  { id: "U1001", username: "王娅", nickname: "王娅", role: "主编", department: "钱行工作室" },
  { id: "U1002", username: "赵婷婷", nickname: "婷婷", role: "责编", department: "钱行工作室" },
  { id: "U1003", username: "黄雅婕", nickname: "雅婕", role: "责编", department: "钱行工作室" },
  { id: "U1004", username: "唐娟", nickname: "娟娟", role: "财务", department: "七月工作室" },
  { id: "U1005", username: "刘萌", nickname: "刘萌", role: "经理", department: "七月工作室" },
];

const templateControlGroups = [
  { group: "甲方联系人与商业金额", count: 4, source: "企业配置＋责编拟定", handling: "审核通过后由绿台 API 预填并锁定", status: "已映射" },
  { group: "作者身份、联系方式与收款账户", count: 17, source: "作者签约资料", handling: "默认同步；责编拟定时可修订，提交审核后锁定本次合同快照", status: "已映射" },
  { group: "小说与作品信息", count: 8, source: "作者签约申请", handling: "同一字段同步填入合同全部重复位置", status: "已映射" },
  { group: "合同签订日与版权转让日", count: 2, source: "签署结果", handling: "建议使用双方完成签署日，待法务确认", status: "待确认" },
  { group: "身份证正反面附件", count: 2, source: "作者签约资料", handling: "加密读取，预览脱敏，写入最终合同附件", status: "已映射" },
  { group: "作者签名、签署日期与企业印章", count: 5, source: "腾讯电子签", handling: "签署过程中生成，不允许绿台伪造", status: "签署生成" },
] as const;

type PreviewField = {
  left: number;
  top: number;
  value: string;
  width?: number;
  tone?: "normal" | "pending" | "sign";
};

type ContractPrefillValues = {
  legalName: string;
  penName: string;
  mobile: string;
  idNumber: string;
  address: string;
  bankName: string;
  bankAccount: string;
};

function amountToChinese(amount: string) {
  const value = Math.floor(Number(amount.replace(/[^\d.]/g, "")));
  if (!Number.isFinite(value) || value < 0) return "待填写";
  if (value === 0) return "零元整";
  const digits = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const units = ["", "拾", "佰", "仟", "万", "拾万", "佰万", "仟万", "亿"];
  const valueText = String(value);
  let result = "";
  let zeroPending = false;
  for (let index = 0; index < valueText.length; index += 1) {
    const digit = Number(valueText[index]);
    const position = valueText.length - index - 1;
    if (digit === 0) {
      if (result && valueText.slice(index + 1).split("").some(char => char !== "0")) zeroPending = true;
      continue;
    }
    if (zeroPending) {
      result += "零";
      zeroPending = false;
    }
    result += `${digits[digit]}${units[position] || ""}`;
  }
  return `${result}元整`;
}

function guaranteePreviewFields(
  page: number,
  novelName: string,
  penName: string,
  amount: string,
  values?: Partial<ContractPrefillValues>,
): PreviewField[] {
  const legalName = values?.legalName || "石京";
  const authorPenName = values?.penName || penName;
  const mobile = values?.mobile || "138 **** 6621";
  const idNumber = values?.idNumber || "3301**********2214";
  const address = values?.address || "浙江省杭州市西湖区文三路88号";
  const bankName = values?.bankName || "招商银行杭州文三路支行";
  const bankAccount = values?.bankAccount || "6225 **** **** 8821";
  const completionDate = "2026年7月22日";
  const contractDate = "双方完成签署日";

  const fields: Record<number, PreviewField[]> = {
    1: [
      { left: 25, top: 11.7, value: "凌文涛", width: 12 },
      { left: 19, top: 15.2, value: "0571-8800 6621", width: 20 },
      { left: 28, top: 20.4, value: legalName, width: 29 },
      { left: 24, top: 22.5, value: legalName, width: 20 },
      { left: 19, top: 24.4, value: address, width: 49 },
      { left: 19, top: 26.4, value: mobile, width: 20 },
      { left: 34, top: 28.4, value: idNumber, width: 25 },
      { left: 22, top: 42.9, value: novelName, width: 65 },
      { left: 20, top: 46.9, value: legalName, width: 17 },
      { left: 48, top: 46.9, value: authorPenName, width: 27 },
      { left: 14, top: 48.9, value: idNumber, width: 24 },
      { left: 22, top: 52.8, value: "88,320", width: 10 },
      { left: 26, top: 56.6, value: completionDate, width: 24 },
    ],
    2: [
      { left: 26, top: 74.1, value: amount.replace(/,/g, ""), width: 12 },
      { left: 47, top: 74.1, value: amountToChinese(amount), width: 28 },
    ],
    3: [
      { left: 22, top: 66.5, value: bankName, width: 57 },
      { left: 22, top: 68.6, value: legalName, width: 31 },
      { left: 20, top: 70.6, value: bankAccount, width: 28 },
      { left: 14, top: 80.3, value: bankName, width: 36 },
      { left: 58, top: 80.3, value: bankAccount, width: 30 },
      { left: 14, top: 82.3, value: legalName, width: 34 },
    ],
    7: [
      { left: 22, top: 23.2, value: "腾讯电子签企业印章控件", width: 31, tone: "sign" },
      { left: 19, top: 25.5, value: "法务签章时自动生成", width: 24, tone: "sign" },
      { left: 26, top: 34.3, value: "腾讯电子签作者签名控件", width: 29, tone: "sign" },
      { left: 19, top: 38.0, value: "作者签署时自动生成", width: 24, tone: "sign" },
    ],
    8: [
      { left: 27, top: 11.7, value: contractDate, width: 20, tone: "pending" },
      { left: 22, top: 15.1, value: novelName, width: 64 },
      { left: 22, top: 21.8, value: novelName, width: 65 },
      { left: 20, top: 25.8, value: legalName, width: 18 },
      { left: 49, top: 25.8, value: authorPenName, width: 28 },
      { left: 14, top: 27.8, value: idNumber, width: 24 },
      { left: 22, top: 31.7, value: "88,320", width: 10 },
      { left: 26, top: 35.7, value: completionDate, width: 24 },
      { left: 45, top: 41.5, value: contractDate, width: 22, tone: "pending" },
    ],
    9: [
      { left: 67, top: 10.0, value: "作者声明函签名控件", width: 24, tone: "sign" },
      { left: 67, top: 12.0, value: "签署日期自动生成", width: 24, tone: "sign" },
      { left: 19, top: 21.5, value: "身份证正反面已加密预填 · 预览脱敏", width: 42, tone: "pending" },
    ],
    10: [
      { left: 10, top: 10.8, value: "一封迟到七年的信，让她重新回到那座被雨困住的海港小城。", width: 78 },
    ],
  };

  return fields[page] || [];
}

function buyoutPreviewFields(
  page: number,
  novelName: string,
  penName: string,
  amount: string,
  values?: Partial<ContractPrefillValues>,
): PreviewField[] {
  const legalName = values?.legalName || "石京";
  const authorPenName = values?.penName || penName;
  const mobile = values?.mobile || "138 **** 6621";
  const idNumber = values?.idNumber || "3301**********2214";
  const address = values?.address || "浙江省杭州市西湖区文三路88号";
  const bankName = values?.bankName || "招商银行杭州文三路支行";
  const bankAccount = values?.bankAccount || "6225 **** **** 8821";
  const fields: Record<number, PreviewField[]> = {
    1: [
      { left: 20, top: 9.3, value: "杭州宝茂网络科技有限公司", width: 34 },
      { left: 20, top: 11.1, value: "凌文涛", width: 13 },
      { left: 20, top: 12.9, value: "浙江省杭州市西湖区文三路88号", width: 42 },
      { left: 20, top: 14.8, value: "0571-8800 6621", width: 21 },
      { left: 25, top: 16.7, value: "91330110MA2JOWL6XW", width: 27 },
      { left: 22, top: 21.6, value: legalName, width: 17 },
      { left: 16, top: 23.5, value: address, width: 45 },
      { left: 16, top: 25.3, value: mobile, width: 19 },
      { left: 27, top: 27.2, value: idNumber, width: 27 },
      { left: 20, top: 37.7, value: novelName, width: 57 },
      { left: 16, top: 39.7, value: legalName, width: 16 },
      { left: 42, top: 39.7, value: authorPenName, width: 22 },
      { left: 18, top: 43.5, value: "88,320", width: 11 },
      { left: 20, top: 47.1, value: "2026年7月22日", width: 22 },
    ],
    2: [
      { left: 53, top: 24.3, value: `人民币 ${amountToChinese(amount)}`, width: 27 },
      { left: 18, top: 34.1, value: bankName, width: 34 },
      { left: 18, top: 36.1, value: legalName, width: 17 },
      { left: 15, top: 38.0, value: bankAccount, width: 25 },
      { left: 53, top: 47.3, value: bankName, width: 32 },
      { left: 68, top: 49.1, value: bankAccount, width: 22 },
    ],
    5: [
      { left: 14, top: 7.6, value: legalName, width: 14 },
      { left: 24, top: 7.6, value: authorPenName, width: 16 },
      { left: 38, top: 7.6, value: idNumber, width: 25 },
      { left: 17, top: 12.8, value: "88,320", width: 10 },
      { left: 18, top: 16.1, value: "2026年7月22日", width: 22 },
      { left: 69, top: 68.0, value: "作者签名控件 · 待签署", width: 24, tone: "sign" },
      { left: 67, top: 71.3, value: "签署日期由腾讯生成", width: 26, tone: "sign" },
    ],
  };

  return fields[page] || [];
}

function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "orange" | "gray" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function AuthorDemo({ state, setState }: { state: EsignState; setState: (state: EsignState) => void }) {
  const [view, setView] = useState<"works" | "income" | "profile" | "editors" | "content" | "draftContent">("works");
  const [signModal, setSignModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [applyTarget, setApplyTarget] = useState<"created" | "existing">("existing");
  const [signing, setSigning] = useState(false);
  const [profileEditing, setProfileEditing] = useState(false);
  const [toast, setToast] = useState("");
  const [createNovelModal, setCreateNovelModal] = useState(false);
  const [importNovelModal, setImportNovelModal] = useState(false);
  const [importStage, setImportStage] = useState<ImportStage>("upload");
  const [importFileName, setImportFileName] = useState("");
  const [draftCreated, setDraftCreated] = useState(false);
  const [draftImported, setDraftImported] = useState(false);
  const [draftApplied, setDraftApplied] = useState(false);
  const [existingDraftApplied, setExistingDraftApplied] = useState(false);
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
  const [deletedWorkKeys, setDeletedWorkKeys] = useState<Array<"created" | AuthorExistingNovelKey>>([]);
  const [deleteWorkTarget, setDeleteWorkTarget] = useState<{ key: "created" | AuthorExistingNovelKey; name: string } | null>(null);
  const [guideEditorOpen, setGuideEditorOpen] = useState(false);
  const [guideDraft, setGuideDraft] = useState("");
  const [existingGuide, setExistingGuide] = useState(existingNovelGuide);
  const [paymentChapterId, setPaymentChapterId] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<"free" | "paid">("free");
  const [paidChapterIds, setPaidChapterIds] = useState([21005, 21006, 21007, 21008]);
  const [pendingProgressOpen, setPendingProgressOpen] = useState(false);
  const [existingNovelEdits, setExistingNovelEdits] = useState(authorNovelDefaults);
  const [selectedExistingNovel, setSelectedExistingNovel] = useState(authorNovelDefaults.contract);
  const [editNovelForm, setEditNovelForm] = useState<(AuthorNovelEditValues & { key: "created" | AuthorExistingNovelKey }) | null>(null);

  const stateCopy = {
    待拟定合同: { label: "待签约", detail: "签约申请已提交，责编正在拟定电子合同", action: "查看进度" },
    待合同审核: { label: "待签约", detail: "合同正在内部审核，审核通过后将自动发送给作者", action: "查看进度" },
    待作者签署: { label: "签约中", detail: "电子合同待作者签署", action: "查看进度" },
    待法务签章: { label: "签约中", detail: "作者已签署，等待法务完成企业签章", action: "查看进度" },
    签署完成: { label: "签约完成", detail: "作者签署与法务签章已完成 · QS202607230018", action: "小说详情" },
    已拒绝签约: { label: "草稿", detail: "责编暂未通过本次签约申请", action: "小说详情" },
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
      setState("待法务签章");
      notify("作者签署已完成，合同正等待法务签章");
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
    setDraftApplied(false);
    setAddedChapter(false);
    setDeletedChapterIds([]);
    setCreateNovelModal(false);
    setView("draftContent");
    notify("小说已创建，请继续导入正文");
  }

  function openExistingNovelDetail(key: AuthorExistingNovelKey) {
    const selectedNovel = existingNovelEdits[key];
    setSelectedExistingNovel(selectedNovel);
    setExistingGuide(selectedNovel.intro);
    setView("content");
  }

  function openEditNovel(key: "created" | AuthorExistingNovelKey) {
    if (key === "created") {
      setEditNovelForm({
        key,
        name: novelName,
        intro: novelIntro,
        finishDate,
        tags: novelTags,
        category,
        novelType,
        customCover,
        coverClass: "teal",
      });
      return;
    }
    setEditNovelForm({ key, ...existingNovelEdits[key] });
  }

  function toggleEditTag(tag: string) {
    setEditNovelForm(current => current
      ? {
          ...current,
          tags: current.tags.includes(tag)
            ? current.tags.filter(item => item !== tag)
            : [...current.tags, tag],
        }
      : current);
  }

  function saveEditedNovel() {
    if (!editNovelForm || !editNovelForm.name.trim() || !editNovelForm.finishDate || editNovelForm.tags.length === 0) return;
    if (editNovelForm.key === "created") {
      setNovelName(editNovelForm.name.trim());
      setNovelIntro(editNovelForm.intro.trim());
      setFinishDate(editNovelForm.finishDate);
      setNovelTags(editNovelForm.tags);
      setCategory(editNovelForm.category);
      setNovelType(editNovelForm.novelType);
      setCustomCover(editNovelForm.customCover);
    } else {
      const key = editNovelForm.key;
      const updatedNovel: AuthorNovelEditValues = {
        name: editNovelForm.name.trim(),
        intro: editNovelForm.intro.trim(),
        finishDate: editNovelForm.finishDate,
        tags: editNovelForm.tags,
        category: editNovelForm.category,
        novelType: editNovelForm.novelType,
        customCover: editNovelForm.customCover,
        coverClass: editNovelForm.coverClass,
      };
      setExistingNovelEdits(current => ({ ...current, [key]: updatedNovel }));
      if (selectedExistingNovel.name === authorNovelDefaults[key].name || selectedExistingNovel.name === existingNovelEdits[key].name) {
        setSelectedExistingNovel(updatedNovel);
        setExistingGuide(updatedNovel.intro);
      }
    }
    setEditNovelForm(null);
    notify("小说信息已更新");
  }

  function openImportNovel() {
    setImportStage("upload");
    setImportFileName("");
    setImportNovelModal(true);
  }

  function finishImport() {
    const editingCreatedNovel = view === "draftContent";
    const introWasEmpty = editingCreatedNovel
      ? novelIntro.trim().length === 0
      : existingGuide.trim().length === 0;
    if (introWasEmpty) {
      if (editingCreatedNovel) setNovelIntro(importedGuide);
      else setExistingGuide(importedGuide);
    }
    if (editingCreatedNovel) setDraftImported(true);
    setImportNovelModal(false);
    notify(introWasEmpty ? "导入成功，已自动使用文档导语补充简介" : "小说正文导入成功");
  }

  const isNewDraftDetail = view === "draftContent";
  const detailNovelName = isNewDraftDetail ? (novelName || "未命名小说") : selectedExistingNovel.name;
  const detailNovelIntro = isNewDraftDetail
    ? (novelIntro || "暂未填写。导入小说后，系统将自动使用文档导语补充简介。")
    : existingGuide;
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

  function confirmDeleteWork() {
    if (!deleteWorkTarget) return;
    const { key, name } = deleteWorkTarget;
    setDeletedWorkKeys(current => current.includes(key) ? current : [...current, key]);
    setDeleteWorkTarget(null);
    notify(`小说《${name}》已删除`);
  }

  function openGuideEditor() {
    setGuideDraft(isNewDraftDetail ? novelIntro : existingGuide);
    setGuideEditorOpen(true);
  }

  function saveGuide() {
    if (isNewDraftDetail) setNovelIntro(guideDraft.trim());
    else setExistingGuide(guideDraft.trim());
    setGuideEditorOpen(false);
    notify("导语已保存");
  }

  function openPaymentSetting(chapterId: number) {
    setPaymentChapterId(chapterId);
    setPaymentMode(paidChapterIds.includes(chapterId) ? "paid" : "free");
  }

  function savePaymentSetting() {
    if (paymentChapterId === null) return;
    setPaidChapterIds(current => paymentMode === "paid"
      ? [...new Set([...current, paymentChapterId])]
      : current.filter(id => id !== paymentChapterId));
    setPaymentChapterId(null);
    notify(`章节已设置为${paymentMode === "paid" ? "付费" : "免费"}`);
  }

  const menuItems = [
    { id: "works", label: "作品管理", icon: "▣" },
    { id: "income", label: "收益管理", icon: "¥" },
    { id: "profile", label: "个人中心", icon: "◎" },
    { id: "editors", label: "联系编辑", icon: "✉" },
  ] as const;

  const visibleWorkCount = (["contract", "pending", "draft", "completed"] as AuthorExistingNovelKey[])
    .filter(key => !deletedWorkKeys.includes(key)).length
    + (draftCreated && !deletedWorkKeys.includes("created") ? 1 : 0);

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
              <select defaultValue="all"><option value="all">全部状态</option><option>草稿</option><option>待签约</option><option>签约中</option><option>签约完成</option></select>
              <input placeholder="⌕ 查询小说名称" />
              <button className="mint-button">查 询</button>
              <button className="mint-button create" onClick={openCreateNovel}>⊕ 新建小说</button>
            </section>
            <section className="author-work-list">
              {draftCreated && !deletedWorkKeys.includes("created") && <article className="author-work-row new-draft-row">
                <button className="work-cover-link" aria-label={`打开《${novelName}》小说详情`} onClick={() => setView("draftContent")}>
                  <span className={`live-cover generated ${customCover ? "custom" : ""}`}><span>{novelName}</span></span>
                </button>
                <div className="live-work-main">
                  <div className="live-work-title"><button className="work-title-link" onClick={() => setView("draftContent")}>{novelName}</button><span className={`live-status ${draftApplied ? "waiting" : "draft"}`}>{draftApplied ? "待签约" : "草稿"}</span></div>
                  <small>{draftImported ? "9,486字" : "0字"}　｜　{category} · {novelType} · {novelTags.join("、")}</small>
                  {draftApplied && <div className="live-contract-line plain">签约申请已提交，责编正在拟定合同</div>}
                </div>
                <div className="live-work-actions">
                  {draftApplied
                    ? <button className="inline-mint" onClick={() => setPendingProgressOpen(true)}>查看进度</button>
                    : <button className="inline-mint" onClick={() => {if (!draftImported) {notify("请先导入小说正文，再申请签约"); return;} setApplyTarget("created"); setApplyModal(true);}}>♢ 申请签约</button>}
                  <button className="pill-action soft" onClick={() => openEditNovel("created")}>编辑</button>
                  <button className="pill-action delete-work-action" onClick={() => setDeleteWorkTarget({key: "created", name: novelName})}>删除</button>
                </div>
              </article>}
              {!deletedWorkKeys.includes("contract") && <article className="author-work-row contract-row">
                <button className="work-cover-link" aria-label={`打开《${existingNovelEdits.contract.name}》小说详情`} onClick={() => openExistingNovelDetail("contract")}>
                  <span className={`live-cover ${existingNovelEdits.contract.customCover ? existingNovelEdits.contract.coverClass : "generated"}`}>{existingNovelEdits.contract.name}</span>
                </button>
                <div className="live-work-main">
                  <div className="live-work-title"><button className="work-title-link" onClick={() => openExistingNovelDetail("contract")}>{existingNovelEdits.contract.name}</button><span className={`live-status ${state === "签署完成" ? "done" : stateCopy.label === "草稿" ? "draft" : "waiting"}`}>{stateCopy.label}</span></div>
                  <small>9,427字　｜　女频 · 都市情感</small>
                  {stateCopy.label !== "草稿" && stateCopy.label !== "签约完成" && <div className="live-contract-line"><b>{stateCopy.detail}</b>{state === "待作者签署" && <span>请及时完成合同核对</span>}</div>}
                </div>
                <div className="live-work-actions">
                  {state !== "签署完成" && <button className="inline-mint" onClick={() => state === "待拟定合同" || state === "待合同审核" ? setPendingProgressOpen(true) : setSignModal(true)}>查看进度</button>}
                  <button className="pill-action soft" onClick={() => openEditNovel("contract")}>编辑</button>
                  <button className="pill-action delete-work-action" onClick={() => setDeleteWorkTarget({key: "contract", name: existingNovelEdits.contract.name})}>删除</button>
                </div>
              </article>}

              {!deletedWorkKeys.includes("pending") && <article className="author-work-row">
                <button className="work-cover-link" aria-label={`打开《${existingNovelEdits.pending.name}》小说详情`} onClick={() => openExistingNovelDetail("pending")}>
                  <span className={`live-cover ${existingNovelEdits.pending.customCover ? existingNovelEdits.pending.coverClass : "generated"}`}>{existingNovelEdits.pending.name}</span>
                </button>
                <div className="live-work-main"><div className="live-work-title"><button className="work-title-link" onClick={() => openExistingNovelDetail("pending")}>{existingNovelEdits.pending.name}</button><span className="live-status waiting">待签约</span></div><small>10,029字　｜　女频 · 悬疑</small><div className="live-contract-line plain">签约申请已提交，责编正在拟定合同</div></div>
                <div className="live-work-actions"><button className="inline-mint" onClick={() => setPendingProgressOpen(true)}>查看进度</button><button className="pill-action soft" onClick={() => openEditNovel("pending")}>编辑</button><button className="pill-action delete-work-action" onClick={() => setDeleteWorkTarget({key: "pending", name: existingNovelEdits.pending.name})}>删除</button></div>
              </article>}

              {!deletedWorkKeys.includes("draft") && <article className="author-work-row">
                <button className="work-cover-link" aria-label={`打开《${existingNovelEdits.draft.name}》小说详情`} onClick={() => openExistingNovelDetail("draft")}>
                  <span className={`live-cover ${existingNovelEdits.draft.customCover ? existingNovelEdits.draft.coverClass : "generated"}`}>{existingNovelEdits.draft.name}</span>
                </button>
                <div className="live-work-main"><div className="live-work-title"><button className="work-title-link" onClick={() => openExistingNovelDetail("draft")}>{existingNovelEdits.draft.name}</button><span className={`live-status ${existingDraftApplied ? "waiting" : "draft"}`}>{existingDraftApplied ? "待签约" : "草稿"}</span></div><small>8,832字　｜　男频 · 都市</small>{existingDraftApplied && <div className="live-contract-line plain">签约申请已提交，责编正在拟定合同</div>}</div>
                <div className="live-work-actions">{existingDraftApplied ? <button className="inline-mint" onClick={() => setPendingProgressOpen(true)}>查看进度</button> : <button className="inline-mint" onClick={() => {setApplyTarget("existing");setApplyModal(true);}}>♢ 申请签约</button>}<button className="pill-action soft" onClick={() => openEditNovel("draft")}>编辑</button><button className="pill-action delete-work-action" onClick={() => setDeleteWorkTarget({key: "draft", name: existingNovelEdits.draft.name})}>删除</button></div>
              </article>}

              {!deletedWorkKeys.includes("completed") && <article className="author-work-row">
                <button className="work-cover-link" aria-label={`打开《${existingNovelEdits.completed.name}》小说详情`} onClick={() => openExistingNovelDetail("completed")}>
                  <span className={`live-cover ${existingNovelEdits.completed.customCover ? existingNovelEdits.completed.coverClass : "generated"}`}>{existingNovelEdits.completed.name}</span>
                </button>
                <div className="live-work-main"><div className="live-work-title"><button className="work-title-link" onClick={() => openExistingNovelDetail("completed")}>{existingNovelEdits.completed.name}</button><span className="live-status done">签约完成</span></div><small>12,604字　｜　女频 · 现实情感</small></div>
                <div className="live-work-actions"><button className="pill-action soft" onClick={() => openEditNovel("completed")}>编辑</button><button className="pill-action delete-work-action" onClick={() => setDeleteWorkTarget({key: "completed", name: existingNovelEdits.completed.name})}>删除</button></div>
              </article>}
            </section>
            <div className="author-pagination">共 {visibleWorkCount} 条　‹　<b>1</b>　›　 <span>10 条/页⌄</span></div>
          </>}

          {view === "income" && <>
            <section className="author-page-card">
              <div className="author-income-filter"><input placeholder="签约完成开始日期"/><span>→</span><input placeholder="签约完成结束日期"/><input placeholder="小说名称"/><button className="mint-button">查 询</button></div>
              <table className="author-income-table"><thead><tr><th>合同ID</th><th>小说名称</th><th>签约性质</th><th>税前收入(元)</th><th title="作者签字与企业签章全部完成的日期">签约日期</th><th>操作</th></tr></thead>
                <tbody>
                  {state === "签署完成" && <tr><td><button onClick={() => setSignModal(true)}>QS202607230018</button></td><td>声声已离商音近</td><td>保底＋分成</td><td>12,000.00</td><td>2026-07-23</td><td><button onClick={() => setSignModal(true)}>查看合同</button></td></tr>}
                  <tr><td><button onClick={() => notify("已打开业务手动上传的历史合同")}>ESIGN-2025-1046</button></td><td>月光落在旧站台</td><td>买断</td><td>15,000.00</td><td>2025-12-31</td><td><button onClick={() => notify("已打开历史线下合同")}>查看合同</button></td></tr>
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
            </div>
            <div className="greenlike-novel-summary">
              <div className={`greenlike-cover ${isNewDraftDetail ? `generated ${customCover ? "custom" : ""}` : selectedExistingNovel.customCover ? selectedExistingNovel.coverClass : "generated"}`}>
                <span>{detailNovelName}</span>
              </div>
              <div className="greenlike-summary-copy">
                <div className="greenlike-title-line">
                  <h1>{detailNovelName}</h1>
                  {isNewDraftDetail && <span className={`live-status ${draftApplied ? "waiting" : "draft"}`}>{draftApplied ? "待签约" : "草稿"}</span>}
                </div>
                <div className="greenlike-guide" role="button" tabIndex={0} onClick={openGuideEditor} onKeyDown={event => event.key === "Enter" && openGuideEditor()}>
                  <b>导语</b>
                  <p>{detailNovelIntro}</p>
                  <small>{isNewDraftDetail && !novelIntro ? "导入正文后将自动使用文档导语补充；点击可编辑" : "点击编辑导语"}</small>
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
                    <td><span className={paidChapterIds.includes(chapter.id) ? "chapter-paid" : "chapter-free"}>{paidChapterIds.includes(chapter.id) ? "付费" : "免费"}</span></td>
                    <td>{chapter.words}</td>
                    <td>2026-07-27 14:{18 + index}</td>
                    <td><button onClick={() => openChapterEditor("edit", index)}>编辑</button><button className="delete" onClick={() => setDeleteChapterId(chapter.id)}>删除</button><button onClick={() => openPaymentSetting(chapter.id)}>设置付费</button></td>
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

      {editNovelForm && <div className="overlay" onClick={() => setEditNovelForm(null)}>
        <div className="author-novel-modal" role="dialog" aria-label="编辑小说信息" onClick={event => event.stopPropagation()}>
          <div className="novel-modal-header"><div><h2>编辑小说信息</h2><p>修改小说基础信息；正文、导语和章节内容请进入小说详情页操作</p></div><button className="close" onClick={() => setEditNovelForm(null)}>×</button></div>
          <div className="novel-modal-body">
            <aside className="cover-builder">
              <div className={`generated-cover-preview ${editNovelForm.customCover ? "custom" : ""}`}><span>{editNovelForm.name || "小说名称"}</span><small>{editNovelForm.customCover ? "自定义封面预览" : "默认封面预览"}</small></div>
              <button className="cover-upload-button" onClick={() => setEditNovelForm(current => current ? { ...current, customCover: !current.customCover } : current)}>{editNovelForm.customCover ? "恢复默认封面" : "上传封面"}</button>
              <p>不上传时使用默认底图，并自动叠加小说名称。</p>
            </aside>
            <div className="author-create-form">
              <section><h3>小说信息</h3>
                <label className="form-field"><span><b>*</b> 小说名称</span><div><input value={editNovelForm.name} onChange={event => setEditNovelForm(current => current ? { ...current, name: event.target.value } : current)} placeholder="请输入小说名称" maxLength={50}/><small>{editNovelForm.name.length}/50</small></div></label>
                <label className="form-field"><span>简介</span><div><textarea value={editNovelForm.intro} onChange={event => setEditNovelForm(current => current ? { ...current, intro: event.target.value } : current)} placeholder="请输入简介（选填）" maxLength={500}/><small>{editNovelForm.intro.length}/500</small><em>若未填写，重新导入小说时可使用文档导语补充</em></div></label>
                <label className="form-field"><span><b>*</b> 完结日期</span><div><input type="date" value={editNovelForm.finishDate} onChange={event => setEditNovelForm(current => current ? { ...current, finishDate: event.target.value } : current)}/><em>精确到天</em></div></label>
              </section>
              <section><h3>内容信息</h3>
                <div className="form-field"><span><b>*</b> 标签</span><div className="tag-picker">{["都市情感","悬疑推理","现实生活","追妻火葬场","女性成长","爽文"].map(tag => <button type="button" key={tag} className={editNovelForm.tags.includes(tag) ? "selected" : ""} onClick={() => toggleEditTag(tag)}>{editNovelForm.tags.includes(tag) ? "✓ " : ""}{tag}</button>)}<em>至少选择 1 个标签</em></div></div>
                <div className="form-field"><span><b>*</b> 分类</span><div className="choice-cards"><button type="button" className={editNovelForm.category === "男频" ? "selected" : ""} onClick={() => setEditNovelForm(current => current ? { ...current, category: "男频" } : current)}>男频</button><button type="button" className={editNovelForm.category === "女频" ? "selected" : ""} onClick={() => setEditNovelForm(current => current ? { ...current, category: "女频" } : current)}>女频</button></div></div>
                <div className="form-field"><span><b>*</b> 小说类型</span><div className="choice-cards"><button type="button" className={editNovelForm.novelType === "长篇" ? "selected" : ""} onClick={() => setEditNovelForm(current => current ? { ...current, novelType: "长篇" } : current)}>长篇</button><button type="button" className={editNovelForm.novelType === "短篇" ? "selected" : ""} onClick={() => setEditNovelForm(current => current ? { ...current, novelType: "短篇" } : current)}>短篇</button></div></div>
              </section>
            </div>
          </div>
          <div className="novel-modal-footer"><span>{editNovelForm.name.trim() && editNovelForm.finishDate && editNovelForm.tags.length > 0 ? "信息已完整，可以保存" : "请填写小说名称、完结日期并至少选择 1 个标签"}</span><button className="soft-button" onClick={() => setEditNovelForm(null)}>取消</button><button className="mint-button" disabled={!editNovelForm.name.trim() || !editNovelForm.finishDate || editNovelForm.tags.length === 0} onClick={saveEditedNovel}>保存修改</button></div>
        </div>
      </div>}

      {importNovelModal && <div className="overlay" onClick={() => setImportNovelModal(false)}>
        <div className="author-import-modal" onClick={event => event.stopPropagation()}>
          <div className="novel-modal-header"><div><h2>导入小说</h2><p>{detailNovelName} · 支持 .doc、.docx</p></div><button className="close" onClick={() => setImportNovelModal(false)}>×</button></div>
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

      {guideEditorOpen && <div className="overlay" onClick={() => setGuideEditorOpen(false)}>
        <div className="guide-editor-modal" role="dialog" aria-label="编辑导语" onClick={event => event.stopPropagation()}>
          <div className="chapter-editor-header">
            <h2>编辑导语</h2>
            <button aria-label="Close" onClick={() => setGuideEditorOpen(false)}>×</button>
          </div>
          <div className="guide-editor-body">
            <textarea value={guideDraft} onChange={event => setGuideDraft(event.target.value)} maxLength={500} placeholder="请输入小说导语" />
            <span>{guideDraft.length}/500</span>
            <p>导语将展示在小说详情页；内容为空时，重新导入小说可自动使用文档导语补充。</p>
          </div>
          <div className="simple-modal-footer">
            <button className="soft-button" onClick={() => setGuideEditorOpen(false)}>取消</button>
            <button className="mint-button" onClick={saveGuide}>保存</button>
          </div>
        </div>
      </div>}

      {paymentChapterId !== null && <div className="overlay" onClick={() => setPaymentChapterId(null)}>
        <div className="payment-setting-modal" role="dialog" aria-label="设置付费" onClick={event => event.stopPropagation()}>
          <div className="chapter-editor-header">
            <h2>设置付费</h2>
            <button aria-label="Close" onClick={() => setPaymentChapterId(null)}>×</button>
          </div>
          <div className="payment-setting-body">
            <div><span>当前章节</span><b>{detailChapters.find(chapter => chapter.id === paymentChapterId)?.title}</b></div>
            <label className={paymentMode === "free" ? "selected" : ""}><input type="radio" name="payment" checked={paymentMode === "free"} onChange={() => setPaymentMode("free")} /><i>免费</i><small>读者无需付费即可阅读本章</small></label>
            <label className={paymentMode === "paid" ? "selected" : ""}><input type="radio" name="payment" checked={paymentMode === "paid"} onChange={() => setPaymentMode("paid")} /><i>付费</i><small>本章将按照平台规则设置为付费章节</small></label>
          </div>
          <div className="simple-modal-footer">
            <button className="soft-button" onClick={() => setPaymentChapterId(null)}>取消</button>
            <button className="mint-button" onClick={savePaymentSetting}>确定</button>
          </div>
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

      {deleteWorkTarget && <div className="overlay" onClick={() => setDeleteWorkTarget(null)}>
        <div className="work-delete-confirm" role="dialog" aria-label="删除小说" onClick={event => event.stopPropagation()}>
          <button className="close" aria-label="关闭" onClick={() => setDeleteWorkTarget(null)}>×</button>
          <h2>确认删除该本小说吗?</h2>
          <p>小说一旦删除，将无法恢复</p>
          <footer>
            <button className="soft-button" onClick={() => setDeleteWorkTarget(null)}>取消</button>
            <button className="mint-button" onClick={confirmDeleteWork}>确认</button>
          </footer>
        </div>
      </div>}

      {applyModal && <div className="overlay" onClick={() => setApplyModal(false)}><div className="author-confirm-modal" onClick={event => event.stopPropagation()}><button className="close" onClick={() => setApplyModal(false)}>×</button><i>♢</i><h2>确认申请签约</h2><p>提交后责编将根据以下资料拟定合同；合同发起后正文将锁定。</p><ul><li>✓ 正文字数 8,832，符合 8,000～20,000 字要求</li><li>✓ 作者实名认证与签约资料已完整</li><li>✓ 小说名称、分类、标签、小说类型和完结日期已填写</li></ul><div className="modal-actions"><button className="soft-button" onClick={() => setApplyModal(false)}>取消</button><button className="mint-button" onClick={() => {setApplyModal(false); if (applyTarget === "created") setDraftApplied(true); else setExistingDraftApplied(true); notify("申请签约已提交，责编将开始拟定合同");}}>确认申请</button></div></div></div>}

      {pendingProgressOpen && <div className="overlay" onClick={() => setPendingProgressOpen(false)}>
        <div className="pending-sign-progress-modal" role="dialog" aria-label="待签约进度" onClick={event => event.stopPropagation()}>
          <button className="close" onClick={() => setPendingProgressOpen(false)}>×</button>
          <i>⌛</i>
          <h2>签约进度</h2>
          <p>责编正在拟定合同中，请稍后查看进度</p>
          <button className="mint-button wide" onClick={() => setPendingProgressOpen(false)}>知道了</button>
        </div>
      </div>}

      {signModal && <div className="overlay" onClick={() => setSignModal(false)}><div className="author-contract-modal live-style" onClick={event => event.stopPropagation()}>
        <button className="close" onClick={() => setSignModal(false)}>×</button><div className="tencent-mark">✓ 腾讯电子签</div><h2>{state === "签署完成" ? "电子合同详情" : "签约进度"}</h2><p>《{existingNovelEdits.contract.name}》版权转让合同（保底＋分成）</p>
        {(state === "待作者签署" || state === "待法务签章") && <>
          <div className="sign-progress-summary">
            <div><span>签约税前金额</span><b className="money">¥12,000.00</b></div>
            <div><span>甲方</span><b>杭州宝茂网络科技有限公司</b></div>
            <div><span>乙方</span><b>石＊京（笔名：溪源）</b></div>
          </div>
          <div className="signature-scope"><b>本次需完成 2 处签名</b><span>① 主合同签署页　② 附件《版权转让声明函》</span></div>
          <button className="mint-button wide" disabled={signing} onClick={state === "待作者签署" ? completeAuthorSign : () => notify("已打开腾讯电子签合同进度")}>{signing ? "正在同步签署结果…" : "前往腾讯电子签"}</button>
        </>}
        {state === "签署完成" && <>
          <div className="sign-progress-summary">
            <div><span>签约税前金额</span><b className="money">¥12,000.00</b></div>
            <div><span>甲方</span><b>杭州宝茂网络科技有限公司</b></div>
            <div><span>乙方</span><b>石＊京（笔名：溪源）</b></div>
          </div>
          <div className="signed-file-actions"><button className="mint-button" onClick={() => notify("已下载签署完成的合同 PDF")}>下载已签合同</button><button className="soft-button" onClick={() => notify("已下载腾讯电子签证据报告")}>下载证据报告</button></div>
        </>}
      </div></div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function AdminDemo({ states, setStates }: { states: EsignState[]; setStates: (states: EsignState[]) => void }) {
  const [adminView, setAdminView] = useState<AdminView>("contracts");
  const [selected, setSelected] = useState(0);
  const [launchModal, setLaunchModal] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [draftContractType, setDraftContractType] = useState<"买断" | "保底＋分成">("保底＋分成");
  const [draftAmount, setDraftAmount] = useState("12,000");
  const [draftAuthor, setDraftAuthor] = useState<ContractPrefillValues>({
    legalName: "石京",
    penName: "溪源",
    mobile: "13812346621",
    idNumber: "330106199506182214",
    address: "浙江省杭州市西湖区文三路88号",
    bankName: "招商银行杭州文三路支行",
    bankAccount: "6225882100188821",
  });
  const draftPageRefs = useRef<Record<number, HTMLElement | null>>({});
  const [draftConfirmed, setDraftConfirmed] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [currentFinanceReviewer, setCurrentFinanceReviewer] = useState<FinanceReviewer>("财务审核人A");
  const [financeApprovals, setFinanceApprovals] = useState<Record<string, FinanceReviewer[]>>({
    "1048": ["财务审核人A", "财务审核人B"],
    "1047": ["财务审核人A"],
    "1045": ["财务审核人A", "财务审核人B"],
    "1043": [],
  });
  const [batchReviewIds, setBatchReviewIds] = useState<string[]>([]);
  const [batchReviewOpen, setBatchReviewOpen] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectSigningOpen, setRejectSigningOpen] = useState(false);
  const [rejectSigningNote, setRejectSigningNote] = useState("");
  const [signRejectionNotes, setSignRejectionNotes] = useState<Record<string, string>>({});
  const [novelPreviewOpen, setNovelPreviewOpen] = useState(false);
  const [urgeModalOpen, setUrgeModalOpen] = useState(false);
  const [signedPdfOpen, setSignedPdfOpen] = useState(false);
  const [mappingOpen, setMappingOpen] = useState(false);
  const [legalSealOpen, setLegalSealOpen] = useState(false);
  const [selectedSeal, setSelectedSeal] = useState<SealName>("杭州宝茂网络科技有限公司合同专用章");
  const [legalSealProcessing, setLegalSealProcessing] = useState(false);
  const [newNovelModalOpen, setNewNovelModalOpen] = useState(false);
  const [newNovelMode, setNewNovelMode] = useState<"manual" | "signing">("manual");
  const [managedNovelIds, setManagedNovelIds] = useState<string[]>(["1046"]);
  const [selectedSigningNovelIds, setSelectedSigningNovelIds] = useState<string[]>([]);
  const [manualNovelName, setManualNovelName] = useState("");
  const [manualNovelAuthor, setManualNovelAuthor] = useState("");
  const [manualAuthorQuery, setManualAuthorQuery] = useState("");
  const [manualAuthorPickerOpen, setManualAuthorPickerOpen] = useState(false);
  const [manualAuthorInputMode, setManualAuthorInputMode] = useState(false);
  const [selectedManagedAuthorId, setSelectedManagedAuthorId] = useState("");
  const [manualNovelAdded, setManualNovelAdded] = useState(false);
  const [permissionDepartment, setPermissionDepartment] = useState("钱行工作室");
  const [permissionQuery, setPermissionQuery] = useState("");
  const [permissionUsers, setPermissionUsers] = useState<PermissionUser[]>(initialPermissionUsers);
  const [permissionUserModalOpen, setPermissionUserModalOpen] = useState(false);
  const [permissionEditingUserId, setPermissionEditingUserId] = useState("");
  const [permissionSelectedUserId, setPermissionSelectedUserId] = useState("");
  const [permissionRole, setPermissionRole] = useState("");
  const [permissionNickname, setPermissionNickname] = useState("");
  const [permissionNicknameTouched, setPermissionNicknameTouched] = useState(false);
  const [toast, setToast] = useState("");
  const selectedState = states[selected];
  const selectedNovel = novels[selected];
  const selectedFinanceApprovals = financeApprovals[selectedNovel.id] || [];
  const currentFinanceApproved = selectedFinanceApprovals.includes(currentFinanceReviewer);
  const previewPageCount = draftContractType === "买断" ? 5 : 10;
  const previewTemplateName = draftContractType === "买断"
    ? "短篇小说版权合同（买断）"
    : "【模板】短篇小说版权转让合同（保底＋分成）";
  const previewPageSrc = contractPageSrc(previewPage);
  const selectedManagedAuthor = managedAuthors.find(author => author.id === selectedManagedAuthorId);
  const filteredManagedAuthors = managedAuthors.filter(author => {
    const keyword = manualAuthorQuery.trim().toLowerCase();
    return !keyword
      || author.penName.toLowerCase().includes(keyword)
      || author.legalName.toLowerCase().includes(keyword)
      || author.mobile.includes(keyword)
      || author.id.toLowerCase().includes(keyword);
  });
  const filteredPermissionUsers = permissionUsers.filter(user => {
    const keyword = permissionQuery.trim().toLowerCase();
    return user.department === permissionDepartment
      && (!keyword
        || user.username.toLowerCase().includes(keyword)
        || user.nickname.toLowerCase().includes(keyword));
  });

  function contractPageSrc(page: number) {
    return draftContractType === "买断"
      ? `${import.meta.env.BASE_URL}contracts/buyout/page-${page}.jpg`
      : `${import.meta.env.BASE_URL}contracts/guarantee-share/page-${String(page).padStart(2, "0")}.jpg`;
  }

  function updateDraftAuthor(field: keyof ContractPrefillValues, value: string) {
    setDraftAuthor(current => ({ ...current, [field]: value }));
    setDraftConfirmed(false);
  }

  function scrollDraftPreview(page: number) {
    setPreviewPage(page);
    draftPageRefs.current[page]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function trackDraftPreviewPage(event: React.UIEvent<HTMLElement>) {
    const container = event.currentTarget;
    let closestPage = previewPage;
    let closestDistance = Number.POSITIVE_INFINITY;
    Object.entries(draftPageRefs.current).forEach(([page, node]) => {
      if (!node || Number(page) > previewPageCount) return;
      const distance = Math.abs(node.offsetTop - container.scrollTop - 18);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = Number(page);
      }
    });
    if (closestPage !== previewPage) setPreviewPage(closestPage);
  }

  function openContractPreview() {
    setPreviewPage(1);
    setPreviewOpen(true);
  }

  function openDraftContract(index: number) {
    const novel = novels[index];
    setSelected(index);
    setDraftContractType(novel.contractType as "买断" | "保底＋分成");
    setDraftAmount(novel.price);
    setDraftAuthor({
      legalName: "石京",
      penName: novel.author,
      mobile: "13812346621",
      idNumber: "330106199506182214",
      address: "浙江省杭州市西湖区文三路88号",
      bankName: "招商银行杭州文三路支行",
      bankAccount: "6225882100188821",
    });
    setDraftConfirmed(false);
    setPreviewPage(1);
    setLaunchModal(true);
  }

  function launchFlow() {
    if (!draftConfirmed) return;
    const next = [...states];
    next[selected] = "待合同审核";
    setStates(next);
    setFinanceApprovals(current => ({ ...current, [selectedNovel.id]: [] }));
    setLaunchModal(false);
    setToast("合同已提交双人财务审核；两人全部通过后将自动发送给作者");
    setTimeout(() => setToast(""), 3200);
  }

  function approveContract() {
    if (currentFinanceApproved) {
      setApproveConfirmOpen(false);
      setToast(`${currentFinanceReviewer}已审核通过，无需重复操作`);
      setTimeout(() => setToast(""), 3200);
      return;
    }
    const nextApprovals = [...selectedFinanceApprovals, currentFinanceReviewer];
    setFinanceApprovals(current => ({ ...current, [selectedNovel.id]: nextApprovals }));
    const next = [...states];
    if (nextApprovals.length === financeReviewers.length) next[selected] = "待作者签署";
    setStates(next);
    setDetailOpen(false);
    setReviewOpen(false);
    setApproveConfirmOpen(false);
    setToast(nextApprovals.length === financeReviewers.length
      ? "两名财务均已审核通过，合同已自动同步至作者投稿后台"
      : `${currentFinanceReviewer}审核通过，合同继续等待另一名财务审核`);
    setTimeout(() => setToast(""), 3200);
  }

  function rejectContract() {
    if (!rejectReason.trim()) return;
    const next = [...states];
    next[selected] = "待拟定合同";
    setStates(next);
    setFinanceApprovals(current => ({ ...current, [selectedNovel.id]: [] }));
    setRejectModal(false);
    setDetailOpen(false);
    setReviewOpen(false);
    setRejectReason("");
    setToast("合同已驳回责编修改，驳回意见已记录");
    setTimeout(() => setToast(""), 3200);
  }

  function toggleBatchReview(novelId: string) {
    setBatchReviewIds(current => current.includes(novelId)
      ? current.filter(id => id !== novelId)
      : [...current, novelId]);
  }

  function toggleAllPendingReviews() {
    const pendingIds = novels
      .map((novel, index) => ({ novel, index }))
      .filter(({ novel, index }) => !novel.legacy && states[index] === "待合同审核")
      .map(({ novel }) => novel.id);
    setBatchReviewIds(current => current.length === pendingIds.length ? [] : pendingIds);
  }

  function confirmBatchReview() {
    const nextStates = [...states];
    const nextApprovals = { ...financeApprovals };
    let reviewedCount = 0;
    let completedCount = 0;
    let skippedCount = 0;

    batchReviewIds.forEach(novelId => {
      const index = novels.findIndex(novel => novel.id === novelId);
      if (index < 0 || nextStates[index] !== "待合同审核") {
        skippedCount += 1;
        return;
      }
      const approvals = nextApprovals[novelId] || [];
      if (approvals.includes(currentFinanceReviewer)) {
        skippedCount += 1;
        return;
      }
      const updated = [...approvals, currentFinanceReviewer];
      nextApprovals[novelId] = updated;
      reviewedCount += 1;
      if (updated.length === financeReviewers.length) {
        nextStates[index] = "待作者签署";
        completedCount += 1;
      }
    });

    setFinanceApprovals(nextApprovals);
    setStates(nextStates);
    setBatchReviewIds([]);
    setBatchReviewOpen(false);
    setToast(`批量审核完成：本人通过 ${reviewedCount} 份，双人完成并同步作者 ${completedCount} 份${skippedCount ? `，跳过 ${skippedCount} 份` : ""}`);
    setTimeout(() => setToast(""), 4200);
  }

  function showContract(index: number) {
    const novel = novels[index];
    setSelected(index);
    setDraftContractType(novel.contractType as "买断" | "保底＋分成");
    setDraftAmount(novel.price);
    setPreviewPage(1);
    setReviewOpen(true);
  }

  function openNovelPreview(index: number) {
    setSelected(index);
    setNovelPreviewOpen(true);
  }

  function openRejectSigning(index: number) {
    setSelected(index);
    setRejectSigningNote("");
    setRejectSigningOpen(true);
  }

  function confirmRejectSigning() {
    const next = [...states];
    next[selected] = "已拒绝签约";
    setStates(next);
    setSignRejectionNotes({
      ...signRejectionNotes,
      [selectedNovel.id]: rejectSigningNote.trim(),
    });
    setRejectSigningOpen(false);
    setToast(rejectSigningNote.trim() ? "已拒绝签约，备注已写入操作记录" : "已拒绝签约");
    setTimeout(() => setToast(""), 3200);
  }

  function openUrgeModal(index: number) {
    setSelected(index);
    setUrgeModalOpen(true);
  }

  function sendUrgeMessage() {
    setUrgeModalOpen(false);
    setDetailOpen(false);
    setToast(`短信已发送：你的小说《${selectedNovel.name}》签约合同已拟定完成`);
    setTimeout(() => setToast(""), 3600);
  }

  function openSignedPdf(index: number) {
    const novel = novels[index];
    setSelected(index);
    setDraftContractType(novel.contractType as "买断" | "保底＋分成");
    setPreviewPage(1);
    setSignedPdfOpen(true);
  }

  function openNewNovelModal() {
    setNewNovelMode("manual");
    setSelectedSigningNovelIds([]);
    setManualNovelName("");
    setManualNovelAuthor("");
    setManualAuthorQuery("");
    setManualAuthorPickerOpen(false);
    setManualAuthorInputMode(false);
    setSelectedManagedAuthorId("");
    setNewNovelModalOpen(true);
  }

  function selectManagedAuthor(author: (typeof managedAuthors)[number]) {
    setSelectedManagedAuthorId(author.id);
    setManualNovelAuthor(author.penName);
    setManualAuthorQuery(author.penName);
    setManualAuthorPickerOpen(false);
  }

  function enableManualAuthorInput() {
    setManualAuthorInputMode(true);
    setSelectedManagedAuthorId("");
    setManualNovelAuthor(manualAuthorQuery.trim());
    setManualAuthorQuery("");
    setManualAuthorPickerOpen(false);
  }

  function returnToManagedAuthorPicker() {
    setManualAuthorInputMode(false);
    setSelectedManagedAuthorId("");
    setManualNovelAuthor("");
    setManualAuthorQuery("");
    setManualAuthorPickerOpen(true);
  }

  function toggleSigningNovel(novelId: string) {
    setSelectedSigningNovelIds(current => current.includes(novelId)
      ? current.filter(id => id !== novelId)
      : [...current, novelId]);
  }

  function confirmSigningNovelSelection() {
    setManagedNovelIds(current => Array.from(new Set([...current, ...selectedSigningNovelIds])));
    setNewNovelModalOpen(false);
    setToast(`已从签约管理新增 ${selectedSigningNovelIds.length} 本小说`);
    setTimeout(() => setToast(""), 3200);
  }

  function confirmManualNovel() {
    if (!manualNovelName.trim() || !manualNovelAuthor.trim()) return;
    setManualNovelAdded(true);
    setNewNovelModalOpen(false);
    setToast(selectedManagedAuthor
      ? `小说《${manualNovelName.trim()}》已新建，并关联作者管理账号 ${selectedManagedAuthor.penName}`
      : `小说《${manualNovelName.trim()}》已新建，作者笔名为手动录入`);
    setTimeout(() => setToast(""), 3200);
  }

  function openAddPermissionUser() {
    setPermissionEditingUserId("");
    setPermissionSelectedUserId("");
    setPermissionRole("");
    setPermissionNickname("");
    setPermissionNicknameTouched(false);
    setPermissionUserModalOpen(true);
  }

  function openEditPermissionUser(user: PermissionUser) {
    setPermissionEditingUserId(user.id);
    setPermissionSelectedUserId(user.id);
    setPermissionRole(user.role);
    setPermissionNickname(user.nickname || user.username);
    setPermissionNicknameTouched(false);
    setPermissionUserModalOpen(true);
  }

  function selectPermissionUser(userId: string) {
    const option = permissionUserOptions.find(user => user.id === userId);
    const existing = permissionUsers.find(user => user.id === userId);
    setPermissionSelectedUserId(userId);
    setPermissionNickname(existing?.nickname || option?.username || "");
    setPermissionNicknameTouched(false);
  }

  function savePermissionUser() {
    const option = permissionUserOptions.find(user => user.id === permissionSelectedUserId);
    const nickname = permissionNickname.trim();
    if (!option || !permissionRole || !nickname) {
      setPermissionNicknameTouched(true);
      return;
    }

    setPermissionUsers(current => {
      const sameUserNickname = current.find(user => user.id === option.id)?.nickname;
      const nextNickname = nickname || sameUserNickname || option.username;
      if (permissionEditingUserId) {
        return current.map(user => user.id === permissionEditingUserId
          ? { ...user, username: option.username, nickname: nextNickname, role: permissionRole }
          : user.id === option.id
            ? { ...user, nickname: nextNickname }
            : user);
      }
      const existingInDepartment = current.find(user => user.id === option.id && user.department === permissionDepartment);
      if (existingInDepartment) {
        return current.map(user => user.id === option.id
          ? { ...user, nickname: nextNickname, role: user.department === permissionDepartment ? permissionRole : user.role }
          : user);
      }
      return [
        ...current.map(user => user.id === option.id ? { ...user, nickname: nextNickname } : user),
        { id: option.id, username: option.username, nickname: nextNickname, role: permissionRole, department: permissionDepartment },
      ];
    });
    setPermissionUserModalOpen(false);
    setToast(permissionEditingUserId ? "用户配置已更新" : "用户已添加，花名配置已保存");
    setTimeout(() => setToast(""), 3200);
  }

  function removePermissionUser(user: PermissionUser) {
    setPermissionUsers(current => current.filter(item => !(item.id === user.id && item.department === permissionDepartment)));
    setToast(`已从${permissionDepartment}移除用户${user.nickname}`);
    setTimeout(() => setToast(""), 3200);
  }

  function openLegalSealFor(index: number) {
    setSelected(index);
    setDraftContractType(novels[index].contractType as "买断" | "保底＋分成");
    setSelectedSeal("杭州宝茂网络科技有限公司合同专用章");
    setLegalSealOpen(true);
  }

  function openLegalSeal() {
    setSelectedSeal("杭州宝茂网络科技有限公司合同专用章");
    setDetailOpen(false);
    setLegalSealOpen(true);
  }

  function cancelLegalSeal() {
    setLegalSealOpen(false);
    setToast("已取消签章，未提交任何用印结果");
    setTimeout(() => setToast(""), 3200);
  }

  function completeLegalSeal() {
    setLegalSealProcessing(true);
    setTimeout(() => {
      const next = [...states];
      next[selected] = "签署完成";
      setStates(next);
      setLegalSealProcessing(false);
      setLegalSealOpen(false);
      setToast(`法务签章完成（${selectedSeal}），合同与证据报告已自动归档`);
      setTimeout(() => setToast(""), 4200);
    }, 1100);
  }

  return (
    <div className="product admin-app">
      <aside className="green-sidebar">
        <div className="green-logo">奇果绿台</div>
        <div className="green-menu-item">◉ 帆软BI入口</div>
        <div className="green-menu-item">◉ 内容管理</div>
        <div className="green-menu-group">◈ 小说管理 <span>⌃</span></div>
        <button className={`green-sub ${adminView === "novels" ? "active" : ""}`} onClick={() => setAdminView("novels")}>小说管理</button>
        <button className={`green-sub contract-menu ${adminView === "contracts" ? "active" : ""}`} onClick={() => setAdminView("contracts")}><span>签约管理</span><i>{states.filter(state => state !== "签署完成" && state !== "已拒绝签约").length}</i></button>
        <div className="green-sub">小说标签管理</div><button className={`green-sub ${adminView === "permissions" ? "active" : ""}`} onClick={() => setAdminView("permissions")}>数据权限配置</button><div className="green-sub">小说送审库</div><div className="green-sub">小说配置栏目</div><div className="green-sub">CP合作管理</div>
        <div className="green-menu-item">◉ 公众号管理</div>
      </aside>
      <div className="green-shell">
        <header className="green-header"><span>☰</span><b>小说管理　/　{adminView === "contracts" ? "签约管理" : adminView === "permissions" ? "数据权限配置" : "小说管理"}</b><span className="challenge">百日0故障挑战 第324天</span><span>洪娟⌄</span></header>
        <main className="green-content">
          {adminView === "contracts" ? <>
            <div className="green-tab">签约管理　×</div>
            <section className="green-filters contract-green-filters">
              <label>签约单号<input placeholder="请输入"/></label>
              <label>小说名称<input placeholder="请输入"/></label>
              <label>作者笔名<input placeholder="请输入"/></label>
              <label>合同类型<select><option>全部</option><option>买断</option><option>保底＋分成</option></select></label>
              <label>签约状态<select><option>全部</option><option>待拟定合同</option><option>待合同审核</option><option>待作者签署</option><option>待法务签章</option><option>签署完成</option><option>已拒绝签约</option><option>异常</option></select></label>
              <label>责编<select><option>请选择</option><option>吴鑫鑫</option><option>柴文静</option></select></label>
              <label>财务审核人<select><option>请选择</option><option>财务审核人A</option><option>财务审核人B</option></select></label>
              <label>申请日期<input placeholder="开始日期　至　结束日期"/></label>
              <div className="filter-actions"><button className="primary small">查询</button><button className="secondary small">重置</button><button className="secondary small">导出</button></div>
            </section>
            <div className="table-toolbar contract-list-toolbar finance-batch-toolbar">
              <div>
                <button className="primary small" disabled={batchReviewIds.length === 0} onClick={() => setBatchReviewOpen(true)}>批量审核</button>
                <span>已选 {batchReviewIds.length} 份</span>
              </div>
              <label>当前财务账号
                <select value={currentFinanceReviewer} onChange={event => setCurrentFinanceReviewer(event.target.value as FinanceReviewer)}>
                  {financeReviewers.map(reviewer => <option key={reviewer}>{reviewer}</option>)}
                </select>
              </label>
              <span>两名财务并行审核、无先后顺序；两名财务全部通过后才同步给作者签约。</span>
            </div>
            <section className="live-table-wrap">
                <table className="live-table contract-list-table"><thead><tr><th className="batch-check-cell"><input type="checkbox" aria-label="全选待审核合同" checked={batchReviewIds.length > 0 && batchReviewIds.length === novels.filter((novel, index) => !novel.legacy && states[index] === "待合同审核").length} onChange={toggleAllPendingReviews}/></th><th>签约单号</th><th>小说名称</th><th>作者</th><th>合同类型</th><th>签约金额</th><th>签约主体</th><th>责编</th><th>财务审核进度</th><th>签约状态</th><th>更新时间</th><th>操作</th></tr></thead>
                  <tbody>{novels.map((novel, index) => ({ novel, index })).filter(({novel}) => !novel.legacy).map(({novel, index}) => {
                    const rowState = states[index];
                    const rowApprovals = financeApprovals[novel.id] || [];
                    return <tr key={novel.id}>
                      <td className="batch-check-cell"><input type="checkbox" aria-label={`选择${novel.name}`} disabled={rowState !== "待合同审核"} checked={batchReviewIds.includes(novel.id)} onChange={() => toggleBatchReview(novel.id)}/></td>
                      <td>{rowState === "签署完成" ? `QS20260723${index + 18}` : `SQ20260723${index + 31}`}</td>
                      <td><button className="novel-link" onClick={() => openNovelPreview(index)}>{novel.name}</button></td>
                      <td>{novel.author}</td>
                      <td>{novel.contractType}</td>
                      <td>¥{novel.price}</td>
                      <td>杭州宝茂网络科技有限公司</td>
                      <td>{novel.owner}</td>
                      <td>{rowState === "待拟定合同" || rowState === "已拒绝签约" ? "-" : <span className={`finance-progress ${rowApprovals.length === 2 ? "complete" : ""}`}><b>{rowApprovals.length}/2</b><small>{rowApprovals.length === 2 ? "均已通过" : rowApprovals.length === 1 ? `${rowApprovals[0]}已通过` : "等待两人审核"}</small></span>}</td>
                      <td><Badge tone={rowState === "签署完成" ? "green" : rowState === "已拒绝签约" ? "gray" : rowState === "待拟定合同" ? "blue" : "orange"}>{rowState}</Badge></td>
                      <td>07-27 14:{20 + index}</td>
                      <td><div className="row-actions">
                        {rowState === "待拟定合同" ? <><button onClick={() => openDraftContract(index)}>拟定合同</button><button className="danger-link" onClick={() => openRejectSigning(index)}>拒绝签约</button></> :
                          rowState === "待合同审核" ? <button onClick={() => showContract(index)}>审核合同</button> :
                          rowState === "待作者签署" ? <button onClick={() => openUrgeModal(index)}>催签</button> :
                          rowState === "待法务签章" ? <button onClick={() => openLegalSealFor(index)}>法务签章</button> :
                          rowState === "签署完成" ? <button onClick={() => openSignedPdf(index)}>查看</button> :
                          <button onClick={() => {setToast(signRejectionNotes[novel.id] ? `拒绝备注：${signRejectionNotes[novel.id]}` : "本次拒绝签约未填写备注");setTimeout(() => setToast(""), 3600);}}>查看备注</button>}
                      </div></td>
                    </tr>;
                  })}</tbody>
                </table>
            </section>
            <div className="pagination">共 {novels.filter(novel => !novel.legacy).length} 条　 <span>20条/页⌄</span>　‹　<b>1</b>　›</div>
          </> : adminView === "permissions" ? <>
          <div className="green-tab">数据权限配置　×</div>
          <section className="permission-config-page">
            <aside className="permission-department-list">
              <button className="primary small">新增部门</button>
              {["钱行工作室", "七月工作室", "测试的部门", "灵巧工作室"].map(department => <button
                key={department}
                className={permissionDepartment === department ? "active" : ""}
                onClick={() => setPermissionDepartment(department)}
              ><span>{department}</span><i>✎　⌫</i></button>)}
            </aside>
            <div className="permission-user-panel">
              <div className="permission-user-filters">
                <label>用户<input value={permissionQuery} onChange={event => setPermissionQuery(event.target.value)} placeholder="请输入用户名或花名"/></label>
                <button className="primary small">查询</button>
                <button className="permission-add-user" onClick={openAddPermissionUser}>新增用户</button>
              </div>
              <table className="permission-user-table">
                <thead><tr><th>用户</th><th>花名</th><th>角色</th><th>操作</th></tr></thead>
                <tbody>{filteredPermissionUsers.length > 0 ? filteredPermissionUsers.map(user => <tr key={`${user.department}-${user.id}`}>
                  <td>{user.username}</td>
                  <td><b>{user.nickname}</b></td>
                  <td>{user.role}</td>
                  <td><button onClick={() => openEditPermissionUser(user)}>编辑</button><button className="danger-link" onClick={() => removePermissionUser(user)}>删除</button></td>
                </tr>) : <tr><td colSpan={4} className="permission-empty">当前部门暂无用户</td></tr>}</tbody>
              </table>
              <div className="permission-rule-note">
                <b>花名用于业务展示，数据权限仍按用户ID判断</b>
                <span>同一用户跨部门共用一个花名；修改花名不会改变角色、部门归属或既有数据权限。</span>
              </div>
            </div>
          </section>
          </> : <>
          <div className="green-tab">小说管理　×</div>
          <section className="green-filters">
            <label>小说ID<input placeholder="请输入"/></label><label>小说名称<input placeholder="请输入"/></label><label>作者笔名<input placeholder="请输入"/></label>
            <label>小说状态<select><option>全部</option></select></label><label>责编<select><option>请选择</option></select></label>
            <label>部门<select><option>全部</option></select></label><label>创建日期<input placeholder="开始日期　至　结束日期"/></label>
            <div className="filter-actions"><button className="primary small">查询</button><button className="secondary small">重置</button><button className="secondary small">导出</button></div>
          </section>
          <div className="table-toolbar"><button className="primary small" onClick={openNewNovelModal}>新建小说</button><span>支持手动录入，或从签约管理批量选择作者已申请签约的小说</span></div>
          <section className="live-table-wrap">
            <table className="live-table"><thead><tr><th>小说ID</th><th>小说名称</th><th>封面</th><th>作者</th><th>编辑</th><th>责编</th><th>部门</th><th>上架类型</th><th>版权类型</th><th>版权文件</th><th>状态</th><th>创建时间</th><th>操作</th></tr></thead>
              <tbody>
              {manualNovelAdded && <tr>
                <td>1050</td><td><button className="novel-link">{manualNovelName}</button></td><td><span className="tiny-cover cover-1">{manualNovelName.slice(0,2)}</span></td><td>{manualNovelAuthor}</td><td>富贵竹</td><td>吴鑫鑫</td><td>钱行工作室</td><td>签约</td><td>自有版权</td><td>-</td><td><span className="online-dot"/>上架</td><td>2026-07-29 20:20:00</td><td><div className="row-actions"><button>修改</button><button>克隆</button></div></td>
              </tr>}
              {novels.map((novel, index) => ({ novel, index })).filter(({novel}) => managedNovelIds.includes(novel.id)).map(({novel, index}) => <tr key={novel.id} className={selected === index ? "selected-row" : ""} onClick={() => setSelected(index)}>
                <td>{novel.id}</td><td><button className="novel-link">{novel.name}</button></td><td><span className={`tiny-cover cover-${index}`}>{novel.name.slice(0,2)}</span></td><td>{novel.author}</td><td>{novel.editor}</td><td>{novel.owner}</td><td>{novel.department}</td><td>签约</td><td>自有版权</td>
                <td>{novel.legacy ? <button className="file-link" onClick={event => { event.stopPropagation(); setToast("已打开业务手动上传的历史线下合同"); }}>历史合同-{novel.id}.pdf</button> : states[index] === "签署完成" ? <span className="file-stack"><button className="file-link">已签合同.pdf</button><button className="file-link">证据报告.pdf</button><small>2 / 5</small></span> : "-"}</td>
                <td><span className="online-dot"/>上架</td><td>{novel.createdAt}</td>
                <td><div className="row-actions"><button>修改</button><button>克隆</button></div></td>
              </tr>)}</tbody>
            </table>
          </section>
          <div className="pagination">共 {managedNovelIds.length + (manualNovelAdded ? 1 : 0)} 条　 <span>10条/页⌄</span>　‹　<b>1</b>　›</div>
          </>}
        </main>
      </div>
      {launchModal && (
        <div className="overlay" onClick={() => setLaunchModal(false)}>
          <div className="contract-drafting-modal" onClick={event => event.stopPropagation()}>
            <header className="contract-drafting-header">
              <div><h2>拟定合同</h2><p>{selectedNovel.name} · 责编核对合同内容及填写控件后提交财务审核</p></div>
              <span>腾讯电子签模板预填</span>
              <button className="close" onClick={() => setLaunchModal(false)}>×</button>
            </header>
            <div className="contract-drafting-body">
              <section className="draft-document-preview">
                <div className="draft-document-toolbar"><b>{previewTemplateName}</b><span>第 {previewPage} / {previewPageCount} 页　100%</span></div>
                <div className="draft-document-workspace">
                  <aside>
                    {Array.from({length: previewPageCount}, (_, index) => index + 1).map(page => <button key={page} className={page === previewPage ? "active" : ""} onClick={() => scrollDraftPreview(page)}><i>{page}</i><span>第{page}页</span></button>)}
                  </aside>
                  <main onScroll={trackDraftPreviewPage}>
                    <div className="draft-page-stack">
                      {Array.from({length: previewPageCount}, (_, index) => index + 1).map(page => <figure key={page} ref={node => {draftPageRefs.current[page] = node;}} className="template-page">
                        <img src={contractPageSrc(page)} alt={`${previewTemplateName}第 ${page} 页`}/>
                        {(draftContractType === "保底＋分成"
                          ? guaranteePreviewFields(page, selectedNovel.name, draftAuthor.penName, draftAmount, draftAuthor)
                          : buyoutPreviewFields(page, selectedNovel.name, draftAuthor.penName, draftAmount, draftAuthor)
                        ).map((field, index) => <span key={`${page}-${index}`} className={`template-prefill-value ${field.tone || "normal"}`} style={{ left: `${field.left}%`, top: `${field.top}%`, width: `${field.width || 20}%` }}>{field.value}</span>)}
                        <div className="draft-preview-mark">合同拟定预览 · 未生效</div>
                        <figcaption>第 {page} / {previewPageCount} 页</figcaption>
                      </figure>)}
                    </div>
                  </main>
                </div>
              </section>
              <aside className="contract-fill-panel" aria-label="合同填写控件，可上下滚动查看全部字段" tabIndex={0}>
                <div className="fill-panel-heading"><div><h3>填写合同内容</h3><p>右侧独立滚动，修改后左侧合同【】内容实时同步</p></div><button onClick={() => setMappingOpen(true)}>查看全部控件</button></div>
                <div className="fill-party-label"><i>杭</i><b>杭州宝茂网络科技有限公司</b></div>
                <label><span><b>*</b> 签约方式</span><select value={draftContractType} onChange={event => {setDraftContractType(event.target.value as "买断" | "保底＋分成");setPreviewPage(1);setDraftConfirmed(false);}}><option>买断</option><option>保底＋分成</option></select></label>
                <label><span><b>*</b> 合同模板</span><input value={previewTemplateName} readOnly/></label>
                <label><span><b>*</b> {draftContractType === "买断" ? "固定版权费用" : "税前保底费用"}</span><input value={`¥ ${draftAmount}`} onChange={event => {setDraftAmount(event.target.value.replace(/[^\d,.]/g, ""));setDraftConfirmed(false);}}/></label>
                <label><span><b>*</b> 小说名称</span><input value={selectedNovel.name} readOnly/></label>
                <div className="author-sync-heading"><div><b>作者信息</b><span>来自作者投稿后台</span></div><small>责编可重新编辑，保存时覆盖本次合同快照</small></div>
                <label><span><b>*</b> 作者实名</span><input value={draftAuthor.legalName} onChange={event => updateDraftAuthor("legalName", event.target.value)}/></label>
                <label><span><b>*</b> 作者笔名</span><input value={draftAuthor.penName} onChange={event => updateDraftAuthor("penName", event.target.value)}/></label>
                <label><span><b>*</b> 作者手机号</span><input value={draftAuthor.mobile} onChange={event => updateDraftAuthor("mobile", event.target.value)}/></label>
                <label><span><b>*</b> 身份证号</span><input value={draftAuthor.idNumber} onChange={event => updateDraftAuthor("idNumber", event.target.value)}/></label>
                <label><span><b>*</b> 联系地址</span><input value={draftAuthor.address} onChange={event => updateDraftAuthor("address", event.target.value)}/></label>
                <label><span><b>*</b> 开户行</span><input value={draftAuthor.bankName} onChange={event => updateDraftAuthor("bankName", event.target.value)}/></label>
                <label><span><b>*</b> 银行卡号</span><input value={draftAuthor.bankAccount} onChange={event => updateDraftAuthor("bankAccount", event.target.value)}/></label>
                <label><span><b>*</b> 财务审核人</span><select><option>财务审核人A＋财务审核人B（并行）</option></select></label>
                <div className="fill-sign-order"><b>签署顺序</b><span>财务双人并行审核（全部通过）→ 作者签字 → 法务签章</span></div>
                <label className="control-confirm-check"><input type="checkbox" checked={draftConfirmed} onChange={event => setDraftConfirmed(event.target.checked)}/><span>我已对照左侧合同原文，核对上述填写控件准确无误</span></label>
              </aside>
            </div>
            <footer className="contract-drafting-footer"><span>两名财务全部审核通过后才创建正式腾讯电子签流程；当前预览不消耗合同份数。</span><button className="secondary" onClick={() => setLaunchModal(false)}>暂存草稿</button><button className="primary" disabled={!draftConfirmed} onClick={launchFlow}>提交双人财务审核</button></footer>
          </div>
        </div>
      )}
      {novelPreviewOpen && <div className="overlay" onClick={() => setNovelPreviewOpen(false)}>
        <div className="novel-content-preview-modal" onClick={event => event.stopPropagation()}>
          <header><div><h2>小说内容预览</h2><p>签约管理 / {selectedNovel.name}</p></div><button className="close" onClick={() => setNovelPreviewOpen(false)}>×</button></header>
          <div className="novel-preview-summary">
            <span className={`detail-cover cover-${selected}`}>{selectedNovel.name}</span>
            <div><h3>{selectedNovel.name}</h3><p>{selectedNovel.author} 著　｜　短篇 · 悬疑　｜　88,320 字</p><div><span>责编：{selectedNovel.owner}</span><span>完结日期：2026-07-22</span><span>作者已申请签约</span></div></div>
          </div>
          <div className="novel-preview-body">
            <aside><b>章节目录</b>{["第1章　雨夜来信","第2章　旧城重逢","第3章　被藏起来的真相","第4章　第七封信"].map((title,index) => <button key={title} className={index === 0 ? "active" : ""}>{title}</button>)}</aside>
            <article><h3>第1章　雨夜来信</h3><p>{chapterContentSamples[0]}</p><p>{chapterContentSamples[1]}</p><p>{chapterContentSamples[2]}</p></article>
          </div>
          <footer><span>仅供责编评估签约使用，小说正文不可在此修改。</span><button className="primary" onClick={() => setNovelPreviewOpen(false)}>关闭预览</button></footer>
        </div>
      </div>}
      {rejectSigningOpen && <div className="overlay" onClick={() => setRejectSigningOpen(false)}>
        <div className="reject-signing-modal" onClick={event => event.stopPropagation()}>
          <button className="close" onClick={() => setRejectSigningOpen(false)}>×</button>
          <div className="reject-signing-icon">!</div><h2>拒绝签约</h2>
          <p>确认拒绝小说《{selectedNovel.name}》的签约申请吗？拒绝后将保留操作记录。</p>
          <label><span>备注 <small>非必填</small></span><textarea value={rejectSigningNote} onChange={event => setRejectSigningNote(event.target.value)} maxLength={300} placeholder="可填写拒绝原因，便于后续业务追溯"/><em>{rejectSigningNote.length}/300</em></label>
          <div className="modal-actions"><button className="secondary" onClick={() => setRejectSigningOpen(false)}>取消</button><button className="danger-button" onClick={confirmRejectSigning}>确认拒绝</button></div>
        </div>
      </div>}
      {urgeModalOpen && <div className="overlay" onClick={() => setUrgeModalOpen(false)}>
        <div className="urge-message-modal" onClick={event => event.stopPropagation()}>
          <button className="close" onClick={() => setUrgeModalOpen(false)}>×</button><h2>短信催签</h2>
          <p>短信将发送至作者签约手机号：138 **** 6621</p>
          <div><b>短信文案</b><span>你的小说《{selectedNovel.name}》签约合同已拟定完成，请点击链接前往查看并完成签字</span><small>短信末尾将自动附加腾讯电子签签署链接</small></div>
          <div className="modal-actions"><button className="secondary" onClick={() => setUrgeModalOpen(false)}>取消</button><button className="primary" onClick={sendUrgeMessage}>确认发送</button></div>
        </div>
      </div>}
      {newNovelModalOpen && <div className="overlay" onClick={() => setNewNovelModalOpen(false)}>
        <div className="new-novel-entry-modal" onClick={event => event.stopPropagation()}>
          <header><div><h2>新建小说</h2><p>请选择小说数据的创建方式</p></div><button className="close" onClick={() => setNewNovelModalOpen(false)}>×</button></header>
          <div className="new-novel-mode-switch">
            <button className={newNovelMode === "manual" ? "active" : ""} onClick={() => setNewNovelMode("manual")}><i>＋</i><span><b>手动录入</b><small>按当前绿台新建小说流程填写完整信息</small></span><em>{newNovelMode === "manual" ? "✓" : ""}</em></button>
            <button className={newNovelMode === "signing" ? "active" : ""} onClick={() => setNewNovelMode("signing")}><i>签</i><span><b>签约管理选择</b><small>从作者已申请签约的小说中批量选择</small></span><em>{newNovelMode === "signing" ? "✓" : ""}</em></button>
          </div>
          {newNovelMode === "manual" ? <div className="manual-novel-form">
            <div className="manual-form-title"><b>小说基础信息</b><span>逻辑与当前线上“新建小说”保持一致</span></div>
            <div className="green-form-grid">
              <label>小说名称 <b>*</b><input value={manualNovelName} onChange={event => setManualNovelName(event.target.value)} placeholder="请输入小说名称"/></label>
              <div className="managed-author-field">
                <span>作者笔名 <b>*</b></span>
                {manualAuthorInputMode ? <div className="manual-author-input">
                  <input autoFocus value={manualNovelAuthor} onChange={event => setManualNovelAuthor(event.target.value)} placeholder="请手动输入作者笔名"/>
                  <em>手动录入</em>
                  <button type="button" onClick={returnToManagedAuthorPicker}>返回选择作者管理</button>
                </div> : <div className="managed-author-picker">
                  <div className={manualAuthorPickerOpen ? "author-combobox active" : "author-combobox"}>
                    <input
                      value={manualAuthorQuery}
                      onFocus={() => setManualAuthorPickerOpen(true)}
                      onChange={event => {
                        setManualAuthorQuery(event.target.value);
                        setManualNovelAuthor("");
                        setSelectedManagedAuthorId("");
                        setManualAuthorPickerOpen(true);
                      }}
                      placeholder="搜索并单选作者管理中的作者"
                    />
                    <button type="button" aria-label="展开作者列表" onClick={() => setManualAuthorPickerOpen(current => !current)}>⌄</button>
                  </div>
                  {manualAuthorPickerOpen && <div className="managed-author-dropdown">
                    <div className="author-picker-tip">优先选择作者管理已有作者</div>
                    {filteredManagedAuthors.length > 0 ? filteredManagedAuthors.map(author => <button type="button" key={author.id} onClick={() => selectManagedAuthor(author)}>
                      <i>{author.penName.slice(0, 1)}</i>
                      <span><b>{author.penName}</b><small>{author.legalName} · {author.mobile}</small></span>
                      <em>{author.id}</em>
                    </button>) : <div className="author-empty-result">未找到“{manualAuthorQuery}”对应的作者</div>}
                    <button type="button" className="manual-author-entry" onClick={enableManualAuthorInput}>＋ 作者管理中没有？手动输入作者笔名</button>
                  </div>}
                  {selectedManagedAuthor && <div className="linked-author-info"><b>已关联作者管理</b><span>{selectedManagedAuthor.legalName} · {selectedManagedAuthor.mobile}</span><em>{selectedManagedAuthor.id}</em></div>}
                </div>}
                <small className="managed-author-help">先从作者管理中下拉单选；没有对应作者时可切换为手动输入。</small>
              </div>
              <label>编辑<select><option>富贵竹</option><option>长青</option></select></label>
              <label>责编<select><option>吴鑫鑫</option><option>柴文静</option></select></label>
              <label>所属部门<select><option>钱行工作室</option><option>七月工作室</option></select></label>
              <label>小说类型<select><option>短篇</option><option>长篇</option></select></label>
              <label>男女频<select><option>女频</option><option>男频</option></select></label>
              <label>小说状态<select><option>上架</option><option>下架</option></select></label>
              <label className="manual-cover-field">小说封面<div><button>＋ 上传封面</button><small>支持 JPG、PNG，建议尺寸 600×800</small></div></label>
              <label>版权类型<select><option>自有版权</option><option>非自有版权</option></select></label>
            </div>
          </div> : <div className="signing-novel-picker">
            <div className="picker-toolbar"><div><b>签约管理小说列表</b><span>数据来自作者已提交的签约申请，可多选</span></div><input placeholder="搜索小说名称 / 作者 / 责编"/></div>
            <table><thead><tr><th>选择</th><th>小说名称</th><th>作者</th><th>责编</th><th>申请日期</th></tr></thead>
              <tbody>{novels.filter(novel => !novel.legacy).map(novel => {
                const alreadyAdded = managedNovelIds.includes(novel.id);
                return <tr key={novel.id} className={alreadyAdded ? "disabled" : ""}><td><input type="checkbox" disabled={alreadyAdded} checked={alreadyAdded || selectedSigningNovelIds.includes(novel.id)} onChange={() => toggleSigningNovel(novel.id)}/></td><td><b>{novel.name}</b>{alreadyAdded && <small>已在小说管理</small>}</td><td>{novel.author}</td><td>{novel.owner}</td><td>2026-07-{22 + Number(novel.id) % 5}</td></tr>;
              })}</tbody>
            </table>
          </div>}
          <footer><span>{newNovelMode === "manual"
            ? manualAuthorInputMode
              ? "作者笔名：手动录入"
              : selectedManagedAuthor
                ? `作者笔名：已关联作者管理 · ${selectedManagedAuthor.id}`
                : "请先从作者管理选择作者"
            : `已选择 ${selectedSigningNovelIds.length} 本小说`}</span><button className="secondary" onClick={() => setNewNovelModalOpen(false)}>取消</button>{newNovelMode === "manual" ? <button className="primary" disabled={!manualNovelName.trim() || !manualNovelAuthor.trim()} onClick={confirmManualNovel}>确定新建</button> : <button className="primary" disabled={selectedSigningNovelIds.length === 0} onClick={confirmSigningNovelSelection}>确认选择</button>}</footer>
        </div>
      </div>}
      {permissionUserModalOpen && <div className="overlay permission-user-overlay" onClick={() => setPermissionUserModalOpen(false)}>
        <div className="permission-user-modal" onClick={event => event.stopPropagation()}>
          <header><h2>{permissionEditingUserId ? "编辑用户" : "新增用户"}</h2><button className="close" onClick={() => setPermissionUserModalOpen(false)}>×</button></header>
          <div className="permission-user-form">
            <label><span><b>*</b> 用户</span><select value={permissionSelectedUserId} disabled={Boolean(permissionEditingUserId)} onChange={event => selectPermissionUser(event.target.value)}>
              <option value="">请选择</option>
              {permissionUserOptions.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
            </select></label>
            <label><span><b>*</b> 角色</span><select value={permissionRole} onChange={event => setPermissionRole(event.target.value)}>
              <option value="">请选择</option><option>责编</option><option>主编</option><option>经理</option><option>财务</option><option>法务</option>
            </select></label>
            <label><span><b>*</b> 花名</span><div><input
              value={permissionNickname}
              maxLength={20}
              onBlur={() => setPermissionNicknameTouched(true)}
              onChange={event => { setPermissionNickname(event.target.value); setPermissionNicknameTouched(true); }}
              placeholder={permissionSelectedUserId ? "请输入花名" : "选择用户后自动带入用户名"}
            />{permissionNicknameTouched && !permissionNickname.trim() && <small>请输入花名</small>}<em>{permissionNickname.length}/20</em></div></label>
          </div>
          <footer><span>选择用户后，花名默认展示用户名，可直接修改。</span><button className="secondary" onClick={() => setPermissionUserModalOpen(false)}>取消</button><button className="primary" disabled={!permissionSelectedUserId || !permissionRole || !permissionNickname.trim()} onClick={savePermissionUser}>确定</button></footer>
        </div>
      </div>}
      {batchReviewOpen && <div className="overlay batch-review-overlay" onClick={() => setBatchReviewOpen(false)}>
        <div className="batch-review-modal" onClick={event => event.stopPropagation()}>
          <header><div><h2>批量审核合同</h2><p>当前审核账号：{currentFinanceReviewer}</p></div><button className="close" onClick={() => setBatchReviewOpen(false)}>×</button></header>
          <div className="batch-review-rule"><b>双人并行审核规则</b><span>本次批量操作只记录当前财务的审核结果，不代替另一名财务；同一账号已审核的合同将自动跳过。两名财务全部通过后，合同才同步给作者签约。</span></div>
          <div className="batch-review-list">
            <div className="batch-review-list-head"><span>小说 / 作者</span><span>当前进度</span><span>本次结果</span></div>
            {batchReviewIds.map(novelId => {
              const novel = novels.find(item => item.id === novelId)!;
              const approvals = financeApprovals[novelId] || [];
              const alreadyReviewed = approvals.includes(currentFinanceReviewer);
              const nextCount = alreadyReviewed ? approvals.length : Math.min(2, approvals.length + 1);
              return <div key={novelId}><span><b>《{novel.name}》</b><small>{novel.author} · {novel.contractType}</small></span><span><b>{approvals.length}/2</b><small>{approvals.length ? `${approvals.join("、")}已通过` : "尚无人通过"}</small></span><span className={alreadyReviewed ? "skip" : nextCount === 2 ? "complete" : "pending"}>{alreadyReviewed ? "跳过·本人已审核" : nextCount === 2 ? "通过后同步作者" : "通过后等待另一人"}</span></div>;
            })}
          </div>
          <footer><span>已选择 {batchReviewIds.length} 份合同</span><button className="secondary" onClick={() => setBatchReviewOpen(false)}>取消</button><button className="primary" onClick={confirmBatchReview}>确认批量通过</button></footer>
        </div>
      </div>}
      {reviewOpen && <div className="overlay contract-review-overlay" onClick={() => setReviewOpen(false)}>
        <div className="contract-review-modal" onClick={event => event.stopPropagation()}>
          <header className="contract-review-header">
            <div><h2>审核合同</h2><p>《{selectedNovel.name}》· {previewTemplateName}</p></div>
            <span><i>✓</i> 腾讯电子签已返回填充完成的合同</span>
            <button className="close" onClick={() => setReviewOpen(false)}>×</button>
          </header>
          <div className="contract-review-body">
            <aside className="review-page-nav">
              <b>共 {previewPageCount} 页</b>
              {Array.from({length: previewPageCount}, (_, index) => index + 1).map(page => <button key={page} className={page === previewPage ? "active" : ""} onClick={() => setPreviewPage(page)}><i>{page}</i><span>第 {page} 页</span></button>)}
            </aside>
            <main className="review-contract-stage">
              <div className="review-contract-toolbar"><span>－　100%　＋</span><b>合同控件已填充 · 只读审核</b></div>
              <figure className="template-page">
                <img src={previewPageSrc} alt={`腾讯电子签返回合同第 ${previewPage} 页`}/>
                {(draftContractType === "保底＋分成"
                  ? guaranteePreviewFields(previewPage, selectedNovel.name, selectedNovel.author, draftAmount)
                  : buyoutPreviewFields(previewPage, selectedNovel.name, selectedNovel.author, draftAmount)
                ).map((field, index) => <span key={`review-${previewPage}-${index}`} className={`template-prefill-value ${field.tone || "normal"}`} style={{ left: `${field.left}%`, top: `${field.top}%`, width: `${field.width || 20}%` }}>{field.value}</span>)}
                <div className="review-return-watermark">腾讯电子签合同预览</div>
                <figcaption>第 {previewPage} / {previewPageCount} 页 · 腾讯电子签返回文件</figcaption>
              </figure>
            </main>
            <aside className="review-contract-info">
              <h3>合同审核信息</h3>
              <div className="review-return-status"><i>✓</i><span><b>控件填充完成</b><small>腾讯电子签文档合成成功</small></span></div>
              <dl>
                <div><dt>合同版本</dt><dd>V1</dd></div>
                <div><dt>签约方式</dt><dd>{selectedNovel.contractType}</dd></div>
                <div><dt>签约金额</dt><dd>¥{selectedNovel.price}</dd></div>
                <div><dt>作者</dt><dd>石＊京 / {selectedNovel.author}</dd></div>
                <div><dt>责编</dt><dd>{selectedNovel.owner}</dd></div>
              </dl>
              <div className="finance-dual-review">
                <div className="finance-dual-title"><b>双人审核进度</b><span>{selectedFinanceApprovals.length}/2</span></div>
                {financeReviewers.map(reviewer => <div key={reviewer} className={selectedFinanceApprovals.includes(reviewer) ? "approved" : ""}>
                  <i>{selectedFinanceApprovals.includes(reviewer) ? "✓" : "待"}</i><span><b>{reviewer}</b><small>{selectedFinanceApprovals.includes(reviewer) ? "已审核通过" : "待审核 · 无先后顺序"}</small></span>{currentFinanceReviewer === reviewer && <em>当前账号</em>}
                </div>)}
                <label>切换当前财务账号<select value={currentFinanceReviewer} onChange={event => setCurrentFinanceReviewer(event.target.value as FinanceReviewer)}>{financeReviewers.map(reviewer => <option key={reviewer}>{reviewer}</option>)}</select></label>
              </div>
              <div className="review-readonly-tip"><b>审核说明</b><span>两名财务审核没有先后顺序，必须全部通过后才同步给作者。任一人审核驳回，合同立即返回责编重新拟定；本页面只读展示腾讯电子签返回的已填充合同。</span></div>
            </aside>
          </div>
          <footer className="contract-review-footer">
            <span>当前进度 {selectedFinanceApprovals.length}/2；单人通过后仍保持“待合同审核”</span>
            <button className="secondary review-reject-action" onClick={() => {setRejectReason("");setRejectModal(true);}}>审核驳回</button>
            <button className="primary" disabled={currentFinanceApproved} onClick={() => setApproveConfirmOpen(true)}>{currentFinanceApproved ? "本人已审核通过" : "审核通过"}</button>
          </footer>
        </div>
      </div>}
      {approveConfirmOpen && <div className="overlay review-confirm-overlay" onClick={() => setApproveConfirmOpen(false)}>
        <div className="review-approve-confirm" onClick={event => event.stopPropagation()}>
          <button className="close" onClick={() => setApproveConfirmOpen(false)}>×</button>
          <div className="review-confirm-icon">?</div>
          <h2>确认合同审核无误？</h2>
          <p>{selectedFinanceApprovals.length === 1 ? "确认后将满足双人审核，合同即同步给作者签约。" : "确认后记录你的审核结果，合同继续等待另一名财务审核。"}</p>
          <div className="review-confirm-summary"><span>小说名称</span><b>《{selectedNovel.name}》</b><span>合同金额</span><b>¥{selectedNovel.price}</b><span>当前审核人</span><b>{currentFinanceReviewer}</b><span>确认后进度</span><b>{Math.min(2, selectedFinanceApprovals.length + 1)}/2</b></div>
          <div className="modal-actions"><button className="secondary" onClick={() => setApproveConfirmOpen(false)}>取消</button><button className="primary" onClick={approveContract}>确认审核通过</button></div>
        </div>
      </div>}
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
              <Badge tone={selectedState === "签署完成" ? "green" : selectedState === "待拟定合同" ? "blue" : "orange"}>{selectedState}</Badge><h2>{selectedNovel.name}</h2><p>{selectedState === "待合同审核" ? "合同版本：V1 · 两名财务全部通过后创建腾讯电子签流程" : "腾讯电子签流程 ID：yDwFmUUckp****3cqjkGm"}</p>
              <div className="drawer-actions">
                {selectedState === "待合同审核" && <><button className="secondary reject-action" onClick={() => setRejectModal(true)}>驳回修改</button><button className="primary" disabled={currentFinanceApproved} onClick={() => setApproveConfirmOpen(true)}>{currentFinanceApproved ? "本人已审核通过" : "财务审核通过"}</button></>}
                {selectedState === "待作者签署" && <button className="primary" onClick={() => openUrgeModal(selected)}>催签作者</button>}
                {selectedState === "待法务签章" && <button className="primary" onClick={openLegalSeal}>法务签章</button>}
                {selectedState === "签署完成" ? <button className="secondary" onClick={() => {setDetailOpen(false);openSignedPdf(selected);}}>在线查看合同</button> : <button className="secondary" onClick={openContractPreview}>预览合同</button>}
              </div>
              <div className="contract-summary vertical">
                <div><span>合同编号</span><b>{selectedState === "签署完成" ? "QS202607230018" : "签署与盖章完成后生成"}</b></div>
                <div><span>合同模板 / 金额</span><b>{selectedNovel.contractType === "买断" ? "短篇小说版权合同（买断）" : "【模板】短篇小说版权转让合同（保底＋分成）"} / ¥{selectedNovel.price}</b></div>
                <div><span>签约主体</span><b>杭州宝茂网络科技有限公司</b></div>
                <div><span>财务审核</span><b>{selectedState === "待合同审核" ? `${selectedFinanceApprovals.length}/2 已通过 · 无先后顺序` : "2/2 均已通过"}</b></div>
                <div><span>作者签署（第 1 顺位）</span><b>{selectedState === "待合同审核" || selectedState === "待拟定合同" ? "合同审核通过后开始" : selectedState === "待作者签署" ? "待签署" : "已完成 · 主合同＋声明函"}</b></div>
                <div><span>法务签章（第 2 顺位）</span><b>{selectedState === "签署完成" ? `已完成 · ${selectedSeal}` : selectedState === "待法务签章" ? "待法务内部确认经办人" : "等待作者先签"}</b></div>
                <div><span>版权文件占用</span><b>{selectedState === "签署完成" ? "已签合同＋证据报告：2 / 5" : "完成后预计新增 2 个文件"}</b></div>
              </div>
              <h3>流转留痕</h3><ol className="audit-list">
                <li><b>作者提交签约申请</b><span>{selectedNovel.author} · 实名与签约资料校验通过</span></li>
                <li><b>责编拟定并提交合同</b><span>{selectedNovel.owner} · 模板、稿费与签署顺序已保存</span></li>
                <li><b>{selectedState === "待合同审核" ? "等待双人财务审核" : "双人财务审核通过"}</b><span>{selectedState === "待合同审核" ? `${selectedFinanceApprovals.length}/2 已通过；两名财务并行审核，无先后顺序` : "2/2 均通过后已自动创建电子签流程并发送作者"}</span></li>
                <li><b>{selectedState === "待合同审核" || selectedState === "待拟定合同" ? "作者签署尚未开始" : selectedState === "待作者签署" ? "等待作者签署" : "作者签署完成"}</b><span>{selectedState === "待合同审核" || selectedState === "待拟定合同" ? "两名财务全部通过后自动发送作者" : selectedState === "待作者签署" ? "电子合同已同步至作者投稿后台" : "主合同与声明函签名控件均完成"}</span></li>
                <li><b>{selectedState === "签署完成" ? "法务签章完成并归档" : "等待法务手动签章"}</b><span>{selectedState === "签署完成" ? "腾讯回调成功后，合同 PDF 与证据报告已回写版权文件" : "法务内部自行确认本次经办人，由具备用印权限的法务完成签章"}</span></li>
              </ol>
            </>}
          </aside>
        </div>
      )}
      {previewOpen && <div className="overlay contract-preview-overlay" onClick={() => setPreviewOpen(false)}>
        <div className="contract-preview-modal" onClick={event => event.stopPropagation()}>
          <header className="contract-preview-header">
            <div><h2>合同预览</h2><p>{previewTemplateName} · 严格按模板逐页展示</p></div>
            <div className="preview-header-status"><span>真实模板原样渲染</span><b>内部预览 · 未生效</b></div>
            <button className="close" onClick={() => setPreviewOpen(false)}>×</button>
          </header>
          <div className="contract-preview-layout">
            <aside className="contract-page-nav">
              <b>页面 · 共 {previewPageCount} 页</b>
              {Array.from({length: previewPageCount}, (_, index) => index + 1).map(page => (
                <button
                  key={page}
                  className={page === previewPage ? "active" : ""}
                  aria-pressed={page === previewPage}
                  onClick={() => setPreviewPage(page)}
                >
                  <i>{page}</i><span>第 {page} 页</span>
                </button>
              ))}
            </aside>
            <main className="contract-paper-stage">
              <figure className="template-page">
                <img src={previewPageSrc} alt={`${previewTemplateName}第 ${previewPage} 页`}/>
                {draftContractType === "保底＋分成" && guaranteePreviewFields(previewPage, selectedNovel.name, selectedNovel.author, draftAmount).map((field, index) => (
                  <span
                    key={`${previewPage}-${index}`}
                    className={`template-prefill-value ${field.tone || "normal"}`}
                    style={{ left: `${field.left}%`, top: `${field.top}%`, width: `${field.width || 20}%` }}
                  >
                    {field.value}
                  </span>
                ))}
                <div className="template-preview-watermark">内部预览 · 未生效</div>
                <figcaption>第 {previewPage} 页 / 共 {previewPageCount} 页 · 内容及分页按合同模板原样展示</figcaption>
              </figure>
            </main>
            <aside className="preview-data-panel">
              <h3>本次拟定数据</h3>
              <p>实际接入后由腾讯电子签模板控件写入对应位置；左侧合同页保持原模板字体、表格、条款和分页。</p>
              <dl>
                <div><dt>合同模板</dt><dd>{previewTemplateName}</dd></div>
                <div><dt>小说名称</dt><dd>{selectedNovel.name}</dd></div>
                <div><dt>作者笔名</dt><dd>{selectedNovel.author}</dd></div>
                <div><dt>作者实名</dt><dd>石＊京</dd></div>
                <div><dt>签约金额</dt><dd>¥{draftAmount}</dd></div>
                <div><dt>签约主体</dt><dd>杭州宝茂网络科技有限公司</dd></div>
              </dl>
              {draftContractType === "保底＋分成" && <div className="preview-control-summary">
                <span><b>31</b>项业务数据已预填</span>
                <span><b>5</b>项由腾讯签署生成</span>
                <span className="pending"><b>2</b>项日期口径待确认</span>
                <button onClick={() => setMappingOpen(true)}>查看全部控件映射</button>
              </div>}
              <div className="preview-tip"><b>预览说明</b><span>本预览使用真实合同模板逐页渲染，仅供拟定与审核；正式合同以腾讯电子签生成的 PDF 为准。</span></div>
            </aside>
          </div>
          <footer className="contract-preview-footer"><span>模板：{previewTemplateName}　当前第 {previewPage} / {previewPageCount} 页</span><button className="secondary" onClick={() => setPreviewOpen(false)}>返回继续编辑</button></footer>
        </div>
      </div>}
      {signedPdfOpen && <div className="overlay contract-preview-overlay" onClick={() => setSignedPdfOpen(false)}>
        <div className="signed-pdf-viewer" onClick={event => event.stopPropagation()}>
          <header><div><h2>已签合同 PDF</h2><p>《{selectedNovel.name}》版权合同 · QS202607230018</p></div><span><i>✓</i> 签约完成</span><button className="close" onClick={() => setSignedPdfOpen(false)}>×</button></header>
          <div className="signed-pdf-body">
            <aside><b>共 {previewPageCount} 页</b>{Array.from({length: previewPageCount},(_,index)=>index+1).map(page => <button key={page} className={page === previewPage ? "active" : ""} onClick={() => setPreviewPage(page)}><i>{page}</i><span>第 {page} 页</span></button>)}</aside>
            <main><div className="pdf-toolbar"><span>－　100%　＋</span><b>只读 · 已完成电子签名与存证</b></div><figure className="template-page"><img src={previewPageSrc} alt={`已签合同第 ${previewPage} 页`}/>{draftContractType === "保底＋分成" && previewPage === 7 && <><div className="signed-author-stamp"><b>石京</b><span>已签 · 2026-07-23</span></div><div className="signed-company-stamp">杭州宝茂<br/>合同专用章</div></>}<figcaption>第 {previewPage} / {previewPageCount} 页 · 腾讯电子签已签 PDF</figcaption></figure></main>
            <aside className="signed-pdf-info"><h3>签署信息</h3><dl><div><dt>合同状态</dt><dd>签约完成</dd></div><div><dt>作者签字</dt><dd>石京 · 已完成</dd></div><div><dt>企业签章</dt><dd>杭州宝茂 · 已完成</dd></div><div><dt>签约日期</dt><dd>2026-07-23</dd></div><div><dt>文件格式</dt><dd>PDF · 10页</dd></div></dl><div><b>文件完整性校验通过</b><span>合同哈希与腾讯电子签归档文件一致</span></div></aside>
          </div>
          <footer><span>在线查看为只读模式，文件内容与归档PDF一致。</span><button className="secondary" onClick={() => setToast("已下载签约完成的合同 PDF")}>下载PDF</button><button className="primary" onClick={() => setSignedPdfOpen(false)}>关闭</button></footer>
        </div>
      </div>}
      {rejectModal && <div className="overlay review-overlay" onClick={() => setRejectModal(false)}>
        <div className="review-reject-modal" onClick={event => event.stopPropagation()}>
          <button className="close" onClick={() => setRejectModal(false)}>×</button>
          <h2>审核驳回</h2>
          <p>请填写驳回原因。任一财务驳回后，合同立即返回责编重新拟定，已产生的通过结果同时失效；审核意见将写入流转记录。</p>
          <label><span><b>*</b> 驳回原因</span><textarea value={rejectReason} onChange={event => setRejectReason(event.target.value)} maxLength={300} placeholder="请说明需要修改的合同条款或信息"/><small>{rejectReason.length}/300</small></label>
          <div className="modal-actions"><button className="secondary" onClick={() => setRejectModal(false)}>取消</button><button className="danger-button" disabled={!rejectReason.trim()} onClick={rejectContract}>确认驳回</button></div>
        </div>
      </div>}
      {mappingOpen && <div className="overlay mapping-overlay" onClick={() => setMappingOpen(false)}>
        <div className="mapping-modal" onClick={event => event.stopPropagation()}>
          <header><div><h2>腾讯模板控件映射</h2><p>【模板】短篇小说版权转让合同（保底＋分成）· 10 页 · 38 个必填控件</p></div><button className="close" onClick={() => setMappingOpen(false)}>×</button></header>
          <div className="mapping-summary">
            <span><b>31</b><small>业务字段自动预填</small></span>
            <span><b>5</b><small>签署时由腾讯生成</small></span>
            <span className="pending"><b>2</b><small>日期口径待法务确认</small></span>
            <span><b>0</b><small>作者重复录入</small></span>
          </div>
          <div className="mapping-table-wrap"><table className="mapping-table">
            <thead><tr><th>控件分组</th><th>数量</th><th>数据来源</th><th>目标处理方式</th><th>状态</th></tr></thead>
            <tbody>{templateControlGroups.map(item => <tr key={item.group}><td><b>{item.group}</b></td><td>{item.count}</td><td>{item.source}</td><td>{item.handling}</td><td><span className={`mapping-status ${item.status === "待确认" ? "pending" : item.status === "签署生成" ? "signing" : ""}`}>{item.status}</span></td></tr>)}</tbody>
          </table></div>
          <div className="mapping-rules"><b>接口映射规则</b><p>重复出现的姓名、书名、身份证号、字数、完成日期和银行卡信息必须共用同一个业务字段；金额大写由系统计算；签名、印章和签署日期只能由腾讯电子签生成。</p></div>
          <footer><span>当前腾讯模板“发起人填写 0 处”，正式接入时由绿台服务端在创建文档阶段写入并锁定。</span><button className="primary" onClick={() => setMappingOpen(false)}>返回拟定合同</button></footer>
        </div>
      </div>}
      {legalSealOpen && <div className="overlay esign-seal-overlay" onClick={cancelLegalSeal}>
        <div className="esign-seal-modal" onClick={event => event.stopPropagation()}>
          <header className="esign-seal-header">
            <div className="esign-logo"><i>✓</i><span><b>腾讯电子签</b><small>企业签署页 · 绿台安全嵌入</small></span></div>
            <div className="seal-lock-status"><i>●</i><span><b>待确认签章</b><small>当前账号具备用印权限</small></span></div>
            <button className="close" onClick={cancelLegalSeal}>×</button>
          </header>
          <div className="esign-stepbar"><span className="done">1 合同审核通过</span><i>→</i><span className="done">2 作者已签字</span><i>→</i><span className="active">3 法务选择印章</span><i>→</i><span>4 腾讯回调归档</span></div>
          <div className="esign-seal-body">
            <section className="esign-document-pane">
              <div className="esign-document-toolbar"><b>版权转让合同 · 签署页</b><span>第 7 / 10 页　100%</span></div>
              <figure><img src={`${import.meta.env.BASE_URL}contracts/guarantee-share/page-07.jpg`} alt="版权转让合同签署页"/><div className="author-signed-mark"><b>石京</b><span>作者已签 · 2026-07-28</span></div><div className="enterprise-seal-slot">请在此处加盖企业印章</div></figure>
            </section>
            <aside className="esign-control-pane">
              <h3>法务签章</h3><p>法务内部自行确认本次签章经办人，绿台不展示或分配签章人员。具备用印权限的法务选择印章并确认后，由腾讯电子签完成签章与存证。</p>
              <div className="seal-picker-title"><b>指定印章</b><span>必选</span></div>
              <div className="seal-picker">
                {(["杭州宝茂网络科技有限公司合同专用章", "杭州宝茂网络科技有限公司公章"] as SealName[]).map(seal => <button key={seal} className={selectedSeal === seal ? "selected" : ""} onClick={() => setSelectedSeal(seal)}>
                  <i><strong>杭州宝茂</strong><small>{seal.includes("合同") ? "合同专用章" : "公司公章"}</small></i>
                  <span>{seal}</span>
                  {selectedSeal === seal && <em>✓</em>}
                </button>)}
              </div>
              <div className="seal-safety-note"><b>签章前校验</b><span>✓ 作者两处签名均已完成</span><span>✓ 合同版本未变化</span><span>✓ 当前账号拥有该印章权限</span></div>
            </aside>
          </div>
          <footer className="esign-seal-footer"><span>取消不会提交用印；确认后以腾讯电子签回调结果为准。</span><button className="secondary" onClick={cancelLegalSeal}>取消</button><button className="esign-confirm" disabled={legalSealProcessing} onClick={completeLegalSeal}>{legalSealProcessing ? "正在等待腾讯回调…" : "确认签章"}</button></footer>
        </div>
      </div>}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<"author" | "admin">("author");
  const [states, setStates] = useState<EsignState[]>(["待作者签署", "待合同审核", "待法务签章", "待拟定合同", "签署完成", "待合同审核"]);
  return <>
    <div className="demo-switch"><div><b>小说电子签迭代 Demo</b><span>基于现有作者投稿后台与绿台小说管理</span></div><div className="segmented"><button className={mode === "author" ? "active" : ""} onClick={() => setMode("author")}>作者投稿后台</button><button className={mode === "admin" ? "active" : ""} onClick={() => setMode("admin")}>内部绿台</button></div></div>
    {mode === "author" ? <AuthorDemo state={states[0]} setState={state => setStates([state, ...states.slice(1)])}/> : <AdminDemo states={states} setStates={setStates}/>}
  </>;
}
