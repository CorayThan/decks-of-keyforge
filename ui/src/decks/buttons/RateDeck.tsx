import { Typography } from "@material-ui/core"
import StarIcon from "@material-ui/icons/Star"
import StarBorderIcon from "@material-ui/icons/StarBorder"
import * as React from "react"
import { spacing } from "../../config/MuiConfig"

interface RateDeckProps {
    myRating?: number
    averageRating: number
    totalRatings: number
}

export class RateDeck extends React.Component<RateDeckProps> {
    render() {
        const {myRating, totalRatings} = this.props

        return (
            <div style={{display: "flex"}}>
                <StarBorderIcon/>
                <StarIcon/>
                <StarIcon/>
                <StarIcon/>
                <StarIcon/>
                <Typography variant={"caption"} style={{marginLeft: spacing(1)}}>{totalRatings} ratings</Typography>
                {myRating ? <Typography variant={"caption"} style={{marginLeft: spacing(1)}}>My rating {myRating}</Typography> : null}
            </div>
        )
    }
}
