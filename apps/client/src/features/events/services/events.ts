import axios from "axios"

export function fetchEventPerformances(eventId: string) {
  return axios
    .get(`https://aiitchtix.net/api/events/${eventId}?`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(res => res.data)
}

export default function fetchEventsPerformance(performanceId: string) {
  //api/venues
  return axios
    .get(`https://aiitchtix.net/api/events/performance/${performanceId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(res => res.data)
}

export function fetchEventsSeats(performanceId: string) {
  return axios
    .get(
      `https://aiitchtix.net/api/events/performance/${performanceId}/inventory`,
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

export function fetchEvents() {
  return axios
    .get("https://aiitchtix.net/api/events", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(res => res.data)
}
