/* eslint-disable */
import { Article, ArticleType, EntryType } from "./Article"
import { bigZ } from "./Authors"

export const daercArts: Article = {
    author: bigZ,
    title: "The DAERC Arts of Deck Evaluation",
    urlTitle: "the-daerc-arts-of-deck-evaluation",
    date: "March 27, 2019",
    type: ArticleType.EVALUATION,
    sections: [
        {
            sectionTitle: "Deck Evaluation",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Before I get into my evaluation of SAS and AERC, I feel obligated to make the following statement.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "There is absolutely no replacement for playing games to measure a deck’s true potential. There are amazing decks out " +
                        "there that will not meet the criteria I look for. Just as there are decks that just do not seem to work even though " +
                        "every metric would indicate that they are amazing. Furthermore, if it just does not match your play style it is a bad deck for " +
                        "you… period. That said, let’s take a look at how you can use these systems to help you efficiently evaluate decks!",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Also, if you haven't already, read the about page section on SAS and AERC. It gives a basic rundown of how the systems work, " +
                        "which will be crucial for using my guide to evaluating decks with them.",
                },
                {
                    type: EntryType.LINK,
                    text: "SAS and AERC",
                    internalLink: "/about/sas"
                },
            ]
        },
        {
            sectionTitle: "Using SAS",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "SAS estimates the total power of the cards in a deck, and how the synergies and anti synergies affect the deck's quality, but it " +
                        "won't be right about every deck. Many decks have complex combos SAS doesn't take into account, or their component cards and " +
                        "synergies are very good, but they're missing a key overall trait, like sufficient Aember Control.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Example of false negative",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "This deck has a 63 SAS, but because of the particular combination of cards in Logos it has a high potential to Loop (draw your " +
                        "deck infinitely) at some point in the game putting it in a position to beat many decks of all tiers.",
                },
                {
                    type: EntryType.DECK,
                    deckId: "203ce092-56a0-4b36-99a2-1d95b7e456a0",
                    deckName: "Wadsworth, Imbrogliona Saggia"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Cards that make the magic happen: {{cardName: Library Access}}, {{cardName: Reverse Time}}, {{cardName: Phase Shift}}, " +
                        "{{cardName: Battle Fleet}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Cards that help: {{cardName: Labwork}}, {{cardName: Wild Wormhole}}, {{cardName: Ganymede Archivist}}, " +
                        "{{cardName: Biomatrix Backup}}, {{cardName: Zyzzix the Many}} ",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Example of false positive",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "This deck has 86 SAS and upon first glance has a whole bunch of amazing and exciting cards. However, it is sporting an Aember Control score of ZERO! With zero ability to affect your opponent’s aember, your opponent needs 18 aember to call ‘GG’ and that is likely to happen somewhat quickly.",
                },
                {
                    type: EntryType.DECK,
                    deckId: "9887c5f9-70c6-438a-8c95-06977a6c79ca",
                    deckName: "Quirky Viktor of the Palace"
                },
            ]
        },
        {
            sectionTitle: "The DAERC Arts",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "When I evaluate a non-Gimmick deck, I go through a checklist of elements that I consider important in KeyForge. Keep in mind my analysis of all of these scores is assuming the deck does not have some kind of special gimmick embedded in it and needs to win the normal way via collecting aember, controlling your opponent, and forging most of your keys during Step One - Forge a Key.",
                },
            ]
        },
        {
            sectionTitle: "Aember Control: A",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "The name of the game is forging Keys. You and your opponent are here to get into that pesky vault of unknown secrets and to achieve power, glory, and of course… that ‘W’!",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Aember Control is one of the most critical elements in this game. Your deck was designed by a computer that was programmed to establish and design combinations that play off of one another. If you cannot control your opponent’s aember long enough to execute those designed mechanisms, the deck itself will not be able to realize its potential in most scenarios.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "primary",
                    text: "A = 10 or Higher"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Additionally, it is important for most decks to have some form of aember control in all three houses. Games often enter a “next key wins” situation where you continually check each other back and forth. If you have a house that has an aember control score of 0, you will not be favored to come out of those situations on top.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "There are no hard minimums in my mind as other metrics can make up for them and some of that will be referenced later. However, I will lay out some cautionary metrics for each category as well.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "secondary",
                    text: "Danger Zone: A = 5 or lower"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Unless you are looking at a Gimmick or extremely fast Aember Rush deck with 2-3 Key Cheats, a sub-five A score is a deck that could potentially be beat by rather average opposing decks just by not having enough time to do what your deck wants to do. With a low A score even mediocre aember generating decks can beat you fast with a good draw.",
                },
            ],
            cards: ["https://cdn.keyforgegame.com/media/card_front/en/341_267_VHQ67J5MWQV5_en.png"]
        },
        {
            sectionTitle: "Expected Aember: E",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "primary",
                    text: "E = 20 or Higher"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Expected Aember is a huge benefit and honestly 20+ is a bit higher than most decks I end up fielding. But at twenty plus you " +
                        "are looking at the capacity to check your opponent almost every other turn starting on turns 3 -5 depending on the compilation " +
                        "of the score. Most decks will do great around 15+, but it takes a little more maneuvering to check your opponent. " +
                        "Also, with 20+ you do not have to put as much effort into playing around strong Aember Control other than "
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{cardName: Bait and Switch}} / {{cardName: Too Much to Protect}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "while at 15 or less you have to be a bit more concerned about cards that will drop you down for gaining a lot such as ",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{cardName: Doorstep to Heaven}}, {{cardName: Effervescent Principle}}, {{cardName: Shatter Storm}}, or others.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "secondary",
                    text: "Danger Zone: E = 10 or less"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "I want you to think about that for a moment. Ignoring board state and player decision, a deck with an E score of 10 will only " +
                        "generate 10 aember once you go through your 36 cards one time. Now it will obviously get more than 10 in that duration, but that " +
                        "is based on gameplay and decision points that exist for all other decks with higher E values as well. E less than 10 typically " +
                        "makes for decks that are hard to forge keys with and the goal is to forge keys and get wins.",
                },
            ],
            cards: ["https://cdn.keyforgegame.com/media/card_front/en/341_230_848RC8PR567J_en.png"]
        },
        {
            sectionTitle: "The aRt of aRtifice, R",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "This is one of the most tricky and hard to quantify metrics in the game. In fact it is so tricky that a lot of the other sites do not even reference it. However, it is a critical metric to have. Regardless of the number, you must always look for and locate how it is being generated so that you understand what form of artifact control you are looking at."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "primary",
                    text: "R = 2 or higher"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "I classify Artifact Control cards into three separate tiers based on their ultimate value in regards to winning a game."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Tier 1 R"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Artifact destruction is the gold standard for the R score. These are the cards you need to know exist and be able to look at for deck evaluation, picking between your own decks, and looking at your opponent’s list during pre-game.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Tier 2 R"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Artifact Use/Denial are Tier 2 R cards and are often just as useful and sometimes more useful than Tier 1 depending on the situation. However, there are times they may be useless or detrimental. Primary example is Nexus. Nexus is a fantastic card, however if you are playing against a skilled opponent there are some situations that will prevent Nexus from reaping.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{cardName: Nexus}}",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "Tier 3 R"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Tier 3 artifact control is basically everything else. Again, sometimes these can be great and they definitely should account toward the R score, but this category is the reason why you MUST look to see what is deriving the R. Cards in this category typically are not going to stop you from getting wrecked by some of the most dangerous artifacts in the game.",
                },
            ],
            cards: [
                "https://cdn.keyforgegame.com/media/card_front/en/341_313_XW5J3RPG585M_en.png",
            ]
        },
        {
            entries: [
                {
                    type: EntryType.TABLE,
                    tableHeaders: ["House", "Tier 1", "Tier 2", "Tier 3", "Total"],
                    tableRows: [
                        ["{{house: Brobnar}}", "", "{{cardName: Barehanded}}", "", "One"],
                        ["{{house: Dis}}", "{{cardName: Poltergeist}}", "{{cardName: Snudge}}", "{{cardName: Tentacus}}", "Three"],
                        ["{{house: Logos}}", "{{cardName: Neutron Shark}}", "{{cardName: Remote Access}}, {{cardName: Crazy Killing Machine}}", "{{cardName: Strange Gizmo}}", "Four"],
                        ["{{house: Mars}}", "{{cardName: EMP Blast}}", "", "", "One"],
                        ["{{house: Sanctum}}", "{{cardName: Gorm of Omm}}", "{{cardName: Whispering Reliquary}}", "", "Two"],
                        ["{{house: Shadows}}", "{{cardName: Sneklifter}}", "{{cardName: Nexus}}", "{{cardName: Customs Office}}", "Three"],
                        ["{{house: Untamed}}", "", "{{cardName: Grasping Vines}}", "", "One"],
                    ]
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "secondary",
                    text: "Danger Zone: Less than two Tier 1 / Tier 2 cards"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "R 2+ means that you have a solid chance of addressing Nepenthe Seed shenanigans and other devastating artifact combinations as long as your score is coming from Tier 1 or 2. Below a 2 and you are looking at a deck that may only have one answer to an artifact that could lose you the game. At an R of ZERO, you better have a mechanism of your own that can win VERY fast or there are many decks out there that can wreck you with their artifacts.",
                },
            ],
        },
        {
            sectionTitle: "Board / Creature Control, C",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "The ability to impose your will across the field of play is what C is all about. In many games when you are up and have your core Battle Line intact, you put your opponent fighting for their life (sometimes even early in the game). While I am not going to break out the C cards like I did for the R since so many things impact C in the game, I do want to state that it is always good to have at least one board clear of some kind in nearly any deck of any style. Unlike the drawbacks of having only 1 Tier 1/Tier 2 R card, it is normally perfectly fine to only have one board clear based on the natural flow of how most games unfold."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "primary",
                    text: "C = 15 or higher"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Honestly, C is not super high on my evaluation needs or criterion and I have seen many very effective decks with a sub 15 C. However, a C score below 15 is going to typically have a very tough time dealing with 20+ creature decks and there are a ton of those out there. Mass creature decks are fun to play and quite a few of them are also super effective in their own right. Even 15 - 18 creatures running Arise! with 6+ Dis creatures are going to be trouble with a sub 15 C score."
                },
            ],
            cards: [
                "https://cdn.keyforgegame.com/media/card_front/en/341_59_WW6PQP2CGM8H_en.png",
            ]
        },
        {
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "secondary",
                    text: "Danger Zone: C = 7 or less"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "I came across this number the hard way when I bought a deck that I thought was going to be amazing. Scienmetric, the Egghead Navigator was one of the first decks I bought off of Decksofkeyforge.com and that 18.5 aember control score made my eyes light up. The current deck I was running was a 10.5 or 11 and I thought “wow”!",
                },
                {
                    type: EntryType.DECK,
                    deckId: "f429f690-8794-40ab-831f-53f214235431",
                    deckName: "Scienmetric, the Egghead Navigator"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "This deck gets swarmed relatively easily. It can still pull out some wins and can even beat some really good decks, but even a 14-16 creature deck without creature recovery mechanics can easily establish early board control. It even has some meaty creatures of its own with double Krump and Shadow Self, but having zero answers to a lot of big bodies and no solution to a bunch of elusives is rough.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "This goes back to the original note: one board wipe is fairly important to most decks. Occasionally the situation gets out of control and you need that reset button.",
                },
            ]
        },
        {
            sectionTitle: "All about the D",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Here it is! My favorite metric, The D!"
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    text: "The answer to so many questions:"
                },
                {
                    type: EntryType.PARAGRAPH,
                    italic: true,
                    text: "Will I get to the critical card that makes my deck work? " +
                        "How often am I going to see all of my cards? " +
                        "What is the likeliness that I will be able to pull off this combo? " +
                        "Are chains going to wreck me? " +
                        "Can I get this deck to Power Level Two? How about Three?"
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "primary",
                    text: "D = 9 or higher"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "At a D score of 9 or higher, I found that this is the threshold in which you can have a great deal of confidence that you will see your entire 36 card deck every game and, in many cases, more than once. Having the capacity to cycle your entire deck means less chance of bad draws affecting your game and a better chance of hitting certain combos that are critical for your deck to succeed."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Even more importantly at 9+ D you are looking at a deck that is much less affected by chains. For the most part you won’t even notice the first six and even in the 7 - 11 range you will still be able to move through your deck, see your cards, and execute most of what you were doing before."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "secondary",
                    text: "Danger Zone: D = 3 or less"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Decks with a D score of 3 or less run a very real chance of going the course of a game and not seeing all their cards since there are many decks that push the pace of the game to dictate a quicker victory for one of the players. This can be critically bad when that Arise! you were counting on is the last card in your deck or your only artifact control card is buried at the bottom and your opponent has Nepenthe Seed in play."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "{{cardName: Arise!}}, {{cardName: Nepenthe Seed}}"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Important to note, some decks play very efficiently even with a low D score and, in unchained environments, they are amazing. Those same decks start to feel the effects of having a low D once you put three or four chains on them."
                },
            ],
            cards: [
                "https://cdn.keyforgegame.com/media/card_front/en/341_115_4J2C745JC5V2_en.png",
            ]
        },
        {
            sectionTitle: "\"CREATURE POWER!\", P",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "I commented on not using P as part of my evaluation earlier, but I do evaluate based on a highly related metric: number of creatures in a deck (which obviously directly impacts the P value). So, for the most part, the higher the P the more creatures there are."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "primary",
                    text: "Number of Creatures = 16 to 20"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "It may surprise some players, but there is such a thing as too many creatures. There are many great actions in this game and they all provide immediate effects. Every creature that takes a slot outside of the Play Effect creatures and Speed Sigil shenanigans are delayed. At 16 to 20 creatures, I feel like I can regularly utilize my Battle Line to reap, fight, and establish board presence. Mass creature decks are a lot of fun and definitely can be really tough to contend with, but your opponent always having the knowledge of what they need to deal with is quite a big benefit to them when playing highly skilled players. And as stated earlier, competitive players bring board wipe."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    color: "secondary",
                    text: "Danger Zone: 13 or fewer creatures"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "There are a lot of very effective racing decks out there with 13 or less creatures. But, outside of those having 13- creature count makes it very hard to control the game state. You will find yourself calling houses without reap opportunities, playing one creature while you only have a few out, possibly unable to play an upgrade, among various other negative situations."
                },
            ],
            cards: [
                "https://cdn.keyforgegame.com/media/card_front/en/341_205_GPCHG3XCV2MV_en.png",
            ]
        },
        {
            sectionTitle: "Wrap-up",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "With all that in play I am happy to share a search that take this all into account. Currently (3/27/19), only 26 registered decks hit the gold standard of all identified desired metrics."
                },
                {
                    type: EntryType.LINK,
                    internalLink: "/decks?constraints=amberControl-MIN-10&constraints=expectedAmber-MIN-20&constraints=artifactControl-MIN-2&constraints=creatureControl-MIN-15&constraints=efficiency-MIN-9&constraints=creatureCount-MIN-16&sort=ADDED_DATE",
                    text: "Gold Standard Search"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Although none of my decks hit this standard across all metrics, using this information and process I can more quickly evaluate whether a deck I am looking at will hold up competitively at my local tournament or online in the competitive crucible environment. Now the Vault Competitive Tier is an entirely different story. Top level events are so new everything is speculation at this point. At the time of this write-up there has only been one non-Sealed Archon Main Event winner:"
                },
                {
                    type: EntryType.LINK,
                    internalLink: "/decks/c9f2d4d2-e439-4720-a814-65a363420c94",
                    text: "Go Rachel!"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Her deck hits 5 out of 6 indicators in my evaluation process and the one it misses is C and that is not in the critical range."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "I could talk about deck evaluation for a long time, but this is already a lot to digest.  There will be plenty more in future articles."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Happy Forging and see you all in the Crucible!"
                },
            ],
            cards: [
                "https://cdn.keyforgegame.com/media/card_front/en/341_153_X83CX7XJ5GRX_en.png",
            ]
        },
    ]
}
