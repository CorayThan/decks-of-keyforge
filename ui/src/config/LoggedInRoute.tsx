import { observer } from "mobx-react"
import * as React from "react"
import { Redirect, Route, RouteProps } from "react-router"
import { Loader } from "../mui-restyled/Loader"
import { UserStore } from "../user/UserStore"
import { Routes } from "./Routes"

@observer
export class LoggedInRoute extends React.Component<RouteProps> {
    render() {
        const loggingIn = UserStore.instance.loginInProgress
        if (loggingIn) {
            return <Loader/>
        }
        const loggedIn = UserStore.instance.loggedIn()
        if (loggedIn) {
            return <Route {...this.props} />
        } else {
            return <Redirect to={Routes.decks}/>
        }
    }
}
