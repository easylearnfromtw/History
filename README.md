# 林王家族誌｜The Lin × Wang Family Archive

以年編事，以人立傳。本專案專注林氏與王氏家族的數位族譜、人物列傳與編年史，不設獨立的地方史網站。

## 網站設計

- **公開官方網站**：`index.html`，亞麻白、深森林綠、香檳金、棕色及大地色。主要呈現家族源流、通紀選讀與典藏理念，不直接引用內部族譜資料。
- **家族登入頁**：`personalfamilypage/index.html`，以密碼於瀏覽器端解密完整世系、人物資料和家族事件。
- **密文存放**：`personalfamilypage/manifest.json`、10 個 `part-XX.txt`、`corrections.enc.json`。**不存放明文密碼**，任何未加密私人資料也不應提交至本公開儲存庫。
- **修訂**：新增已確認的親子關係、民國出生年份及註明推估性質的就學年表；移除人物照片。

## GitHub Pages

`Settings → Pages → Deploy from a branch → main → /(root)`

公開首頁：`https://easylearnfromtw.github.io/History/`  
家族入口：`https://easylearnfromtw.github.io/History/personalfamilypage/`

## 史料與安全原則

家屬口述、公開工商紀錄及文件證據應分開註明來源。依應屆學制估計的求學年份是推測，不等於已證實的畢業日。

GitHub Pages 並不提供後端帳號權限，隱藏網址無法阻止下載。私人典藏採用 PBKDF2-SHA256 與 AES-256-GCM 保護內容，但目前短密碼僅適合測試，正式使用應更換較長通關密語或改用伺服器登入。**舊提交中的敏感資訊不會因為刪掉目前版本而完全消失**；要徹底清除需要清理 Git 歷史及第三方快取。