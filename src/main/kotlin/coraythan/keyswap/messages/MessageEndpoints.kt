package coraythan.keyswap.messages

import coraythan.keyswap.Api
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("${Api.base}/messages/secured")
class MessageEndpoints(
        private val messageService: PrivateMessageService,
) {

    @GetMapping("/unread-count")
    fun unreadCount() = messageService.unreadCount()

    @PostMapping("/search")
    fun searchMessages(@RequestBody filters: MessagesSearchFilters) = messageService.searchMessages(filters)

    @PostMapping("/block/{username}")
    fun blockUser(@PathVariable username: String) = messageService.blockUser(username)

    @PostMapping("/send")
    fun sendMessage(@RequestBody message: SendMessage) = messageService.sendMessage(message)
}
