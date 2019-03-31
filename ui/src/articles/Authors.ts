import bigZImg from "../user/imgs/big-z.png"
import dunkoroImg from "../user/imgs/dunkoro.png"

export interface Author {
    name: string
    username: string
    bio: string
    img: string
}

export const dunkoro: Author = {
    name: "dunkoro",
    username: "Dunkoro",
    bio: "",
    img: dunkoroImg
}

export const bigZ: Author = {
    name: "Big Z",
    username: "Zarathustra05",
    bio: "",
    img: bigZImg
}
