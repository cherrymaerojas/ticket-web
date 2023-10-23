import axios from "axios"

export default function fetchVenues() {
  return axios
    .get("http://localhost:3000/api/events/venues")
    .then(res => res.data)
}

export function fetchVenue(venueId: string) {
  return axios
    .get(`http://localhost:3000/api/events/venues/${venueId}`)
    .then(res => res.data)
}

export function fetchVenuesEventIds(venueId: string, eventsId: string) {
  return axios
    .get(
      `http://localhost:3000/api/events/venues/inventory/${venueId}?eventsIds=${encodeURIComponent(
        eventsId
      )}`
    )
    .then(res => res.data)
}

export function fetchVenuesEvents(venueId: string) {
  return async function () {
    const venue = await fetchVenue(venueId)
    const promisesEvents = venue.performances
      .reduce((initVal, current) => {
        if (!initVal.some(e => e.eventId === current.event_id)) {
          return initVal.concat({
            performanceId: current.id,
            eventId: current.event_id,
            eventIds: [current.ref_id],
          })
        }
        return initVal.map(e => {
          if (e.eventId === current.event_id) {
            e.eventIds.push(current.ref_id)
            return e
          }
          return e
        })
      }, [])
      .map(events => {
        const eventsId = events.eventIds.join(",")
        return fetchVenuesEventIds(venue.id, eventsId)
      })
    const results = await Promise.all(promisesEvents)
    return [venue, results]
  }
}
