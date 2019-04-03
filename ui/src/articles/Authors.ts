import bigZImg from "../user/imgs/big-z.png"
import dunkoroImg from "../user/imgs/dunkoro.png"

export interface Author {
    name: string
    username: string

    /**
     * Each string is a paragraph.
     */
    bio: string[]
    img: string
}

export const dunkoro: Author = {
    name: "Dunkoro",
    username: "Dunkoro",
    bio: [
        "Dunkoro is a member of the SAS team.",
        "He has a long history working with card games, beginning with Magic: the Gathering, playing Yu-Gi-Oh! competitively for a few years and creating the first competitive team in Gwent, which has had a lasting effect on the game as a whole.",
        "In all of these games he has been dilligently seeking optimization, trying to understand the game mechanics as much as possible and put to words theories that professionals have been using intuitively.",
        "His theorycraft has not been without an impact. He has created multiple top-tier decks in Gwent and discovered many of the hidden mechanics of the game.",
        "He's also a big fan of board games and roleplaying games.",
        "If you have any questions, contact him on Discord at Dunkoro#8003"
    ],
    img: dunkoroImg
}

export const bigZ: Author = {
    name: "Big Z",
    username: "Zarathustra05",
    bio: [
        "I am a lifelong gamer progressing from consoles when I was a child, to computer games when I was a young adult, and have become a dedicated board game player over the last five or so years. My wife, son, and I play board/card games together with our friends three to five days a week.",
        "(Random shout out to Gloomhaven as the best board game ever!)",
        "I decided to author some articles addressing deck selection and strategy because  I love KeyForge and want to share with the amazing community some of the tidbits of knowledge that I have gleaned from my obsession.",
        "As a player I have played at least 300 games of KeyForge start to finish and only about 100 of those are online via The Crucible. Additionally, I have participated in over twenty tournaments/events, I have won at least 12 that I can account for, and I recently came in third place at the Seattle Vault tour. This is a video you can watch of me playing top eight: https://m.twitch.tv/videos/397058210 I was running my sealed deck choice Warlord Yoweasel Tsong. I made about three obvious mistakes, but still carried the win.",
        "I am also part of the newly formed Team SAS! How SASy is your deck?"
    ],
    img: bigZImg
}
