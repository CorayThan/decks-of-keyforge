/* eslint-disable */
import { Article, ArticleType, EntryType } from "./Article"
import { dunkoro } from "./Authors"

export const whatsTheRush: Article = {
    author: dunkoro,
    title: "What's the Rush?",
    urlTitle: "whats-the-rush",
    date: "April 2, 2019",
    type: ArticleType.STRATEGY,
    sections: [
        {
            sectionTitle: "What is rush",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Most games of KeyForge come down to a simple comparison; one player is rushing towards the game’s end, while the other is the defender, wanting to stave off that aggression and prolong the game.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "I will refer to these two players as ‘Rush’ and ‘Control’, because these are the roles they fill in in the match.",
                },
            ]
        },
        {
            sectionTitle: "Why is this important?",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Realising whether you are supposed to be playing Rush or Control can make a huge difference in how the game plays out. If you misconstrue your role as Rush where it was supposed to be Control you will often get outraced. If you see yourself as Control while you were supposed to Rush you might find yourself out of resources as your opponent controls the game.",
                },
            ]
        },
        {
            sectionTitle: "Is my deck a Rush deck?",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Sadly, it is impossible to look at a deck and definitely define which side of the spectrum it remains at, as it’s always relative to the deck your opponent is playing.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    /* not sure if this will work, just experimenting as I don't know the full format :D */
                    italic: true,
                    text: "You should always evaluate the decks in a match in relation to one another. Don’t ask ‘how fast is this deck’ but ‘which deck is the faster one’.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "This is a big part of why being able to look at your opponent’s identity card at the beginning of an archon match is critical. It isn’t only about noticing meaningful cards to play around but also about seeing what kind of gameplay the deck prefers; closing out the game as quickly as possible or prolonging the game to outvalue the opponent.",
                },
            ]
        },
        {
            sectionTitle: "How to tell the difference?",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "In most games, having numerous efficient creatures is a clear sign of a deck poised to be the rusher, but that does not hold true for KeyForge.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "In fact it’s entirely the opposite; while in other games creatures are the way to finish a game quickly and actions are the way to stop them from doing that, in KeyForge creatures are the best way to win a slow game and actions help you rush keys. As a rule of thumb the deck with more creatures and artifacts is more likely to be the Control deck.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Why? Because creatures usually provide no immediate impact on amber when entering the field, but creatures with valuable “on play” effects provide immediate value, like actions. For more standard creature-centric decks, though, the goal is to slow down the game, because the more turns the game has the more reaping opportunities it provides.",
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
                        "{{house: Logos}} – {{cardName: Library Access}}, {{cardName: Timetraveller}}, {{cardName: Wild Wormhole}}",
                        "{{house: Mars}} – {{cardName: Squawker}}, {{cardName: Crystal Hive}}, {{cardName: “John Smyth”}}",
                        "{{house: Sanctum}} – {{cardName: Virtuous Works}}, {{cardName: Cleansing Wave}}, {{cardName: Glorious Few}}",
                        "{{house: Shadows}} – {{cardName: Ghostly Hand}}, {{cardName: Urchin}}, {{cardName: Treasure Map}}",
                        "{{house: Untamed}} – {{cardName: Hunting Witch}}, {{cardName: Dust Pixie}}, {{cardName: Chota Hazri}}",
                    ],
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "The Control deck wants to slow the game down, make sure there’s enough turns in the game so that their slower, more reliable value cards will prevail. They want to keep the board and reap with it, while using their actions to control opponent’s amber supply. And even though maximizing value is important, if you deny yourself draws, your value will suffer. As a result, only rarely keep cards in hand rather than play or discard them.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Effects a Control deck wants include: increasing key cost, skipping key-forging step, stealing, reducing amber of both players, conserving their cards to that they can provide optimal value, removing or otherwise controlling your opponent’s artifacts and creatures.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Key Control Cards",
                    bold: true,
                    noPad: true
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "{{house: Brobnar}} – {{cardName: Burn the Stockpile}}, {{cardName: Coward’s End}}, {{cardName: Iron Obelisk}}",
                        "{{house: Dis}} – {{cardName: Control the Weak}}, {{cardName: Lash of Broken Dreams}}, {{cardName: Succubus}}",
                        "{{house: Logos}} – {{cardName: Effervescent Principle}}, {{cardName: Scrambler Storm}}, {{cardName: Skippy Timehog}}",
                        "{{house: Mars}} – {{cardName: Grabber Jammer}}, {{cardName: Uxlyx the Zookeeper}}, {{cardName: Jammer Pack}}",
                        "{{house: Sanctum}} – {{cardName: The Vaultkeeper}}, {{cardName: Doorstep to Heaven}}, {{cardName: Numquid the Fair}}",
                        "{{house: Shadows}} – {{cardName: Bait and Switch}}, {{cardName: Miasma}}, {{cardName: Shadow Self}}",
                        "{{house: Untamed}} – {{cardName: Ritual of Balance}}, {{cardName: Bigtwig}}, {{cardName: Witch of the Eye}}",
                    ],
                },
            ]
        },
        {
            sectionTitle: "Quick lessons",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Always compare your opponent’s and your list before a game to figure out which one is the faster one, mostly looking at creature count.",
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If you’re the Rush, rush for the win, if you’re the Control, try your best to prolong the game and outvalue your opponent.",
                }
            ]
        },
        {
            sectionTitle: "Acknowledgement",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "This article is in part inspired by a seminal article on Magic: The Gathering strategy “Who’s the Beatdown?” by Mike Flores. " +
                        "I adapted some of that article’s concepts and added my own to address a similar strategic decision in KeyForge.",
                },
                {
                    type: EntryType.LINK,
                    text: "Who's the Beatdown?",
                    externalLink: "http://www.starcitygames.com/magic/fundamentals/3692_Whos_The_Beatdown.html"
                },
            ]
        },
    ]
}
