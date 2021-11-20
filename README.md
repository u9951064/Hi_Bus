# Hi Bus! 今天想搭乘哪輛公車呢？

## 關於 Hi Bus!

---
Hi BUS! 揮揮手搭乘公車開啟您的旅途！\
「揮手搭乘公車」是在台灣的生活中經常看見的景象，我們透過這樣的情境延伸設計出 Hi BUS! 的 Logo，希望為我們的用戶帶來美好的體驗。

主頁以明顯的搜尋框協助用戶方便進行搜尋，也能透過導覽列「我的最愛」及「附近站牌」的功能快速查找公車動態資訊。

整體色系以深藍色為主色、並以淺灰色為輔色，傳達沈穩、專業且安全的公車系統形象。導覽列下方透過流動漸層，呈現公車正在行駛中的意象。

Hi BUS! 提供：

&emsp;&emsp;💻 支援裝置瀏覽\
&emsp;&emsp;&emsp;&emsp;可以在手機、平板與電腦隨時隨地使用Hi BUS!

&emsp;&emsp;🔍 快速查詢\
&emsp;&emsp;&emsp;&emsp;可以快速查詢公車路線及動態時刻

&emsp;&emsp;🗺 附近站牌\
&emsp;&emsp;&emsp;&emsp;根據您的位置定位附近公車站牌

&emsp;&emsp;⭐ 收藏最愛\
&emsp;&emsp;&emsp;&emsp;將經常搭乘的路線儲存方便快速查詢

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
- localStorage
- Web APIs (Navigator.geolocation)

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

&copy; Hi BUS! | Designed by Joyce | Developed by Josh
