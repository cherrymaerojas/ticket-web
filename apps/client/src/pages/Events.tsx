import {
    Box, Button, HStack,
    IconButton,
    Input,
    Switch,
    Table,
    Tbody, Td,
    Th, Thead, Tr, createDisclosure
} from '@hope-ui/solid'
import { RiMediaPlayListAddFill } from 'solid-icons/ri'
import { TbRefresh } from 'solid-icons/tb'
import { VsAdd } from 'solid-icons/vs'
import { For } from 'solid-js'
import AddBulkEvent from '../components/AddBulkEvent'
import AddEvent from '../components/AddEvent'

const tableHeaders: string[] = [
    'Venue/Event Links',
    'Platform',
    'Performances',
    'TimeStamp',
    'Actions'
]

export default function Events() {
    const addEvent = createDisclosure()
    const addBulkEvent = createDisclosure()

    return (
        <Box ml="$60" p="$4" overflow="scroll">
            <AddEvent isOpen={addEvent.isOpen} onClose={addEvent.onClose} />
            <AddBulkEvent isOpen={addBulkEvent.isOpen} onClose={addBulkEvent.onClose} />
            <HStack marginBottom="$4" justifyContent="space-between">
                <Input w="auto" placeholder="Search Events" />
                <HStack spacing="$4">
                    <Switch labelPlacement="end" variant="filled">Show Expired Events</Switch>
                    <IconButton aria-label="Refresh" icon={<TbRefresh />} />
                    <Button leftIcon={<RiMediaPlayListAddFill />} onClick={addBulkEvent.onOpen}>Bulk Add Event</Button>
                    <Button leftIcon={<VsAdd />} onClick={addEvent.onOpen}>Add Event</Button>
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
