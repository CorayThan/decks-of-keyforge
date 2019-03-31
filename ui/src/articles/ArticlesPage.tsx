import { observer } from "mobx-react"
import * as React from "react"
import { RouteComponentProps } from "react-router"
import { spacing } from "../config/MuiConfig"
import { UiStore } from "../ui/UiStore"
import { Article } from "./Article"
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

    render() {
        const urlTitle = this.props.match.params.urlTitle
        let articles = allArticles
        if (urlTitle) {
            articles = allArticles.filter((article) => article.urlTitle === urlTitle)
        }
        return (
            <div style={{margin: spacing(4), display: "flex", flexDirection: "column", alignItems: "center"}}>
                {articles.map((article: Article, idx: number) => <ArticleView {...article} key={idx}/>)}
            </div>
        )
    }
}

export const allArticles = [whatsTheRush, daercArts]
