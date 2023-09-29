import React, { useState } from 'react';
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
import { Project, TechStack } from '@/models/data';
import { useTheme } from '@/hooks/useTheme';
import { parseResponsibilitiesData } from '@/lib/parseTextIntoComponent';
import Image from 'next/image';
import { Skeleton } from '@nextui-org/skeleton';

interface ProjectModalProps extends Project {
    isOpen: boolean;
    onOpenChange: () => void;
    onClose: () => void;
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
        thumbnailUrl,
        screenshotUrls,
    } = props;
    const { setNavbarVisible } = useNavbar();
    const { theme } = useTheme();
    const [isImageLoaded, setIsImageLoaded] = useState(
        screenshotUrls.reduce<{ [key: number]: boolean }>((acc, _, index) => {
            acc[index] = false;
            return acc;
        }, {}),
    );

    const onModalClose = () => {
        onClose();
        setNavbarVisible(true);
    };

    const handleOnLoadingComplete = (index: number) => {
        setIsImageLoaded((prevState) => ({
            ...prevState,
            [index]: true,
        }));
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
                            <div className="flex items-end justify-between">
                                <h1 className="text-3xl highlightedFontColor">
                                    {projectTitle}
                                </h1>
                                <h3 className="text-lg font-medium highlightedFontColor">
                                    {role}
                                </h3>
                            </div>

                            {/* Tech Used */}
                            <ul className="flex flex-wrap gap-4 mt-4">
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
                        </ModalHeader>
                        <ModalBody className="pt-4 gap-8 flex flex-col items-center">
                            {/* Context */}
                            <p className="font-semibold text-base text-center italic px-8">
                                {context}
                            </p>

                            <Image
                                src={thumbnailUrl}
                                alt={'Project I worked on'}
                                quality={95}
                                loading="lazy"
                                className="rounded-lg shadow-2xl"
                            />

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

                            {/* Screenshots */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-semibold highlightedFontColor">
                                    Screenshots
                                </h2>
                                <div className="flex flex-wrap gap-8">
                                    {screenshotUrls.map(
                                        (screenshotUrl, index) => (
                                            <Skeleton
                                                key={index}
                                                isLoaded={isImageLoaded[index]}
                                            >
                                                <Image
                                                    src={screenshotUrl}
                                                    alt={'Project Screenshot'}
                                                    quality={95}
                                                    onLoadingComplete={() =>
                                                        handleOnLoadingComplete(
                                                            index,
                                                        )
                                                    }
                                                    className="rounded-lg shadow-2xl"
                                                />
                                            </Skeleton>
                                        ),
                                    )}
                                </div>
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
