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
import { VsAdd } from "solid-icons/vs"
import { For } from "solid-js"

const tableHeaders: string[] = ["Name", "Action"]

export default function Pricing() {
  return (
    <>
      <HStack marginBottom="$4" justifyContent="space-between">
        <Heading>Pricing Group</Heading>
        <IconButton aria-label="Add" icon={<VsAdd />} />
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
          </Tr>
          <Tr>
            <Td></Td>
            <Td></Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  )
}
