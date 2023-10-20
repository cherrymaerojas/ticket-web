import {
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  notificationService,
} from "@hope-ui/solid"
import { For, Match, Switch, createEffect, createSignal } from "solid-js"
import { A, useParams } from "@solidjs/router"
import { createMutation, createQuery } from "@tanstack/solid-query"
import { fetchVenue, fetchVenuesEvents } from "../services/venues"
import SkeletonLoader from "../../../components/SkeletonLoader"
import { FiExternalLink } from "solid-icons/fi"
import dateFormatter from "../../../util/dateFormatter"

const tableHeaders: string[] = [
  "Date",
  "Name",
  "# Sold",
  "# Listed",
  "# Broadcasted",
  "Skybox",
]

export default function VenueItem() {
  const param = useParams()
  const results = createMutation({
    mutationFn: fetchVenuesEvents(param.id),
    onError() {
      notificationService.show({
        status: "danger",
        description: "Failed to fetch data",
      })
    },
  })

  createEffect(() => {
    results.mutateAsync()
  })

  return (
    <Switch>
      <Match when={results.isLoading}>
        <SkeletonLoader />
      </Match>
      <Match when={results.isSuccess}>
        <Box overflow="scroll">
          <Table dense highlightOnHover>
            <TableCaption placement="top">
              {results.data?.[0].name} : {results.data?.[0].state}{" "}
              {results.data?.[0].city}
            </TableCaption>
            <Thead>
              <Tr>
                <For each={tableHeaders}>{header => <Th>{header}</Th>}</For>
              </Tr>
            </Thead>
            <Tbody>
              <For each={results.data?.[0].performances}>
                {performance => {
                  const totalSold = results.data?.[1]
                    ?.flat()
                    ?.filter(result => +performance.ref_id === result.eventId)
                    .filter(result => result.ticketStatus === "SOLD")
                    .reduce((initVal, current) => initVal + current.quantity, 0)

                  const totalListed = results.data?.[1]
                    ?.flat()
                    ?.filter(result => +performance.ref_id === result.eventId)
                    .reduce(
                      (initVal, current) =>
                        initVal + current.seatNumbers.split(",").length,
                      0
                    )

                  const totalBroadcasted = results.data?.[1]
                    ?.flat()
                    ?.filter(result => +performance.ref_id === result.eventId)
                    .filter(result => result.broadcast)
                    .reduce(
                      (initVal, current) =>
                        initVal + current.seatNumbers.split(",").length,
                      0
                    )

                  return (
                    <Tr>
                      <Td>
                        {dateFormatter(
                          performance.date,
                          results.data?.[0].timeZone
                        )}
                      </Td>
                      <Td css={{ color: "blue", textDecoration: "underline" }}>
                        <A href={`/performances/${performance.id}`}>
                          {performance.name}
                        </A>
                      </Td>
                      <Td>{totalSold}</Td>
                      <Td>{totalListed - totalSold}</Td>
                      <Td>{totalBroadcasted - totalSold}</Td>
                      <Td color="blue">
                        <a
                          href={`https://skybox.vividseats.com/inventory?groupBy=event&limit=100&pageNumber=1&sortedByB=section&sortDirB=desc&ef.excludeParking=false&ef.eventDate=fromToday&ef.tagsMatchAll=false&inf.eventId=${performance.ref_id}&forceCollapse=true`}
                          target="_blank"
                        >
                          <FiExternalLink />
                        </a>
                      </Td>
                    </Tr>
                  )
                }}
              </For>
            </Tbody>
          </Table>
        </Box>
      </Match>
    </Switch>
  )
}
