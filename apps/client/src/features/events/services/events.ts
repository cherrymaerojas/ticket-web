import axios from "axios"

export function fetchEventPerformances(eventId: string) {
  return axios
    .get(`http://localhost:3000/api/events/${eventId}`)
    .then(res => res.data)
}

export default function fetchEventsPerformance(performanceId: string) {
  return axios
    .get(`http://localhost:3000/api/events/performance/${performanceId}`)
    .then(res => res.data)
}

export function fetchEventsSeats(performanceId: string) {
  return axios
    .get(
      `http://localhost:3000/api/events/performance/${performanceId}/inventory`
    )
    .then(res => res.data)
}

export function fetchEvents() {
  return axios.get("http://localhost:3000/api/events").then(res => res.data)
}
