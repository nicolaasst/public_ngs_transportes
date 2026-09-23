export const IMAGE_LOAD_MODE = { ORIGINAL: "original", FALLBACK: "fallback" };
export const DEFAULT_TRANSFORM_WIDTH = 1024;
export const splitImageProps = (props) => ({ wrapperProps: {}, imageProps: props });
export const getOriginalImageUrl = (src) => src;
export const nextImageLoadMode = () => IMAGE_LOAD_MODE.FALLBACK;
