import { HStack, IconButton, useColorMode } from "@hope-ui/solid"
import { BsSunFill } from 'solid-icons/bs'
import { FaRegularMoon } from 'solid-icons/fa'

export default function ColorMode() {
    const { colorMode, toggleColorMode } = useColorMode()

    return <HStack padding="1rem">
        <IconButton variant="ghost" aria-label="Search" onclick={toggleColorMode} icon={colorMode() === 'light' ? <BsSunFill /> : <FaRegularMoon />} />
    </HStack>
}
