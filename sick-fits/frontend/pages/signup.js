import styled from "styled-components";
import SignUp from "../components/SignUp";
const StyledGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 2rem;
`;

const Login = () => (
  <StyledGroup>
    <SignUp />
    <SignUp />
    <SignUp />
  </StyledGroup>
);

export default Login;
