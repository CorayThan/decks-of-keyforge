package coraythan.keyswap.keyforgeevents

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("${Api.base}/keyforge-events")
class KeyForgeEventEndpoints(
        private val keyForgeEventService: KeyForgeEventService
) {

    @PostMapping("/public/search")
    fun searchEvents(@RequestBody filters: KeyForgeEventFilters) = keyForgeEventService.searchEvents(filters)

    @PostMapping("/secured")
    fun saveEvent(@RequestBody event: KeyForgeEventDto) {
        keyForgeEventService.saveEvent(event)
    }

    @DeleteMapping("/secured/{id}")
    fun deleteEvent(@PathVariable id: Long) = keyForgeEventService.deleteEvent(id)

    @PostMapping("/secured/event-icon/{name}")
    fun addStoreIcon(
            @RequestParam("eventIcon")
            eventIcon: MultipartFile,

            @RequestHeader("Extension")
            extension: String,

            @PathVariable name: String

    ) =  keyForgeEventService.addEventIcon(name, eventIcon, extension)
}
