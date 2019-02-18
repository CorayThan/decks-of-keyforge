import { Tab } from "@material-ui/core"
import * as React from "react"
import { UnstyledLink } from "./UnstyledLink"

// tslint:disable-next-line:no-any
export const LinkTab = (props: {label: string, to: string, value: string}) => <Tab component={UnstyledLink as any} {...props} />
