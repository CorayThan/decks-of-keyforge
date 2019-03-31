/* tslint:disable:max-line-length */
import { Article, EntryType } from "./Article"
import { dunkoro } from "./Authors"

export const whatsTheRush: Article = {
    author: dunkoro,
    title: "What's the Rush?",
    urlTitle: "whats-the-rush",
    date: "March 1, 2019",
    sections: [
        {
            sectionTitle: "Acknowledgement",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Before I begin, I want to mention that this article is in part inspired by a seminal article on Magic: The Gathering strategy “Who’s the Beatdown?” by Mike Flores. I’ve adapted some of that article’s concepts and added my own to address a similar strategic decision in KeyForge.",
                },
                {
                    type: EntryType.LINK,
                    text: "Who's the Beatdown?",
                    externalLink: "http://www.starcitygames.com/magic/fundamentals/3692_Whos_The_Beatdown.html"
                },
            ]
        },
        {
            sectionTitle: "What to do with that information?",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "The Rush deck usually wants to sprint through the game; gather as much amber as possible and leave its opponent’s slower, engine-based amber gain in the dust. You almost never want to fight, letting your opponent focus on that, since reaping will help you out rush your opponent.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When you’re rushing, you want aember right now. It’s often proper to gain as much as possible during the current turn and cycle towards more aember gain for future turns rather than doing multi-turn setups for maximum value. Never keep cards of the active house in your hand past the turn’s end.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Effects a Rush deck wants include: decreasing key cost, out-of-phase key forging, giving amber to both players, gaining aember for just playing cards.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Key Rush Cards",
                    bold: true,
                    noPad: true
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "{{house: Brobnar}} – {{cardName: Smith}}, {{cardName: Loot the Bodies}}, {{cardName: Looter Goblin}}",
                        "{{house: Dis}} – {{cardName: Soul Snatcher}}, {{cardName: The Terror}}, {{cardName: Dust Imp}}",
                    ],
                },
            ]
        },
    ]
}
