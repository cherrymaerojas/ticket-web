import { Flex, useColorModeValue } from "@hope-ui/solid"
import AvatarProfile from "../components/AvatarProfile"

export default function HeaderNav() {
    return (
        <Flex
            ml="$60"
            px="$4"
            height="$20"
            alignItems="center"
            bg="unset"
            borderBottomWidth="2px"
            borderBottomColor={useColorModeValue('$blackAlpha3', '$blackAlpha7')()}
            justifyContent='flex-end'>
            <AvatarProfile />
        </Flex>
    )
}
