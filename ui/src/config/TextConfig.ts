import * as WebFont from "webfontloader"

export class TextConfig {

    static readonly TITLE = "Righteous"
    static readonly BODY = "Lato"

    static loadFonts = () => {

        // Fonts we use get loaded here.
        WebFont.load({
            google: {
                families: [TextConfig.TITLE, TextConfig.BODY + ":600"]
            },
        })
    }
}