import { Avatar, Divider, HStack, Icon, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text } from "@hope-ui/solid"
import { FaSolidGear } from 'solid-icons/fa'
import { TbPower } from 'solid-icons/tb'
import type { Component } from 'solid-js'

const AvatarProfile: Component = () => (
    <HStack padding="1rem">
        <Popover>
            <PopoverTrigger as={Avatar} variant="ghost" colorScheme="neutral" />
            <PopoverContent width="10%">
                <PopoverArrow />
                <PopoverBody cursor="pointer">
                    <HStack justifyContent="center">
                        <Icon as={FaSolidGear} marginRight=".5rem" />
                        <Text>Settings</Text>
                    </HStack>
                </PopoverBody>
                <Divider />
                <PopoverBody cursor="pointer">
                    <HStack justifyContent="center">
                        <Icon as={TbPower} marginRight=".5rem" />
                        <Text>Logout</Text>
                    </HStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    </HStack>
)

export default AvatarProfile
