/* tslint:disable:max-line-length */
import { Article, ArticleType, EntryType } from "./Article"
import { dunkoro } from "./Authors"

export const whatsTheRush = {
    author: dunkoro,
    title: "What's the Rush?",
    urlTitle: "whats-the-rush",
    date: "July 10 2019",
    type: ArticleType.STRATEGY, //not a thing yet
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
                    type: EntryType.PARAGRAPH,
                    text: "The player that has three forged keys wins the game."
                }
            ]
        },
        {
            sectionTitle: "Beginning of the game",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Both decks are sufficiently shuffled and placed in their respective deck areas face-down."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Æmber tokens, stun tokens, damage tokens, power tokens are placed within reach of both players, with both players agreeing to which tokens represent which of these."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Key tokens are placed to the side of the playing field, with their unforged side facing up."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Chain trackers are put within reach of either player, with a standard starting value of zero chains."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "The first player is randomly determined."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "The first player draws seven cards from their deck, while the second player draws six from theirs."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "This beginning draw might be modified with chains if either player begins with any."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Either player is allowed to, once, shuffle their hand into their deck and draw a new hand with one less card."
                },
            ]
        },
        {
            sectionTitle: "Turn Sequence",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "During any of the steps, when the game is in an Open Game State (no effects or events are in the process of being resolved) the Active Player may choose to go to the next step in order."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When the active player chooses to end their draw step, their turn ends and then their opponent's turn and their Forge a Key step begins."
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "1. Forge a key.<br>If the Active Player has six or more Æmber, they forge a key and lose six Æmber.",
                        "2. Choose a house<br>The Active Player chooses a house that is either on their archon's identity card or is a house of a card their control.<br>After that, if the Active Player has any cards in their Archive, they can choose to add all of them to their hand.",
                        "3. Play, discard, or use cards of the chosen house<br>The active player can Play, Discard and/or Use cards that belong to the house chosen in step 2.<br>The first player during their first turn is only allowed to Play and/or Discard a total of one card.<br>Playing, Discarding and/or Using cards is only allowed in an Open Game State (no effects or events being currently resolving).",
                        "4. Ready Cards<br>Active Player readies all cards they control",
                        "5. Draw cards<br>Active Player draws cards until they have six cards in their hand."
                    ]
                }
            ]
        },
        {
            sectionTitle: "Playing a card",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "To play a card, a player chooses a card in their hand. Then they put it into play face-up on the field."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When they do so, they gain gain 1 Æmber for each Æmber symbol printed on the top left of the card, before any appropriate When effects."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Creatures get put into play into their controller’s battleline, at either Flank, Exhausted. Artifacts get put into play Exhausted."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Upgrades get put into play attached to any Creature in play. An Upgrade can’t be played if there is no creature to attach it to."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Actions get put into play, and after they have been played, get put into the discard pile, after any appropriate effects."
                }
            ]
        },
        {
            sectionTitle: "Discarding a card",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "To discard a card, the active player chooses a card from their hand and puts it into their discard pile."
                }
            ]
        },
        {
            sectionTitle: "Using a Card",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "You can't use a card that's not Ready. (overrides Golden Rule)"
                }, 
                {
                    type: EntryType.PARAGRAPH,
                    text: "A Player can only use the Creatures or Artifacts they control."
                }, 
                {
                    type: EntryType.PARAGRAPH,
                    text: "If a card effect allows a player to play or use another card (or to fight or to reap with a card), the chosen card may belong to any house unless the effect specifically states otherwise."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Using a Creature"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To use a Creature, the Active Player chooses a Friendly Creature and exhausts it."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When they do, they choose to Reap or Fight with the creature or use their Action or Omni ability."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If they Fight, they also choose an Enemy Creature the Creature they're using will be fighting. Then, trigger the appropriate Effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Using an Artifact"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To use an Artifact, the Active Player chooses a Friendly Artifact and exhausts it."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When they do, they choose to Action or Omni."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Then, trigger the appropriate effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Reap"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "All Creatures can Reap."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When they do, they choose to Action or Omni."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a creature Reaps, the Active Player gains 1 Aember."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Fight"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a creature Fights, both the creature being used (the fighting creature) and the Opposing Creature (the creature that's fought) deal damage to one another equal to their power simultaneously."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Action"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Only Creatures or Artifacts with an Action ability can use Action."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When the Active Player uses an Action ability, resolve all of the Action abilities of that card sequentially."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Omni"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Only Creatures or Artifacts with an Omni ability can use Omni."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When the Active Player uses an Omni ability, resolve all of the Omni abilities of that card sequentially."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "A player can use friendly Omni effects even if the card doesn't belong to the Active House."
                }
            ]
        },
        {
            sectionTitle: "Key Rules",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "The Golden Rule"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If the text of a card directly contradicts the text of the rules, the text of the card takes precedence."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Board Rule"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "No effect can trigger outside of the field of play."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Active Player Chooses"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Whenever there's any choice whatsoever to make, the active player makes that choice."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Card Placement"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Creatures are placed in a battleline."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Artifacts are placed behind creatures, closer to the cards' controller."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Upgrades are placed under the creature they are attached to."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Exhausted Creatures and Artifacts are sideways, while Ready ones are upright, facing their controller."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Rule of Six"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Neither player is allowed to do a combination of Playing and/or Using any number of cards that share the same name more than six times during a turn."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Resolve as much as you can"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "While resolving an effect, resolve as much of the effect as can be resolved, and ignore any parts of the effect that cannot be resolved."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "A player can usually choose any target for any effect, even one that the specific effect would not do anything against that specific target."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a card has specific requirements to its effect, the player can only target cards that meet these requirements."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effect Scope"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Card effects can only affect cards that are on the field at the time of the effect's activation, unless specifically mentioned otherwise."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Can’t vs Must/May"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If two card effects are simultaneously instructing a player that they “can’t” do something and that they “must” or “may” do the same thing, the “can't” effect takes precedence."
                }
            ]
        },
        {
            sectionTitle: "Chains",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Whenever a player gains a chain, they increase the number of chains tracked on the chain tracker."
                },
                {
                    type: EntryType.PARAGRAPH,
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
                    type: EntryType.PARAGRAPH,
                    text: "Everything that happens during the game is either an event or an effect."
                },
            ]
        },
        {
            sectionTitle: "Event",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Events can either happen because of a player action (Discarding, Using or Playing a card) or as a result of specific timings (Forging Keys, Choosing Houses, Picking up Archives, Readying Cards or Drawing cards) or as a result of current gamestate (Destroying creatures because of damage, dealing damage in a fight, gaining Æmber from reaping) or as a result of Effects."
                },
                {
                    type: EntryType.PARAGRAPH,
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
                    type: EntryType.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Events are everything that happens as a result of game rules."
                },
            ]
        },
        {
            sectionTitle: "Effect",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Effects are everything that happens as a result of card text."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Some effects can be made up of multiple smaller effects. Each of these smaller effects is signified by a separate verb and they need to be triggered in the order in which they appear on the card."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "“To”, “If you do” effects require the proceeding effect to resolve in full in order to proceed to the following effect, otherwise the latter doesn’t trigger."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effect types"
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Continuous"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Effects which work at all times. No need to resolve them, ever. All continuous effects modify how something else happens."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Examples; {{cardName: Mother}}. {{cardName: Annihilation Ritual}}, {{cardName: Groggins}}."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Trigger"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Effects which have a trigger and get resolved one by one. All trigger effects make something happen."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Examples; {{cardName: Soul Snatcher}}. {{cardName: Hunting Witch}}, {{cardName: Bait & Switch}}."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Lingering"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Continuous effects created by Trigger effects. They get created with a trigger effect and remain in effect until the described situation or time occurs. It’s possible for a lingering effect to create further trigger effects."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Examples; {{cardName: Library Access}}. {{cardName: Restringuntus}}, {{cardName: Spectral Tunneler}}, {{cardName: Uxlyx Zookeeper}}, {{cardName: Foggify}}."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Triggers"
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Before"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Examples: Destroyed, Leaves Play, 'In order to'"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Whenever an event would happen and there are any Before triggers on that event, the event in question gets put on hold and the Before effect of Active Player's choice gets triggered."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Active Player then keeps resolving the Before effects one by one until there is no Before effect left that didn’t get triggered yet, at which point they proceed with the original event."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "When"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Examples: 'Each time', 'Whenever', 'At (X time)'"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Immediately after an event happened and there are any When triggers on that event, the When effect of Active Player's choice gets triggered."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Active Player then keeps triggering the When effects one by one until there is no When effect left that didn’t get resolved yet."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "All available When effects need to finish resolving before one can proceed to appropriate After effects."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "After"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Examples: Play, Reap, Fight, Omega"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "After an event happened and there are any After triggers on that event, the After effect of Active Player's choice gets triggered."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Active Player then keeps triggering the After effects one by one until there is no After effect left that didn’t get resolved yet."
                },
                {
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Effects within effects"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When one effect causes another one to trigger, the original one gets put on hold while the latter one triggers and resolves, alongside with all associated triggers (Before, When and After), before the original effect continues resolving."
                },
                {
                    type: EntryType.PARAGRAPH,
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
                    type: EntryType.PARAGRAPH,
                    bold: true,
                    noPad: true,
                    text: "Target"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Target(s) must be chosen at the beginning of resolution of the Effect. (step A)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If an effect says to affect “Each” card, it targets each card that meets the criteria at the time it is triggered."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If a card says a more generic statement that affects the enemy or their cards without saying “Each”, it affects them without targeting, potentially also affecting cards that enter the field afterwards."
                },
            ]
        },
        {
            sectionTitle: "Glossary",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Active Player"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Active player is the one whose turn it currently is."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Active House"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Active House is the one chosen in step 2 of the turn sequence."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Adjacent"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "The creatures to the immediate left and right of a creature in a player’s battleline are Adjacent to it."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Æmber"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Whenever either player gains Æmber, they put that many Æmber tokens on their Archon card from the common pool."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Whenever either player loses Æmber, they put that many Æmber tokens to the common pool from their Archon card."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Alpha"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "A card with Alpha can only be played if the active player didn't Play, Use or Discard any cards during Step 3 of their turn yet."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Archive (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a player Archives a card, they take that card and put it into the Archives face-down.<br>If an effect doesn't specify where a card is supposed to be Archived from, it is archived from their hand."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Archives (Zone)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Archives is an out-of-play zone.<br>Each player can look at the cards in their own Archives."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Armor"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "All creatures have an Armor value. For most creatures, it's 0 (denoted as ~ on the card).<br>Before a creature with an Armor value would take damage, instead reduce the damage by the armor value.<br>Then reduce the Armor value by the amount of Damage prevented until the end of the turn.<br>A creature's Armor value can't be negative."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "As if you controlled it, As if it were yours"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If an effect instructs a player to do something with a card 'as if it were yours' or 'as if you controlled it',  the player is treated as the card's controller for the purposes of resolving the effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Assault"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Before a creature with Assault fights, deal Damage to the opposing creature equal to the value of Assault.<br>If this damage destroys the opposing creature, the Fight event stops at that time and doesn’t proceed further."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Capture"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Captured Æmber is taken from opponent's pool and put on a creature the capturing player controls.<br>If a creature's effect says to capture Æmber, that creature captures the Æmber.<br>When a creature with Æmber on it leaves play, all Æmber on it goes to the pool of the opponent of the creature’s controller, regardless of where the Æmber came from."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Control"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "All cards a player has played onto the field are under their control.<br>If a player takes control of a card that they didn’t already control, it's put into play under their control."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Damage"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Whenever damage is dealt to a creature, that many damage tokens are put on that creature.<br>If that creature has as much or more damage than its power, it is destroyed."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Deploy"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "A Creature with Deploy may be placed in between two creatures a player controls in addition to being able to be placed at the flanks when played."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Destroy (Event)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a card is destroyed, it is put into its owner's discard pile."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Destroyed (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Destroyed effect triggers before the Card would be destroyed."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Discard Pile"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Discard Pile is an out-of-play zone.<br>Cards are put into discard pile face-up.<br>Cards in either discard pile can be examined by either player at any time.<br>Order of cards in the discard pile must be maintained.<br>If multiple cards would put into the discard pile at the same time, the active player chooses the order to put them in."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Draw"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To draw a card, a player takes the top card of their deck and adds it to their hand.<br>If a player would draw a card and their deck is empty, before they draw they return all cards from their discard pile into their deck and shuffle their new deck.<br>If an effect draws multiple cards, all draws are resolved one by one."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Elusive"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When an elusive Creature gets fought, if this is the first time it's fought this turn, neither creature deals damage to the other during the fight itself."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Enemy"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Cards under a player's opponent's Control are Enemy cards."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Exhaust"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To Exhaust a card move it to a sideways position. It is now exhausted.<br>An Exhausted card can still be targeted with an Exhaust effect, but it will resolve without an effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Fight (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Fight effect triggers After the Creature Fights, if it survived the fight.<br>For details about the Fight (Event), see Fight" //want to put a link to Fight section here
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Flank"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Flanks are the far ends of a player's creature line.<br>Flank creatures are creatures at the far ends of a player's creature line."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "For Each"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If an effect instructs a player to do something “for each” something, they can make different choices for each instance of that resulting Effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Forge"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a player forges a key they flip one of their key tokens that is on the unforged side to the forged side and that key is now forged."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Friendly"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Cards under a player's Control are Friendly cards."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Hazardous"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Before a creature with Hazardous gets fought, deal Damage to the opposing creature equal to the value of Hazardous.<br>If this damage destroys the opposing creature, the rest of the fight does not occur."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Heal"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a creature is Healed, remove that much damage from it.<br>A creature is only Healed for however much damage was actually removed."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "If you do, In order to, to"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "The effect preceding this statement must resolve fully in order to trigger the following effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Instead"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If an effect says to do something Instead of something else, the original event is treated to not happen."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Least Powerful"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Least powerful creatures are the ones that are tied for the lowest power value on the field.<br>In case of ties the active player chooses from among the Least Powerful creatures."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Leave Play (Event)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a card leaves play it is put into its owner's appropriate out-of-play zone, unless the effect in question specifically interacts with that zone.<br>When a creature with Æmber on it leaves play, all Æmber on it goes to the pool of the opponent of the creature’s controller, regardless of where the Æmber came from, then all tokens on it get put into the common pool.<br>When a non-creature tokens on it get put into the common pool.<br>When a card with an upgrade attached to it leaves play, that upgrade gets put into the discard pile.<br>When a card with a face-down card underneath it leaves play, that face-down card gets put into the discard pile.<br>When a card leaves the field to an out of play zone, all pending effects that interact with that card stop."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Leaves Play (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Leaves Play effect triggers before the Card would leave play (be put into any out of play zone from play)."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "May"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If an effect specifies May in it's text, the effect following that word is optional."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "May Play, May Use"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If an effect allows a player to play or use a card, they are allowed to play or use such a card in addition to all the other cards they may play or use that turn."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Most Powerful"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Most powerful creatures are the ones that are tied for the highest power value on the field.<br>In case of ties the active player chooses from among the Most Powerful creatures."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Neighbor"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "The creatures to the immediate left and right of a creature in a player’s battleline are its neighbors."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Omega"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "After a card with the Omega keyword is played, the current step of the game ends."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Open Game State"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Open Game State exists during any step of the game at a time when no Events or Effects are in any of their steps of resolution.<br>Open Game State is required to manually Play, Use and/or Discard cards, to trigger timing-based Events and Effects and to switch between Phases."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Opposing"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a creature is involved in a fight (either because it was used to fight, or because it was attacked by another creature), the other creature in the fight is the opposing creature."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Other Counters"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Some cards may refer to counters that do not have official components to represent them.<br>These counters have no inherent rules, instead the card that creates them provides context to how the counters function.<br>List of other counter types:<br>- Doom Counters"
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Owner"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "A player owns cards that started the game in their deck."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Pay"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If a player must pay Æmber, they take that much Æmber from their Æmber pool and put it into the opponent's Æmber pool."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Play (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Play abilities trigger after the Card is played.<br>Actions are put into the discard pile after their Play abilities fully resolve (if any).<br>If a play ability does multiple things, trigger them one by one sequentially, unless otherwise stated or if all of the effects deal damage."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Put into Play"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a card is Put into Play (such as by being played) different rules govern it depending on the card type;<br>Creatures get Put into Play into their controller’s battleline on either flank, exhausted.<br>Artifacts get Put into Play on their controller’s side of the field, exhausted.<br>Actions get Put into Play on their controller’s side of the field and then put into the discard pile after they finish resolving.<br>Upgrades get Put into Play under whichever creature they’re being attached to."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Poison"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Any damage dealt in a fight by a creature with Poison destroys the opposing creature. If the damage is completely prevented (such as by armor), Poison doesn’t destroy that creature."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Power"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "A creature's power is listed on the left."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Power Counter"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Each power counter increases a creature's Power by 1."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Purge (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Purge is an out-of play zone under the player's archon card.<br>Purge is underneath the players Archon card and cards there are face-up."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Purged (Zone)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a card is purged it's placed into Purge."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Ready"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To ready a creature move it to upright position. It is now ready.<br>A ready Creature can still be targeted with a Ready effect, but it will resolve without an effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Reap (Effect)"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Reap effect triggers After the Creature reaps.<br>For details about the Reap as a way to Use creatures, see (Reap event)" //want link here
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Redistribute"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When an effect instructs one to Redistribute tokens, pick up all of the aforementioned tokens and place them in whichever arrangement is desired.<br>Redistributing damage tokens is not treated as dealing damage (and thus ignores armor)."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Repeat"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To repeat an effect trigger it again."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Return"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When an effect instructs a player to return anything to a specific zone, it's put there."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Sacrifice"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Sacrificing a card is equivalent to Destroying it.<br>A player can only Sacrifice Friendly cards."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Search"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a player searches a zone they look through all the cards in the appropriate zone in secret.<br>A player may deliberately fail to find a card they were searching for, even if it is in the appropriate zone."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Self-Referential Text"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If a card refers to its own name, that reference is only to that copy of a card."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Skirmish"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a creature with skirmish fights, it gets dealt no damage by the opposing creature from that fight."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Splash"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When damage is dealt with splash, the Neighbors of the Creature that took the original damage take the Splash damage."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Steal"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When an effect Steals Æmber, that much Æmber is removed from opponent's pool and put into the Stealing player's pool."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Stun/Stunned"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a player stuns a creature, that creature gets a stun token and is stunned.<br>A creature can only have at most one stun token at a time.<br>When a stunned creature would be used, it is instead no longer stunned and the stun token is removed from it.<br>A Stunned Creature can still be targeted with a Stun effect, but it will resolve without an effect."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Swap"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "If two cards get swapped, they exchange positions.<br>Cards controlled by different players can’t be swapped.<br>If two zones get swapped, all cards in either zone get put in the other."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Taunt"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Non-Taunt Neighbors of Taunt Creatures can't be attacked."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Traits"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Traits are a card's descriptors, under the card's Name (like Human or Scientist)."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Trigger"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "To trigger an effect means to activate it and begin resolving it (go to step 1 of the effect’s resolution)."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "Unforge"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a player unforges a key they flip one of their forged key tokens from the forged side to the unforged side and that key is now unforged."
                },
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    text: "You, Your, Yours"
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "You, Your, and Yours always references the card’s current controller."
                }
            ]
        },
        {
            sectionTitle: "Ruling Clarifications",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "Since When effects happen immediately after the triggering event, creatures that are destroyed don’t trigger their “Each time a creature is destroyed” or similar, because they’re already in the discard pile by then."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Effects that use something your opponent controls as if you controlled them don’t finish resolving until after you’ve finished using the card in question. That means that it is treated as being friendly for the entirety of its own usage, including any triggered effects thereof."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "Since triggers are checked one by one, if a new trigger appears during the resolution of another one, it can still trigger despite not being there at the time of the original event happening."
                }
            ]
        },
        {
            sectionTitle: "Rules Exceptions",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    text: "When a maverick Pitlord is on the field and their controller doesn't have Dis on their identity card nor among cards they control, they don't have to (and, in fact, can't) choose Dis as their active house."
                },
                {
                    type: EntryType.PARAGRAPH,
                    text: "When Overlord Greking destroys a creature it can put that creature into play despite it being in the discard pile by then despite not explicitly mentioning the discard pile."
                }
            ]
        },
        {
            sectionTitle: "Rules in action examples",
            entries: [
                {
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    bold: true,
                    text: "I have chosen house Logos to be my active house this turn and start off by playing Library Access (CoTA 115), I then play Wild Wormhole (CoTA 125). In what order do I resolve this combination of effects?"
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "a. In step 1 of Wild Wormhole Playing event, you place it on the field.",
                        "b. In step 2 of Wild Wormhole Playing event, nothing happens.",
                        "c. In step 3 of Wild Wormhole Playing event, it gets played.",
                        "d. In step 4 of Wild Wormhole Playing event, you gain an Æmber (When effect, but before all other When effects)",
                        "e. In step 4 of Wild Wormhole Playing event, you resolve Library’s Access lingering When effect and draw a card.",
                        "f. In step 5 of Wild Wormhole Playing event, its Play ability triggers.",
                        "   i. In step A of Wild Wormhole Play effect, nothing happens as it doesn’t target.",
                        "   ii. In step B of Wild Wormhole Play effect, the top card of the deck gets played.",
                        "       1. In step 1 of the other card’s Playing event, you place it on the field.",
                        "       2. In step 2 of the other card’s Playing event, nothing happens.",
                        "       3. In step 3 of the other card’s Playing event, it gets played.",
                        "       4. In step 4 of the other card’s Playing event, you gain its pure Æmber (If any)",
                        "       5. In step 4 of the other card’s Playing event, you resolve Library’s Access lingering When effect and draw a card.",
                        "       6. In step 5 of the other card’s Playing event, its Play ability triggers, if any.",
                        "           a. In step A of the other card’s Play effect, it selects targets, if any.",
                        "           b. In step B of the other card’s Play effect, the card’s Play effect resolves.",
                        "           c. In step C of the other card’s Play effect, the card’s Play effect finishes resolving.",
                        "       7. In step 6 of the other card’s Playing event, finish the event. If it’s an action, place it in the discard pile at this point.",
                        "   iii. In step C of Wild Wormhole Play effect, the Play effect finishes resolving.",
                        "g. In step 6 of Wild Wormhole Playing event, finish the event. Place it in the discard pile at this point.",
                    ],
                },{
                    type: EntryType.PARAGRAPH,
                    noPad: true,
                    bold: true,
                    text: "On my opponent’s turn they use their Yxilo Bolter (CoTA 204) to reap and choose to resolve its reap effect on my Bad Penny (CoTA 296). Is the Bad Penny purged or does it end up back in my hand?"
                },
                {
                    type: EntryType.UNORDERED_LIST,
                    listItems: [
                        "a. In step 1 of Yxilo Bolter Use event it gets Exhausted and the Reap option is chosen.",
                        "b. In step 2 of Yxilo Bolter Use event, nothing happens.",
                        "c. In step 3 of Yxilo Bolter Use event, the active player gains an Æmber.",
                        "d. In step 4 of Yxilo Bolter Use event, nothing happens.",
                        "e. In step 5 of Yxilo Bolter Use event, trigger its Reap effect.",
                        "   i. In step A of Yxilo Bolter Reap effect nothing happens.",
                        "   ii. In step B of Yxilo Bolter Reap effect, the first subeffect is triggered.",
                        "       1. In step A of Yxilo Bolter Reap effect’s first subeffect, the active player chooses Bad Penny as a target.",
                        "       2. In step B of Yxilo Bolter Reap effect’s first subeffect, Bad Penny gets dealt 2 damage.",
                        "           a. In step 1 of Bad Penny Destruction event, it gets triggered.",
                        "           b. In step 2 of Bad Penny Destruction event, her Destroyed effect triggers.",
                        "               i. In step A of her Destroyed effect, no targets are chosen.",
                        "               ii. In step B of her Destroyed effect she gets returned to her owner’s hand.",
                        "               iii. In step C of her Destroyed effect it finishes resolving.",
                        "           c. In step 3 of Bad Penny Destruction event she is treated to be destroyed.",
                        "           d. In step 4 of Bad Penny Destruction event nothing happens.",
                        "           e. In step 5 of Bad Penny Destruction event nothing happens.",
                        "           f. In step 6 of Bad Penny Destruction event the event finishes.",
                        "       3. In step C of Yxilo Bolter Reap effect’s first subeffect it finishes resolving. The second subeffect gets triggered.",
                        "       4. In step A of Yxilo Bolter Reap effect’s second subeffect no targets are chosen.",
                        "       5. In step B of Yxilo Bolter Reap effect’s second subeffect that subeffect attempts to Purge Bad Penny, as she has been destroyed. Because the effect doesn’t mention any out-of-play zones, it affects only cards on the field and thus doesn’t affect Bad Penny.",
                        "       6. In step C of Yxilo Bolter Reap effect’s second subeffect it finishes resolving.",
                        "   iii. In step C of Yxilo Bolter Reap effect it finishes resolving.",
                        "f. In step 6 of Yxilo Bolter Use event it finishes."
                    ]
                }
            ]
        }
    ]
}
