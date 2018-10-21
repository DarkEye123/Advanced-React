import Nav from "./Nav";
import styled from "styled-components";
import Link from "next/link";

const Logo = styled.h1`
  transform: skew(-7deg);
  font-size: 4rem;
  position: relative;
  z-index: 2;
  margin-left: 2rem;
  a {
    background-color: ${props => props.theme.red};
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
  }
  @media (max-width: ${props => props.theme.mediaSize}) {
    text-align: center;
    margin: 0;
  }
`;

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: ${props => props.theme.mediaSize}) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }

  .sub-bar {
    border-bottom: 1px solid ${props => props.theme.lightGrey};
    display: grid;
    grid-template-columns: 1fr auto;
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>Sick Fits</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <div className="sub-bar">
      <p>Search</p>
    </div>
    <div>Cart</div>
  </StyledHeader>
);

export default Header;
