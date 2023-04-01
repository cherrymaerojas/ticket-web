import {
    Box,
    useColorModeValue
} from '@hope-ui/solid'

import { IconTypes } from 'solid-icons'
import { AiOutlineDollarCircle, AiOutlineInfoCircle } from 'solid-icons/ai'
import { BiRegularAddToQueue } from 'solid-icons/bi'
import { FaSolidFileImport, FaSolidMasksTheater } from 'solid-icons/fa'
import { FiStar, FiTrendingUp } from 'solid-icons/fi'

import Logo from '../components/Logo'
import ReportEvents from '../components/ReportEvents'
import SidebarItem from "../components/SidebarItem"


interface LinkItemProps {
    name: string
    icon: IconTypes
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Add Events', icon: BiRegularAddToQueue },
    { name: 'Under 100', icon: FiTrendingUp },
    { name: 'Seats Info', icon: AiOutlineInfoCircle },
    { name: 'Custom Events', icon: FiStar },
    { name: 'Venues', icon: FaSolidMasksTheater },
    { name: 'Pricing', icon: AiOutlineDollarCircle },
    { name: 'XLS Import', icon: FaSolidFileImport },
]

export default function Sidebar() {
    return <Box
        borderRightWidth="2px"
        borderRightColor={useColorModeValue('$blackAlpha3', '$blackAlpha7')()}
        w="$60"
        pos="fixed"
        h="$screenH">

        <Logo />

        {LinkItems.map((link) => (
            <SidebarItem icon={link.icon}>
                {link.name}
            </SidebarItem>
        ))}

        <ReportEvents />
    </Box>
}
