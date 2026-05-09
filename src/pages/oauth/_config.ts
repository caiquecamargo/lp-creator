import { OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET, OAUTH_GITHUB_URL, FORM_APIKEY } from 'astro:env/client';

export const clientId = OAUTH_GITHUB_CLIENT_ID;
export const clientSecret = OAUTH_GITHUB_CLIENT_SECRET;
export const githubUrl = OAUTH_GITHUB_URL;
export const githubApiKey = FORM_APIKEY;

export const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo,user`;
