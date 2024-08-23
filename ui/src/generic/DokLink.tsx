import { Link, LinkProps } from "@material-ui/core"
import { observer } from "mobx-react"
import { themeStore } from "../config/MuiConfig"

export const DokLink = observer((props: LinkProps) => {
    return <Link color={themeStore.darkMode ? "secondary" : "primary"} {...props}/>
})
