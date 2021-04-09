import { get, set } from "idb-keyval"
import { messageStore } from "../ui/MessageStore"
import { log } from "./Utils"


export class IdbUtils {

    static idbAvailable = false

    /**
     * Do not use outside of first loading
     */
    static canUseIdb = async () => {
        const toSave = Math.random()
        try {
            await set("test", toSave)
            const saved = await get("test")
            if (saved == toSave) {
                IdbUtils.idbAvailable = true
            } else {
                log.info("IDB not available, bad test result")
            }
        } catch (e) {
            log.info("IDB is not available, stuffs will not be saved.")
            IdbUtils.idbAvailable = false
            messageStore.setWarningMessage("Your browser cannot cache data. Please ensure you allow this site to save data!")
        }
    }
}
