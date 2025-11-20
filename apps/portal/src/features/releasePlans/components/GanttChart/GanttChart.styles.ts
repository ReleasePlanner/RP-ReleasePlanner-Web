import styled from "@emotion/styled";

export const TodayMarker = styled.div`
  border-left: 2px dashed
    ${(props) => props.theme?.palette?.secondary?.main || "#185ABD"};
`;

export const Preview = styled.div`
  height: 100%;
  border-radius: 0.125rem; /* rounded-sm */
  border: 2px solid
    ${(props) => props.theme?.palette?.primary?.main || "#217346"};
  background-color: ${(props) =>
    props.theme?.palette?.primary?.main || "#217346"}1A;
`;

export const PreviewContainer = styled.div<{
  left: number;
  top: number;
  width: number;
  height: number;
  zIndex: number;
}>`
  position: absolute;
  pointer-events: none;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  z-index: ${(props) => props.zIndex};
  will-change: transform, left, width;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
`;
