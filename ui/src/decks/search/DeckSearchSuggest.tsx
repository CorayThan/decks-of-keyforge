import { createStyles, Fade, IconButton, InputBase, List, makeStyles, Paper, Popper, Theme } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"
import { PopperPlacementType } from "@material-ui/core/Popper"
import { Clear, Search } from "@material-ui/icons"
import { observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { RouteComponentProps, withRouter } from "react-router"
import { spacing } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { log, prettyJson } from "../../config/Utils"
import { LinkMenuItem } from "../../mui-restyled/LinkMenuItem"
import { screenStore } from "../../ui/ScreenStore"
import { deckStore } from "../DeckStore"
import { DeckFilters } from "./DeckFilters"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        input: {
            color: "white"
        }
    }),
)

class SearchDeckNameStore {
    @observable
    deckName: string = ""

    quietPeriodTimeoutId?: number

    inputRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.deckName = event.target.value

        log.debug(`Handle search change deck name ${this.deckName} previous timeout id ${this.quietPeriodTimeoutId}`)

        if (this.quietPeriodTimeoutId != null) {
            window.clearTimeout(this.quietPeriodTimeoutId)
        }

        if (this.deckName.trim().length > 3) {
            this.quietPeriodTimeoutId = window.setTimeout(() => {
                log.debug(`Delayed search with ${this.deckName}`)
                deckStore.findDecksByName(this.deckName.trim())
            }, 500)
        } else {
            deckStore.deckNameSearchResults = []
        }
    }

    reset = () => {
        if (this.quietPeriodTimeoutId != null) {
            window.clearTimeout(this.quietPeriodTimeoutId)
        }
        this.deckName = ""
        deckStore.deckNameSearchResults = []
    }
}

const searchDeckNameStore = new SearchDeckNameStore()

interface DeckSearchSuggestProps {
    placement: PopperPlacementType
}

export const DeckSearchSuggest = withRouter(observer((props: DeckSearchSuggestProps & RouteComponentProps) => {
    const classes = useStyles()
    const deckNameSuggestions = deckStore.deckNameSearchResults.map(deckNameId => ({label: deckNameId.name, value: deckNameId.id}))
    const menuOpen = deckNameSuggestions.length > 0
    log.debug(`Rendering deck name suggestions: ${prettyJson(deckNameSuggestions)} menuOpen = ${menuOpen}`)
    const filters = new DeckFilters()
    filters.title = searchDeckNameStore.deckName
    const search = Routes.deckSearch(filters)
    return (
        <>
            <div
                ref={searchDeckNameStore.inputRef}
                style={{
                    display: "flex",
                    borderRadius: 4,
                    backgroundColor: blue[400],
                    marginLeft: spacing(screenStore.screenSizeXs() ? 1 : 2),
                    marginRight: spacing(screenStore.screenSizeXs() ? 1 : 2),
                    alignItems: "center",
                    width: screenStore.screenSizeXs() ? 124 : 240
                }}
            >
                <Search style={{color: "#FFFFFF", marginLeft: spacing(1), marginRight: spacing(1)}}/>
                <InputBase
                    onChange={searchDeckNameStore.handleSearchChange}
                    style={{caretColor: "#FFFFFF"}}
                    placeholder={screenStore.screenSizeXs() ? "Search" : "Search decks..."}
                    className={classes.input}
                    value={searchDeckNameStore.deckName}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") {
                            props.history.push(search)
                            searchDeckNameStore.reset()
                        }
                    }}
                />
                {searchDeckNameStore.deckName.trim().length > 0 ? (
                    <>
                        <div style={{flexGrow: 1}}/>
                        <IconButton size={"small"} style={{marginLeft: spacing(1)}} onClick={searchDeckNameStore.reset}>
                            <Clear style={{color: "white"}}/>
                        </IconButton>
                    </>
                ) : null}
            </div>
            <SuggestPopper menuOpen={menuOpen} placement={props.placement} search={search} ref={searchDeckNameStore.inputRef}/>
        </>
    )
}))

const SuggestPopper = observer(React.forwardRef((props: { menuOpen: boolean, placement: PopperPlacementType, search: string }, ref: React.Ref<HTMLDivElement>) => {
    return (
        <Popper
            open={props.menuOpen}
            anchorEl={(ref as any).current}
            transition
            style={{zIndex: screenStore.zindexes.menuPops}}
            placement={props.placement}
        >
            {({TransitionProps}) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Paper>
                        <List>
                            {deckStore.deckNameSearchResults.map((deckNameId, idx) => (
                                <LinkMenuItem
                                    key={deckNameId.id}
                                    to={Routes.deckPage(deckNameId.id)}
                                    onClick={searchDeckNameStore.reset}
                                >
                                    {deckNameId.name}
                                </LinkMenuItem>
                            ))}
                            <LinkMenuItem
                                to={props.search}
                                onClick={searchDeckNameStore.reset}
                            >
                                All results...
                            </LinkMenuItem>
                        </List>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}))
