# Hi Bus! 今天想搭乘哪輛公車呢？

## 作品說明

---

The F2E 全台公車動態時刻查詢應用服務

### 系統說明

---

1. 安裝相依套件:

   ```
   npm install
   ```

2. 設定 .env files，請參考 .env.example 和 .env.local.example 放置對應的參數

   > Note: Here map API 請參考 "第三方服務 > Here map > API 申請" 進行申請

3. live server 瀏覽:
   ```
   npm run serve
   ```
4. build production:
   ```
   npm run build
   ```

### 資料夾說明

---

- .env.example/.env.local.example - 環境變數設定範例
- src/main.js - 主程式進入點
- src/views - 頁面 .vue files
- src/router - Vue-router 路由檔案
- src/store - Vuex 存存 modules
- src/components - Vue Components
- src/libs - API 接口物件
- src/utils - 功能 functions
- src/assets - 圖檔放置位置
- public - 接入起始檔案

### 使用技術

---

- Vue Cli
- Vue 3
- Vuex 4
- Vue Router 4
- Axios
- ES6
- RWD
- SCSS
- CSS Flex
- Here Map

### 第三方服務

---

- TDX API: [[查看文件](https://tdx.transportdata.tw/api-service/swagger)] [[API 申請](https://ptx.transportdata.tw/PTX/Management/AccountApply)].
- Here Map: [[查看文件](https://developer.here.com/develop/javascript-api)] [[API 申請](https://developer.here.com/sign-up?create=Freemium-Basic)].
- Google Fonts: [[查看文件](https://fonts.google.com/)].

### The F2E Page

---

[2021 The F2E Home Page](https://2021.thef2e.com/).

### Copyright

---

&copy; Hi BUS! | Designed by Joyce | Developed by Josh.
