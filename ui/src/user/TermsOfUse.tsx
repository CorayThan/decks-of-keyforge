import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import { useLocation } from "react-router-dom"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log } from "../config/Utils"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { WhiteSpaceTypography } from "../mui-restyled/WhiteSpaceTypography"
import { userStore } from "./UserStore"

export const AgreeToTerms = observer(() => {

    const location = useLocation()
    const isOnTermsPage = location.pathname === Routes.codeOfConduct || location.pathname === Routes.termsOfUse || location.pathname === Routes.privacyPolicy

    log.info("route path: " + location.pathname)

    if (isOnTermsPage || (userStore.loggedIn() && userStore.user?.agreedToTerms == true) || userStore.user == null) {
        return null
    }

    return (
        <div>
            <Dialog

                open={true}
            >
                <DialogTitle>
                    Terms of Use
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{marginBottom: spacing(1)}}>
                        You must agree to the Code of Conduct, Terms of Use and Privacy Policy to use this site.
                    </DialogContentText>
                    <LinkButton size={"small"} href={Routes.codeOfConduct} newWindow={true} style={{marginRight: spacing(2)}}>
                        Code of Conduct
                    </LinkButton>
                    <LinkButton size={"small"} href={Routes.termsOfUse} newWindow={true} style={{marginRight: spacing(2)}}>
                        Terms of Use
                    </LinkButton>
                    <LinkButton size={"small"} href={Routes.privacyPolicy} newWindow={true}>
                        Privacy Policy
                    </LinkButton>
                </DialogContent>
                <DialogActions>
                    <Button onClick={userStore.logout} color="primary">
                        Disagree and Logout
                    </Button>
                    <KeyButton onClick={userStore.agreedToTerms} color="primary" loading={userStore.agreeingToTerms}>
                        Agree
                    </KeyButton>
                </DialogActions>
            </Dialog>
        </div>
    )
})

export const TermsOfUse = () => {

    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <div style={{maxWidth: 800}}>
                <Paper style={{margin: spacing(4), marginTop: spacing(2), padding: spacing(4)}}>
                    <Typography variant={"h6"} style={{fontSize: 36, fontWeight: 700}}>
                        TERMS OF USE
                    </Typography>
                    <Typography
                        variant={"subtitle1"}
                        style={{fontWeight: 700, marginTop: spacing(1)}}
                        color={"textSecondary"}
                    >
                        Last updated August 07, 2020
                    </Typography>
                    <TermsHeader>
                        DoK Terms of Use
                    </TermsHeader>
                    <WhiteSpaceTypography>
                        By accessing or using our servers, services, website, or any associated content or sale
                        listings (together, "DoK"), you agree to these Terms of Use ("TOU"). You understand and agree DoK is a private site owned and operated
                        by Graylake LLC. If you access or use DoK on behalf of a business, you must have authority
                        to accept the TOU on behalf of that business and that business also agrees to the TOU. You are not authorized to use DoK if you do not
                        agree to the TOU.
                        We may modify or make changes to the TOU, at our sole discretion, at any time for any reason.
                        When changes are made to this TOU we will update the last updated date. It is your responsibility to regularly check for any changes
                        made
                        to this TOU and are bound by those changes if you continue to use DoK.
                        Our privacy
                        policy <Link href={"https://decksofkeyforge.com/privacy-policy"}>https://decksofkeyforge.com/privacy-policy</Link>, and all
                        other policies, site rules, and agreements listed below or on DoK, are fully integrated into this TOU, and you also agree to them.
                    </WhiteSpaceTypography>
                    <TermsHeader>
                        LICENSE
                    </TermsHeader>

                    <WhiteSpaceTypography>
                        DoK is intended to be used by by users who are 18 years old or older. Persons younger than 18 are not permitted to register on the site
                        or use it. If you agree to the TOU and are of sufficient age and wherewithal to use DOK and be bound by this TOU, or you use DoK on
                        behalf of a
                        business and bind that business to this TOU,
                        we grant you a limited, non-exclusive, revocable, non-assignable license to
                        use DoK in compliance with the TOU. Unlicensed use of DoK is unauthorized.
                        You may use content from DoK only when following the terms listed on the public application interface
                        page: <Link href={"https://decksofkeyforge.com/about/sellers-and-devs"}>https://decksofkeyforge.com/about/sellers-and-devs</Link>.
                        For all other content on DoK you agree not to make derivative works,
                        license, distribute, or sell that content, except when that content is created by you. You grant us a worldwide, perpetual,
                        irrevocable, unlimited, fully paid, royalty free, sublicensable license to use, show, copy, distribute, and make derivative works
                        from content you post.
                    </WhiteSpaceTypography>

                    <TermsHeader>
                        USE
                    </TermsHeader>

                    <WhiteSpaceTypography>
                        Unless licensed by us in a separate written or electronic agreement, or following the terms laid out on the
                        public application interface
                        page: <Link href={"https://decksofkeyforge.com/about/sellers-and-devs"}>https://decksofkeyforge.com/about/sellers-and-devs</Link>,
                        you agree not to use, create, or distribute software or services that integrate with or use data from DoK, e.g. for downloading,
                        uploading, creating or updating or using an account, posting, emailing, searching, or mobile use.
                        You agree to not copy or collect content or data from DoK
                        with bots, scripts, crawlers, spiders, scrapers, or any automated or manual means. Misleading,
                        and/or unlawful sale listings/communications/accounts are prohibited. The buying or selling of accounts is prohibitied as well.
                        You agree that the only items you are allowed to list for sale on the site are complete, registered KeyForge decks with a deck list
                        archon card, all cards that go with that deck list, and that these cards will all be in playable or better condition, i.e. no cards
                        are torn or noticeably marked, scratched or damaged in any way.
                        You agree to not misuse or abuse the seller rating system or any other reporting or feedback features. You agree not to collect
                        user information from DoK. You agree we may moderate DoK access and use at our sole discretion, i.e. we may terminate your access or
                        account, change your username or any other user details, delete or modify any decks added to your account or listed for sale, or
                        delete or modify any other content you create.
                        You agree to not bypass any moderation we perform, we are not liable for moderating or not moderating any users or content,
                        and we have the right to moderate or not moderate, and this right cannot be waived by anything we say or do.

                        Except as detailed in this TOU, or licensed by us in a separate agreement, written or electronic, you agree not to
                        (1) sell, publish, distribute, or otherwise make available DoK or our application
                        programming interface ("API"), (2) to copy, adapt, decompile, reverse engineer,
                        port or modify the API or website code, (3) or remove or change any copyrights, trademarks or other rights notices.

                        You agree you will not misappropriate, infringe, or otherwise violate the rights of any person, or violate any applicable laws,
                        with your use of DoK or its API.

                        If you are eligible to use DoK, you are granted a limited license to access and use DoK and to download or
                        print a copy of any portion of its content for personal, non-commercial use.

                    </WhiteSpaceTypography>

                    <TermsHeader>
                        PATREON BENEFITS
                    </TermsHeader>

                    <WhiteSpaceTypography>
                        Users who pay a monthly fee to Patreon to support this site, from this
                        page: <Link>https://www.patreon.com/decksofkeyforge</Link> are known as ("Patrons"). Any benefits provided to Patrons are provided
                        at the sole discretion of DoK, and may be modified or removed at any time.
                        These features may not work or function as expected, and
                        DoK is under no obligation to provide any benefits to any Patrons at any time.
                    </WhiteSpaceTypography>

                    <TermsHeader>
                        DISCLAIMER
                    </TermsHeader>

                    <WhiteSpaceTypography>
                        DoK and its content are provided on an "AS-IS" and "AS AVAILABLE" basis. Your use of this site and its services is at your sole risk.
                        To the full extent permitted by law, DoK disclaims all warranties and does not guarantee the accuracy, reliability or completeness
                        of the site's
                        content. We make no warranties or guarantees about any 3rd party products, services, or websites linked from DoK.

                        DoK and its directors, employees, and agents ("DoK Entities") will not be liable to you or any third part for any direct, indirect,
                        exemplary,
                        incidental, consequential, special, or punitive damages, including loss of profits, data, or goodwill arising from your use of the site.
                        DoK Entities are not liable or responsible for any acts, conduct, or falsehoods in the conduct of you or any party in connection with
                        DoK.

                        DoK Entities' liability to you will at all times be limited to the lesser of the amount paid by you to us during the six month period
                        preceding
                        any cause of action that arises, or $100.00 USD. Some US state and international laws do not allow limitations on implied warranties
                        or the limitation of some damages, and if these laws apply to you, some or all of the disclaimers and limitations above may not apply
                        to you and you may have additional rights.

                        KeyForge is a trademark of Ghost Galaxy, which does not endorse DoK, and is not associated with DoK in any way shape or form.
                    </WhiteSpaceTypography>

                    <TermsHeader>
                        GOVERNING LAW
                    </TermsHeader>

                    <WhiteSpaceTypography>
                        This TOU and your use of DoK is governed by the laws of the State of Oregon. Any legal action, claim, or dispute ("Claims")
                        arising from or related to DoK
                        will be commenced or prosecuted in the state and federal courts of Lane County, Oregon.
                        You agree to indemnify and hold DoK Entities harmless from any Claims, losses, liability,
                        expenses, losses, or attorneys' fees that arise from a third party and relate to your use of DoK. You agree to be liable
                        and responsible for any Claims we may have against you, your affiliates, or any party directly or indirectly paid by you, controlled by
                        you, or acting for your benefit.
                    </WhiteSpaceTypography>

                    <TermsHeader>
                        DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICE AND POLICY NOTIFICATIONS
                    </TermsHeader>

                    <Typography>
                        If you believe your copyright or intellectual property rights have been violated by any material or content on DoK, please notify our
                        Designated Copyright Agent using the contact information provided below.
                        Your notice will be subject to the Digital Mellennium Copyright Act (DMCA). In your notification, please include:
                    </Typography>
                    <Typography>
                        1. Identification of copyrighted work which has been infringed.
                    </Typography>
                    <Typography>
                        2. Identification of where on DoK the infrigement takes place. Please include
                        a URL and other details.
                    </Typography>
                    <Typography>
                        3. A statement that you have a good faith belief that this use is not authorized by the copyright owner or the law.
                    </Typography>
                    <Typography>
                        4. A statement declaring under penalty of perjury that the information included in the notice is accurate and that you are the owner of
                        the copyright in question, or authorized to act on the copyright owner's behalf.
                    </Typography>
                    <Typography>
                        5. Your address, telephone number, and email address.
                    </Typography>
                    <Typography>
                        6. Your signature.
                    </Typography>
                    <Typography>

                        Please send your notice to:
                    </Typography>
                    <Typography>
                        decksofkeyforge@gmail.com
                    </Typography>

                    <TermsHeader>
                        MISCELLANEOUS
                    </TermsHeader>

                    <WhiteSpaceTypography>
                        If a TOU term is unenforceable, it will be limited to the least extent possible, and substituted with a valid provision that
                        embodies the intent of the term for all parties.
                    </WhiteSpaceTypography>
                </Paper>
            </div>
        </div>
    )
}

const TermsHeader = (props: { children: string }) => {
    return (
        <Typography variant={"h6"} style={{fontWeight: 700, marginTop: spacing(4), marginBottom: spacing(2)}}>
            {props.children}
        </Typography>
    )
}
