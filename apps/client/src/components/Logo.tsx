import { Flex, Text } from "@hope-ui/solid"

export default function Logo() {
    return <Flex h="$20" alignItems="center" mx="$8" justifyContent="space-between">
        <Text fontSize="$lg" color="#27367f" fontFamily="$sans" fontWeight="bold">
            Tickets Counter
        </Text>
    </Flex>
}
