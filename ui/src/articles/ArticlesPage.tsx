import { Divider, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { KeyDrawer, keyDrawerStore } from "../components/KeyDrawer"
import { keyTopbarStore } from "../components/KeyTopbar"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { UnstyledHashLink } from "../generic/UnstyledLink"
import { uiStore } from "../ui/UiStore"
import { answeringTheCall } from "./AnsweringTheCall"
import { Article, ArticleType } from "./Article"
import { ArticleView } from "./ArticleView"
import { daercArts } from "./DaercArts"
import { whatsTheRush } from "./WhatsTheRush"

interface ArticlesPageProps extends RouteComponentProps<{ urlTitle?: string }> {
}

@observer
export class ArticlesPage extends React.Component<ArticlesPageProps> {

    constructor(props: ArticlesPageProps) {
        super(props)
        uiStore.setTopbarValues("Articles", "Articles", "Learn strategy and evaluation")
    }

    componentDidMount(): void {
        keyTopbarStore.displayLeftHamburger = true
    }

    componentWillUnmount(): void {
        keyTopbarStore.displayLeftHamburger = false
        keyDrawerStore.open = false
    }

    render() {
        const urlTitle = this.props.match.params.urlTitle
        let articles = allArticles
        let snippet = true
        if (urlTitle) {
            articles = allArticles.filter((article) => article.urlTitle === urlTitle)
            snippet = false
        }
        return (
            <div style={{display: "flex"}}>
                <KeyDrawer width={240} hamburgerMenu={true}>
                    <List>
                        <ListSubheader>
                            Strategy
                        </ListSubheader>
                        <ArticleLinksForType type={ArticleType.STRATEGY}/>
                        <Divider style={{marginTop: spacing(2)}}/>
                        <ListSubheader>
                            Evaluation
                        </ListSubheader>
                        <ArticleLinksForType type={ArticleType.EVALUATION}/>
                    </List>
                </KeyDrawer>
                <div style={{margin: spacing(4), display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
                    {articles.map((article: Article, idx: number) => <ArticleView article={article} snippet={snippet} key={idx}/>)}
                </div>
            </div>
        )
    }
}

export const allArticles = [answeringTheCall, whatsTheRush, daercArts]
export const latestTwoArticles = allArticles.slice(0, 2)

const ArticleLinksForType = (props: { type: ArticleType }) => {
    return (
        <>
            {
                allArticles
                    .filter((article: Article) => article.type === props.type)
                    .map((article: Article) => (
                        <UnstyledHashLink
                            to={`${Routes.articles}#${article.urlTitle}`}
                            scroll={
                                el => {
                                    el.scrollIntoView(true)
                                    window.scrollBy(0, -80)
                                }
                            }
                            key={article.urlTitle}
                        >
                            <ListItem
                                button={true}
                            >
                                <ListItemText>
                                    {article.title}
                                </ListItemText>
                            </ListItem>
                        </UnstyledHashLink>
                    ))
            }
        </>
    )
}
