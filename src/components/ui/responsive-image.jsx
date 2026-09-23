import * as React from "react";

export const ResponsiveImage = React.forwardRef(({ src, alt = "", className, style, ...props }, ref) => <img ref={ref} src={src} alt={alt} className={className} style={style} loading="lazy" {...props} />);
ResponsiveImage.displayName = "ResponsiveImage";
