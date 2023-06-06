import {
    Box,
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    SimpleOption,
    SimpleSelect,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@hope-ui/solid"
import { VsSave } from "solid-icons/vs"
import { For, createSignal } from "solid-js"

interface AddEventProps {
    isOpen: () => boolean
    onClose: () => void
}

const tableHeaders: string[] = [
    'Performer Name',
    '#',
    'URL',
    'Provider',
    'Name',
    'Date',
    'Performer Event Type',
]

const AddBulkEvent = (props: AddEventProps) => {
    const [provider, setProvider] = createSignal("")
    const [venue, setVenue] = createSignal("")

    return (
        <Modal size="xl" centered opened={props.isOpen()} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    Add Bulk Event
                </ModalHeader>
                <ModalBody>
                    <HStack mb="$4" spacing="$4">
                        <SimpleSelect placeholder="Search Venues">
                            <SimpleOption value="test">Test</SimpleOption>
                        </SimpleSelect>
                        <Button leftIcon={<VsSave />} onClick={props.onClose}>Save</Button>
                    </HStack>
                    <Box overflow="scroll">
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
                                </Tr>
                                <Tr>
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
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AddBulkEvent
