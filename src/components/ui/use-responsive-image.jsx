import * as React from "react";

export function useResponsiveImage({ onLoad } = {}, parentRef) {
  const wrapperRef = React.useRef(null); const imgRef = React.useRef(null);
  React.useImperativeHandle(parentRef, () => imgRef.current);
  return { wrapperRef, imgRef, loaded: true, options: null, handleLoad: (event) => onLoad?.(event) };
}
