/* tslint:disable:max-line-length */
import { Article, ArticleType, EntryType } from "./Article"
import { dunkoro } from "./Authors"

export const keyforgeRulesRewritten: Article = {
    author: dunkoro,
    title: "Unofficial Keyforge Rulebook",
    urlTitle: "unofficial-keyforge-rulebook",
    date: "July 10 2019",
    type: ArticleType.RULES, //not a thing yet
    sections: [
        {
            sectionTitle: "Written by Jakub “Dunkoro” Nosal in collaboration with Carson Guy and Joe Huber",
            entries: [
            ]
        },
        {
            sectionTitle: "Objective",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "The player that has three forged keys wins the game."
                }
            ]
        },
        {
            sectionTitle: "Beginning of the game",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "Both decks are sufficiently shuffled and placed in their respective deck areas face-down."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Æmber tokens, stun tokens, damage tokens, power tokens are placed within reach of both players, with both players agreeing to which tokens represent which of these."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Key tokens are placed to the side of the playing field, with their unforged side facing up."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Chain trackers are put within reach of either player, with a standard starting value of zero chains."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "The first player is randomly determined."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "The first player draws seven cards from their deck, while the second player draws six from theirs."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "This beginning draw might be modified with chains if either player begins with any."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Either player is allowed to, once, shuffle their hand into their deck and draw a new hand with one less card."
                },
            ]
        },
        {
            sectionTitle: "Turn Sequence",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "During any of the steps, when the game is in an Open Game State (no effects or events are in the process of being resolved) the Active Player may choose to go to the next step in order."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When the active player chooses to end their draw step, their turn ends and then their opponent's turn and their "Forge a Key" step begins."
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "1. Forge a key.\nIf the Active Player has six or more Æmber, they forge a key and lose six Æmber.",
                        "2. Choose a house\nThe Active Player chooses a house that is either on their archon's identity card or is a house of a card their control.\nAfter that, if the Active Player has any cards in their Archive, they can choose to add all of them to their hand.",
                        "3. Play, discard, or use cards of the chosen house\nThe active player can Play, Discard and/or Use cards that belong to the house chosen in step 2.\nThe first player during their first turn is only allowed to Play and/or Discard a total of one card.\nPlaying, Discarding and/or Using cards is only allowed in an Open Game State (no effects or events being currently resolving).",
                        "4. Ready Cards\nActive Player readies all cards they control",
                        "5. Draw cards\nActive Player draws cards until they have six cards in their hand."
                    ]
                }
            ]
        },
        {
            sectionTitle: "Playing a card",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "To play a card, a player chooses a card in their hand. Then they put it into play face-up on the field."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When they do so, they gain gain 1 Æmber for each Æmber symbol printed on the top left of the card, before any appropriate When effects."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Creatures get put into play into their controller’s battleline, at either Flank, Exhausted. Artifacts get put into play Exhausted."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Upgrades get put into play attached to any Creature in play. An Upgrade can’t be played if there is no creature to attach it to."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Actions get put into play, and after they have been played, get put into the discard pile, after any appropriate effects."
                }
            ]
        },
        {
            sectionTitle: "Discarding a card",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "To discard a card, the active player chooses a card from their hand and puts it into their discard pile."
                }
            ]
        },
        {
            sectionTitle: "Using a Card",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "You can't use a card that's not Ready. (overrides Golden Rule)"
                }, 
                {
                    type: Type.PARAGRAPH,
                    text: "A Player can only use the Creatures or Artifacts they control."
                }, 
                {
                    type: Type.PARAGRAPH,
                    text: "If a card effect allows a player to play or use another card (or to fight or to reap with a card), the chosen card may belong to any house unless the effect specifically states otherwise."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Using a Creature"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "To use a Creature, the Active Player chooses a Friendly Creature and exhausts it."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When they do, they choose to Reap or Fight with the creature or use their Action or Omni ability."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "If they Fight, they also choose an Enemy Creature the Creature they're using will be fighting. Then, trigger the appropriate Effect."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Using an Artifact"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "To use an Artifact, the Active Player chooses a Friendly Artifact and exhausts it."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When they do, they choose to Action or Omni."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Then, trigger the appropriate effect."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Reap"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "All Creatures can Reap."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When they do, they choose to Action or Omni."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When a creature Reaps, the Active Player gains 1 Aember."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Fight"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When a creature Fights, both the creature being used (the fighting creature) and the Opposing Creature (the creature that's fought) deal damage to one another equal to their power simultaneously."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Action"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Only Creatures or Artifacts with an Action ability can use Action."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When the Active Player uses an Action ability, resolve all of the Action abilities of that card sequentially."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Omni"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Only Creatures or Artifacts with an Omni ability can use Omni."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When the Active Player uses an Omni ability, resolve all of the Omni abilities of that card sequentially."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "A player can use friendly Omni effects even if the card doesn't belong to the Active House."
                }
            ]
        },
        {
            sectionTitle: "Key Rules",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "The Golden Rule"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "If the text of a card directly contradicts the text of the rules, the text of the card takes precedence."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Board Rule"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "No effect can trigger outside of the field of play."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Active Player Chooses"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Whenever there's any choice whatsoever to make, the active player makes that choice."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Card Placement"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Creatures are placed in a battleline."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Artifacts are placed behind creatures, closer to the cards' controller."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Upgrades are placed under the creature they are attached to."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Exhausted Creatures and Artifacts are sideways, while Ready ones are upright, facing their controller."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Rule of Six"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Neither player is allowed to do a combination of Playing and/or Using any number of cards that share the same name more than six times during a turn."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Resolve as much as you can"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "While resolving an effect, resolve as much of the effect as can be resolved, and ignore any parts of the effect that cannot be resolved."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "A player can usually choose any target for any effect, even one that the specific effect would not do anything against that specific target."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When a card has specific requirements to its effect, the player can only target cards that meet these requirements."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effect Scope"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Card effects can only affect cards that are on the field at the time of the effect's activation, unless specifically mentioned otherwise."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Can’t vs Must/May"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "If two card effects are simultaneously instructing a player that they “can’t” do something and that they “must” or “may” do the same thing, the “can't” effect takes precedence."
                }
            ]
        },
        {
            sectionTitle: "Chains",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "Whenever a player gains a chain, they increase the number of chains tracked on the chain tracker."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "At the opening draw of the game and whenever a player would draw cards up to their hand size, draw fewer cards instead, the amount of which depends on current chains amount, and if they did, they lose a chain."
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "1-6   chains: 1 fewer",
                        "7-12  chains: 2 fewer",
                        "13-18 chains: 3 fewer",
                        "19-24 chains: 4 fewer"
                    ]
                }
            ]
        },
        {
            sectionTitle: "Effect and Events",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "Everything that happens during the game is either an event or an effect."
                },
            ]
        },
        {
            sectionTitle: "Event",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Events can either happen because of a player action (Discarding, Using or Playing a card) or as a result of specific timings (Forging Keys, Choosing Houses, Picking up Archives, Readying Cards or Drawing cards) or as a result of current gamestate (Destroying creatures because of damage, dealing damage in a fight, gaining Æmber from reaping) or as a result of Effects."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Event structure"
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "1. Event is triggered. This can happen either because of a step change, an effect or another event triggering the Event or a player manually triggering it (Discarding, Using or Playing cards).",
                        "2. Trigger all Before triggers for that Event in order.",
                        "3. Resolve the Event.",
                        "4. Trigger all When triggers for that Event in order.",
                        "5. Trigger all After triggers for that Event in order.",
                        "6. Finish the Event."
                    ],
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
            ]
        },
        {
            sectionTitle: "Effect",
            entries: [
                {
                    type: Type.PARAGRAPH,
                    text: "Effects are everything that happens as a result of card text."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Some effects can be made up of multiple smaller effects. Each of these smaller effects is signified by a separate verb and they need to be triggered in the order in which they appear on the card."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "“To”, “If you do” effects require the proceeding effect to resolve in full in order to proceed to the following effect, otherwise the latter doesn’t trigger."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effect types"
                },
                {
                    type: Type.PARAGRAPH,
                    noPad: true,
                    text: "Continuous"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Effects which work at all times. No need to resolve them, ever."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Examples; {{cardName: Mother}}. {{cardName: Annihilation Ritual}}, {{cardName: Groggins}}."
                },
                {
                    type: Type.PARAGRAPH,
                    noPad: true,
                    text: "Trigger"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Effects which have a trigger and get resolved one by one."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Examples; {{cardName: Soul Snatcher}}. {{cardName: Hunting Witch}}, {{cardName: Bait & Switch}}."
                },
                {
                    type: Type.PARAGRAPH,
                    noPad: true,
                    text: "Lingering"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Continuous effects created by Trigger effects. They get created with a trigger effect and remain in effect until the described situation or time occurs. It’s possible for a lingering effect to create further trigger effects."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Examples; {{cardName: Library Access}}. {{cardName: Restringuntus}}, {{cardName: Spectral Tunneler}}, {{cardName: Uxlyx Zookeeper}}, {{cardName: Foggify}}."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Triggers"
                },
                {
                    type: Type.PARAGRAPH,
                    noPad: true,
                    text: "Before"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Examples: Destroyed, Leaves Play, "In order to""
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Whenever an event would happen and there are any Before triggers on that event, the event in question gets put on hold and the Before effect of Active Player's choice gets triggered."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Active Player then keeps resolving the Before effects one by one until there is no Before effect left that didn’t get triggered yet, at which point they proceed with the original event."
                },
                {
                    type: Type.PARAGRAPH,
                    noPad: true,
                    text: "When"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Examples: “Each time”, "Whenever”, “At (X time)”"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Immediately after an event happened and there are any When triggers on that event, the When effect of Active Player's choice gets triggered."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Active Player then keeps triggering the When effects one by one until there is no When effect left that didn’t get resolved yet."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "All available When effects need to finish resolving before one can proceed to appropriate After effects."
                },
                {
                    type: Type.PARAGRAPH,
                    noPad: true,
                    text: "After"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Examples: Play, Reap, Fight"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "After an event happened and there are any After triggers on that event, the After effect of Active Player's choice gets triggered."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Active Player then keeps triggering the After effects one by one until there is no After effect left that didn’t get resolved yet."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effects within effects"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "When one effect causes another one to trigger, the original one gets put on hold while the latter one triggers and resolves, alongside with all associated triggers (Before, When and After), before the original effect continues resolving."
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effect structure"
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "A. Effect is triggered. This is where the Active Player declares targets, if any.",
                        "B. Resolve the Effect itself. This might cause other Effects or Events to trigger, put the original Effect on hold until all of them resolve.",
                        "C. Finish resolving the Effect."
                    ],
                },
                {
                    type: Type.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Target"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "Target(s) must be chosen at the beginning of resolution of the Effect. (step A)"
                },
                {
                    type: Type.PARAGRAPH,
                    text: "If an effect says to affect “Each” card, it targets each card that meets the criteria at the time it is triggered."
                },
                {
                    type: Type.PARAGRAPH,
                    text: "If a card says a more generic statement that affects the enemy or their cards without saying “Each”, it affects them without targeting, potentially also affecting cards that enter the field afterwards."
                },
            ]
        },
    ]
}
