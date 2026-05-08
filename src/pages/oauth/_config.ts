import { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET } from 'astro:env/client';

export const clientId = OAUTH_GITHUB_CLIENT_ID;
export const clientSecret = OAUTH_GITHUB_CLIENT_SECRET;

export const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
export const tokenUrl = 'https://github.com/login/oauth/access_token';
