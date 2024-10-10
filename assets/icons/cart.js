import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
const Cart = ({ width, height, fill, ...props }) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        fill={fill}
        d="M29.334 12h-6.387l-5.854-8.76c-.533-.786-1.693-.786-2.213 0L9.027 12h-6.36c-.733 0-1.333.6-1.333 1.334 0 .12.013.24.053.36l3.387 12.36A2.652 2.652 0 0 0 7.334 28h17.333a2.68 2.68 0 0 0 2.573-1.946l3.387-12.36.04-.36c0-.734-.6-1.334-1.334-1.334ZM15.987 6.387 19.733 12H12.24l3.747-5.613ZM16 22.667A2.675 2.675 0 0 1 13.334 20c0-1.466 1.2-2.666 2.666-2.666 1.467 0 2.667 1.2 2.667 2.666 0 1.467-1.2 2.667-2.667 2.667Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={fill} d="M0 0h32v32H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Cart;
