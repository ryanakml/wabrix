import React from "react";

interface CameraRigProps {
  scale?: number;
  translateX?: number;
  translateY?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  perspective?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  scale = 1,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  perspective = 1400,
  children,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `
            scale(${scale})
            translate3d(${translateX}px, ${translateY}px, 0px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
          `,
          transition: "transform 0.05s linear",
        }}
      >
        {children}
      </div>
    </div>
  );
};
