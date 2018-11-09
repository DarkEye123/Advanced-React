import CreateItem from "../components/CreateItem";
import RequireSignIn from "../components/RequireSignIn";
const Sell = props => (
  <RequireSignIn>
    <CreateItem />
  </RequireSignIn>
);

export default Sell;
