import { HStack, IconButton, useColorMode } from "@hope-ui/solid"
import { BsSunFill } from 'solid-icons/bs'
import { FaRegularMoon } from 'solid-icons/fa'
import type { Component } from 'solid-js'

const ColorMode: Component = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    return <HStack padding="1rem">
        <IconButton variant="ghost" aria-label="Search" onclick={toggleColorMode} icon={colorMode() === 'light' ? <BsSunFill /> : <FaRegularMoon />} />
    </HStack>
}

export default ColorMode
