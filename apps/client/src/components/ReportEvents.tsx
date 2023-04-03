import {
    Flex,
    Icon,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    css
} from '@hope-ui/solid'
import { A } from '@solidjs/router'
import { FaRegularNoteSticky } from 'solid-icons/fa'
import { HiOutlineDocumentReport } from 'solid-icons/hi'

const activeClass = css({
    backgroundColor: "gainsboro"
})

export default function ReportEvents() {
    return <Menu placement='right-end'>
        <MenuTrigger
            w="$full"
            p="$4"
            cursor="pointer"
            px="$0"
            bg="none"
        >
            <Flex mx="$8">
                <Icon
                    mr="$4"
                    fontSize="$lg"
                    as={HiOutlineDocumentReport}
                />
                Reports
            </Flex>
        </MenuTrigger>
        <MenuContent>
            <MenuItem as={A} href='/reports/skybox' activeClass=''>
                <Icon
                    mr="$4"
                    fontSize="$lg"
                    as={FaRegularNoteSticky}
                />
                Skybox
            </MenuItem>
            <MenuItem as={A} href='/reports/events'>
                <Icon
                    mr="$4"
                    fontSize="$lg"
                    as={FaRegularNoteSticky}
                />
                Events
            </MenuItem>
            <MenuItem as={A} href='/reports/missing-pricing'>
                <Icon
                    mr="$4"
                    fontSize="$lg"
                    as={FaRegularNoteSticky}
                />
                Missing Pricing
            </MenuItem>
        </MenuContent>
    </Menu>
}
