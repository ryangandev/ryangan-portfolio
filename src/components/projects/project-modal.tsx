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
import { SocialMediaIcon } from '@/assets/icons/social-media-icons';
import { Project, SocialMedia, TechStack } from '@/models/data';
import { useTheme } from '@/hooks/useTheme';
import { parseResponsibilitiesData } from '@/lib/parse-text-into-component';
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
    sources,
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
                <h1 className="highlightedFontColor text-3xl">
                  {projectTitle}
                </h1>
                <div className="mb-1 flex flex-row gap-2 sm:gap-4">
                  {sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md flex flex-row items-center justify-center gap-1 font-medium sm:gap-2 sm:text-xl"
                    >
                      <SocialMediaIcon
                        type={source.icon as SocialMedia}
                        isDarkMode={theme === 'dark'}
                      />
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 sm:text-base">
                        {source.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Tech Used */}
              <ul className="mt-4 flex flex-wrap gap-4">
                {techUsed.map((tech, index) => (
                  <li
                    className="highlightedFontColor flex items-center justify-center gap-2 text-base"
                    key={index}
                  >
                    <TechStackIcon
                      type={tech.icon as TechStack}
                      isDarkMode={theme === 'dark'}
                    />
                    <span className="text-xs font-medium">{tech.name}</span>
                  </li>
                ))}
              </ul>
            </ModalHeader>
            <ModalBody className="flex flex-col items-center gap-8 pt-4">
              {/* Context */}
              <p className="px-8 text-center text-base font-semibold italic">
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
                <h2 className="highlightedFontColor text-2xl font-semibold">
                  Overview
                </h2>
                {overview.map((paragraph, index) => (
                  <p key={index} className="highlightedFontColor text-base">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Features */}
              <div className="flex flex-col gap-4">
                <h2 className="highlightedFontColor text-2xl font-semibold">
                  Features
                </h2>
                <ul className="modalListContent">
                  {features.map((feature, index) => (
                    <li className="descriptionFontColor text-base" key={index}>
                      <span className="highlightedFontColor font-bold">
                        {feature.title}
                      </span>{' '}
                      - {feature.detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Responsibilities */}
              <div className="flex flex-col gap-4">
                <h2 className="highlightedFontColor text-2xl font-semibold">
                  Responsibilities ({role})
                </h2>
                <ul className="modalListContent">
                  {responsibilities.map((responsibility, index) => (
                    <li className="descriptionFontColor text-base" key={index}>
                      {parseResponsibilitiesData(responsibility)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Screenshots */}
              <div className="flex flex-col gap-4">
                <h2 className="highlightedFontColor text-2xl font-semibold">
                  Screenshots
                </h2>
                <div className="flex flex-wrap gap-8">
                  {screenshotUrls.map((screenshotUrl, index) => (
                    <Skeleton key={index} isLoaded={isImageLoaded[index]}>
                      <Image
                        src={screenshotUrl}
                        alt={'Project Screenshot'}
                        quality={95}
                        onLoadingComplete={() => handleOnLoadingComplete(index)}
                        className="rounded-lg shadow-2xl"
                      />
                    </Skeleton>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="ghost" onPress={onModalClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
