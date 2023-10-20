import { notificationService } from "@hope-ui/solid"
import { createQuery } from "@tanstack/solid-query"
import { fetchEventPerformances } from "../services/events"

export function createEventPerformances(eventId: string) {
  return createQuery(
    () => ["eventPerformances"],
    () => fetchEventPerformances(eventId),
    {
      onError() {
        notificationService.show({
          status: "danger",
          description: "Failed to fetch list of events",
        })
      },
    }
  )
}
