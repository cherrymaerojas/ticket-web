import {
    Flex,
    FlexProps,
    Icon,
    css
} from '@hope-ui/solid'
import { A } from '@solidjs/router'
import { IconTypes } from 'solid-icons'

interface NavItemProps extends FlexProps {
    icon: IconTypes
    path: string
    children: string
}

const activeClass = css({
    backgroundColor: "gainsboro"
})

export default function SidebarItem({ path, icon, children }: NavItemProps) {
    return (
        <A href={path} activeClass={activeClass()}>
            <Flex
                p="$4"
                mx="$4"
                borderRadius="$lg"
                role="group"
                bg="inherit"
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
        </A>
    )
}
