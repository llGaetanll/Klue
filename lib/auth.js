import { parseCookies } from "nookies";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("../pages/login"));

export default (PageComponent, { ssr = true } = {}) => {
  const WithLogin = ({ token }) => {
    // if serverside token or client side token are unavailable
    if (!token || !parseCookies().token) return <Login />;

    return <PageComponent {...props} />;
  };

  let token;
  if (ssr || PageComponent.getInitialProps) {
    // check server side token cookie
    WithLogin.getInitialProps = async ctx => {
      token = parseCookies(ctx).token;

      // Run getInitialProps from HOCed PageComponent
      const pageProps =
        typeof PageComponent.getInitialProps === "function"
          ? await PageComponent.getInitialProps(context)
          : {};

      // return serverside token
      return {
        ...pageProps,
        token
      };
    };
  }

  return WithLogin;
};
