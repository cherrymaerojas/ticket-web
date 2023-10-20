import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@hope-ui/solid"
import { For } from "solid-js"

const tableHeaders: string[] = [
  "Event",
  "Date",
  "Ticket Count",
  "Past Ticket Count",
]

//Venue, Event Link, Provider, Capacity, Upcoming Performance, Skybox, Timestamp (EST), Actions

// .data.filter(
//     data => !!data.archived === isChecked()
//   )

//archived == expired

export default function Under100() {
  return (
    <>
      <Table striped="odd">
        <Thead>
          <Tr>
            <For each={tableHeaders}>{header => <Th>{header}</Th>}</For>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  )
}
