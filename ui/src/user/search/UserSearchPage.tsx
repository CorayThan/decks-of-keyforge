import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { sortBy } from "lodash"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as QueryString from "querystring"
import * as React from "react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { keyLocalStorage } from "../../config/KeyLocalStorage"
import { spacing, themeStore } from "../../config/MuiConfig"
import { Routes } from "../../config/Routes"
import { SortOrder } from "../../config/Utils"
import { KeyLink } from "../../mui-restyled/KeyLink"
import { Loader } from "../../mui-restyled/Loader"
import { PatreonRewardsTier, patronRewardLevelDescription } from "../../thirdpartysites/patreon/PatreonRewardsTier"
import { screenStore } from "../../ui/ScreenStore"
import { uiStore } from "../../ui/UiStore"
import { UserType } from "../KeyUser"
import { userStore } from "../UserStore"
import { UserFilters } from "./UserFilters"
import { UserSearchResult } from "./UserSearchResult"
import { userSearchStore } from "./UserSearchStore"

export const UserSearchPage = observer(() => {

    const location = useLocation()
    const queryValues = QueryString.parse(location.search)
    const filters = UserFilters.rehydrateFromQuery(queryValues)

    useEffect(() => {
        uiStore.setTopbarValues("Collections of KeyForge", "Collections", "")
    }, [])

    return <UserSearchContainer filters={filters}/>
})

class Store {
    @observable
    page = 0

    @observable
    orderBy: keyof UserSearchResult = "deckCount"

    @observable
    order: SortOrder = "desc"

    @observable
    username = ""

    @observable
    role?: UserType | "" = ""

    @observable
    manualPatreonTier?: PatreonRewardsTier | "" = ""

    @observable
    patrons = false

    filters: UserFilters

    constructor(filters: UserFilters) {
        this.filters = filters
    }

    createSortHandler = (property: keyof UserSearchResult) => () => {
        const isDesc = this.orderBy === property && this.order === "desc"
        this.order = isDesc ? "asc" : "desc"
        this.orderBy = property
    }

}

const UserSearchContainer = observer((props: { filters: UserFilters }) => {

    const {filters} = props

    useEffect(() => {
        userSearchStore.searchUsers()
    }, [])

    const [store] = useState(new Store(filters))

    const {results} = userSearchStore

    if (results == null) {
        return <Loader/>
    }
    const {users, updatedMinutesAgo} = results

    const rowsPerPage = keyLocalStorage.userRows()

    let updatedMessage = `Updated ${updatedMinutesAgo} minutes ago`
    if (updatedMinutesAgo === 0) {
        updatedMessage = "Up to date"
    } else if (updatedMinutesAgo === 1) {
        updatedMessage = "Updated 1 minute ago"
    }

    const {order, orderBy, page, username, role, manualPatreonTier, patrons, createSortHandler} = store

    let filteredUsers = users

    if (username.trim().length > 0) {
        filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(username.trim().toLowerCase()))
    }
    if (patrons) {
        filteredUsers = filteredUsers.filter(user => user.patreonTier != null)
    }
    if (role !== "") {
        filteredUsers = filteredUsers.filter(user => user.role === role)
    }
    if (manualPatreonTier !== "") {
        filteredUsers = filteredUsers.filter(user => user.manualPatreonTier === manualPatreonTier)
    }

    const sortedUsers = sortUsers(filteredUsers, orderBy, order)

    return (
        <div
            style={{padding: spacing(4), display: "flex", justifyContent: "center"}}
        >
            <Paper style={{width: "100%", maxWidth: 1600}}>
                <Toolbar
                    style={{
                        paddingTop: spacing(2),
                        paddingBottom: spacing(2),
                    }}
                >
                    {!screenStore.screenSizeXs() && (
                        <Typography variant={"h6"}>
                            Users
                        </Typography>
                    )}
                    <div style={{flexGrow: 1}}/>
                    {userStore.isAdmin && (
                        <Button
                            style={{marginRight: spacing(2)}}
                            onClick={userSearchStore.searchAllUsers}
                        >
                            Search All
                        </Button>
                    )}
                    <TextField
                        label={"Username"}
                        value={username}
                        onChange={event => store.username = event.target.value}
                        variant={"outlined"}
                        style={{marginRight: spacing(2)}}
                    />
                    {userStore.isAdmin && (
                        <>
                            <FormControl style={{width: 120, marginRight: spacing(2)}}>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={role}
                                    onChange={event => store.role = event.target.value as (UserType | "")}
                                >
                                    <MenuItem value={""}/>
                                    <MenuItem value={UserType.USER}>User</MenuItem>
                                    <MenuItem value={UserType.CONTENT_CREATOR}>Content Creator</MenuItem>
                                    <MenuItem value={UserType.ADMIN}>Admin</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl style={{width: 120, marginRight: spacing(2)}}>
                                <InputLabel>Manual Patreon</InputLabel>
                                <Select
                                    value={role}
                                    onChange={event => store.manualPatreonTier = event.target.value as (PatreonRewardsTier | "")}
                                >
                                    <MenuItem value={""}/>
                                    <MenuItem value={PatreonRewardsTier.NOTICE_BARGAINS}>Notices Bargains</MenuItem>
                                    <MenuItem value={PatreonRewardsTier.SUPPORT_SOPHISTICATION}>Purchases the Paradigm</MenuItem>
                                    <MenuItem value={PatreonRewardsTier.MERCHANT_AEMBERMAKER}>Merchant Aembermaker</MenuItem>
                                    <MenuItem value={PatreonRewardsTier.ALWAYS_GENEROUS}>Always Generous</MenuItem>
                                </Select>
                            </FormControl>
                        </>
                    )}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={patrons}
                                onChange={event => store.patrons = event.target.checked}
                            />
                        }
                        label={"Patrons"}
                    />
                </Toolbar>
                <TableContainer style={{width: "100%", overflowX: "auto"}}>
                    <Table style={{minWidth: 1000}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align={"right"}>
                                    Rank
                                </TableCell>
                                {(patrons ? headCellsWithPatrons : headCells).map(headCell => (
                                    <TableCell
                                        key={headCell.id}
                                        align={headCell.numeric ? "right" : "left"}
                                        sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : "asc"}
                                            onClick={createSortHandler(headCell.id)}
                                            hideSortIcon={true}
                                        >
                                            {headCell.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                {userStore.isAdmin && (
                                    <TableCell>
                                        Role
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedUsers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((user, idx) => (
                                    <TableRow key={user.username}>
                                        <TableCell align={"right"}>
                                            {(page * rowsPerPage) + idx + 1}
                                        </TableCell>
                                        <TableCell>
                                            <KeyLink style={{color: themeStore.defaultTextColor}} noStyle={true} to={Routes.decksForUser(user.username)}>
                                                {user.username}
                                            </KeyLink>
                                        </TableCell>
                                        {patrons && (
                                            <TableCell>
                                                {patronRewardLevelDescription(user.patreonTier)}
                                            </TableCell>
                                        )}
                                        <TableCell align={"right"}>
                                            {user.deckCount}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.forSaleCount}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.topSasAverage}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.highSas}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.lowSas}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.totalPower}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.totalChains}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.mavericks}
                                        </TableCell>
                                        <TableCell align={"right"}>
                                            {user.anomalies}
                                        </TableCell>
                                        {userStore.isAdmin && (
                                            <TableCell>
                                                <FormControl>
                                                    <InputLabel>Role</InputLabel>
                                                    <Select
                                                        value={user.role}
                                                        onChange={event => userStore.setUserRole(user.username, event.target.value as UserType)}
                                                    >
                                                        <MenuItem value={UserType.USER}>User</MenuItem>
                                                        <MenuItem value={UserType.CONTENT_CREATOR}>Content Creator</MenuItem>
                                                        <MenuItem value={UserType.ADMIN}>Admin</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <AddPatreon username={user.username}/>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div style={{display: "flex", alignItems: "center", flexDirection: screenStore.screenSizeXs() ? "column" : undefined}}>
                    <Typography style={{margin: spacing(2)}} variant={"body2"}>{updatedMessage}</Typography>
                    <div style={{flexGrow: 1}}/>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
                        component={"div"}
                        count={sortedUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={(event: unknown, newPage: number) => {
                            store.page = newPage
                        }}
                        onChangeRowsPerPage={(event: React.ChangeEvent<HTMLInputElement>) => {
                            keyLocalStorage.updateGenericStorage({
                                userRows: Number(event.target.value)
                            })
                            store.page = 0
                        }}
                    />
                </div>
            </Paper>
        </div>
    )
})

const sortUsers = (users: UserSearchResult[], orderBy: keyof UserSearchResult, order: SortOrder): UserSearchResult[] => {
    let filtered: UserSearchResult[] = users
    if (orderBy === "forSaleCount") {
        filtered = users.filter(user => user.forSaleCount > 0)
    } else if (orderBy === "patreonTier") {
        filtered = users.filter(user => user.patreonTier != null)
    } else if (orderBy === "topSasAverage") {
        filtered = users.filter(user => user.topSasAverage > 0)
    } else if (orderBy === "highSas") {
        filtered = users.filter(user => user.highSas > 0)
    } else if (orderBy === "lowSas") {
        filtered = users.filter(user => user.lowSas > 0)
    } else if (orderBy === "totalPower") {
        filtered = users.filter(user => user.totalPower > 0)
    } else if (orderBy === "totalChains") {
        filtered = users.filter(user => user.totalChains > 0)
    } else if (orderBy === "mavericks") {
        filtered = users.filter(user => user.mavericks > 0)
    } else if (orderBy === "anomalies") {
        filtered = users.filter(user => user.anomalies > 0)
    }
    const sorted = sortBy(filtered, [orderBy, "username"])
    if (order === "desc") {
        sorted.reverse()
    }
    return sorted
}

interface HeadCell {
    id: keyof UserSearchResult
    label: string
    numeric?: boolean
}

const headCells: HeadCell[] = [
    {id: "username", label: "Username"},
    {id: "deckCount", label: "Decks Owned", numeric: true},
    {id: "forSaleCount", label: "For Sale", numeric: true},
    {id: "topSasAverage", label: "Top 10 SAS", numeric: true},
    {id: "highSas", label: "Highest SAS", numeric: true},
    {id: "lowSas", label: "Lowest SAS", numeric: true},
    {id: "totalPower", label: "Total Power", numeric: true},
    {id: "totalChains", label: "Total Chains", numeric: true},
    {id: "mavericks", label: "Mavericks", numeric: true},
    {id: "anomalies", label: "Anomalies", numeric: true},
]

const headCellsWithPatrons = [...headCells]
headCellsWithPatrons.splice(1, 0, {id: "patreonTier", label: "Patreon Tier"})

class AddPatreonStore {

    @observable
    open = false

    @observable
    tier = PatreonRewardsTier.SUPPORT_SOPHISTICATION

    @observable
    expiresInDays = "90"

}

const AddPatreon = observer((props: { username: string }) => {
    const [store] = React.useState(new AddPatreonStore());

    return (
        <div>
            <Button
                onClick={() => store.open = true}
            >
                Add Patron
            </Button>
            <Dialog open={store.open} onClose={() => store.open = false}>
                <DialogTitle>Make Manual Patron</DialogTitle>
                <DialogContent>
                    <FormControl style={{width: 240, marginRight: spacing(2)}}>
                        <InputLabel>Tier</InputLabel>
                        <Select
                            value={store.tier}
                            onChange={event => store.tier = event.target.value as PatreonRewardsTier}
                        >
                            <MenuItem value={PatreonRewardsTier.NOTICE_BARGAINS}>Notices Bargains $1</MenuItem>
                            <MenuItem value={PatreonRewardsTier.SUPPORT_SOPHISTICATION}>Purchases the Paradigm $5</MenuItem>
                            <MenuItem value={PatreonRewardsTier.MERCHANT_AEMBERMAKER}>Merchant Aembermaker $10</MenuItem>
                            <MenuItem value={PatreonRewardsTier.ALWAYS_GENEROUS}>Always Generous $25</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Expire in days"
                        type="number"
                        value={store.expiresInDays}
                        onChange={event => store.expiresInDays = event.target.value}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => store.open = false} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            const expiresAsNumber = Number(store.expiresInDays)
                            const realExpires = expiresAsNumber < 1 ? undefined : expiresAsNumber
                            userStore.setManualPatreonTier(props.username, store.tier, realExpires)
                            store.open = false
                        }}
                        color="primary"
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
})
