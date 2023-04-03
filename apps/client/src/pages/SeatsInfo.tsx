import {
    Box, HStack,
    IconButton,
    Input,
    Switch,
    Table,
    Tbody, Td,
    Th, Thead, Tr
} from '@hope-ui/solid'
import { TbRefresh } from 'solid-icons/tb'
import { For } from 'solid-js'

const tableHeaders: string[] = [
    'Venue',
    'Event Link',
    'Provider',
    'Capacity',
    'Upcoming Performance',
    'Skybox',
    'Timestamp(EST)',
    'Availability',
    'Actions'
]

export default function SeatsInfo() {
    return (
        <Box ml="$60" p="$4" overflow="scroll">
            <HStack marginBottom="$4" justifyContent="space-between">
                <Input w="auto" placeholder="Search Events" />
                <HStack spacing="$4">
                    <Switch labelPlacement="end" variant="filled">Show Expired Events</Switch>
                    <IconButton aria-label="Refresh" icon={<TbRefresh />} />
                </HStack>
            </HStack>
            <Table striped="odd">
                <Thead>
                    <Tr>
                        <For each={tableHeaders}>
                            {
                                (header) => <Th>{header}</Th>
                            }
                        </For>
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
                        <Td></Td>
                        <Td></Td>
                        <Td></Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}
