// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'https://frontoffice-staging.digitale.comune.chiavari.ge.it/backend/api/suechiavaristaging',
  oikos_url: 'https://geo.portalecomuni.net/prodrest/api/stradarioliguria',
  // tslint:disable-next-line: max-line-length
  auth_url: 'https://login-staging.digitale.comune.chiavari.ge.it/?redirect_url=',
  // tslint:disable-next-line: max-line-length
  logout_url: ' https://login-staging.digitale.comune.chiavari.ge.it/logout?redirect_url=https://frontoffice-staging.digitale.comune.chiavari.ge.it',
  cookie_name: 'staging_comune_chiavari_ge_it_idtoken'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

