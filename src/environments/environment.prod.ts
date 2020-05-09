export const environment = {
  production: true,
  api_url: 'https://api-digitale.comune.chiavari.it/frontoffice',
  oikos_url: 'https://geo.portalecomuni.net/sue/api/suechiavari',
  authEndPoint: {
    redirect_uri: 'https://map.portalecomuni.net/mapguide/progetti/testing/suechiavari/',
    idmUrl: 'https://login.digitale.chiavari.ge.it/?response_type=code&client_id=client_id&redirect_uri=https://map.portalecomuni.net/mapguide/progetti/testing/suechiavari/&scope=read',
    client_id: 'client_id',
    client_secret: 'client_secret',
    access_token_uri: 'https://login.digitale.chiavari.ge.it/auth/token',
    user_authorization_uri: 'https://login.digitale.chiavari.ge.it/auth/authorize',
    grant_type: 'authorization_code',
    scope: 'read',
    host: 'https://login.digitale.chiavari.ge.it'
  }
};
