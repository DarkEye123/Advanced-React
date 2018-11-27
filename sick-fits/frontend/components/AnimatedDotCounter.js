import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const AnimatedDot = styled.span`
  position: relative;
  .count {
    display: block;
    transition: all 0.4s;
    backface-visibility: hidden;
    position: relative;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: rotateX(0.5turn);
  }
`;

const Dot = styled.div`
  border-radius: 50%;
  color: white;
  line-height: 2rem;
  min-width: 3rem;
  padding: 0.5rem;
  font-weight: 100;
  margin-left: 1rem;
  background-color: ${props => props.theme.red};
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
`;

const AnimatedDotCounter = ({ number }) => (
  <AnimatedDot>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        timeout={{ enter: 400, exit: 400 }}
        key={number}
      >
        <Dot>{number}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimatedDot>
);

AnimatedDotCounter.propTypes = {
  number: PropTypes.number.isRequired,
};

export default AnimatedDotCounter;
