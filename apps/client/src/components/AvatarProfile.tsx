import { Avatar, Flex, HStack, Icon, Menu, MenuContent, MenuGroup, MenuItem, MenuLabel, MenuTrigger, createDisclosure } from "@hope-ui/solid"
import { useNavigate } from "@solidjs/router"
import axios from "axios"
import { FaSolidGear, FaSolidPowerOff } from 'solid-icons/fa'
import ChangePassword from "./ChangePassword"

export default function AvatarProfile() {
    const { isOpen, onOpen, onClose } = createDisclosure()
    const navigator = useNavigate()

    async function signOut() {
        // TODO(Lyndon): Does not work on browser only in postman
        // TODO(Lyndon): Cookie was not removed
        // TODO(Lyndon): Revert into token based
        return (await axios.get('api/session-authentication/sign-out'))
    }

    async function handleLogout() {
        const data = await signOut()
        if (data) {
            navigator('/login', { replace: true })
        }
    }

    return (
        <HStack spacing="$6">
            <Flex alignItems={'center'}>
                <ChangePassword onClose={onClose} isOpen={isOpen} />
                <Menu>
                    <MenuTrigger bg="none">
                        <HStack>
                            <Avatar
                                size='md'
                                cursor="pointer"
                            />
                        </HStack>
                    </MenuTrigger>
                    <MenuContent>
                        <MenuGroup>
                            <MenuLabel>Profile</MenuLabel>
                            <MenuItem onSelect={onOpen}>
                                <Icon
                                    mr="$4"
                                    fontSize="$lg"
                                    as={FaSolidGear}
                                />
                                Settings
                            </MenuItem>
                            <MenuItem onSelect={handleLogout}>
                                <Icon
                                    mr="$4"
                                    fontSize="$lg"
                                    as={FaSolidPowerOff}
                                />
                                Logout
                            </MenuItem>
                        </MenuGroup>
                    </MenuContent>
                </Menu>
            </Flex>
        </HStack>
    )
}
