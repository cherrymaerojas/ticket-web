import {
  Box,
  Icon,
  IconProps,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@hope-ui/solid"
import { For, Match, Switch } from "solid-js"
import createVenues from "../hooks/createVenues"
import { useNavigate } from "@solidjs/router"
import SkeletonLoader from "../../../components/SkeletonLoader"

const tableHeaders: string[] = [
  "Name",
  "# of Events",
  "Time Zone",
  "Country",
  "State",
  "City",
]

export default function Venues() {
  const query = createVenues()
  const navigate = useNavigate()
  return (
    <Switch>
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
              <For each={query.data}>
                {venue => (
                  <Tr
                    onClick={(data: MouseEvent) => {
                      navigate(`/venues/${venue.id}`, { replace: true })
                    }}
                    _hover={{
                      cursor: "pointer",
                    }}
                  >
                    <Td>{venue.name}</Td>
                    <Td>{venue.events.length}</Td>
                    <Td>{venue.timeZone}</Td>
                    <Td>{venue.country}</Td>
                    <Td>{venue.state}</Td>
                    <Td>{venue.city}</Td>
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
    </Switch>
  )
}
