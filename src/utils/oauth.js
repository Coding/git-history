import joinPath from 'join-path';

export const getOAuthOriginByCurrentDomain = () => {
    return 'https://coding.net'
}

export const getOAuthURL = () => joinPath(getOAuthOriginByCurrentDomain(), '/oauth_authorize.html')

export const getOAuthAccessTokenURL = () => joinPath(getOAuthOriginByCurrentDomain(), '/api/oauth/access_token')