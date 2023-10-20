import { VStack, Skeleton } from "@hope-ui/solid"

const SkeletonLoader = () => (
  <VStack alignItems="stretch" spacing="$2">
    <Skeleton height="$sm" />
    <Skeleton height="$sm" />
    <Skeleton height="$sm" />
  </VStack>
)

export default SkeletonLoader
