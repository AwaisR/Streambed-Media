import React from "react";
import clsx from "clsx";
import { styled } from "twin.macro";

const CardDiv = styled.div`
  border-radius: 20px;
  box-shadow: 0 3px 10px rgba(0, 55, 74, 0.1);
  &.sliderCard {
    width: 230px;
  }
  &.termsCard {
    max-width: 230px;
    width: 100%;
  }
  &.cardsidebar {
    height: calc(100vh - 150px);
    box-shadow: 0px 3px 10px #00000034;
    border-radius: 20px;
    opacity: 1;
  }
  &.settings {
    margin-top: 11px;
  }
`;

const CardFooterDiv = styled.div`
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

export const Card = ({ className, children, ...rest }) => {
  return (
    <CardDiv className={clsx(className)} {...rest}>
      {children}
    </CardDiv>
  );
};

export const CardContent = ({ className, children, ...rest }) => {
  return (
    <div
      className={clsx(
        "py-2 px-3 text-copy text-base sm:text-sm sm:px-5 sm:py-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ className, children, ...rest }) => (
  <CardFooterDiv className={clsx(className)} {...rest}>
    {children}
  </CardFooterDiv>
);
