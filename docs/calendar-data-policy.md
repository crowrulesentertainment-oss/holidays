# Holiday calendar data policy

## Publication model
Treat dates as data, not hand-maintained display markup. Each observance should include:
- `id`: stable slug
- `name` and optional localized names
- `calendarType`: Gregorian, lunar, lunisolar, or rule-based
- `dateStart` and optional `dateEnd` in ISO 8601
- `startsAtSundown` where applicable
- `regions`, `traditions`, and optional `categories`
- `dateStatus`: confirmed, estimated, or varies-by-community
- `sourceName`, `sourceUrl`, `checkedAt`, and `notes`
- `recurrenceRule` only for observances with a verified recurrence rule

## Editorial controls
- Verify movable and lunar-calendar observances against authoritative local or community sources for each year; do not simply increment the previous year's date.
- Distinguish national public holidays from religious, cultural, awareness, and informal celebrations.
- Record time zones and sundown boundaries where meaningful.
- Show a visible “last reviewed” date and identify estimates. Do not label the calendar exhaustive.
- Review source licenses and attribution requirements before importing third-party datasets.
- Keep source metadata alongside each record so annual updates are auditable.
- Add automated schema/date validation, then require human review for culturally sensitive or variable dates.
