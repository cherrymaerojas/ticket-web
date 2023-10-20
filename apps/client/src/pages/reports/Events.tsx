import {
  Box,
  HStack,
  Heading,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@hope-ui/solid"
import { AiOutlineCloudDownload } from "solid-icons/ai"
import { For } from "solid-js"

const tableHeaders: string[] = [
  "Name",
  "Provider",
  "Url",
  "Created At",
  "Updated At",
  "Actions",
]

export default function Events() {
  return (
    <>
      <HStack marginBottom="$4" justifyContent="space-between">
        <Heading>Events</Heading>
        <IconButton aria-label="Download" icon={<AiOutlineCloudDownload />} />
      </HStack>
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
            <Td></Td>
            <Td></Td>
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
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
