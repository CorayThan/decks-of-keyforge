import * as Bowser from "bowser"

export class CheckBrowser {
    static check = () => {
        const bowserParser = Bowser.getParser(window.navigator.userAgent)
        const isValidBrowser = bowserParser.satisfies({
            android: ">=81",
            firefox: ">=75",
            chrome: ">=81",
            chromium: ">=81",
            opera: ">=67",
            safari: ">=12",
            uc: ">=12",
        })


        if (!isValidBrowser) {
            const ls = window.localStorage
            const baseMessage = "Your browser is not supported by this website. Please use an up to date version of Chrome, Firefox, Safari, or Edge."

            if (ls) {
                if (ls.getItem("ignore browser") == undefined) {
                    if (window.confirm(baseMessage +
                        ` Click "OK" to dismiss this message permanently, or cancel to continue.`)) {
                        ls.setItem("ignore browser", "true")
                    }
                }
            } else {
                window.alert(baseMessage)
            }
        }
    }
}
