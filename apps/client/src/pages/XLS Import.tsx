import {
    Box, Button
} from '@hope-ui/solid'


import { AiOutlineCloudUpload } from 'solid-icons/ai'

export default function XLSImport() {
    return (
        <Box ml="$60" p="$4">
            <Button leftIcon={<AiOutlineCloudUpload />}>
                Load File
            </Button>
        </Box>
    )
}
