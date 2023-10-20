import {
  Box,
  Button,
  HStack,
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@hope-ui/solid"
import { TbRefresh } from "solid-icons/tb"
import { For, Match, Switch as Select, Show } from "solid-js"
import { FiArchive, FiExternalLink } from "solid-icons/fi"
import {
  AiFillCheckCircle,
  AiOutlineDelete,
  AiOutlineFieldTime,
  AiOutlineSync,
} from "solid-icons/ai"
import SkeletonLoader from "../../../components/SkeletonLoader"
import { VsSync } from "solid-icons/vs"
import dateFormatter from "../../../util/dateFormatter"
import { A, useParams } from "@solidjs/router"
import { createEventPerformances } from "../hooks/createEventPerformances"

const tableHeaders: string[] = [
  "Date",
  "Seats",
  "# Broadcasted",
  "# Sold",
  "Availability",
  "Updated At",
  "SkyBox",
  "Actions",
]

export default function EventPerformances() {
  const param = useParams()
  const query = createEventPerformances(param.id)

  async function handleRefesh() {
    await query.refetch()
  }

  return (
    <>
      <HStack marginBottom="$4" justifyContent="end">
        <IconButton
          disabled={query.isLoading || query.isRefetching}
          aria-label="Refresh"
          onClick={handleRefesh}
          icon={<TbRefresh />}
        />
      </HStack>
      <Select>
        <Match when={query.isLoading || query.isRefetching}>
          <SkeletonLoader />
        </Match>
        <Match when={query.isSuccess}>
          <Box overflow="scroll">
            <Table dense highlightOnHover>
              <TableCaption placement="top">
                {query.data.name} : {query.data.venue}
              </TableCaption>
              <Thead>
                <Tr>
                  <For each={tableHeaders}>{header => <Th>{header}</Th>}</For>
                </Tr>
              </Thead>
              <Tbody>
                <For each={query.data.performances}>
                  {performance => (
                    <Tr>
                      <Td>{performance.date}</Td>
                      <Td
                        style={{
                          color: "blue",
                          "text-decoration": "underline",
                        }}
                      >
                        <A href={`/performances/${performance.id}`}>
                          {`${performance.num_seats}/${performance.capacity}`}
                        </A>
                      </Td>
                      <Td>{performance.num_broadcasted}</Td>
                      <Td>{performance.num_sold}</Td>
                      <Td>
                        <HStack spacing="1rem">
                          <Select>
                            <Match
                              when={performance.skybox_status === "UP_TO_DATE"}
                            >
                              <Tooltip label="Up to Date!">
                                <AiFillCheckCircle color="green" />
                              </Tooltip>
                            </Match>
                            <Match
                              when={performance.skybox_status === "PENDING"}
                            >
                              <Tooltip label="Pending">
                                <AiOutlineFieldTime color="darkblue" />
                              </Tooltip>
                            </Match>
                            <Match
                              when={performance.skybox_status === "UP_TO_DATE"}
                            >
                              <Tooltip label="Up to Date!">
                                <AiFillCheckCircle color="green" />
                              </Tooltip>
                            </Match>
                          </Select>
                          <Show when={performance.skybox_auto_sync}>
                            <Tooltip label="Auto Sync">
                              <VsSync />
                            </Tooltip>
                          </Show>
                        </HStack>
                      </Td>
                      <Td>{performance.updated_at}</Td>
                      <Td color="blue">
                        <a
                          href={`https://skybox.vividseats.com/inventory?groupBy=event&limit=100&pageNumber=1&sortedByB=section&sortDirB=desc&ef.excludeParking=false&ef.eventDate=fromToday&ef.tagsMatchAll=false&inf.eventId=${performance.skybox_event_id}&forceCollapse=true`}
                          target="_blank"
                        >
                          <FiExternalLink />
                        </a>
                      </Td>
                      <Td>
                        <Button leftIcon={<AiOutlineSync />}>
                          Sync with SkyBox
                        </Button>
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
