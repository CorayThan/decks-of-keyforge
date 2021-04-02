package coraythan.keyswap.messages

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class MailCategory {
    INBOX,
    SENT,
    UNREAD,
    ALL_MAIL,
    ARCHIVED
}