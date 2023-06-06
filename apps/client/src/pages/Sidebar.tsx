import {
    Box,
    Heading,
    useColorModeValue
} from '@hope-ui/solid'

import { IconTypes } from 'solid-icons'
import { AiOutlineDollarCircle, AiOutlineInfoCircle } from 'solid-icons/ai'
import { BiRegularAddToQueue } from 'solid-icons/bi'
import { FaSolidFileImport, FaSolidMasksTheater } from 'solid-icons/fa'
import { FiStar, FiTrendingUp } from 'solid-icons/fi'

import { For } from 'solid-js'
import Logo from '../components/Logo'
import ReportEvents from '../components/ReportEvents'
import SidebarItem from "../components/SidebarItem"


interface LinkItemProps {
    name: string
    path: string
    icon: IconTypes
}

const linkItems: Array<LinkItemProps> = [
    { name: 'Add Events', path: '/events', icon: BiRegularAddToQueue },
    { name: 'Under 100', path: '/under-100', icon: FiTrendingUp },
    { name: 'Seats Info', path: '/seats-info', icon: AiOutlineInfoCircle },
    { name: 'Custom Events', path: '/custom-events', icon: FiStar },
    { name: 'Venues', path: '/venues', icon: FaSolidMasksTheater },
    { name: 'Pricing', path: '/pricing', icon: AiOutlineDollarCircle },
    { name: 'XLS Import', path: '/xls-import', icon: FaSolidFileImport },
]

export default function Sidebar() {
    return <Box
        borderRightWidth="2px"
        borderRightColor={useColorModeValue('$blackAlpha3', '$blackAlpha7')()}
        w="$60"
        pos="fixed"
        h="$screenH">
        <Logo />
        <Heading mx="$8" mb="$4">Events</Heading>
        <For each={linkItems}>
            {
                (link) => <SidebarItem path={link.path} icon={link.icon}>
                    {link.name}
                </SidebarItem>
            }
        </For>
        <ReportEvents />
    </Box>
}
