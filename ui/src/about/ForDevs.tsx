import * as React from "react"
import { InfoListCard } from "../generic/InfoListCard"
import { AboutGridItem } from "./AboutPage"

export class ForDevs extends React.Component {
    render() {
        return (
            <AboutGridItem>
                <InfoListCard title={"For Devs"} infos={[
                    "I've created a simple API you can use to get SAS and AERC ratings for a deck, but if you use it I would appreciate it " +
                    "if you could follow a few rules.",
                    "1. Don't hit the endpoint too hard. It's a fairly efficient request, but my servers aren't super robust.",
                    "2. Please don't send requests with deck IDs that don't exist in master vault.",
                    "3. If you display SAS or AERC values please provide a link to decksofkeyforge.com (or a link to the deck itself " +
                    "on decksofkeyforge.com) along with the rating. " +
                    `It doesn't need to be obtrusive, for example making "75 SAS" into a link, or having a small link icon next to it, is fine.`,
                    "4. Please attribute decksofkeyforge.com on your site.",
                    "5. Send a message to me to get the API."
                ]}/>
            </AboutGridItem>
        )
    }
}
