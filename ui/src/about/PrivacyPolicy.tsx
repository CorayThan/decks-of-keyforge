import { Paper, Typography } from "@material-ui/core"
import * as React from "react"
import { spacing } from "../config/MuiConfig"

export class PrivacyPolicy extends React.Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div style={{maxWidth: 800}}>
                    <Typography variant={"h4"} style={{marginBottom: spacing(1), marginLeft: spacing(4), marginTop: spacing(4)}}>
                        Privacy Policy
                    </Typography>
                    <Paper style={{margin: spacing(4), marginTop: spacing(2), padding: spacing(4)}}>

                        <Typography style={{marginBottom: spacing(1)}}>
                            This Privacy Policy describes how your personal information is collected, used, and shared when you visit
                            https://decksofkeyforge.com
                            (the “Site”).

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            PERSONAL INFORMATION WE COLLECT

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            When you visit the Site, we automatically collect certain information about your device, including information about your web
                            browser,
                            IP
                            address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect
                            information
                            about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information
                            about
                            how
                            you interact with the Site. We refer to this automatically-collected information as “Device Information.”

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            We collect Device Information using the following technologies:

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            - “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more
                            information
                            about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.
                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            - “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service
                            provider,
                            referring/exit pages, and date/time stamps.
                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            - “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.
                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            - "HTML5 Local Storage" Stores information about the user like login status and anonymous unique identifiers.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order
                            Information.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            HOW DO WE USE YOUR PERSONAL INFORMATION?

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            We use your personal information to help other users contact you when you list decks for sale. We will not show your email to other users,
                            but we will send you an email on their behalf if you have a deck for sale and your user profile allows emails.
                            We make the public information you have provided available for users to see to contact you for the
                            purchase of decks you have listed.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            Also, when you have us send an email to a potential seller as a buyer, we will provide your email to the seller so they can
                            communicate
                            with
                            you to sell you the deck.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            SHARING YOUR PERSONAL INFORMATION

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant
                            or
                            other lawful request for information we receive, or to otherwise protect our rights.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            DO NOT TRACK
                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            CHANGES
                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other
                            operational,
                            legal or regulatory reasons.

                        </Typography>
                        <Typography style={{marginBottom: spacing(1)}}>
                            CONTACT US
                        </Typography>
                        <Typography>
                            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us
                            by
                            e-mail at decksofkeyforge@gmail.com
                        </Typography>
                    </Paper>
                </div>
            </div>
        )
    }
}