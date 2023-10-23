import axios from "axios"

export function fetchEventPerformances(eventId: string) {
  return axios
<<<<<<< HEAD
    .get(`http://srv430760.hstgr.cloud/api/events/${eventId}`)
=======
    .get(`http://localhost:3000/api/events/${eventId}`)
>>>>>>> refs/remotes/origin/development
    .then(res => res.data)
}

export default function fetchEventsPerformance(performanceId: string) {
  return axios
    .get(`http://srv430760.hstgr.cloud/api/events/performance/${performanceId}`)
    .then(res => res.data)
}

export function fetchEventsSeats(performanceId: string) {
  return axios
    .get(
      `http://srv430760.hstgr.cloud/api/events/performance/${performanceId}/inventory`
    )
    .then(res => res.data)
}

export function fetchEvents() {
  return axios
    .get("http://srv430760.hstgr.cloud/api/events")
    .then(res => res.data)
}
