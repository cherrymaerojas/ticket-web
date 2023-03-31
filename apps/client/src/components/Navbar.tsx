import { HStack, Text } from "@hope-ui/solid"
import type { Component } from 'solid-js'
import AvatarProfile from "./AvatarProfile"
import ColorMode from "./ColorMode"

const NavBar: Component = () => (
    <HStack justifyContent="space-between" padding="1rem">
        <Text>Tickets Counter</Text>
        <HStack>
            <ColorMode />
            <AvatarProfile />
        </HStack>
    </HStack>
)

export default NavBar
