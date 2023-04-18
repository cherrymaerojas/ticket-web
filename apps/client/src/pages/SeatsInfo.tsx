import {
    Box, HStack,
    IconButton,
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
    'Capacity',
    'Upcoming Performance',
    'Skybox',
    'Timestamp(EST)',
    'Availability',
    'Actions'
]

async function fetchEvents() {
    const resukt = await fetch('/api/events')
    const thing = await resukt.json()
    return thing
}


export default function SeatsInfo() {
    const [events] = createResource(fetchEvents)
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
                                        <Td>{event.venue}</Td>
                                        <Td><a href={event.url} target="_blank">{event.name}<FiExternalLink /></a></Td>
                                        <Td>
                                            <HStack spacing="$1">
                                                {event.provider.name}
                                            </HStack>
                                        </Td>
                                        <Td>{event.num_seats}/{event.total_seats}</Td>
                                        <Td>1</Td>
                                        <Td>1</Td>
                                        <Td>2</Td>
                                        <Td>1</Td>
                                        <Td>2</Td>
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
