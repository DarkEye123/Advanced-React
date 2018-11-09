import ResetPassword from "../components/ResetPassword";
const ResetPage = props => <ResetPassword token={props.query.resetToken} />;

export default ResetPage;
