import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { useNavbar } from '@/hooks/useNavbar';

interface ProjectModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    ProjectTitle: string;
    ProjectContent: string;
}

export default function ProjectModal(props: ProjectModalProps) {
    const { isOpen, onOpenChange, ProjectTitle, ProjectContent, onClose } =
        props;
    const { setNavbarVisible } = useNavbar();

    const onModalClose = () => {
        onClose();
        setNavbarVisible(true);
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            placement="center"
            size="5xl"
            backdrop="blur"
            onClose={onModalClose}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: 'easeOut',
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: 'easeIn',
                        },
                    },
                },
            }}
        >
            <ModalContent>
                {(onModalClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {ProjectTitle}
                        </ModalHeader>
                        <ModalBody>{ProjectContent}</ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="ghost"
                                onPress={onModalClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
