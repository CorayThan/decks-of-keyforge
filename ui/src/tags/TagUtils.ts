import { PublicityType } from "../generated-src/PublicityType"
import { TagDto } from "../generated-src/TagDto"

export class TagUtils {

    static tagName = (tag: TagDto) => {
        let name = tag.name
        if (tag.publicityType === PublicityType.NOT_SEARCHABLE) {
            name += " Semi-Private"
        } else if (tag.publicityType === PublicityType.PUBLIC) {
            name += " Public"
        }

        return name
    }
}