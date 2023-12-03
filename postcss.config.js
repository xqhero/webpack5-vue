module.exports = {
    plugins: [
        [
            "postcss-preset-env", 
            {   
                "browserslist": [
                    "last 2 version", 
                    "> 1%", 
                    "not dead"
                ]
            }
        ]
    ]
}