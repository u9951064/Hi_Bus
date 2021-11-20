var JavaScriptObfuscator = require('webpack-obfuscator')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/'
        : '/',
    productionSourceMap: process.env.NODE_ENV !== 'production',
    configureWebpack: {
        plugins: [
            new JavaScriptObfuscator({
                // 壓縮程式碼
                compact: true,
                // 是否啟用控制流扁平化(降低1.5倍的執行速度)
                controlFlowFlattening: false,
                // 隨機的死程式碼塊(增加了混淆程式碼的大小)
                deadCodeInjection: false,
                // 此選項幾乎不可能使用開發者工具的控制檯選項卡
                debugProtection: false,
                // 如果選中，則會在“控制檯”選項卡上使用間隔強制除錯模式，從而更難使用“開發人員工具”的其他功能。
                debugProtectionInterval: false,
                // 通過用空函式替換它們來禁用console.log，console.info，console.error和console.warn。這使得偵錯程式的使用更加困難。
                disableConsoleOutput: true,
                // 識別符號的混淆方式 hexadecimal(十六進位制) mangled(短識別符號)
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                // 是否啟用全域性變數和函式名稱的混淆
                renameGlobals: false,
                // 通過固定和隨機（在程式碼混淆時生成）的位置移動陣列。這使得將刪除的字串的順序與其原始位置相匹配變得更加困難。如果原始原始碼不小，建議使用此選項，因為輔助函式可以引起注意。
                rotateStringArray: true,
                // 混淆後的程式碼,不能使用程式碼美化,同時需要配置 cpmpat:true;
                selfDefending: true,
                // 刪除字串文字並將它們放在一個特殊的陣列中
                stringArray: true,
                stringArrayThreshold: 0.75,
                // 允許啟用/禁用字串轉換為unicode轉義序列。Unicode轉義序列大大增加了程式碼大小，並且可以輕鬆地將字串恢復為原始檢視。建議僅對小型原始碼啟用此選項。
                unicodeEscapeSequence: false
            }, [])
        ]
    },
}