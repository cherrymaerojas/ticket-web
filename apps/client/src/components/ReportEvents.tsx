import {
    Flex,
    Icon,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger
} from '@hope-ui/solid'
import { FaRegularNoteSticky } from 'solid-icons/fa'
import { HiOutlineDocumentReport } from 'solid-icons/hi'

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
            <MenuItem>
                <Icon
                    mr="$4"
                    fontSize="$lg"
                    as={FaRegularNoteSticky}
                />
                Skybox
            </MenuItem>
            <MenuItem>
                <Icon
                    mr="$4"
                    fontSize="$lg"
                    as={FaRegularNoteSticky}
                />
                Events
            </MenuItem>
            <MenuItem>
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
