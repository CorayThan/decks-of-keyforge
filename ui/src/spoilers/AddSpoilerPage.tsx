import { Card, Grid, MenuItem, TextField, Typography } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { CardType } from "../cards/CardType"
import { Rarity } from "../cards/rarity/Rarity"
import { spacing } from "../config/MuiConfig"
import { Utils } from "../config/Utils"
import { Expansion } from "../expansions/Expansions"
import { EventValue } from "../generic/EventValue"
import { House } from "../houses/House"
import { KeyButton } from "../mui-restyled/KeyButton"
import { messageStore } from "../ui/MessageStore"
import { Spoiler } from "./Spoiler"
import { spoilerStore } from "./SpoilerStore"

@observer
export class AddSpoilerPage extends React.Component {

    @observable
    cardTitle = ""
    @observable
    house: "" | House = ""
    @observable
    cardType: "" | CardType = ""
    @observable
    cardText = ""
    @observable
    amber = "0"
    @observable
    power = ""
    @observable
    armor = ""
    @observable
    rarity: "" | Rarity = ""
    @observable
    cardNumber = ""

    save = () => {
        const cardTitle = this.cardTitle.trim()
        if (cardTitle.length < 1) {
            messageStore.setWarningMessage("Please include a card title.")
            return
        }
        const house = this.house as House
        if (house.length < 1) {
            messageStore.setWarningMessage("Please include house.")
            return
        }
        const cardType = this.cardType as CardType
        if (cardType.length < 1) {
            messageStore.setWarningMessage("Please include card type.")
            return
        }
        const rarity = this.rarity as Rarity
        if (rarity.length < 1) {
            messageStore.setWarningMessage("Please include rarity.")
            return
        }
        const spoiler: Spoiler = {
            cardType,
            cardTitle,
            rarity,
            house,
            frontImage: "",
            expansion: Expansion.WC,
            amber: this.amber === "" ? 0 : Number(this.amber),
            powerString: this.power,
            armorString: this.armor,
            cardText: this.cardText.trim(),
            cardNumber: this.cardNumber.trim(),
            active: true
        }
        spoilerStore.saveSpoiler(spoiler)
    }

    render() {
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <Card style={{maxWidth: 800, margin: spacing(4), padding: spacing(2)}}>
                    <Typography variant={"h4"} style={{marginBottom: spacing(2)}}>Create Spoiler Card</Typography>
                    <Grid container={true} spacing={2}>
                        <Grid item={true} xs={12} md={8}>
                            <TextField
                                label={"name"}
                                value={this.cardTitle}
                                onChange={(event: EventValue) => this.cardTitle = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} md={4}>
                            <TextField
                                label={"number"}
                                value={this.cardNumber}
                                onChange={(event: EventValue) => this.cardNumber = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                type={"number"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                select={true}
                                label={"house"}
                                value={this.house}
                                onChange={(event: EventValue) => this.house = event.target.value as House}
                                variant={"outlined"}
                                fullWidth={true}
                            >
                                {Utils.enumValues(House).map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                select={true}
                                label={"type"}
                                value={this.cardType}
                                onChange={(event: EventValue) => this.cardType = event.target.value as CardType}
                                variant={"outlined"}
                                fullWidth={true}
                            >
                                {Utils.enumValues(CardType).map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                select={true}
                                label={"rarity"}
                                value={this.rarity}
                                onChange={(event: EventValue) => this.rarity = event.target.value as Rarity}
                                variant={"outlined"}
                                fullWidth={true}
                            >
                                {Utils.enumValues(Rarity).map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                label={"aember"}
                                value={this.amber}
                                onChange={(event: EventValue) => this.amber = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                type={"number"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                label={"power"}
                                value={this.power}
                                onChange={(event: EventValue) => this.power = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                type={"number"}
                            />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                            <TextField
                                label={"armor"}
                                value={this.armor}
                                onChange={(event: EventValue) => this.armor = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                type={"number"}
                            />
                        </Grid>
                        <Grid item={true} xs={12}>
                            <TextField
                                label={"text"}
                                value={this.cardText}
                                onChange={(event: EventValue) => this.cardText = event.target.value}
                                fullWidth={true}
                                variant={"outlined"}
                                multiline={true}
                            />
                        </Grid>
                    </Grid>
                    <div style={{marginTop: spacing(2), display: "flex"}}>
                        <KeyButton
                            variant={"contained"}
                            color={"primary"}
                            loading={spoilerStore.savingSpoiler}
                            onClick={this.save}
                        >
                            Save
                        </KeyButton>
                    </div>
                </Card>
            </div>
        )
    }
}
