import {
    Button,
    Card,
    CardContent,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { CardAsLine } from "../cards/CardSimpleView"
import { cardStore } from "../cards/CardStore"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { SimpleDeckView } from "../decks/SimpleDeckView"
import { UnstyledLink } from "../generic/UnstyledLink"
import { House } from "../houses/House"
import { HouseImage } from "../houses/HouseBanner"
import { KeyButton } from "../mui-restyled/KeyButton"
import { LinkButton } from "../mui-restyled/LinkButton"
import { screenStore } from "../ui/ScreenStore"
import { Article, ArticleEntry, ArticleSection, EntryType, MuiColors } from "./Article"

interface ArticleViewProps {
    article: Article
    snippet?: boolean
}

@observer
export class ArticleView extends React.Component<ArticleViewProps> {

    @observable
    bioOpen = false

    @observable
    collapsed = true

    constructor(props: ArticleViewProps) {
        super(props)
        this.collapsed = !!props.snippet
    }

    render() {
        const {article} = this.props
        const {title, subtitle, urlTitle, date, sections, author} = article
        const link = Routes.articlePage(urlTitle)

        return (
            <Card
                style={{
                    maxWidth: 800,
                    marginBottom: spacing(4),
                }}
                id={urlTitle}
            >
                <Dialog
                    open={this.bioOpen}
                    onClose={() => this.bioOpen = false}
                >
                    <DialogTitle>{author.name}</DialogTitle>
                    <DialogContent>
                        {author.bio.map((bio, idx) => (
                            <DialogContentText style={{marginTop: idx === 0 ? 0 : spacing(1)}} key={idx}>
                                {bio}
                            </DialogContentText>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <LinkButton color="primary" to={Routes.userProfilePage(author.username)}>
                            {author.name}'s Profile
                        </LinkButton>
                        <div style={{flexGrow: 1}}/>
                        <Button onClick={() => this.bioOpen = false} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <CardContent>
                    <Collapse in={!this.collapsed} collapsedHeight={"400px"}>
                        <UnstyledLink to={link}>
                            <Typography variant={"h3"} color={"primary"} style={{marginBottom: spacing(2)}}>
                                {title}
                            </Typography>
                        </UnstyledLink>
                        {subtitle ? (
                            <Typography variant={"h5"} color={"textSecondary"} style={{marginBottom: spacing(2), fontStyle: "italic"}}>
                                {subtitle}
                            </Typography>
                        ) : null}
                        <div style={{display: "flex", alignItems: "center", marginBottom: spacing(4)}}>
                            <img alt={"Writer Image"} src={author.img} style={{height: 48, borderRadius: "50%", marginRight: spacing(2)}}/>
                            <Typography>by</Typography>
                            <Button style={{marginTop: 4, marginLeft: spacing(1)}} onClick={() => this.bioOpen = true}>
                                {author.name}
                            </Button>
                            <div style={{flexGrow: 1}}/>
                            <Typography>{date}</Typography>
                        </div>

                        {sections.map((section: ArticleSection, idx: number) => {
                            const {sectionTitle, entries, cards} = section
                            return (
                                <div key={idx}>
                                    {sectionTitle == null ? null : (
                                        <Typography variant={"h5"} style={{marginBottom: spacing(2), marginTop: idx !== 0 ? spacing(4) : 0}}>
                                            {sectionTitle}
                                        </Typography>
                                    )}
                                    <div style={{display: "flex"}}>
                                        <div style={{flexGrow: 1}}>
                                            {entries.map((entry: ArticleEntry, entryIdx: number) => {
                                                switch (entry.type) {
                                                    case EntryType.PARAGRAPH:
                                                        return <Paragraph {...entry} key={entryIdx}/>
                                                    case EntryType.LINK:
                                                        if (entry.externalLink) {
                                                            return <ArticleExternalLink externalLink={entry.externalLink!} text={entry.text!} key={entryIdx}/>
                                                        } else {
                                                            return <ArticleInternalLink internalLink={entry.internalLink!} text={entry.text!} key={entryIdx}/>
                                                        }
                                                    case EntryType.UNORDERED_LIST:
                                                        return <UnorderedList {...entry} key={entryIdx}/>
                                                    case EntryType.DECK:
                                                        if (screenStore.screenSizeXs()) {
                                                            return <ArticleInternalLink internalLink={`/decks/${entry.deckId!}`} text={entry.deckName!}
                                                                                        key={entryIdx}/>
                                                        }
                                                        return <Deck deckId={entry.deckId!} key={entryIdx} name={entry.deckName!} modal={entry.modal}/>
                                                    case EntryType.TABLE:
                                                        if (screenStore.screenSizeXs()) {
                                                            return null
                                                        }
                                                        return <ArticleTable headers={entry.tableHeaders!} rows={entry.tableRows!} key={entryIdx}/>
                                                    default:
                                                        throw new Error("No case for entry type " + entry.type)
                                                }
                                            })}
                                        </div>
                                        {cards == null || screenStore.screenSizeXs() ? null : (
                                            <div style={{marginLeft: spacing(2)}}>
                                                {cards.map((card: string) => <SideCard cardImg={card} key={card}/>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </Collapse>

                </CardContent>
                {this.collapsed ? (
                    <div style={{display: "flex", justifyContent: "center", marginBottom: spacing(2)}}>
                        <div>
                            <KeyButton onClick={() => this.collapsed = false}>Read more</KeyButton>
                        </div>
                    </div>
                ) : null}
            </Card>
        )
    }
}

const SideCard = (props: { cardImg: string }) => (
    <div style={{padding: spacing(2), backgroundColor: "#DDDDDD"}}>
        <img
            style={{width: 232}}
            src={props.cardImg}
            alt={"Card."}
        />
    </div>
)

interface ArticleDeckProps {
    deckId: string
    name: string
    modal?: boolean
}

@observer
class Deck extends React.Component<ArticleDeckProps> {
    @observable
    open = false

    render() {
        const deck = <SimpleDeckView deckId={this.props.deckId!}/>

        if (!this.props.modal) {
            return (
                <div style={{display: "flex", justifyContent: "center", marginBottom: spacing(2)}}>
                    {deck}
                </div>
            )
        }
        return (
            <div>
                <Button color={"primary"} onClick={() => this.open = true} style={{marginBottom: spacing(2)}}>{this.props.name}</Button>
                <Dialog
                    open={this.open}
                    onClose={() => this.open = false}
                    maxWidth={"md"}
                >
                    <DialogContent style={{display: "flex", justifyContent: "center"}}>
                        {deck}
                    </DialogContent>
                    <DialogActions style={{display: "flex", justifyContent: "center"}}>
                        <Button color={"primary"} onClick={() => this.open = false} autoFocus={true}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const Paragraph = (props: ArticleEntry) => (
    <div style={{marginBottom: props.noPad ? undefined : spacing(2)}}>
        {bodyText(props.text!, props.bold, props.italic, props.color)}
    </div>
)

const ArticleExternalLink = (props: { externalLink: string, text: string }) => (
    <KeyButton
        color={"primary"}
        href={props.externalLink}
        target={"_blank"}
        style={{marginBottom: spacing(2)}}
    >
        {props.text}
    </KeyButton>
)

export const ArticleInternalLink = (props: { internalLink: string, text: string }) => (
    <LinkButton
        color={"primary"}
        to={props.internalLink!}
        style={{marginBottom: spacing(2)}}
    >
        {props.text}
    </LinkButton>
)

const UnorderedList = (props: ArticleEntry) => (
    <List>
        {props.listItems!.map((item: string, idx: number) => (
            <ListItem key={idx}>
                {bodyText(item)}
            </ListItem>
        ))}
    </List>
)

const bodyText = (text: string, bold?: boolean, italic?: boolean, color?: MuiColors) => {

    const nodes: React.ReactNode[] = []
    let textToParse = text
    while (textToParse.length > 0) {
        // log.debug(`Text to parse is ` + textToParse)
        const nextHouseIdx = textToParse.indexOf("{{house: ")
        const nextCardIdx = textToParse.indexOf(("{{cardName: "))
        let pushText
        let pushNode
        if (nextHouseIdx === -1 && nextCardIdx === -1) {
            pushText = textToParse
            textToParse = ""
        } else {
            // log.debug(`House idx: ${nextHouseIdx} card idx: ${nextCardIdx}`)
            const endIdx = textToParse.indexOf("}}")
            if (nextHouseIdx !== -1 && (nextHouseIdx < nextCardIdx || nextCardIdx === -1)) {
                pushText = textToParse.substring(0, nextHouseIdx)
                const houseName = textToParse.substring(nextHouseIdx + 9, endIdx)
                // log.debug(`House name is "${houseName}"`)
                pushNode = <HouseImage key={houseName} house={houseName as House} size={36} style={{marginRight: spacing(1)}}/>
            } else {
                pushText = textToParse.substring(0, nextCardIdx)
                const cardName = textToParse.substring(nextCardIdx + 12, endIdx)
                // log.debug(`Card name is "${cardName}"`)
                pushNode = (
                    <div key={cardName}>
                        <CardAsLine card={cardStore.fullCardFromCardName(cardName)!} marginTop={1} hideRarity={true}/>
                    </div>
                )
            }
            textToParse = textToParse.substring(endIdx + 2)
        }
        nodes.push(
            <Typography
                key={nodes.length}
                color={color}
                style={{fontWeight: bold ? "bold" : undefined, fontStyle: italic ? "italic" : undefined}}
            >
                {pushText}
            </Typography>
        )
        if (pushNode) {
            nodes.push(pushNode)
        }
    }

    return (
        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
            {nodes}
        </div>
    )
}

const ArticleTable = (props: { headers: string[], rows: string[][] }) => (
    <Table padding={"checkbox"} style={{marginBottom: spacing(2)}}>
        <TableHead>
            <TableRow>
                {props.headers.map(header => <TableCell key={header}>{header}</TableCell>)}
            </TableRow>
        </TableHead>
        <TableBody>
            {props.rows.map((rowColumns, idx) => (
                <TableRow key={idx}>
                    {rowColumns.map((cell, cellIdx) => <TableCell key={cellIdx}>{bodyText(cell)}</TableCell>)}
                </TableRow>
            ))}
        </TableBody>
    </Table>
)
