import { Box, Button } from "@hope-ui/solid"

import { AiOutlineCloudUpload } from "solid-icons/ai"

export default function XLSImport() {
  return (
    <>
      <Button leftIcon={<AiOutlineCloudUpload />}>Load File</Button>
    </>
  )
}
