import {
    Box, Center, HStack,
    Icon,
    IconButton,
    IconProps,
    Image,
    Input,
    Skeleton,
    Switch,
    Table,
    Tbody, Td,
    Th, Thead, Tr
} from '@hope-ui/solid'
import { FiExternalLink } from 'solid-icons/fi'
import { TbRefresh } from 'solid-icons/tb'
import { For, createResource, createSignal } from 'solid-js'

import axios from 'axios'
import BROADWAYSACR from '../assets/providers/BROADWAYSACR.png'
import HULTCENTER from '../assets/providers/HULTCENTER.png'
import MPV from '../assets/providers/MPV.png'
import OMAHA from '../assets/providers/OMAHA.png'
import PLAYHOUSESQUARE from '../assets/providers/PLAYHOUSESQUARE.png'
import SCFTA from '../assets/providers/SCFTA.png'
import SFSYMPHONY from '../assets/providers/SFSYMPHONY.png'

interface Image {
    OMAHA: string
    BROADWAYSACR: string
    HULTCENTER: string
    MPV: string
    PLAYHOUSESQUARE: string
    SCFTA: string
    SFSYMPHONY: string
}
const images: Image = {
    OMAHA,
    BROADWAYSACR,
    HULTCENTER,
    MPV,
    PLAYHOUSESQUARE,
    SCFTA,
    SFSYMPHONY
}


const tableHeaders: string[] = [
    'Venue',
    'Event Link',
    'Provider',
    'Timestamp',
    'Row Section',
    'Seat Number',
    'Skybox',
    'Availability',
    'Actions'
]

async function fetchSeats() {
    return (await axios.get('api/tickets', { withCredentials: true })).data
}

const CircleIcon = (props: IconProps) => (
    <Icon viewBox='0 0 200 200' {...props}>
        <path
            fill='currentColor'
            d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
        />
    </Icon>
)

export default function SeatsInfo() {
    const [events] = createResource(fetchSeats)
    const [isChecked, setChecked] = createSignal(false)

    return (
        <Box ml="$60" p="$4">
            <HStack marginBottom="$4" justifyContent="space-between">
                <Input disabled={events.loading} w="auto" placeholder="Search Events" />
                <HStack spacing="$4">
                    <Switch checked={isChecked()} onChange={() => setChecked(!isChecked())} disabled={events.loading} labelPlacement="end" variant="filled">Show Expired Events</Switch>
                    <IconButton disabled={events.loading} aria-label="Refresh" icon={<TbRefresh />} />
                </HStack>
            </HStack>
            <Skeleton height="$md" loaded={!events.loading}>
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
                            <For each={events()}>
                                {
                                    (event) => <Tr>
                                        <Td>{event.event.performance.venue.name}</Td>
                                        <Td><a href={event.event.ticket_link} target="_blank">{event.name}<FiExternalLink /></a></Td>
                                        <Td>
                                            <HStack spacing="$1">
                                                {event.event.performance.provider.name}
                                            </HStack>
                                        </Td>
                                        <Td>{event.event.date}</Td>
                                        <Td>{event.row}</Td>
                                        <Td>{event.seat_number}</Td>
                                        <Td><Center><CircleIcon boxSize="$3" color={`${event.in_skybox ? "green" : "red"}`} /></Center></Td>
                                        <Td><Center><CircleIcon boxSize="$3" color={`${!event.in_skybox ? "green" : "red"}`} /></Center></Td>
                                        <Td>ACTIONS</Td>
                                    </Tr>
                                }
                            </For>
                        </Tbody>
                    </Table>
                </Box>
            </Skeleton>
        </Box>
    )
}
