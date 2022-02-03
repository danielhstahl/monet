import { OktaAuth } from "@okta/okta-auth-js";

export const getOktaUser = (oktaAuth: OktaAuth) => () => oktaAuth.getUser().then(({ preferred_username, email }) => preferred_username || email)