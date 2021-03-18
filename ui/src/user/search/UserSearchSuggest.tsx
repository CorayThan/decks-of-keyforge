import { Box, Fade, IconButton, List, Paper, Popper, TextField } from "@material-ui/core"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import { Clear } from "@material-ui/icons"
import axios, { AxiosResponse, CancelTokenSource } from "axios"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import React, { useState } from "react"
import { spacing } from "../../config/MuiConfig"
import { log } from "../../config/Utils"
import { UserSearchResult } from "../../generated-src/UserSearchResult"
import { screenStore } from "../../ui/ScreenStore"
import { UserStore } from "../UserStore"
import { UserListItem } from "./UserListItem"

class SearchUsernameStore {
    @observable
    searchValue = ""

    @observable
    foundUsers: UserSearchResult[] = []

    quietPeriodTimeoutId?: number

    usernameSearchCancel: CancelTokenSource | undefined

    inputRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

    findUsernames = (name: string) => {
        if (this.usernameSearchCancel != null) {
            this.usernameSearchCancel.cancel()
        }
        this.usernameSearchCancel = axios.CancelToken.source()
        axios.get(`${UserStore.CONTEXT}/by-name/${name}`, {
            cancelToken: this.usernameSearchCancel.token
        })
            .then((response: AxiosResponse<UserSearchResult[]>) => {
                this.foundUsers = response.data
                this.usernameSearchCancel = undefined
            })
            .catch(error => {
                log.debug("Canceled request to find decks by name with message: " + error.message)
            })
    }

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.searchValue = event.target.value

        if (this.quietPeriodTimeoutId != null) {
            window.clearTimeout(this.quietPeriodTimeoutId)
        }

        const trimmed = this.searchValue.trim()
        if (trimmed.length > 2) {
            this.quietPeriodTimeoutId = window.setTimeout(() => {
                log.debug(`Delayed search with ${trimmed}`)
                if (trimmed.length > 3) {
                    this.findUsernames(trimmed)
                }
            }, 500)
        } else {
            this.foundUsers = []
        }
    }

    reset = () => {
        if (this.quietPeriodTimeoutId != null) {
            window.clearTimeout(this.quietPeriodTimeoutId)
        }
        this.searchValue = ""
        this.foundUsers = []
        if (this.usernameSearchCancel != null) {
            this.usernameSearchCancel.cancel()
        }
    }

    constructor() {
        makeObservable(this)
    }
}

interface UsernameSearchSuggestProps {
    usernames?: string[]
    placeholderText: string
    onClick?: (username: string) => void
}

export const UserSearchSuggest = observer((props: UsernameSearchSuggestProps) => {
    const {usernames, placeholderText, onClick} = props

    const [store] = useState(new SearchUsernameStore())

    const menuOpen = store.foundUsers.length > 0

    return (
        <Box mb={1} mt={1}>
            <TextField
                onChange={store.handleSearchChange}
                placeholder={placeholderText}
                value={store.searchValue}
                onKeyPress={(event) => {
                    if (event.key === "Enter" && store.foundUsers.length > 0) {
                        const username = store.foundUsers[0].username
                        if (usernames != null) {
                            usernames.push(username)
                        }
                        if (onClick != null) {
                            onClick(username)
                        }
                        store.reset()
                    }
                }}
                fullWidth={true}
                ref={store.inputRef}
            />
            {store.searchValue.trim().length > 0 ? (
                <>
                    <div style={{flexGrow: 1}}/>
                    <IconButton size={"small"} style={{marginLeft: spacing(1)}} onClick={store.reset}>
                        <Clear style={{color: "white"}}/>
                    </IconButton>
                </>
            ) : null}
            <SuggestPopper store={store} usernames={usernames} menuOpen={menuOpen} ref={store.inputRef} onClick={onClick}/>
        </Box>
    )
})

// eslint-disable-next-line
const SuggestPopper = observer(React.forwardRef((props: { store: SearchUsernameStore, usernames?: string[], onClick?: (username: string) => void, menuOpen: boolean }, ref: React.Ref<HTMLDivElement>) => {
    return (
        <ClickAwayListener onClickAway={props.store.reset}>
            <Popper
                open={props.menuOpen}
                anchorEl={
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (ref as any).current
                }
                transition
                style={{zIndex: screenStore.zindexes.menuPops}}
            >
                {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <List>
                                {props.store.foundUsers.map(user => (
                                    <UserListItem
                                        key={user.username}
                                        user={user}
                                        onClick={() => {
                                            log.info("Clickedddddd!")
                                            if (props.usernames != null) {
                                                props.usernames.push(user.username)
                                            }
                                            if (props.onClick != null) {
                                            log.info("Clickedddddd! in onclick")
                                                props.onClick(user.username)
                                            }
                                            props.store.reset()
                                        }}
                                    />
                                ))}
                            </List>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </ClickAwayListener>
    )
}))
