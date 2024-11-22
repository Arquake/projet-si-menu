import React, { useRef, useEffect } from "react";
import { interpolate } from "flubber";

interface ProfileOrArrowProps {
    extendMenu: boolean;
}

const arrowPath: string = "M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z";
const accountPath: string = "M10 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-4.991 9A2 2 0 0 0 3 13c0 1.691.833 2.966 2.135 3.797C6.417 17.614 8.145 18 10 18s3.583-.386 4.865-1.203C16.167 15.967 17 14.69 17 13a2 2 0 0 0-2-2z";
const arrowViewBox: string = "0 0 24 24";
const accountViewBox: string = "0 0 20 20";

export const ProfileArrowSvg: React.FC<ProfileOrArrowProps> = ({ extendMenu }) => {

    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        const fromPath = extendMenu ? arrowPath : accountPath;
        const toPath = extendMenu ? accountPath : arrowPath;

        const interpolator = interpolate(fromPath, toPath, { maxSegmentLength: 1 });

        let animationFrameId: number;
        const animate = (t: number) => {
            if (pathRef.current) {
                pathRef.current.setAttribute("d", interpolator(t));
            }
            if (t < 1) {
                animationFrameId = requestAnimationFrame(() => animate(t + 0.05));
            }
        };
        animate(0);

        return () => cancelAnimationFrame(animationFrameId);
    }, [extendMenu]);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={!extendMenu? arrowViewBox : accountViewBox} className="h-8 aspect-square cursor-pointer">
            <path fill="currentColor" ref={pathRef} />
        </svg>
    );
};
