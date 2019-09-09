import { Tab } from "@material-ui/core"
import * as React from "react"
import { UnstyledLink } from "./UnstyledLink"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LinkTab = (props: {label: string, to: string, value: string}) => <Tab component={UnstyledLink as any} {...props} />
