// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:8001/api/suechiavari',
  oikos_url: 'https://geo.portalecomuni.net/sue/api/suechiavari',
  // tslint:disable-next-line: max-line-length
  auth_url: 'https://login-staging.digitale.comune.chiavari.ge.it/?redirect_url=http://localhost:4200/?code=ssoreturn'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

