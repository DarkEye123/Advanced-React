import styled from "styled-components";
import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import RequestReset from "../components/RequestReset";
const StyledGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 2rem;
`;

const Login = () => (
  <StyledGroup>
    <SignUp />
    <SignIn />
    <RequestReset />
  </StyledGroup>
);

export default Login;
