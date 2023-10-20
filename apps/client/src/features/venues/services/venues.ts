import axios from "axios"

export default function fetchVenues() {
  //api/venues
  return axios
    .get("https://aiitchtix.net/api/events/venues?sticky=true", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(res => res.data)
}

export function fetchVenue(venueId: string) {
  return axios
    .get(
      `https://aiitchtix.net/api/events/venues/${venueId}?performances=1&skybox=1`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
    .then(res => res.data)
}

export function fetchVenuesEventIds(venueId: string, eventsId: string) {
  return axios
    .get(
      `https://aiitchtix.net/api/events/venues/inventory/${venueId}?eventsIds=${encodeURIComponent(
        eventsId
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
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
