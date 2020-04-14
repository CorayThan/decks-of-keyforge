import { SvgIcon, SvgIconProps } from "@material-ui/core"
import * as React from "react"

export const ExcludedCheckboxIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 3H19C20.11 3 21 3.9 21 5V19C21 20.1 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3ZM18.364 16.9497L16.9498 18.364L12 13.4142L7.05026 18.364L5.63605 16.9498L10.5858 12L5.63605 7.05025L7.05026 5.63604L12 10.5858L16.9498 5.63604L18.364 7.05026L13.4142 12L18.364 16.9497Z"
            />
        </SvgIcon>
    )
}
