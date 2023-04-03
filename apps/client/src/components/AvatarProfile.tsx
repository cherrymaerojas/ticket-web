import { Avatar, Flex, HStack, Icon, Menu, MenuContent, MenuGroup, MenuItem, MenuLabel, MenuTrigger } from "@hope-ui/solid"
import { FaSolidGear, FaSolidPowerOff } from 'solid-icons/fa'

export default function AvatarProfile() {
    return (
        <HStack spacing="$6">
            <Flex alignItems={'center'}>
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
                            <MenuItem>
                                <Icon
                                    mr="$4"
                                    fontSize="$lg"
                                    as={FaSolidGear}
                                />
                                Settings
                            </MenuItem>
                            <MenuItem>
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
