import moment from "moment-timezone"

export default function dateFormatter(
  performanceDate: string,
  timeZone: string
) {
  return moment(performanceDate).tz(timeZone).format("MMM D YYYY, hh:mm a")
}
