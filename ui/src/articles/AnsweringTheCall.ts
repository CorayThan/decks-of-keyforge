/* tslint:disable:max-line-length */
import { Article, ArticleEntry, ArticleSection, ArticleType, EntryType } from "./Article"
import { firesa } from "./Authors"

const makeFinishesSection = (name: string, keyforgeFinishes: string[], otherFinishes: string[]): ArticleSection => {
    const entries: ArticleEntry[] = []
    entries.push({
        type: EntryType.PARAGRAPH,
        bold: true,
        text: "Notable KeyForge finishes",
    })
    entries.push(
        ...keyforgeFinishes.map(finish => ({
            type: EntryType.PARAGRAPH,
            text: finish
        }))
    )
    entries.push({
        type: EntryType.PARAGRAPH,
        bold: true,
        text: "Notable finishes in other games",
    })
    entries.push(
        ...otherFinishes.map(finish => ({
            type: EntryType.PARAGRAPH,
            text: finish
        }))
    )
    return {
        sectionTitle: name,
        entries
    }
}

const players = ["Daniel Lloyd / Pokelope", "Nathan Westlake / CorayThan", "Daniel Trujillo / Kiramode", "Yaro Tkatchenko"]

interface BestCardInfo {
    answer: string,
    card: string
}

const bestCard = (house: string, answers: BestCardInfo[], card: string): ArticleSection => {
    const entries: ArticleEntry[] = []
    answers.forEach((answer, idx) => {
        entries.push({
            type: EntryType.PARAGRAPH,
            bold: true,
            text: players[idx]
        })
        entries.push({
            type: EntryType.PARAGRAPH,
            text: `{{cardName: ${answer.card}}}`
        })
        entries.push({
            type: EntryType.PARAGRAPH,
            text: answer.answer
        })
    })
    return {
        sectionTitle: `Best ${house} card`,
        entries,
        cards: [card]
    }
}

export const answeringTheCall: Article = {
    author: firesa,
    title: "Answering the Call",
    subtitle: "The best Call of the Archons cards according to the best players",
    urlTitle: "answering-the-call",
    date: "May 21, 2019",
    type: ArticleType.EVALUATION,
    sections: [
        {
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "KeyForge has now been out for six months, which has given players time to familiarize themselves with the first set. Although there are always new things to learn, tournament players in particular have homed in on cards, card combinations, and houses they have found to be most consistently successful, and also unsuccessful.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "At the outset, Four Horsemen decks (maybe link a relevant example here or picture them) were seen as outrageously powerful, and very sought after. As players came to understand the power of control, particularly amber control through steal and capture effects, the metagame slowly shifted to where it is now.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "So just in time for the release of the next set, we sought to get the opinions of several KeyForge players, including Vault Tour winners, and players with similar accomplishments, on what they felt the best cards in each house were. Lending their views to this article are:"
                }
            ]
        },
        makeFinishesSection(
            "Daniel Lloyd / Pokelope",
            ["2nd Chicago Vault Tour, Many online tournament first place finishes on the Keyforge Events discord."],
            ["Keyforge is my first competitive game."]
        ),
        {
            sectionTitle: "Nathan Westlake / CorayThan of Team SAS of the Luxurious Playstyle",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Notable KeyForge finishes"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "At the Seattle Vault tour I had the good fortune to open a Logos, Shadows Untamed deck, and the bad fortune for it to be mediocre outside a couple powerful cards and combos. I managed to make top 16 with it by the skin of my teeth."
                },
                {
                    type: EntryType.DECK,
                    deckId: "81ec5178-b93f-419c-84dd-364084fbb94d",
                    deckName: "Berger, the Smuggler of The Bramble",
                    modal: true
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "At Vault Tour Denver I made a meta choice by bringing the LANS combo for day 1 (most of my opponents expected those be played day 2 instead). I went 5-1 with a concession to reach my 2nd deck. Most games ended with a LANS combo into permanent Control the Weak turns."
                },
                {
                    type: EntryType.DECK,
                    deckId: "4f34017e-646e-4380-8ff6-16b47ab72971",
                    deckName: "\"Galaxy\" Tycho, Manor Arrowsmith",
                    modal: true
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Day 2 I piloted a control deck that served me quite well. CTW and Ember Imps managed to slow down the combo decks enough to win those games, and massive Arise turns made games pretty easy."
                },
                {
                    type: EntryType.DECK,
                    deckId: "7b38b1f3-66e5-410a-86d5-85e74fac24e9",
                    deckName: "Bahamut \"Alp Larissa\" Heifetz",
                    modal: true
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Notable finishes in other games"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "I used to play World of Warcraft miniatures competitively. I won a Darkmoon Faire tournament and made it to the semi-finals in the World competition."
                },
            ]
        },
        makeFinishesSection(
            "Daniel Trujillo / Kiramode of Team Bouncing Deathquark",
            ["2019 - Top 4 Denver Vault Tour."],
            ["2011 Top 16 Worlds (Heroclix), 2012 ECCC Champion (Heroclix), 2016 Top 16 Worlds (Star Wars LCG), 2018 Top 16 Worlds (Star Wars LCG), 2018 Top 16 Worlds (Legend of the Five Rings)"]
        ),
        makeFinishesSection(
            "Yaro Tkatchenko",
            ["Winner of the Seattle Vault Tour"],
            ["Placed top 64 in a few MTG Grand prixs, top 8ed a number of other competitive MTG events, and won a Star City Games seasonal state championship in 2015.", "Still with us? Then let’s dive right into it!"]
        ),
        bestCard("Brobnar", [
                {
                    answer: "This card advocates good board control by using creatures played on the same turn. In some cases it can generate 3 amber by itself. It also allows house cheating by means of fighting, thus providing highly efficient board control.",
                    card: "Relentless Assault"
                },
                {
                    answer: "Champion’s Challenge is a great card. Gateway to Dis is a great card, and Champion’s Challenge lacks the downside and has an upside.",
                    card: "Champion’s Challenge"
                },
                {
                    answer: "Unfortunately it's a rare, but no other Brobnar card can warp the game in the same way the moment it hits the table.",
                    card: "Pile of Skulls"
                },
                {
                    answer: "This card gives so much versatility with board control and utilising your cards to their maximum potential.",
                    card: "Gauntlet of Command"
                },
            ], "https://cdn.keyforgegame.com/media/card_front/en/341_25_M6WXP2FVXH53_en.png"
        ),
        bestCard("Dis", [
                {
                    answer: "Turn control is very strong. In some cases you can get a free turn which is game changing. Also gives an amber which is a bit overkill.",
                    card: "Control the Weak"
                },
                {
                    answer: "Control the Weak can be one of the best cards in the game with the right support. It’s at its best when you can control the board or wipe your opponent’s board with Key to Dis or Gateway to Dis.",
                    card: "Control the Weak"
                },
                {
                    answer: "Probably Gateways to Dis. Arise, Control the Weak, and Restringuntus all have cases, but the most degenerate versions of those cards all involve leading with Gateway first.",
                    card: "Gateway to Dis"
                },
                {
                    answer: "Versatile card, not giving a player a good turn can win you the game as well.",
                    card: "Control the Weak"
                },
            ], "https://cdn.keyforgegame.com/media/card_front/en/341_55_7CJ4H2WMJWQ2_en.png"
        ),
        bestCard("Logos", [
                {
                    answer: "A powerful form of turn control which can allow you to safely forge a key in certain matchups. When played correctly, this card will force your opponent into making a suboptimal play on his/her next turn, allowing you to take advantage in the following turns.",
                    card: "Scrambler Storm"
                },
                {
                    answer: "Time Traveller/HFFS is probably the best card in the game. I’ll go with Phase Shift, though. Phase Shift is key to many Logos combos with other houses, and is one of the best cards to set up a large turn of a different house.",
                    card: "Help From Future Self"
                },
                {
                    answer: "Mother by a considerable margin. Works in every deck and is probably the best Creature in the game.",
                    card: "Mother"
                },
                {
                    answer: "Phase shift/Mother. Could  not decide between these two, Phase shift is the most versatile card that helps you empty out your hand and produce most interesting plays, Mother's effect is the best effect in the game, the worst house distribution in hand rises to 3/2/2 letting you always have a choice of playing at least three cards if not more.",
                    card: "Phase Shift"
                },
            ], "https://cdn.keyforgegame.com/media/card_front/en/341_145_65HF32HQGF2G_en.png"
        ),
        bestCard("Mars", [
                {
                    answer: "Card generates 1 amber and with a mars creature will either grant board control or additional amber. Most mars creatures have additional effects when fighting or reaping leading to more board control, amber control, or more amber in general. Good by itself and in many common situations.",
                    card: "Squawker"
                },
                {
                    answer: "Hypnotic Command, provided you have a reasonable number of creatures. This card has the raw stealing power of Bait and Switch, but unlike Bait and Switch it’s very difficult for an opponent to play around.",
                    card: "Hypnotic Command"
                },
                {
                    answer: "Squawker. Shatter Storm, Commpod, and Brain Stem Antenna are stronger in raw power, but are rarely found in duplicates, and not as versatile in all deck types the way Squawker is.",
                    card: "Squawker"
                },
                {
                    answer: "Card advantage is very strong when all cards are free to play!",
                    card: "Battlefleet"
                },
            ], "https://cdn.keyforgegame.com/media/card_front/en/341_178_7J9MG8W9F6GM_en.png"
        ),
        bestCard("Sanctum", [
                {
                    answer: "Although being a rare makes this card hard to come by, it is strong, preventing your amber from being stolen, countering one of the most consistent mechanics in the current meta.",
                    card: "The Vaultkeeper"
                },
                {
                    answer: "Good aember rush can beat anything in the game, and it’s hard to have too much of it in anything except in an extreme combo deck.",
                    card: "Virtuous Works"
                },
                {
                    answer: "All of their capture effects turn into a house of cards without Doorstep. It also plays well in control decks and racing decks.",
                    card: "Doorstep to Heaven"
                },
                {
                    answer: "Cards that are able to produce amber in big chunks can win you the game on the spot, this effect is a good compliment to a house that cares about having creatures in play.",
                    card: "Cleansing Wave"
                },
            ], "https://cdn.keyforgegame.com/media/card_front/en/341_230_848RC8PR567J_en.png"
        ),
        bestCard("Shadows", [
                {
                    answer: "By having Faygin in your deck you have a 100% chance of 2 or more Urchins. You get a minimum of 3 powerful cards that all synergize.",
                    card: "Faygin"
                },
                {
                    answer: "4+ Routine Job. My favorite Shadows card, though, is Master Plan. Shadows is always strong for holding your opponent off keys, but Master Plan can enable some pretty special combos.",
                    card: "Routine Job"
                },
                {
                    answer: "I hate the way this card works. What makes it broken is that you can play it after you forge a key to eliminate any serious counter play.",
                    card: "Bait and Switch"
                },
                {
                    answer: "Powerful effect that can swing the game from losing to winning, a card that needs to be played around.",
                    card: "Bait and Switch"
                },
            ],
            "https://cdn.keyforgegame.com/media/card_front/en/341_267_VHQ67J5MWQV5_en.png"),
        bestCard("Untamed", [
                {
                    answer: "One of the best key cheating cards in the game since it allows you to forge a key safely at only +1 the cost. Also synergies well with other untamed cards like regrowth, natures call, lost in the woods, nepenthe seed, and sometimes mimicry, sometimes allowing you to forge two keys in one turn at a low cost.",
                    card: "Chota Hazri"
                },
                {
                    answer: "Nature’s call hands down. Enables a lot of combos, and is very flexible. My favorite use is removing opponents’ creatures and filling their hand with multi-house cards to reduce future draws, but it’s also great with on-play ability creatures of your own.",
                    card: "Nature's Call"
                },
                {
                    answer: " Possibly the dirtiest removal card in the game given that Fear and Lights Out exist. What makes it stand out is that It can be used to combo with Play effects to blow opponents out or possibly win on the spot with Chota.",
                    card: "Nature's Call"
                },
                {
                    answer: "It's a second copy of your best card!",
                    card: "Nepenthe Seed"
                },
            ], "https://cdn.keyforgegame.com/media/card_front/en/341_329_387QVR6XM2M3_en.png"
        ),
        {
            sectionTitle: "Best House",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Daniel Lloyd / Pokelope",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Shadows}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If I were to craft the perfect deck, it would include Shadows, despite it likely not being the best in theory-crafted deck lists. I do think shadows is the most consistent in internal house synergy making it unlikely to have a bad shadows line-up. Most shadows cards well together, and this consistency makes it the best house.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Nathan Westlake / CorayThan",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Dis}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Dis is the best house for countering what other decks can do, and consistently winning against any other type of deck in my estimation. Control the Weak, Restringuntus, and things like Mind Barb can slow down the game and give you a chance against combo decks. It also has some of the best artifact control, creatures with great on-play effects, and also some of the best combo and board control cards in the game.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Daniel Trujillo / Kiramode",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Shadows}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Shadows because stealing amber is fundamentally broken as a mechanic and they have too many cards that do that.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Yaro Tkatchenko",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Shadows}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "It has the best source of amber control: stealing. If not for stealing, it would be hands down Untamed, amber production is unparalleled!",
                },
            ]
        },
        {
            sectionTitle: "Worst House",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Daniel Lloyd / Pokelope",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Mars}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Again, if I were theory crafting optimal decks, I would not say Mars is the worst. It can be difficult to find a deck containing a good Mars list since the cards need to work well together, and the lack of consistency makes it, in my opinion, the worst house.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Nathan Westlake / CorayThan",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Brobnar}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Brobnar rarely helps a deck work as a whole. Most other houses have cards that enable inter-house combos, like Phase Shift, Master Plan, Witch of the Wilds, Combat Pheromones, or Arise. The focus on fighting, also makes for an awkward house that’s good at doing the wrong things given that reaping helps you win.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Daniel Trujillo / Kiramode",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Logos}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "On balance it's Logos by a lot. At high levels they tend to place well which gives an impression that they are a strong house, but in non-combo decks they don't bring a lot to the table. Card draw is overrated in this game. Mother is incredibly overpowered. So players look at the house and say \" Combos are broken, Mother is the best creature, and card draw is great, this house must be good\".",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Yaro Tkatchenko",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{house: Mars}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Mars has a high density of situational cards and weak commons.",
                },
            ]
        },
        {
            sectionTitle: "Summary",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "There was some consensus and some disagreement on what constitute the best cards in each house. The players were consistent, however, in raising the point that synergy within one house, and across houses, is an important factor when judging the value of a card in a given deck. Cards like Control the Weak, Nature’s Call, and Bait and Switch received several mentions, while other powerful cards received less attention.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "One interesting theme among the best cards chosen was what benefit they provide. Almost all of them provide a type of control (aember, creature, or your opponent’s ability to play cards) or card advantage. Also, the majority are actions, although some are creatures and artifacts.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Perhaps the most straightforward consensus was on what House is best, with three of four agreeing it is Shadows due to its consistently high value cards that steal Aember. There was less agreement about which house is the worst, with only two players calling out Mars’ highly situation cards that require strong—yet rare—internal synergies to be effective.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If anything, this shows that even at the highest level of competition, personal preference can have a profound impact on deck selection, and in game decision-making. That said, the impact of Shadows as a house on the game of KeyForge as a whole is clearly evident.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "NOTE: Players were asked about cards in the context of the Archon format. Answers may differ when discussing other formats, such as Sealed, and this may be covered in a future article.",
                },
            ]
        },
        {
            sectionTitle: "What does this mean for Age of Ascension?",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "The second KeyForge set will have a number of challenges to overcome, including concerns that cards and decks may not be as powerful as those of the first set. Mechanics and interactions that stifle the power of Shadows and Dis cards will likely need to be present, while Mars and Brobnar will no doubt look to receive new cards that will improve their viability for competitive play.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Nonetheless it is an exciting time for new and “veteran” KeyForge players, and also reassuring to find that the game is far from solved, even at the highest level of competition. What will Age of Ascension add to the equation to shake things up? What are you hoping to see? With a 30th of May release date, we won’t have to wait long to find out!",
                },
            ]
        },
    ]
}
