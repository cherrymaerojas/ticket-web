import {
    Button,
    Checkbox,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    SelectContent,
    SelectIcon,
    SelectListbox,
    SelectOption,
    SelectOptionIndicator,
    SelectOptionText,
    SelectPlaceholder,
    SelectTrigger,
    SelectValue,
    Textarea
} from "@hope-ui/solid"
import { VsAdd } from "solid-icons/vs"
import { For, createSignal } from "solid-js"

interface AddEventProps {
    isOpen: () => boolean
    onClose: () => void
}

const AddEvent = (props: AddEventProps) => {
    const [provider, setProvider] = createSignal("")
    const [venue, setVenue] = createSignal("")

    return (
        <Modal centered opened={props.isOpen()} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Add Event</ModalHeader>
                <ModalBody>
                    <FormControl mb="$4">
                        <Input placeholder="Event/Venue Link" name="url" />
                    </FormControl>
                    <FormControl mb="$4">
                        <Select value={provider()} onChange={setProvider}>
                            <SelectTrigger>
                                <SelectPlaceholder>Choose a Provider</SelectPlaceholder>
                                <SelectValue />
                                <SelectIcon />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectListbox>
                                    <For each={["Test"]}>
                                        {item => (
                                            <SelectOption value={item}>
                                                <SelectOptionText>{item}</SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                        )}
                                    </For>
                                </SelectListbox>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormControl mb="$4">
                        <Select value={venue()} onChange={setVenue}>
                            <SelectTrigger>
                                <SelectPlaceholder>Search Venues</SelectPlaceholder>
                                <SelectValue />
                                <SelectIcon />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectListbox>
                                    <For each={["Test"]}>
                                        {item => (
                                            <SelectOption value={item}>
                                                <SelectOptionText>{item}</SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                        )}
                                    </For>
                                </SelectListbox>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormControl mb="$4">
                        <Select disabled>
                            <SelectTrigger>
                                <SelectPlaceholder>Search Performers</SelectPlaceholder>
                                <SelectValue />
                                <SelectIcon />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectListbox>
                                    <For each={["Test"]}>
                                        {item => (
                                            <SelectOption value={item}>
                                                <SelectOptionText>{item}</SelectOptionText>
                                                <SelectOptionIndicator />
                                            </SelectOption>
                                        )}
                                    </For>
                                </SelectListbox>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <Checkbox mb="$4" name="skybox_auto_sync" defaultChecked>Skybox Auto Sync</Checkbox>
                    <FormControl mb="$4">
                        <Input id="ref_id" type="input" placeholder="Reference (Optional)" />
                    </FormControl>
                    <FormControl mb="$4">
                        <Textarea name="description" placeholder="Description" />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button leftIcon={<VsAdd />} onClick={props.onClose}>Add Event</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddEvent
