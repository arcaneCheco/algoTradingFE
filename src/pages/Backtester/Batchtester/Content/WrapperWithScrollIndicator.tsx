import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

export const WrapperWithScrollIndicator = ({
  children,
}: {
  children?: JSX.Element | JSX.Element[];
}) => {
  const $wrapper = useRef<HTMLDivElement>(null);

  const [scrollIndicatorShadow, setScrollIndicatorShadow] = useState("");

  const scrollHandler = () => {
    let s = "";
    if ($wrapper && $wrapper.current) {
      const {
        offsetHeight,
        scrollHeight,
        scrollTop,
        scrollWidth,
        offsetWidth,
        scrollLeft,
      } = $wrapper.current;

      if (scrollTop > 0) {
        s += ",linear-gradient(#ffffff, #00000000 20%) center top";
      }
      if (scrollHeight - offsetHeight > scrollTop) {
        s += ",linear-gradient(#00000000 80%, #ffffff) center bottom";
      }
      if (scrollWidth - offsetWidth > scrollLeft) {
        s += ",linear-gradient(to left, #ffffff, #00000000 10%) center left";
      }
      if (scrollLeft > 0) {
        s += ",linear-gradient(to left, #00000000 90%, #ffffff) center right";
      }

      setScrollIndicatorShadow(s.substring(1));
    }
  };

  useEffect(() => {
    $wrapper?.current?.addEventListener("scroll", scrollHandler);

    return () =>
      $wrapper?.current?.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <Wrapper ref={$wrapper} $scrollIndicatorShadow={scrollIndicatorShadow}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $scrollIndicatorShadow: string }>`
  display: flex;
  overflow: auto;
  background: ${(props) => props.$scrollIndicatorShadow};
  min-height: 94px;
  max-height: 300px;
`;
