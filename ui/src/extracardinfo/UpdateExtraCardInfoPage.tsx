import {
    Card,
    CardActions,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core"
import { ChevronLeft, ChevronRight, Close, Delete, Save } from "@material-ui/icons"
import { range, startCase } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { SingleCardSearchSuggest } from "../cards/CardSearchSuggest"
import { CardView } from "../cards/CardSimpleView"
import { cardStore } from "../cards/CardStore"
import { CardType } from "../cards/CardType"
import { KCard } from "../cards/KCard"
import { keyLocalStorage } from "../config/KeyLocalStorage"
import { spacing, themeStore } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { log, prettyJson, Utils } from "../config/Utils"
import { BackendExpansion } from "../expansions/Expansions"
import { EventValue } from "../generic/EventValue"
import { UnstyledLink } from "../generic/UnstyledLink"
import { KeyButton } from "../mui-restyled/KeyButton"
import { KeyMultiSearchSuggest, SelectedOptions } from "../mui-restyled/KeyMultiSearchSuggest"
import { KeySingleSearchSuggest } from "../mui-restyled/KeySingleSearchSuggest"
import { LinkButton } from "../mui-restyled/LinkButton"
import { Loader } from "../mui-restyled/Loader"
import { SynTraitHouse } from "../synergy/SynTraitHouse"
import { SynTraitPlayer, SynTraitRatingValues, SynTraitValue } from "../synergy/SynTraitValue"
import { TraitBubble } from "../synergy/TraitBubble"
import { uiStore } from "../ui/UiStore"
import { ExtraCardInfo } from "./ExtraCardInfo"
import { extraCardInfoStore } from "./ExtraCardInfoStore"
import { synergyOptions, SynergyTrait, traitOptions } from "./SynergyTrait"

interface UpdateExtraCardInfoPageProps extends RouteComponentProps<{ infoId: string }> {
}

@observer
export class UpdateExtraCardInfoPage extends React.Component<UpdateExtraCardInfoPageProps> {

    componentDidMount(): void {
        if (this.props.match.params.infoId) {
            extraCardInfoStore.findExtraCardInfo(this.props.match.params.infoId)
        }
    }

    componentDidUpdate(prevProps: UpdateExtraCardInfoPageProps): void {
        if (prevProps.match.params.infoId && this.props.match.params.infoId != this.props.match.params.infoId) {
            extraCardInfoStore.findExtraCardInfo(this.props.match.params.infoId)
        }
    }

    render() {
        const extraCardInfo = extraCardInfoStore.extraCardInfo
        const allCards = cardStore.allCards
        if (extraCardInfo == null || allCards.length === 0) {
            return <Loader/>
        }
        const card = cardStore.findCardByIdentifier(extraCardInfo.cardNumbers[0])
        if (card == null) {
            return <Loader/>
        }
        return <UpdateExtraCardInfo extraCardInfo={extraCardInfo} card={card}/>
    }
}

interface UpdateExtraCardInfoProps {
    extraCardInfo: ExtraCardInfo
    card: KCard
}

@observer
class UpdateExtraCardInfo extends React.Component<UpdateExtraCardInfoProps> {

    @observable
    amberControl = "0"
    @observable
    expectedAmber = "0"
    @observable
    artifactControl = "0"
    @observable
    creatureControl = "0"
    @observable
    aercScore = "0"
    @observable
    efficiency = "0"
    @observable
    effectivePower = "0"
    @observable
    amberProtection = "0"
    @observable
    disruption = "0"
    @observable
    houseCheating = "0"
    @observable
    other = "0"

    @observable
    amberControlMax = "0"
    @observable
    expectedAmberMax = "0"
    @observable
    artifactControlMax = "0"
    @observable
    creatureControlMax = "0"
    @observable
    aercScoreMax = "0"
    @observable
    efficiencyMax = "0"
    @observable
    effectivePowerMax = "0"
    @observable
    amberProtectionMax = "0"
    @observable
    disruptionMax = "0"
    @observable
    houseCheatingMax = "0"
    @observable
    otherMax = "0"

    @observable
    traits: SynTraitValue[] = []
    @observable
    synergies: SynTraitValue[] = []

    // eslint-disable-next-line
    // @ts-ignore
    infoId: string
    // eslint-disable-next-line
    // @ts-ignore
    card: KCard

    constructor(props: UpdateExtraCardInfoProps) {
        super(props)
        this.reset(props.extraCardInfo)
    }

    componentDidUpdate(prevProps: Readonly<UpdateExtraCardInfoProps>) {
        if (prevProps.extraCardInfo !== this.props.extraCardInfo) {
            this.reset(this.props.extraCardInfo)
        }
    }

    reset = (resetTo: ExtraCardInfo) => {
        const extraCardInfo = resetTo == null ? this.props.extraCardInfo : resetTo
        this.infoId = extraCardInfo.id
        this.card = this.props.card

        this.amberControl = extraCardInfo.amberControl.toString()
        this.expectedAmber = extraCardInfo.expectedAmber.toString()
        this.artifactControl = extraCardInfo.artifactControl.toString()
        this.creatureControl = extraCardInfo.creatureControl.toString()
        this.efficiency = extraCardInfo.efficiency.toString()
        this.effectivePower = extraCardInfo.effectivePower.toString()
        this.amberProtection = extraCardInfo.amberProtection.toString()
        this.disruption = extraCardInfo.disruption.toString()
        this.houseCheating = extraCardInfo.houseCheating.toString()
        this.other = extraCardInfo.other.toString()

        this.amberControlMax = extraCardInfo.amberControlMax == null ? "0" : extraCardInfo.amberControlMax.toString()
        this.expectedAmberMax = extraCardInfo.expectedAmberMax == null ? "0" : extraCardInfo.expectedAmberMax.toString()
        this.artifactControlMax = extraCardInfo.artifactControlMax == null ? "0" : extraCardInfo.artifactControlMax.toString()
        this.creatureControlMax = extraCardInfo.creatureControlMax == null ? "0" : extraCardInfo.creatureControlMax.toString()
        this.efficiencyMax = extraCardInfo.efficiencyMax == null ? "0" : extraCardInfo.efficiencyMax.toString()
        this.effectivePowerMax = extraCardInfo.effectivePowerMax == null ? "0" : extraCardInfo.effectivePowerMax.toString()
        this.amberProtectionMax = extraCardInfo.amberProtectionMax == null ? "0" : extraCardInfo.amberProtectionMax.toString()
        this.disruptionMax = extraCardInfo.disruptionMax == null ? "0" : extraCardInfo.disruptionMax.toString()
        this.houseCheatingMax = extraCardInfo.houseCheatingMax == null ? "0" : extraCardInfo.houseCheatingMax.toString()
        this.otherMax = extraCardInfo.otherMax == null ? "0" : extraCardInfo.otherMax.toString()

        log.debug("traits length " + extraCardInfo.traits.length)
        this.traits = extraCardInfo.traits
        this.synergies = extraCardInfo.synergies

        uiStore.setTopbarValues("Edit " + this.card.cardTitle, "Edit", "")
    }

    save = async () => {

        const extraCardInfo: ExtraCardInfo = {
            ...this.props.extraCardInfo,

            amberControl: Number(this.amberControl),
            expectedAmber: Number(this.expectedAmber),
            artifactControl: Number(this.artifactControl),
            creatureControl: Number(this.creatureControl),
            efficiency: Number(this.efficiency),
            effectivePower: Number(this.effectivePower),
            amberProtection: Number(this.amberProtection),
            disruption: Number(this.disruption),
            houseCheating: Number(this.houseCheating),
            other: Number(this.other),

            amberControlMax: Number(this.amberControlMax),
            expectedAmberMax: Number(this.expectedAmberMax),
            artifactControlMax: Number(this.artifactControlMax),
            creatureControlMax: Number(this.creatureControlMax),
            efficiencyMax: Number(this.efficiencyMax),
            effectivePowerMax: Number(this.effectivePowerMax),
            amberProtectionMax: Number(this.amberProtectionMax),
            disruptionMax: Number(this.disruptionMax),
            houseCheatingMax: Number(this.houseCheatingMax),
            otherMax: Number(this.otherMax),

            traits: this.traits,
            synergies: this.synergies
        }
        log.debug(`Traits we're saving: ${prettyJson(extraCardInfo.traits)}`)
        await extraCardInfoStore.saveExtraCardInfo(extraCardInfo)
        const saved = await extraCardInfoStore.findExtraCardInfo(this.infoId)
        this.reset(saved)
    }

    render() {
        const wcOnly = keyLocalStorage.genericStorage.wcOnly
        const filteredCards = cardStore.allCards
            .filter(card => wcOnly ? card.extraCardInfo.cardNumbers.length === 1 && card.extraCardInfo.cardNumbers.find(cardNum => cardNum.expansion === BackendExpansion.WORLDS_COLLIDE || cardNum.expansion === BackendExpansion.ANOMALY_EXPANSION) : true)
        let nextId
        let prevId
        if (filteredCards.length > 0 && this.props.extraCardInfo != null) {
            const findWith = filteredCards.find(card => card.id === this.card.id)
            if (findWith != null) {
                const idx = filteredCards.indexOf(findWith)
                nextId = idx > -1 && idx < filteredCards.length - 1 ? filteredCards[idx + 1].extraCardInfo.id : undefined
                prevId = idx > 0 ? filteredCards[idx - 1].extraCardInfo.id : undefined
            }
        }
        return (
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}
            >
                {this.card && (
                    <div>
                        <Typography variant={"h5"} style={{marginLeft: spacing(2), marginBottom: spacing(2)}}>Current Values</Typography>
                        <CardView card={this.card}/>
                    </div>
                )}
                <div>
                    <Card style={{maxWidth: 800, margin: spacing(4), padding: spacing(2)}}>
                        <div style={{display: "flex", alignItems: "center", marginBottom: spacing(2)}}>
                            <Typography variant={"h4"}>
                                {this.card.cardTitle}'s AERC
                            </Typography>
                            <div style={{flexGrow: 1}}/>
                            <Tooltip title={"Worlds Collide Only"}>
                                <Checkbox
                                    style={{marginLeft: spacing(2)}}
                                    checked={wcOnly}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => keyLocalStorage.updateGenericStorage({wcOnly: event.target.checked})}
                                />
                            </Tooltip>
                            {prevId != null && (
                                <UnstyledLink to={Routes.editExtraCardInfo(prevId)} style={{marginLeft: spacing(2)}}>
                                    <IconButton>
                                        <ChevronLeft/>
                                    </IconButton>
                                </UnstyledLink>
                            )}
                            {nextId != null && (
                                <UnstyledLink to={Routes.editExtraCardInfo(nextId)} style={{marginLeft: spacing(2)}}>
                                    <IconButton>
                                        <ChevronRight/>
                                    </IconButton>
                                </UnstyledLink>
                            )}
                        </div>
                        <Grid
                            container={true}
                            spacing={2}
                            style={{marginTop: spacing(2)}}
                        >
                            <InfoInput
                                name={"expected aember"}
                                value={this.expectedAmber}
                                update={(event: EventValue) => this.expectedAmber = event.target.value}
                            />
                            <InfoInput
                                name={"exp aember max"}
                                value={this.expectedAmberMax}
                                update={(event: EventValue) => this.expectedAmberMax = event.target.value}
                            />
                            <InfoInput
                                name={"aember control"}
                                value={this.amberControl}
                                update={(event: EventValue) => this.amberControl = event.target.value}
                            />
                            <InfoInput
                                name={"aember control max"}
                                value={this.amberControlMax}
                                update={(event: EventValue) => this.amberControlMax = event.target.value}
                            />
                            <InfoInput
                                name={"artifact control"}
                                value={this.artifactControl}
                                update={(event: EventValue) => this.artifactControl = event.target.value}
                            />
                            <InfoInput
                                name={"artifact control max"}
                                value={this.artifactControlMax}
                                update={(event: EventValue) => this.artifactControlMax = event.target.value}
                            />
                            <InfoInput
                                name={"creature control"}
                                value={this.creatureControl}
                                update={(event: EventValue) => this.creatureControl = event.target.value}
                            />
                            <InfoInput
                                name={"creature control max"}
                                value={this.creatureControlMax}
                                update={(event: EventValue) => this.creatureControlMax = event.target.value}
                            />
                            <InfoInput
                                name={"efficiency"}
                                value={this.efficiency}
                                update={(event: EventValue) => this.efficiency = event.target.value}
                            />
                            <InfoInput
                                name={"efficiency max"}
                                value={this.efficiencyMax}
                                update={(event: EventValue) => this.efficiencyMax = event.target.value}
                            />
                            <InfoInput
                                name={"disruption"}
                                value={this.disruption}
                                update={(event: EventValue) => this.disruption = event.target.value}
                            />
                            <InfoInput
                                name={"disruption max"}
                                value={this.disruptionMax}
                                update={(event: EventValue) => this.disruptionMax = event.target.value}
                            />
                            <InfoInput
                                name={"effective power"}
                                value={this.effectivePower}
                                update={(event: EventValue) => this.effectivePower = event.target.value}
                            />
                            <InfoInput
                                name={"effective power max"}
                                value={this.effectivePowerMax}
                                update={(event: EventValue) => this.effectivePowerMax = event.target.value}
                            />
                            <InfoInput
                                name={"aember protection"}
                                value={this.amberProtection}
                                update={(event: EventValue) => this.amberProtection = event.target.value}
                            />
                            <InfoInput
                                name={"aember prot max"}
                                value={this.amberProtectionMax}
                                update={(event: EventValue) => this.amberProtectionMax = event.target.value}
                            />
                            <InfoInput
                                name={"house cheating"}
                                value={this.houseCheating}
                                update={(event: EventValue) => this.houseCheating = event.target.value}
                            />
                            <InfoInput
                                name={"house cheating max"}
                                value={this.houseCheatingMax}
                                update={(event: EventValue) => this.houseCheatingMax = event.target.value}
                            />
                            <InfoInput
                                name={"other"}
                                value={this.other}
                                update={(event: EventValue) => this.other = event.target.value}
                            />
                            <InfoInput
                                name={"other max"}
                                value={this.otherMax}
                                update={(event: EventValue) => this.otherMax = event.target.value}
                            />
                            <Grid item={true} xs={12} sm={6}>
                                <div>
                                    {this.traits.map((synergy, idx) => (
                                        <div
                                            key={idx}
                                            style={{display: "flex"}}
                                        >
                                            <TraitBubble
                                                traitValue={synergy}
                                                trait={true}
                                            />
                                            <IconButton
                                                onClick={() => this.traits.splice(idx, 1)}
                                            >
                                                <Delete/>
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <div>
                                    {this.synergies.map((synergy, idx) => (
                                        <div
                                            key={idx}
                                            style={{display: "flex"}}
                                        >
                                            <TraitBubble
                                                traitValue={synergy}
                                            />
                                            <IconButton
                                                onClick={() => this.synergies.splice(idx, 1)}
                                            >
                                                <Delete/>
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Grid item={true} xs={12}>
                                <AddTrait traits={this.traits} synergies={this.synergies}/>
                            </Grid>
                        </Grid>
                        <CardActions>
                            <LinkButton
                                to={Routes.cards}
                                style={{marginRight: spacing(2)}}
                            >
                                Cards
                            </LinkButton>
                            <div style={{flexGrow: 1}}/>
                            <KeyButton
                                variant={"contained"}
                                color={"primary"}
                                loading={extraCardInfoStore.savingExtraCardInfo}
                                onClick={this.save}
                            >
                                Save
                            </KeyButton>
                        </CardActions>
                    </Card>
                </div>
            </div>
        )
    }
}

const InfoInput = (props: { name: string, value: string, update: (event: EventValue) => void }) => {
    const {name, value, update} = props
    return (
        <Grid item={true} xs={6} sm={3}>
            <TextField
                label={name}
                value={value}
                onChange={update}
                fullWidth={true}
                variant={"outlined"}
                type={"number"}
            />
        </Grid>
    )
}

@observer
class AddTrait extends React.Component<{ traits: SynTraitValue[], synergies: SynTraitValue[] }> {

    cardTraitsStore = new SelectedOptions()

    @observable
    traitOrSynergy: "trait" | "synergy" = "synergy"

    @observable
    rating: SynTraitRatingValues = 3

    @observable
    house: SynTraitHouse = SynTraitHouse.anyHouse

    @observable
    cardTypes: CardType[] = []

    @observable
    powersString = ""

    @observable
    player: SynTraitPlayer = SynTraitPlayer.ANY

    @observable
    holdsCard = {
        option: ""
    }

    @observable
    holdsTrait = {
        option: SynergyTrait.any.toString()
    }

    get trait(): SynergyTrait | undefined {
        if (this.holdsTrait.option.length > 0) {
            log.debug("Find trait for: " + this.holdsTrait.option)
            return (this.traitOrSynergy === "synergy" ? synergyOptions : traitOptions).find(trait => this.holdsTrait.option === trait.label)!.value as SynergyTrait
        }
        return undefined
    }

    render() {
        const {traits, synergies} = this.props

        const selectableTraits = this.traitOrSynergy === "synergy" ? synergyOptions : traitOptions

        return (
            <Grid container={true} spacing={2} style={{backgroundColor: themeStore.aercViewBackground, marginBottom: spacing(2)}}>
                <Grid item={true} xs={12}>
                    <FormControl>
                        <FormLabel>Rating</FormLabel>
                        <RadioGroup
                            value={this.rating}
                            onChange={(event) => this.rating = Number(event.target.value) as SynTraitRatingValues}
                        >
                            <div style={{display: "flex", flexWrap: "wrap"}}>
                                {range(-4, 5).map(value => (
                                    <FormControlLabel key={value} value={value} control={<Radio/>} label={value.toString()}/>
                                ))}
                            </div>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item={true}>
                    <FormControl>
                        <FormLabel>Type</FormLabel>
                        <RadioGroup
                            value={this.traitOrSynergy}
                            onChange={event => {
                                const newValids = this.traitOrSynergy === "synergy" ? traitOptions : synergyOptions
                                const choosenTrait = this.holdsTrait.option as SynergyTrait | ""
                                if (choosenTrait.length > 0 && newValids.find(option => choosenTrait === option.value) == null) {
                                    this.holdsTrait.option = ""
                                }
                                this.traitOrSynergy = event.target.value as "trait" | "synergy"
                            }}
                        >
                            <FormControlLabel value={"trait"} control={<Radio/>} label={"Trait"}/>
                            <FormControlLabel value={"synergy"} control={<Radio/>} label={"Syn"}/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item={true}>
                    <FormControl>
                        <FormLabel>Card Types</FormLabel>
                        <FormGroup>
                            {(Utils.enumValues(CardType) as CardType[]).map(type => (
                                <FormControlLabel
                                    key={type}
                                    control={
                                        <Checkbox
                                            checked={this.cardTypes.includes(type)}
                                            onChange={() => {
                                                if (this.cardTypes.includes(type)) {
                                                    this.cardTypes = this.cardTypes.filter(toRemove => type !== toRemove)
                                                } else {
                                                    this.cardTypes.push(type)
                                                }
                                            }}
                                        />
                                    }
                                    label={type}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid item={true}>
                    <FormControl>
                        <FormLabel>House</FormLabel>
                        <RadioGroup
                            value={this.house}
                            onChange={(event) => this.house = event.target.value as SynTraitHouse}
                        >
                            {Utils.enumValues(SynTraitHouse).map(option => (
                                <FormControlLabel
                                    key={option}
                                    value={option}
                                    control={<Radio/>}
                                    label={option === SynTraitHouse.anyHouse ? "Any" : (option === SynTraitHouse.house ? "House" : "Out of")}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item={true}>
                    <FormControl>
                        <FormLabel>Player</FormLabel>
                        <RadioGroup
                            value={this.player}
                            onChange={(event) => this.player = event.target.value as SynTraitPlayer}
                            color={"primary"}
                        >
                            {Utils.enumValues(SynTraitPlayer).map(option => (
                                <FormControlLabel key={option} value={option} control={<Radio/>} label={startCase((option as string).toLowerCase())}/>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item={true} style={{minWidth: 280}}>
                    <TextField
                        label={"Power"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={this.powersString}
                        placeholder={"odd, even, 2-5, 2 or less, 3+, 3,5,7"}
                        onChange={(event) => this.powersString = event.target.value}
                        fullWidth={true}
                    />
                    <KeyMultiSearchSuggest
                        selected={this.cardTraitsStore}
                        placeholder={"Card Traits"}
                        options={cardStore.cardTraits}
                        fullWidth={true}
                    />
                    <SingleCardSearchSuggest
                        selected={this.holdsCard}
                        placeholder={"Card"}
                    />
                    <KeySingleSearchSuggest
                        selected={this.holdsTrait}
                        placeholder={"Trait"}
                        options={selectableTraits}
                        fullWidth={true}
                    />
                    <div style={{display: "flex"}}>
                        <IconButton
                            onClick={() => {
                                this.holdsCard.option = ""
                                this.powersString = ""
                                this.player = SynTraitPlayer.ANY
                                this.house = SynTraitHouse.anyHouse
                                this.traitOrSynergy = "trait"
                                this.cardTypes = []
                                this.rating = 3
                                this.holdsTrait.option = SynergyTrait.any.toString()
                                this.cardTraitsStore.reset()
                            }}
                        >
                            <Close/>
                        </IconButton>
                        <IconButton
                            style={{marginRight: spacing(2)}}
                            onClick={() => {
                                (this.traitOrSynergy === "synergy" ? synergies : traits).push({
                                    trait: this.holdsCard.option.length > 0 ? SynergyTrait.card : this.holdsTrait.option as SynergyTrait,
                                    rating: this.rating,
                                    cardName: this.holdsCard.option.length > 0 ? this.holdsCard.option : undefined,
                                    house: this.house,
                                    player: this.player,
                                    cardTypes: this.cardTypes.slice(),
                                    cardTraits: this.cardTraitsStore.selectedValues.slice(),
                                    powersString: this.powersString.trim()
                                })

                            }}
                        >
                            <Save/>
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
        )
    }
}