import { addDays, addWeeks, differenceInSeconds, getDay, getMinutes, parseISO, setMinutes, startOfMinute, subMinutes } from "date-fns"
import format from "date-fns/format"
import parse from "date-fns/parse"
import { log } from "./Utils"

export class TimeUtils {

    private static readonly readableDateFormat = "MMM d, yyyy"
    private static readonly readableShortDateFormat = "MMM yyyy"
    private static readonly readableDateTimeFormat = "MMM d, yyyy, h:mm a"
    private static readonly eventTimeFormat = "h:mm a z"
    private static readonly roundStartTime = "h:mm a"
    private static readonly eventDateFormat = "EEE MMM d, yy"
    private static readonly tournamentDateFormat = "MMM d, yyyy"
    private static readonly eventWeekFormat = "MMM d, yyyy"
    static readonly localDateFormat = "yyyy-MM-dd"
    static readonly zonedDateTimeFormat = "yyyy-MM-dd'T'HH:mm'Z'"
    static readonly dateTimeFormat = "yyyy-MM-dd'T'HH:mm"

    static formatZonedDateTimeToDate = (date: string) => {
        return format(TimeUtils.parseZonedDateTime(date), TimeUtils.readableDateFormat)
    }

    static formatDateTimeToDate = (date: string) => {
        return format(TimeUtils.parseDateTime(date), TimeUtils.readableDateFormat)
    }

    static formatDate = (date: string) => {
        try {
            return format(TimeUtils.parseLocalDate(date), TimeUtils.readableDateFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + date)
            return "bad date"
        }
    }

    static formatShortDate = (date: string) => {
        try {
            return format(TimeUtils.parseLocalDate(date), TimeUtils.readableShortDateFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + date)
            return "bad date"
        }
    }

    static formatLocalUTCToReadableDateTime = (dateTimeInUTC: string) => {
        try {
            const parsed = TimeUtils.eventDateTime(dateTimeInUTC)!
            return format(parsed, TimeUtils.readableDateTimeFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + dateTimeInUTC)
            return "bad date"
        }
    }

    static eventTime = (dateTimeInUTC?: string) => {
        if (dateTimeInUTC == null) {
            return ""
        }
        try {
            const parsed = TimeUtils.eventDateTime(dateTimeInUTC)!
            return format(parsed, TimeUtils.eventTimeFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + dateTimeInUTC)
            return "bad date"
        }
    }

    static tournamentDate = (dateTimeInUTC?: string) => {
        if (dateTimeInUTC == null) {
            return ""
        }
        try {
            const parsed = TimeUtils.eventDateTime(dateTimeInUTC)!
            return format(parsed, TimeUtils.tournamentDateFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + dateTimeInUTC)
            return "bad date"
        }
    }

    static eventDate = (dateTimeInUTC?: string) => {
        if (dateTimeInUTC == null) {
            return ""
        }
        try {
            const parsed = TimeUtils.eventDateTime(dateTimeInUTC)!
            return format(parsed, TimeUtils.eventDateFormat)
        } catch (e) {
            log.warn("Couldn't parse date from " + dateTimeInUTC)
            return "bad date"
        }
    }

    static eventDateTime = (dateTimeInUTC?: string) => {
        if (dateTimeInUTC == null) {
            return null
        }
        return parseISO(dateTimeInUTC + "Z")
    }

    static parseLocalDate = (date: string) => parse(date, TimeUtils.localDateFormat, new Date())
    static parseZonedDateTime = (date: string) => parse(date, TimeUtils.zonedDateTimeFormat, new Date())
    static parseDateTime = (date: string) => parse(date, TimeUtils.dateTimeFormat, new Date())
    static parseReadableLocalDateTime = (date: string) => parse(date, TimeUtils.readableDateTimeFormat, new Date())

    static countdownStartReadable = (countDownEnd: string, durationMinutes: number) => {
        const endDate = parseISO(countDownEnd + "Z")
        const startDate = subMinutes(endDate, durationMinutes)
        return format(startDate, TimeUtils.roundStartTime)
    }

    static countDownTo = (countDownEnd: string) => {
        const endDate = parseISO(countDownEnd + "Z")
        const totalSecondsDiff = differenceInSeconds(endDate, new Date())
        if (totalSecondsDiff < 0) {
            return `0:00`
        }
        const minutesDiff = Math.floor(totalSecondsDiff / 60)
        const remainderSecDiff = totalSecondsDiff - minutesDiff * 60
        return `${minutesDiff}:${remainderSecDiff.toString().padStart(2, "0")}`
    }

    static weekDescriptionForEvent = (fromDate: Date) => {
        const fromDateDayOfWeek = getDay(fromDate)
        let offsetDays = fromDateDayOfWeek - 1
        if (fromDateDayOfWeek === 0) {
            // Sunday on previous week
            offsetDays = 6
        }
        const monday = addDays(fromDate, -offsetDays)
        return `Week of ${format(monday, TimeUtils.eventWeekFormat)}`
    }

    static nowDateString = () => format(new Date(), TimeUtils.localDateFormat)
    static nowDateTimeString = () => format(new Date(), TimeUtils.dateTimeFormat)
    static nowPlus1WeekDateTimeString = () => format(addWeeks(setMinutes(new Date(), 0), 1), TimeUtils.dateTimeFormat)

    static roundToNearestMinutes = (date: Date, interval: number) => {
        const roundedMinutes = Math.floor(getMinutes(date) / interval) * interval
        return setMinutes(startOfMinute(date), roundedMinutes)
    }

    static currentTimeZoneOffset = () => {
        let timezoneOffset = new Date().getTimezoneOffset() * -1
        if (timezoneOffset == null || isNaN(timezoneOffset)) {
            log.warn("No timezone offset available.")
            timezoneOffset = 0
        }
        return timezoneOffset
    }

    static readableTimeZoneOffset = () => {
        return `UTC${TimeUtils.currentTimeZoneOffset() / 60}`
    }
}
