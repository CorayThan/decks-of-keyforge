import { Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { Loader } from "../mui-restyled/Loader"
import { userStore } from "../user/UserStore"

export class VerifyEmailPage extends React.Component<RouteComponentProps<{ verificationCode: string }>> {
    render() {
        const verificationCode = this.props.match.params.verificationCode
        return <VerifyEmailView verificationCode={verificationCode}/>
    }
}

@observer
export class VerifyEmailView extends React.Component<{ verificationCode: string }> {

    constructor(props: { verificationCode: string }) {
        super(props)
        userStore.verifyingEmail = true
    }

    componentDidMount(): void {
        if (!userStore.emailIsVerified) {
            userStore.verifyEmail(this.props.verificationCode)
        }
    }

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div>
                    <Typography
                        variant={"h4"}
                        style={{margin: spacing(2), marginTop: spacing(4)}}
                    >
                        Verify your email
                    </Typography>
                    <Paper style={{maxWidth: 400, margin: spacing(2), padding: spacing(2)}}>
                        {userStore.verifyingEmail ? (
                            <Typography>
                                Email verification in progress ...
                            </Typography>
                        ) : null}
                        {!userStore.emailVerificationSuccessful && userStore.loggedIn() && (
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                                    Sorry, we couldn't verify your email. Please try again.
                                </Typography>
                                <img
                                    style={{width: 232}}
                                    src={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/mind-barb.png"}
                                    alt={"Card."}
                                />

                            </div>
                        )}
                        {userStore.emailIsVerified ? (
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <div>
                                    <Typography variant={"h6"}>
                                        Eureka!
                                    </Typography>
                                    <Typography variant={"subtitle1"} style={{marginBottom: spacing(2)}}>
                                        Your email has been verified, making it 3% better than a real duck.
                                    </Typography>
                                </div>
                                <img
                                    style={{width: 232}}
                                    src={"https://keyforge-card-images.s3-us-west-2.amazonaws.com/card-imgs/eureka.png"}
                                    alt={"Card."}
                                />
                            </div>
                        ) : null}
                        {userStore.verifyingEmail ? <Loader/> : null}
                        {!userStore.loggedIn() && (
                            <Typography>
                                Please login
                            </Typography>
                        )}
                    </Paper>
                </div>
            </div>
        )
    }
}