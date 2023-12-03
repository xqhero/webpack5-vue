module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "targets": {
                    chrome: '60',
                    ie: '9' // 等等
                },
                "corejs": "3",
                "useBuiltIns": "usage"
            }
        ]
    ]
}