import { Divider, List, ListItem, ListItemText, ListSubheader } from "@material-ui/core"
import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { KeyDrawer, KeyDrawerStore } from "../components/KeyDrawer"
import { keyTopbarStore } from "../components/KeyTopbar"
import { spacing } from "../config/MuiConfig"
import { Routes } from "../config/Routes"
import { UnstyledHashLink } from "../generic/UnstyledLink"
import { UiStore } from "../ui/UiStore"
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
        UiStore.instance.setTopbarValues("Articles", "Articles", "Learn strategy and evaluation")
    }

    componentDidMount(): void {
        keyTopbarStore.displayLeftHamburger = true
    }

    componentWillUnmount(): void {
        keyTopbarStore.displayLeftHamburger = false
        KeyDrawerStore.open = false
    }

    render() {
        const urlTitle = this.props.match.params.urlTitle
        let articles = allArticles
        if (urlTitle) {
            articles = allArticles.filter((article) => article.urlTitle === urlTitle)
        }
        return (
            <div style={{display: "flex"}}>
                <KeyDrawer width={240} hamburgerMenu={true}>
                    <List>
                        <ListItem>
                            <ListSubheader>
                                Strategy
                            </ListSubheader>
                        </ListItem>
                        <ArticleLinksForType type={ArticleType.STRATEGY}/>
                        <Divider style={{marginTop: spacing(2)}}/>
                        <ListItem>
                            <ListSubheader>
                                Evaluation
                            </ListSubheader>
                        </ListItem>
                        <ArticleLinksForType type={ArticleType.EVALUATION}/>
                    </List>
                </KeyDrawer>
                <div style={{margin: spacing(4), display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1}}>
                    {articles.map((article: Article, idx: number) => <ArticleView {...article} key={idx}/>)}
                </div>
            </div>
        )
    }
}

export const allArticles = [whatsTheRush, daercArts]

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
