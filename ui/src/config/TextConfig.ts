import * as WebFont from "webfontloader"

export class TextConfig {

    static readonly TITLE = "Righteous"
    static readonly BODY = "Lato"
    static readonly MONOTYPE = "PT Mono"

    static loadFonts = () => {

        // Fonts we use get loaded here.
        WebFont.load({
            google: {
                families: [`${TextConfig.TITLE}:300,400,500`, `${TextConfig.BODY}:300,400,500,400italic`, `${TextConfig.MONOTYPE}`]
            },
        })
    }
}
