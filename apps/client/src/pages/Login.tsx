import { Box, Button, Flex, FormControl, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, VStack } from "@hope-ui/solid"
import { AiFillEye, AiFillEyeInvisible, AiOutlineLock, AiOutlineUser } from 'solid-icons/ai'
import { OcSignout3 } from 'solid-icons/oc'
import { Show, createSignal } from "solid-js"
import { createStore } from "solid-js/store"
import { createLogin } from "../hooks/createLogin"
import useAuth from "../hooks/useAuth"

type FormFields = {
    username: string
    password: string
}

export default function Login() {
    const [showPassword, setShowPassword] = createSignal(false)
    const auth = useAuth()
    const { login } = createLogin()
    const [form, setForm] = createStore<FormFields>({
        username: "",
        password: ""
    })

    async function handleSubmit(e: Event) {
        e.preventDefault()
        login({
            username: form.username,
            password: form.password,
        })
    }

    function handleShowClick() {
        setShowPassword(!showPassword())
    }

    function handleUpdateFormField(fieldName: string) {
        return function (event: Event) {
            const inputElement = event.currentTarget as HTMLInputElement
            setForm({
                [fieldName]: inputElement.value
            })
        }
    }

    return (
        <Flex
            flexDirection="column"
            w="$screenW"
            h="$screenH"
            backgroundColor="gainsboro"
            justifyContent="center"
            alignItems="center"
        >
            <VStack
                flexDirection="column"
                mb="2"
                justifyContent="center"
                alignItems="center"
                backgroundColor="white"
                borderRadius="$md"
            >

                <Box minW="$md">
                    <form onSubmit={handleSubmit}>
                        <VStack
                            spacing="$4"
                            p="1rem"
                            boxShadow="$md"
                        >
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <AiOutlineUser color="$neutral8" />
                                    </InputLeftElement>
                                    <Input type="text"
                                        placeholder="Username"
                                        onChange={handleUpdateFormField("username")}
                                        disabled={auth?.auth.isLoading}
                                        value={form.username}
                                        required
                                    />
                                </InputGroup>
                            </FormControl>
                            <FormControl>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <AiOutlineLock color="$neutral8" />
                                    </InputLeftElement>
                                    <Input
                                        type={showPassword() ? "text" : "password"}
                                        placeholder="Password"
                                        onChange={handleUpdateFormField("password")}
                                        value={form.password}
                                        disabled={auth?.auth.isLoading}
                                        required
                                    />
                                    <InputRightElement width="4.5rem">
                                        <Show
                                            when={showPassword()}
                                            fallback={<IconButton outline="none" disabled={auth?.auth.isLoading} _focus={{
                                                boxShadow: "none"
                                            }} _active={{
                                                background: "unset",
                                            }} _hover={{
                                                background: "unset",
                                            }} color="$neutral10" variant="ghost" aria-label="Hide Password" icon={<AiFillEye />} onClick={handleShowClick} />}
                                        >
                                            <IconButton outline="none" _focus={{
                                                boxShadow: "none"
                                            }} _active={{
                                                background: "unset",
                                            }} _hover={{
                                                background: "unset",
                                            }} color="$neutral10" variant="ghost" disabled={auth?.auth.isLoading} aria-label="Show Password" icon={<AiFillEyeInvisible />} onClick={handleShowClick} />
                                        </Show>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button loadingText="Logging-in"
                                leftIcon={<OcSignout3 />}
                                type="submit"
                                variant="solid"
                                width="$full"
                                loading={auth?.auth.isLoading}
                            >
                                Login
                            </Button>
                        </VStack>
                    </form>
                </Box>
            </VStack>
        </Flex>
    )
}
