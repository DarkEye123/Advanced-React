import Permissions from "../components/Permissions";
import RequireSignIn from "../components/RequireSignIn";
const PermissionsPage = props => (
  <RequireSignIn>
    <Permissions />
  </RequireSignIn>
);

export default PermissionsPage;
