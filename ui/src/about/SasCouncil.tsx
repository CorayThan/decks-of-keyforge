import { Typography } from "@material-ui/core"
import Link from "@material-ui/core/Link"
import { observer } from "mobx-react"
import * as React from "react"
import { spacing } from "../config/MuiConfig"
import { InfoListCard } from "../generic/InfoListCard"
import { AboutGridItem } from "./AboutPage"

@observer
export class SasCouncil extends React.Component {

    render() {
        return (
            <AboutGridItem>
                <InfoListCard
                    title={"SAS Council"}
                    subtitle={
                        "The SAS Council helps rate and evaluate SAS. It includes members of Team SAS-LP as well as other community members."
                    }
                    infos={[
                        <MemberView
                            name={`Nathan "CorayThan" Westlake`}
                            role={"AERCitect of SAS and DoK"}
                            description={
                                "Nathan creates SAS with the help of the SAS Council as well as everyone else who generously donates their time and " +
                                "expertise. Thank you to everyone who sends me recommendations via Discord, email, and other means!"
                            }
                        />,
                        <MemberView
                            name={`Jakub "Dunkoro" Nosal`}
                            role={"Card Ratings Guru"}
                            description={
                                "Jakub has been instrumental in evaluating and rating the cards of KeyForge with SAS and AERC. He is an original member " +
                                "of Team SAS-LP and has won two vault tours."
                            }
                        />,
                        <MemberView
                            name={`Big Z`}
                            role={"AERC Afficianado"}
                            description={
                                "In addition to helping with card ratings, Z helps plan and strategize the design of AERC and its categories. " +
                                "He is also the captain of Team SAS-LP."
                            }
                        />,
                        <MemberView
                            name={`Luke "JustAGuyPlayin" Daniels`}
                            role={"SAS Expert"}
                            description={
                                "Another original member of Team SAS-LP, Luke helps evaluate cards and synergies to help improve SAS and AERC. He " +
                                "won the Albany, NY Vault Tour."
                            }
                        />,
                        <MemberView
                            name={`Dan "Dr Sheep"`}
                            role={"Combo Exploiter"}
                            description={
                                "Dr Sheep loves to find those hidden gems that need improvement in the SAS system, and evaluate how to improve their " +
                                "rating."
                            }
                        />,
                        <MemberView
                            name={`Dave "Bizarro" Cordeiro`}
                            role={"AERCvisor"}
                            description={
                                <Typography variant={"body2"}>
                                    Dave is an active community member who has consistently lent his time and thoughts to help improve SAS.
                                    He isn't shy about expressing his opinion, which is of great use when Nathan does something silly. He is a member
                                    of <Link href={"https://reapout.com"} target={"_blank"}>Team Reapout</Link>
                                </Typography>
                            }
                        />,
                        <MemberView
                            name={`Aurore`}
                            role={"Preeminent Evaluator"}
                            description={
                                <Typography variant={"body2"}>
                                    Aurore helps provide an outside perspective, as well as helping rate and evaluate cards for SAS. She is a member of
                                    the Sanctumonius community, and creator
                                    of <Link href={"https://timeshapers.com"} target={"_blank"}>timeshapers.com</Link>
                                </Typography>
                            }
                        />,
                    ]}
                />
            </AboutGridItem>
        )
    }
}

const MemberView = (props: { name: string, role: string, description: React.ReactNode }) => {
    return (
        <div style={{marginTop: spacing(2)}}>
            <div style={{display: "flex", alignItems: "flex-end", marginBottom: spacing(1)}}>
                <Typography variant={"h6"} style={{marginRight: spacing(2)}}>{props.name}</Typography>
                <Typography variant={"subtitle2"} style={{paddingBottom: 3}}>{props.role}</Typography>
            </div>
            {typeof props.description == "string" ? (
                <Typography variant={"body2"}>{props.description}</Typography>
            ) : (
                <div>
                    {props.description}
                </div>
            )}
        </div>
    )
}
