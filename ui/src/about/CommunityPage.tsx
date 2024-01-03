import { Box } from "@material-ui/core"
import React from "react"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { LinkButton } from "../mui-restyled/LinkButton"

export const CommunityPage = () => {
    return (
        <Box display={"flex"} m={4} justifyContent={"center"} flexWrap={"wrap"}>
            <LinkButton href={Routes.users} variant={"contained"}>DoK Users</LinkButton>
            <LinkButton href={Routes.tournaments} variant={"contained"} style={{marginLeft: spacing(2)}}>Tournaments</LinkButton>
            <LinkButton href={Routes.tags} variant={"contained"} style={{marginLeft: spacing(2)}}>Tagged Decks</LinkButton>
            <LinkButton href={Routes.articles} variant={"contained"} style={{marginLeft: spacing(2)}}>Articles</LinkButton>
            <LinkButton href={Routes.thirdPartyTools} variant={"contained"} style={{marginLeft: spacing(2)}}>Third Party Tools</LinkButton>
        </Box>
    )
}