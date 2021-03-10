import { Box, Fade, IconButton, List, Paper, Popper, TextField } from "@material-ui/core"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import { Clear } from "@material-ui/icons"
import { makeObservable, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { spacing } from "../../config/MuiConfig"
import { log } from "../../config/Utils"
import { screenStore } from "../../ui/ScreenStore"
import { userStore } from "../UserStore"
import { UserListItem } from "./UserListItem"

class SearchUsernameStore {
    @observable
    searchValue = ""

    quietPeriodTimeoutId?: number

    inputRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>()

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
                    userStore.findUsernames(trimmed)
                }
            }, 500)
        } else {
            userStore.foundUsers = []
        }
    }

    reset = () => {
        if (this.quietPeriodTimeoutId != null) {
            window.clearTimeout(this.quietPeriodTimeoutId)
        }
        this.searchValue = ""
        userStore.foundUsers = []
        if (userStore.usernameSearchCancel != null) {
            userStore.usernameSearchCancel.cancel()
        }
    }

    constructor() {
        makeObservable(this)
    }
}

const searchUsernameStore = new SearchUsernameStore()

interface UsernameSearchSuggestProps {
    usernames?: string[]
    placeholderText: string
    onClick?: (username: string) => void
}

export const UserSearchSuggest = observer((props: UsernameSearchSuggestProps) => {
    const {usernames, placeholderText, onClick} = props
    const menuOpen = userStore.foundUsers.length > 0

    return (
        <Box mb={1} mt={1}>
            <TextField
                onChange={searchUsernameStore.handleSearchChange}
                placeholder={placeholderText}
                value={searchUsernameStore.searchValue}
                onKeyPress={(event) => {
                    if (event.key === "Enter" && userStore.foundUsers.length > 0) {
                        const username = userStore.foundUsers[0].username
                        if (usernames != null) {
                            usernames.push(username)
                        }
                        if (onClick != null) {
                            onClick(username)
                        }
                        searchUsernameStore.reset()
                    }
                }}
                fullWidth={true}
                ref={searchUsernameStore.inputRef}
            />
            {searchUsernameStore.searchValue.trim().length > 0 ? (
                <>
                    <div style={{flexGrow: 1}}/>
                    <IconButton size={"small"} style={{marginLeft: spacing(1)}} onClick={searchUsernameStore.reset}>
                        <Clear style={{color: "white"}}/>
                    </IconButton>
                </>
            ) : null}
            <SuggestPopper usernames={usernames} menuOpen={menuOpen} ref={searchUsernameStore.inputRef}/>
        </Box>
    )
})

// eslint-disable-next-line
const SuggestPopper = observer(React.forwardRef((props: { usernames?: string[], onClick?: (username: string) => void, menuOpen: boolean }, ref: React.Ref<HTMLDivElement>) => {
    return (
        <ClickAwayListener onClickAway={searchUsernameStore.reset}>
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
                                {userStore.foundUsers.map(user => (
                                    <UserListItem
                                        key={user.username}
                                        user={user}
                                        onClick={() => {
                                            if (props.usernames != null) {
                                                props.usernames.push(user.username)
                                            }
                                            if (props.onClick != null) {
                                                props.onClick(user.username)
                                            }
                                            searchUsernameStore.reset()
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
