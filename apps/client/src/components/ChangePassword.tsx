import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@hope-ui/solid'

interface ChangePasswordProps {
    isOpen: () => boolean
    onClose: () => void
}

const ChangePassword = (props: ChangePasswordProps) => {
    return (
        <>
            <Modal
                opened={props.isOpen()}
                onClose={props.onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>Change Password</ModalHeader>
                    <ModalBody>
                        <FormControl id="currentPassword" mb="$4">
                            <FormLabel>Current Password</FormLabel>
                            <Input type='password' placeholder="Current Password" />
                        </FormControl>
                        <FormControl id="newPassword" mb="$4">
                            <FormLabel>New Password</FormLabel>
                            <Input type='password' placeholder="New Password" />
                        </FormControl>
                        <FormControl id="confPassword" mb="$4">
                            <FormLabel>Password Confirmation</FormLabel>
                            <Input type='password' placeholder="Password Confirmation" />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={props.onClose}>Update</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ChangePassword
