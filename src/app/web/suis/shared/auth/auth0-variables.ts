interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'RcyA3BAI1ffqJZL4uNKWkZLSecel2VE2',
  domain: 'suis.auth0.com',
  callbackURL: 'http://localhost:4200/callback'
};
