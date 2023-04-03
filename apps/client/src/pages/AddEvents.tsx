import {
    Box, Button, HStack,
    IconButton,
    Input,
    Switch,
    Table,
    Tbody, Td,
    Th, Thead, Tr
} from '@hope-ui/solid'
import { RiMediaPlayListAddFill } from 'solid-icons/ri'
import { TbRefresh } from 'solid-icons/tb'
import { VsAdd } from 'solid-icons/vs'
import { For } from 'solid-js'

const tableHeaders: string[] = [
    'Venue/Event Links',
    'Platform',
    'Performances',
    'TimeStamp',
    'Actions'
]

export default function AddEvents() {
    return (
        <Box ml="$60" p="$4" overflow="scroll">
            <HStack marginBottom="$4" justifyContent="space-between">
                <Input w="auto" placeholder="Search Events" />
                <HStack spacing="$4">
                    <Switch labelPlacement="end" variant="filled">Show Expired Events</Switch>
                    <IconButton aria-label="Refresh" icon={<TbRefresh />} />
                    <Button leftIcon={<RiMediaPlayListAddFill />}>Bulk Add Event</Button>
                    <Button leftIcon={<VsAdd />}>Add Event</Button>
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
                    </Tr>
                    <Tr>
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
