import { get, set } from "idb-keyval"
import { messageStore } from "../ui/MessageStore"
import { log } from "./Utils"


export class IdbUtils {

    private static idbAvailable?: boolean

    static canUseIdb = async () => {
        if (IdbUtils.idbAvailable == null) {
            const toSave = Math.random()
            try {
                await set("test", toSave)
                const saved = await get("test")
                if (saved == toSave) {
                    IdbUtils.idbAvailable = true
                }
            } catch (e) {
                log.info("IDB is not available, cards will not be saved.")
                IdbUtils.idbAvailable = false
                messageStore.setWarningMessage("Your browser cannot cache data. Please ensure you allow this site to save data!")
            }
        }
        return IdbUtils.idbAvailable
    }
}
