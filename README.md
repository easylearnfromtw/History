# 社寮王家｜The Sheliao Wang Family Archive

## 最新首頁敘事與人物關係圖（2026-10-10）

- **首頁** `/` 按序直接展開：王家傳與「海島有名」小說入口、和平島簡史與詳細史入口、王居萬及王黃彩雲傳、王家二代合傳簡史與家族史入口、外傳簡史與外傳入口。首頁摘要不使用點擊展開。
- **完整直接閱讀** `/family/`、`/people/juwan/`、`/people/caiyun/` 不再執行 `assets/disclosure.js`，保留完整正文可直接閱讀。
- **二代合傳** `/archive/second-generation/` 改為四名子女合寫一篇史傳，保留既有 `#wang-xiaofen` 等四個錨點。原本較詳細的各人事蹟轉存於個別史記。
- **小說計畫** `/literature/`：「海島有名」為預留家族文學入口，現階段沒有宣稱已發布小說情節。史實、口述與虛構將分開標示。
- **人物關係圖** `/relations/`：王居萬、王黃彩雲、第二代四房與其姻親、第三代合共 18 位公開人物，以可點擊圖表呈現；選取姓名即可直接閱讀個別史記並可使用 `?person=姓名` 深連結。另有姓名搜尋與行動版橫向捲動。
- **個別史記資料與後台** `data/person-records.json` 與 `/admin/records.html` 支援逐人編輯段落、史料註記以及經 GitHub 權限驗證的發布。原 `/admin/` 繼續管理年齡關係與學籍狀態。
- **原世系圖保留** `/archive/lineage/` 可繼續使用，但主要人物關係圖以 `/relations/` 為準。
- **無 Emoji 規範** 前台、後台、往後新增介面均遵照 `DESIGN_RULES.md`，優先使用純文字導覽與歷史書卷式排版。

公開頁面僅保存原站已收錄的家族口述與後人提供資料，未明事項標註待考；私人加密族譜與密碼資料並未因此公開。

## 人物資料管理與點選閱讀（2026-10-10）

- 人物資料管理：`/admin/`。這是公開靜態編輯頁，僅持有 GitHub 儲存庫 Contents 寫入權限之使用者可按鈕提交；沒有自建伺服器身分驗證。GitHub Token 僅存於當次輸入，不寫入 GitHub 或 localStorage。
- 共用來源：`data/people.json`。修改內容同步影響公開互動族譜；私人加密族譜會在使用者解鎖並套用既有加密修訂後，以共用來源作本次顯示修正，並**不**改寫加密原始檔。
- 三人同歲：陳季佑、林哲緯、王品媗。陳季佑及王品媗已畢業；林哲緯在台灣時間 2027-05-01 前顯示就讀中，該日起依家屬預定資料顯示已畢業，並附實際資格待核實說明。
- 李芸閑比林哲愷大兩歲。沒有具體證據的出生日期與其他人的學歷未推定。
- `assets/disclosure.js` 和 `assets/disclosure.css`：除了完整展開的王家傳外，人物、第二代列傳、通紀、社寮地方史、庭外史、雅興外史與災異記事主要正文採原生 `details/summary` 點擊閱讀；保留文字和深連結。
- `DESIGN_RULES.md`：全站、資料後台以及未來功能禁止 Emoji 表情符號及裝飾性 pictograph；以字體、留白、CSS 線條維持嚴謹風格。

**限制：** 加密私有族譜原始檔未解密及重新封裝。當前針對其解鎖後之人物文字顯示做修訂；與加密檔一致性及部署後的實際畫面仍應由有密碼的家族成員驗證。

## 2026-10-10 多頁式網站更新（目前架構）

首頁已改成精簡入口，完整史文移入專頁。舊版一頁式的網站說明留作編纂沿革，以下連結為目前主要導覽：

- 首頁：https://easylearnfromtw.github.io/History/
- 王家傳：https://easylearnfromtw.github.io/History/family/
- 和平島：https://easylearnfromtw.github.io/History/island/
- 王居萬傳：https://easylearnfromtw.github.io/History/people/juwan/
- 王黃彩雲傳：https://easylearnfromtw.github.io/History/people/caiyun/
- 家族典藏目錄：https://easylearnfromtw.github.io/History/archive/
- 第二代列傳：https://easylearnfromtw.github.io/History/archive/second-generation/
- 王家通紀：https://easylearnfromtw.github.io/History/archive/chronicle/
- 家系源流：https://easylearnfromtw.github.io/History/archive/origins/
- 互動世系：https://easylearnfromtw.github.io/History/archive/lineage/
- 更多史篇：https://easylearnfromtw.github.io/History/more/
- 私人家族族譜：https://easylearnfromtw.github.io/History/personalfamilypage/

舊首頁章節錨點會導向相對應的新頁面。公開內容保留家族口述／待考標記；私人族譜未變更。新增王居萬傳之地方交遊補記，所述謝立功、張文彬交誼與選舉拜訪情形依家族口述登載，尚待外部史料查核，並不代表特定政治立場。


社寮王家家族史館，以**編年體為經、紀傳體為緯**，公開講述王家自福建、汐止至基隆社寮的家族口述史。主題為王家傳、〈王黃彩雲傳〉、〈王居萬傳〉與社寮王家通紀。

## 公開世系圖

公開網站新增互動的社寮王家世系圖 以王居萬與王黃彩雲為家系核心 敘及王曉芬 王美玲 王俊明 王螢家及各房子女

圖譜依家屬最新確認之長幼順序排列 依次為長女王曉芬 次女王美玲 長子王俊明 么女王螢家 不包含生辰 學歷 聯絡方式或私人醫療紀錄 手機可展開各支及一次展開全譜

## 雙入口
- **Public 公開家族官方網站**：`index.html`。採亞麻白、深綠色、香檳金、棕色、大地色系。以王家為公共敘事核心，不含王居萬肖像。
- **Family 私人家族族譜**：`personalfamilypage/index.html`。仍為林氏 × 王氏完整家族誌，使用瀏覽器端解密，並非伺服器身分驗證。

## 史料分類
「家族口述」與已取得文件的「可核實事項」分開標記。福建遷徙、黃家仕紳及繼承、軍中往事、撞球間及和平檳榔店營業年代、造船廠景氣變遷均仍有待考證；不要把旁白當成官方歷史定論。

## GitHub Pages
- Public：https://easylearnfromtw.github.io/History/
- Family：https://easylearnfromtw.github.io/History/personalfamilypage/

如網站無法開啟，至 Settings → Pages 設定 main / (root)。

**安全：** GitHub 靜態檔案與歷史提交為公開資源。私人版僅靠前端密碼保護加密資料，若需要真正的家族帳號與權限控管，應改用具有伺服器端驗證的資料平台。

## 文風與編纂版本

- Public 公開網站以「社寮王家」為核心，文風採紀傳體、史傳筆法，強調人物境遇、親情、持家與地方記憶。
- 〈王家傳〉依編纂者最新提供的四段序文照錄 保留天實 祝融侵擾 眷聽而從之及民國壹佰壹拾五時秋朔等原有措辭 序文修辭及地方史敘述仍須與可考史實分別看待
- 〈王黃彩雲傳〉、〈王居萬傳〉及《社寮王家通紀》作風格統一；原有「家族口述／待考」標註保留。
- 私人家族入口 `personalfamilypage/` 仍維持獨立，公開文稿不載王居萬肖像與私密族譜。

## 公開第二代列傳

公開網站依長幼次序記載第二代四篇人物列傳

- 長女 王曉芬傳
- 次女 王美玲傳
- 長子 王俊明傳
- 么女 王螢家傳

人物卡片可直接通往各自傳記 史料不足之處明示待續補而不補造經歷

手機閱讀提供篇目橫向導覽 並保持不使用可見標點的史傳正文

## 中船與和平島產業補記

公開家族通紀新增中船高雄與基隆廠沿革的文獻補記　分別記述1973年高雄新廠成立　1978年兩公司整併　1996年總公司南遷高雄　並辨明基隆廠並未整廠遷離　以維基百科　國家檔案資料　台船公司年報　公視新聞等公開來源佐證　家族店鋪商情變化仍屬口述史　不逕認單一因果

## 使用者體驗優化

- 公開史館新增人物索引 依姓名字號或已公開的個人簡介搜尋人物紀錄
- 手機底部導航整理為家乘序 人物 通紀 世系四個主要入口
- 人物紀錄新增返回上一位親屬 方便在親屬間逐層閱讀
- 正文可切換字級 並將使用者偏好儲存於裝置
- 私人登入頁新增密碼輸入優化 解鎖中狀態及可收合的登入疑難說明
- 保留家乘序標點 其餘史傳不加標點

## 民國一一四年元旦屋後火警紀錄

2025年1月29日為農曆乙巳年正月初一　家族口述當日全家於和平島阿媽家過年　忽聞屋後爆響　隨後有消防車聲　得知屋後發生火警　火勢未延燒家屋

家人提及有人於屋後施放鞭炮　但確切起火原因未取得消防調查紀錄　須與已查證史實區分

家屬提供影片連結　https://youtu.be/57ngxmBJYgQ?si=AgKppe7k2b6XO0bV　影音內容尚未獨立核實

公開通紀加列卷六家事　原卷六壽辰調整為卷七　不改動原有序文

## 兩起和平島火警與影音紀錄

兩起事件分別收錄於社寮王家通紀及主題附記 並非同一場火災

### 乙巳元旦屋後火警

2025年1月29日　農曆乙巳正月初一　家人春節聚於阿媽家　忽聞一聲巨響及消防車聲　家人表示後方火警未延燒家屋　據家人口述可能與施放鞭炮有關　尚無正式火調佐證

- https://youtu.be/57ngxmBJYgQ?si=AgKppe7k2b6XO0bV
- https://youtu.be/4cXZi6lpoLk?si=-01yQmxa0ce_j99F
- https://youtu.be/cL4Q8PYMzHE?si=R3UIxFjzUlCTSwK4
- https://youtu.be/mX5wcyjsZck?si=mA3DxgaPAreNrc9u

### 阿媽家旁午後大火

2019年9月9日下午　家人回憶和平島阿媽家旁 原阿九鯊魚羹所在處 突發大火　家族適逢外出旅遊　據家屬所述家人未有傷亡　惟有不少物品焚損　損失範圍仍待核實

- https://youtu.be/wY6YrXXqlbI?si=SW8IqofGcwHJvoCf
- https://youtu.be/QxD_RAg_zgE?si=cfrmc0FFYOJQ-PUj
- https://youtu.be/IaVmKb1oLsY?si=nTuqVG9Yosk4Hy9M

影音網址由家屬提供　影片內容目前無法直接核實　阿九鯊魚羹旁火警日期與時段由家屬補充為2019年9月9日下午　火警原因另待查證　公開網站採家族口述紀錄方式呈現

## 和平島地方史資料補充

公開網站的家系源流新增社寮地誌　以和平島維基百科及基隆市政府歷史現場資料整理六個地方史階段

- 巴賽族與 tuman 舊稱
- 大雞籠嶼與十七世紀西荷歷史　含西班牙聖薩爾瓦多城
- 清季至日治社寮島與社寮町的地名演變
- 一九三四年和平橋前身及島陸交通
- 戰後和平島名稱使用與二二八相關記憶　改名的確切由來不強作定論
- 近代港區造船與王家的地方生活背景

維基百科　https://zh.wikipedia.org/wiki/和平島

基隆市歷史現場　https://klgreat.klcg.gov.tw/History_Content.aspx?n=8106&s=8856&sms=12604

聖薩爾瓦多城遺址　https://klgreat.klcg.gov.tw/History_Content.aspx?n=8106&s=8853

地方史用於補充王家所居之地的背景 不代表家族先人親歷每項事件 家族口述與公共資料各自獨立註記

## 庭外史

位於公開網站家乘序之後人物列傳之前　新增獨立庭外史區塊　保留家屬提供兩則庭院逸聞原文與標點

- 曇之夜綻　於王家外庭，種有曇，彩雲所種也，常蓓蕾，夜時所綻，頃刻即謝，姍姍可愛
- 菸草偶生　王家屋外，居萬時而喫煙之，菸草落於溝蓋下，意外種得菸草。

兩則為家族生活記憶　並非可獨立考證之植物種源或科學鑑定資料

## 正史與外史多頁架構

公開網站為真正多頁的家族史館　正史首頁保留家乘序　人物列傳　王家通紀　家系源流及家族世系　與家族成員搜尋等互動

- 正史首頁　https://easylearnfromtw.github.io/History/
- 更多史篇目錄　https://easylearnfromtw.github.io/History/more/
- 庭外史　https://easylearnfromtw.github.io/History/more/courtyard.html
- 雅興外史　https://easylearnfromtw.github.io/History/more/pastimes.html
- 災異紀事　https://easylearnfromtw.github.io/History/more/incidents.html
- 社寮地誌　https://easylearnfromtw.github.io/History/more/locality.html

首頁的更多史篇入口會前往獨立頁面　家族通紀中的火警紀錄僅保留概要　舊有的章節錨點仍保留作導覽　完整影音移至災異紀事　地誌詳細內容移至獨立頁面

公開的雅興外史只收錄家族遊戲及麻將傳統　健康病史與具名家庭爭執均不公開　私人家族典藏仍是獨立加密入口
