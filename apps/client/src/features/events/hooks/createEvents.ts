import { notificationService } from "@hope-ui/solid"
import { createQuery } from "@tanstack/solid-query"
import { fetchEvents } from "../services/events"

export function createPerformance() {
  return createQuery(() => ["performances"], fetchEvents, {
    onError() {
      notificationService.show({
        status: "danger",
        description: "Failed to fetch list of events",
      })
    },
  })
}
