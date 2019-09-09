import { observer } from "mobx-react"
import * as React from "react"
import { InfoListCard } from "../generic/InfoListCard"
import { AboutGridItem } from "./AboutPage"

@observer
export class TeamSasLp extends React.Component {

    render() {
        return (
            <AboutGridItem>
                <InfoListCard
                    title={"Team SAS-LP"}
                    infos={[
                        "Team SAS of the Luxurious Playstyle is a competitive KeyForge team sponsored by Decks of KeyForge and",
                        <a href={"https://luxuryplaystyle.com"} target={"_blank"} key={"lp"}>Luxury Playstyle</a>,
                        "We travel to KeyForge tournaments around the world, and include many of the top players in the world, with two vault tour champions " +
                        "and many of the top spots on the official VT leaderboard.",
                        "Check out our team site for team swag, to join our online tournaments, read member profiles and more!",
                        <a href={"https://sites.google.com/view/zforge/team-sas-lp"} target={"_blank"} key={"tsaslp"}>Team SAS-LP</a>,
                    ]}
                />
            </AboutGridItem>
        )
    }
}
