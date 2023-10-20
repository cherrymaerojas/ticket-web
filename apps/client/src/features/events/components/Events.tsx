import {
  Box,
  HStack,
  IconButton,
  Input,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@hope-ui/solid"
import { TbRefresh } from "solid-icons/tb"
import { For, Match, Switch as Select, Show, createSignal } from "solid-js"
import { FiArchive } from "solid-icons/fi"
import {
  AiFillCheckCircle,
  AiOutlineDelete,
  AiOutlineFieldTime,
} from "solid-icons/ai"
import { createPerformance } from "../hooks/createEvents"
import SkeletonLoader from "../../../components/SkeletonLoader"
import { VsSync } from "solid-icons/vs"
import dateFormatter from "../../../util/dateFormatter"
import { A } from "@solidjs/router"

const tableHeaders: string[] = [
  "Venue",
  "Event Link",
  "Provider",
  "Capacity",
  "Upcoming Performance",
  "Skybox",
  "Availability",
  "Actions",
]

export default function Performances() {
  const query = createPerformance()
  const [isChecked, setChecked] = createSignal(false)
  const [searchEvents, setSearchEvents] = createSignal("")

  async function handleRefesh() {
    await query.refetch()
  }

  return (
    <>
      <HStack marginBottom="$4" justifyContent="space-between">
        <Input
          disabled={query.isLoading || query.isRefetching || query.isError}
          w="auto"
          placeholder="Search Events"
          onChange={e => setSearchEvents(e.target.value.trim())}
        />
        <HStack spacing="$4">
          <Switch
            checked={isChecked()}
            onChange={() => setChecked(!isChecked())}
            disabled={query.isLoading || query.isRefetching || query.isError}
            labelPlacement="end"
            variant="filled"
          >
            Show Expired Events
          </Switch>
          <IconButton
            disabled={query.isLoading || query.isRefetching}
            aria-label="Refresh"
            onClick={handleRefesh}
            icon={<TbRefresh />}
          />
        </HStack>
      </HStack>
      <Select>
        <Match when={query.isLoading || query.isRefetching}>
          <SkeletonLoader />
        </Match>
        <Match when={query.isSuccess}>
          <Box overflow="scroll">
            <Table dense highlightOnHover>
              <Thead>
                <Tr>
                  <For each={tableHeaders}>{header => <Th>{header}</Th>}</For>
                </Tr>
              </Thead>
              <Tbody>
                <For
                  each={query.data
                    .filter(data => !!data.archived === isChecked())
                    .filter(data => data.name.includes(searchEvents()))}
                >
                  {event => (
                    <Tr>
                      <Td>{event.venue}</Td>
                      <Td
                        style={{
                          color: "blue",
                          "text-decoration": "underline",
                        }}
                      >
                        <a href={event.url} target="_blank">
                          {event.name}
                        </a>
                      </Td>
                      <Td>{event.provider.name}</Td>
                      <Td
                        style={
                          event.upcoming_performance && {
                            color: "blue",
                            "text-decoration": "underline",
                          }
                        }
                      >
                        <Show when={event.upcoming_performance} fallback={"-"}>
                          <A href={`/events/${event.id}/performances`}>
                            {`${event.upcoming_performance.num_seats}/${event.upcoming_performance.capacity}`}
                          </A>
                        </Show>
                      </Td>
                      <Td>
                        {event.upcoming_performance
                          ? dateFormatter(
                              event.upcoming_performance.date,
                              event.venue_.timeZone
                            )
                          : "-"}
                      </Td>
                      <Td verticalAlign="middle">
                        <HStack spacing="1rem">
                          <Select>
                            <Match when={event.skybox_status === "UP_TO_DATE"}>
                              <Tooltip label="Up to Date!">
                                <AiFillCheckCircle color="green" />
                              </Tooltip>
                            </Match>
                            <Match when={event.skybox_status === "PENDING"}>
                              <Tooltip label="Pending">
                                <AiOutlineFieldTime color="lightblue" />
                              </Tooltip>
                            </Match>
                            <Match when={event.skybox_status === "UP_TO_DATE"}>
                              <Tooltip label="Up to Date!">
                                <AiFillCheckCircle color="green" />
                              </Tooltip>
                            </Match>
                          </Select>
                          <Show when={event.skybox_auto_sync}>
                            <Tooltip label="Auto Sync">
                              <VsSync />
                            </Tooltip>
                          </Show>
                        </HStack>
                      </Td>
                      <Td>-</Td>
                      <Td>
                        <IconButton
                          aria-label="Archive"
                          icon={<FiArchive />}
                          mr="$2"
                          onClick={() => {
                            //(Post)
                            console.log(
                              `https://aiitchtix.net/api/events/archive/${event.id}`
                            )
                            //   query.refetch()
                          }}
                        />
                        <IconButton
                          colorScheme="danger"
                          aria-label="Delete"
                          icon={<AiOutlineDelete />}
                          onClick={() => {
                            //(Delete)
                            console.log(
                              `https://aiitchtix.net/api/events/${event.id}?delete_from_skybox=1`
                            )
                            //   query.refetch()
                          }}
                        />
                      </Td>
                    </Tr>
                  )}
                </For>
              </Tbody>
            </Table>
          </Box>
        </Match>
        <Match when={query.isError}>
          <Box overflow="scroll">
            <Table dense highlightOnHover>
              <Thead>
                <Tr>
                  <For each={tableHeaders}>{header => <Th>{header}</Th>}</For>
                </Tr>
              </Thead>
              <Tbody></Tbody>
            </Table>
          </Box>
        </Match>
      </Select>
    </>
  )
}
