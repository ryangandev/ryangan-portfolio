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
import { TechStackIcon } from '@/assets/icons';
import { TechStack } from '@/models/data';
import { useTheme } from '@/hooks/useTheme';

interface ProjectModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    projectTitle: string;
    projectRole: string;
    projectContent: string;
    projectTags: readonly string[];
    projectContext: string;
    projectScreenshotUrls: readonly string[];
}

export default function ProjectModal(props: ProjectModalProps) {
    const {
        isOpen,
        onOpenChange,
        onClose,
        projectTitle,
        projectRole,
        projectContent,
        projectTags,
        projectContext,
        projectScreenshotUrls,
    } = props;
    const { setNavbarVisible } = useNavbar();
    const { theme } = useTheme();

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
            size="2xl"
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
                            <h1 className="text-3xl">{projectTitle}</h1>
                            <h3 className="text-lg font-medium leading-6">
                                {projectRole}
                            </h3>
                        </ModalHeader>
                        <ModalBody className="gap-8">
                            <ul className="flex flex-wrap gap-4 sm:mt-auto">
                                {projectTags.map((tag, index) => (
                                    <li
                                        className="flex text-base gap-2 justify-center items-center"
                                        key={index}
                                    >
                                        <TechStackIcon
                                            type={tag as TechStack}
                                            isDarkMode={theme === 'dark'}
                                        />
                                        <span className="text-sm">{tag}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="font-semibold text-base text-center italic px-4">
                                {projectContext}
                            </p>
                            <p>{projectContent}</p>
                        </ModalBody>
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
