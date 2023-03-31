import { HStack, Text } from "@hope-ui/solid"
import type { Component } from 'solid-js'
import ColorMode from "./ColorMode"

const NavBar: Component = () => (
    <HStack justifyContent="space-between" padding="1rem">
        <Text>Tickets Counter</Text>
        <ColorMode />
    </HStack>
)

export default NavBar
