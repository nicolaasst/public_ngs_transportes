import * as React from "react";

const Image = React.forwardRef(({ src, alt = "", ...props }, ref) => <img ref={ref} src={src} alt={alt} {...props} />);
Image.displayName = "Image";
export { Image };
