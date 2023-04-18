import { Skeleton, VStack } from "@hope-ui/solid"
import { Component } from 'solid-js'

const range = (start: number, end: number, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i)

const SkeletonLayout: Component = () => {
    return (
        <VStack alignItems="stretch" spacing="$2">
            <Skeleton width="$md" height="20px" mb="$4" />
            {
                range(1, 11).map(_ => <Skeleton height="20px" mb="$4" />)
            }
        </VStack>
    )
}

export default SkeletonLayout
