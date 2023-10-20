import { createQuery } from "@tanstack/solid-query"
import fetchVenues from "../services/venues"
import { notificationService } from "@hope-ui/solid"

export default function createVenues() {
  return createQuery(() => ["venues"], fetchVenues, {
    onError() {
      notificationService.show({
        status: "danger",
        description: "Failed to fetch list of venues",
      })
    },
  })
}
