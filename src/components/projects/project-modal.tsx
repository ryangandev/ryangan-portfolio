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
import { IconsData, TechStack } from '@/models/data';
import { useTheme } from '@/hooks/useTheme';
import { parseResponsibilitiesData } from '@/lib/parseTextIntoComponent';

interface ProjectModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
    projectTitle: string;
    role: string;
    techUsed: IconsData;
    context: string;
    overview: readonly string[];
    features: readonly { title: string; detail: string }[];
    responsibilities: readonly string[];
    thumbnailUrl: string;
    screenshotUrls: readonly string[];
}

export default function ProjectModal(props: ProjectModalProps) {
    const {
        isOpen,
        onOpenChange,
        onClose,
        projectTitle,
        role,
        techUsed,
        context,
        overview,
        features,
        responsibilities,
        screenshotUrls,
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
                            <h1 className="text-3xl highlightedFontColor">
                                {projectTitle}
                            </h1>
                            <h3 className="text-lg font-medium leading-6 highlightedFontColor">
                                {role}
                            </h3>
                        </ModalHeader>
                        <ModalBody className="gap-8">
                            {/* Tech Used */}
                            <ul className="flex flex-wrap gap-4 sm:mt-auto">
                                {techUsed.map((tech, index) => (
                                    <li
                                        className="flex text-base highlightedFontColor gap-2 justify-center items-center"
                                        key={index}
                                    >
                                        <TechStackIcon
                                            type={tech.iconType as TechStack}
                                            isDarkMode={theme === 'dark'}
                                        />
                                        <span className="text-xs font-medium">
                                            {tech.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Context */}
                            <p className="font-semibold text-base text-center italic px-4">
                                {context}
                            </p>

                            {/* Overview */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold highlightedFontColor">
                                    Overview
                                </h2>
                                {overview.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="text-base highlightedFontColor"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Features */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold highlightedFontColor">
                                    Features
                                </h2>
                                <ul className="modalListContent">
                                    {features.map((feature, index) => (
                                        <li
                                            className="text-base descriptionFontColor"
                                            key={index}
                                        >
                                            <span className="font-bold highlightedFontColor">
                                                {feature.title}
                                            </span>{' '}
                                            - {feature.detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Responsibilities */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold highlightedFontColor">
                                    Responsibilities
                                </h2>
                                <ul className="modalListContent">
                                    {responsibilities.map(
                                        (responsibility, index) => (
                                            <li
                                                className="text-base descriptionFontColor"
                                                key={index}
                                            >
                                                {parseResponsibilitiesData(
                                                    responsibility,
                                                )}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
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
