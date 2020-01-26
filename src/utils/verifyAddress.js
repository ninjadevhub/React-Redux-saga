import get from 'lodash/get';
import { appConfig } from 'config/appConfig';

const { SmartyStreetsSDK } = window;

// eslint-disable-next-line
export function verifyAddress({ zipcode, state, city, address }) {
  const SmartyStreetsCore = SmartyStreetsSDK.core;
  const { usStreet: { Lookup } } = SmartyStreetsSDK;

  // Add your credentials to a credentials object.
  const credentials = new SmartyStreetsCore.StaticCredentials(appConfig.smartyStreetAuthId, appConfig.smartyStreetAuthToken);

  const clientBuilder = new SmartyStreetsCore.ClientBuilder(credentials);
  const client = clientBuilder.buildUsStreetApiClient();
  const lookup = new Lookup();
  if (address) {
    lookup.street = address;
  }

  if (zipcode) {
    lookup.zipcode = zipcode;
  }

  if (state) {
    lookup.state = state;
  }

  if (city) {
    lookup.city = city;
  }

  lookup.candidates = 10;

  return new Promise((resolve, reject) => {
    client.send(lookup)
      .then((response) => {
        resolve(get(response, 'lookups[0].result[0]'));
      })
      .catch((response) => {
        reject(response);
      });
  });
}
