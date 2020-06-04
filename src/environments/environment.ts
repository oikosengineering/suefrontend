// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://192.168.1.26/backend/api/suechiavari',
  oikos_url: 'https://geo.portalecomuni.net/sue/api/suechiavari',
  auth_url: 'https://login-staging.digitale.comune.chiavari.ge.it/?redirect_url=http://localhost:4200/home?code=ssoreturn',
  // tslint:disable-next-line: max-line-length
  key: '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAusHYPH5KXsVSx8QLxc8prrZ2ujjSKrMgd9YxY6a6CTsGSUz5xAWUPFXYuUwTMsBdi9bRvoaMIxa6TG9thO9hSAdi9GXcc9jyFhGfPYdJSDiJhzBDMJaeYAPkN+GYov05IXSkK35lL7eFYwCWKLNTAaScNGOTUUAJE/RBUE1u9Tt0H4dhE30/aGnzOkEinlIXc+oZHhEn1mfWprVPg86zU1o62Iqp09Xf7z/zf5wTr3rbCgX0ERdN4j2bsW3Jp+XB0A6ERRjaalSP2kyUwGG1nHYkKDB1CxwKO6o/Nrn+l9b/UjzZY4WPKIF8YzEbL9ei+r/+fYZuZR06/t2dC+IXnQIDAQAB-----END PUBLIC KEY-----'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

