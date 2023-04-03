import {
    Flex,
    FlexProps,
    Icon
} from '@hope-ui/solid'
import { IconTypes } from 'solid-icons'

interface NavItemProps extends FlexProps {
    icon: IconTypes
    children: string
}

export default function SidebarItem({ icon, children }: NavItemProps) {
    return (
        <a href="#">
            <Flex
                p="$4"
                mx="$4"
                borderRadius="$lg"
                role="group"
                cursor="pointer">
                {icon && (
                    <Icon
                        mr="$4"
                        fontSize="$lg"
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </a>
    )
}
