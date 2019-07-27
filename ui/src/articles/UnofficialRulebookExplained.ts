/* tslint:disable:max-line-length */
import { Article, ArticleType, EntryType } from "./Article"
import { randomjoe } from "./Authors"

export const rulebookExplained: Article = {
    author: randomjoe,
    title: "Unofficial Rulebook Explained",
    urlTitle: "unofficial-rulebook-explained",
    date: "July 28, 2019",
    type: ArticleType.RULES,
    sections: [
        {
            sectionTitle: "Greetings!",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "A few people on Team SAS have spent time over the past few months working hard to fully understand the rules of Keyforge and predict what judge rulings on interactions would be. As we worked through that, it became clear that we should talk to Carson Guy (Head Marshal for US Keyforge events) and get his feedback on our understanding. Through those conversations, we realized that it would be valuable to create a document to share with the community in order to help everyone prepare for competitive events, and avoid being surprised by card interactions that they might not have expected.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "These are our goals for this document:",
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "Have clear expectations of how the rules will be interpreted at US vault tours (We have not yet connected with other head marshals around the world).",
                        "Give players a framework to understand current rulings (Such as {{cardName: Archimedes}}).",
                        "Give players structures based on current rulings that can be extended out to answer questions that are not explicitly handled by the rules today.",
                    ]
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "A few examples of questions that we believe cannot be clearly and explicitly answered by the current FFG rules document alone:",
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "{{cardName: Shadow of Dis}}: It is clear that if a card enters play and is affected by Shadow of Dis, it would have a blank text box and not resolve “Play:” triggers or anything else (It has a blank text box). It is not clear whether it does affect new creatures entering play or not. It very much could, by placing an effect on game state or player (similar to {{cardName: Skippy Timehog}}), but there are rules sections that speak to cards also being unable to affect cards out of play. (Our current ruling is that {{cardName: Shadow of Dis}} does affect new creatures coming into play).",
                        "Replacement effects: The intent of {{cardName: Armageddon Cloak}}is clear. What is less clear is whether or not {{cardName: Soul Snatcher}} would make 1 AEmber if a creature with {{cardName: Armageddon Cloak}} is destroyed. Do replacement effects delete history, meaning that anything attempting to trigger on that effect no longer happen? Or does it replace the rest of the currently resolving effect? (Our current ruling is that replacement means the original event no longer happened, and is now the replacement effect, effectively turning off any triggers waiting to resolve on the replaced effect).",
                        "{{cardName: Bad Penny}} {{cardName: Stealer of Souls}}/{{cardName: Yxilo Bolter}} scenarios. (Current rulings are in official FAQ).",
                        "Whether {{cardName: Entropic Manipulator}} damage redistribution is affected by armor or not. Redistribute is not a defined word. The reminder text implies damage is caused, but reminder text is not rules text, and {{cardName: Entropic Manipulator}} is worded differently than something like Guardian Demon. (Redistribute is not dealing damage, so ignores armor and doesn’t trigger anything related to dealing/healing damage).",
                        "{{cardName: Gabos Longarms}} vs Elusive. This is an example of a situation where the reminder text implies one thing, but reading of the rules implies another. The FAQ has a question on Longarms, but it doesn’t answer the question of whether Longarms can attack an elusive creature and deal damage to another. (Our current ruling is that Longarms can attack an elusive creature, choose to deal damage to another creature, and will successfully do so)."
                    ]
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "We choose these examples intentionally, because for the moment all of them except the {{cardName: Bad Penny}} interactions have not received FAQ rulings, but these cards are being played at Vault Tours today, and judges need to rule on them and players need to understand what to expect and how their cards work.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To be explicitly clear, disagreeing with FFG positions and FAQ rulings is in no way a goal of this project. Throughout, the entire goal has been to build internally consistent models based off of what official information we do get. For all of the positions above, FFG could update the FAQ or rules tomorrow and change our understanding. In that scenario, we would update our understanding and ruleset to conform to FFG official position. Our intent is to have clear, community wide, tournament level understanding of how cards work in the absence of those rulings. Example 3 was included to be an example of a situation where the rules don’t give a clear answer, but the FAQ does give a clear answer, and we are able to build and expand off of that ruling to explain other card and rules interactions.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Because it is the basis, following the rules as defined by this document should produce all of the rulings described in the official FAQ in a step by step, much more comprehensive way.",
                },
                {
                    type: EntryType.LINK,
                    text: "The Rules Document",
                    externalLink: "https://decksofkeyforge.com/articles/unofficial-keyforge-rulebook"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "As part of this initiative, Carson has agreed to be present in a channel on our Discord server. Anyone is welcome to come and ask rules questions on that channel. Frequent questions may be collected into a FAQ of our own, or your questions and challenges may actually influence the thinking here and evolve this understanding of the rules.",
                },
                {
                    type: EntryType.LINK,
                    text: "Decks of Keyforge Discord",
                    externalLink: "https://discord.gg/fbSwr7e"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "As this is a community effort with many differing perspectives, full alignment may not always be possible. There is one situation that's not fully agreed upon currently;",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Carson believes that destruction caused by lethal damage needs to maintain lethal damage until the creature actually leaves play. This means that “Destroyed:” triggers, which process between a triggering event and cards actually leaving play, can heal creatures or make their power higher and prevent them from being destroyed due to no longer meeting the condition for being destroyed.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Our rules group couldn’t find alignment on this point, so we have not included it in the document. Since the core goal of this project is to give players clear expectations on how cards and situations will be ruled at Vault Tours, it needed to be communicated somewhere. On all points and understandings other than this specific one, players can expect judge rulings (at US Vault Tours specifically) to align with this document.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Thanks!",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "The current team for this project:"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Jakub Nosal is a member of team SAS-LP and a prior Magic and Yu Gi Oh judge. Jakub has done most of the heavy lifting on this project in terms of drafting the document and owning resolution on all of the details.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Joe Huber is a member of team SAS-LP. He is passionate about rules and the systems that go with them, with a history of professional card game design. He was excited about Keyforge from early on, and so (like many others) has closely watching rulings and FAQ evolution over time, and has puzzled over how to create internal consistency within those rulings and extend them to new situations not clearly covered by the rules or FAQ answers. Joe authored this article.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Carson Guy is the Head Marshal for US Vault Tour events. He and Joe frequently discuss rules questions as he generously judges Joe’s local chain bound events.",
                }
            ]
        }
    ]
}