type MdastNode = {
  type: string;
  value?: string;
  name?: string | null;
  attributes?: unknown[];
  children?: MdastNode[];
};

/**
 * A remark plugin that turns a paragraph of nothing but images, two or more,
 * into an `<ImageGallery>`. Images written on consecutive lines, as every
 * project's screenshots are, are one paragraph in Markdown, so a gallery
 * needs nothing new in the content, and an image on its own stays a
 * full-width image.
 *
 * The line breaks between the images are dropped, so the gallery's children
 * are exactly its images.
 */
export const groupImages = () => (tree: MdastNode) => {
  const visit = (node: MdastNode) => {
    node.children?.forEach((child, index) => {
      if (child.type !== 'paragraph') {
        visit(child);
        return;
      }

      const parts = child.children ?? [];
      const images = parts.filter((part) => part.type === 'image');
      const onlyImages = parts.every(
        (part) =>
          part.type === 'image' ||
          (part.type === 'text' && !part.value?.trim()),
      );

      if (images.length < 2 || !onlyImages) return;

      node.children![index] = {
        type: 'mdxJsxFlowElement',
        name: 'ImageGallery',
        attributes: [],
        children: images,
      };
    });
  };

  visit(tree);
};
