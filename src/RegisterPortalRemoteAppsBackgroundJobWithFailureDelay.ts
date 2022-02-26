import RegisterPortalRemoteAppsBackgroundJob from '@mashroom/mashroom-portal-remote-app-registry/dist/jobs/RegisterPortalRemoteAppsBackgroundJob';
import type {RemotePortalAppEndpoint} from '@mashroom/mashroom-portal-remote-app-registry/type-definitions';
import type { MashroomPluginContextHolder } from '@mashroom/mashroom/type-definitions';

class RegisterPortalRemoteAppsBackgroundJobWithFailureDelay extends RegisterPortalRemoteAppsBackgroundJob {
  private _failureDelays: { [url: string]: number } = {};

  constructor(public _socketTimeoutSec: number , public _registrationRefreshIntervalSec: number, public _pluginContextHolder: MashroomPluginContextHolder) {
    super(_socketTimeoutSec, _registrationRefreshIntervalSec, _pluginContextHolder);
  }

  async refreshEndpointRegistration(remotePortalAppEndpoint: RemotePortalAppEndpoint): Promise<void> {
    const { url } = remotePortalAppEndpoint;

    if (this._failureDelays[url] && this._failureDelays[url] > Date.now()) {
        return this._logger.info(`Fetching remote endpoint data from URL: ${remotePortalAppEndpoint.url} postponed to ${new Date(this._failureDelays[url]).toISOString()} due to previous failure. Retry #${remotePortalAppEndpoint.retries}`);
    }

    return super.refreshEndpointRegistration(remotePortalAppEndpoint);
  }

  async fetchPortalAppDataAndUpdateEndpoint(remotePortalAppEndpoint: RemotePortalAppEndpoint): Promise<RemotePortalAppEndpoint> {
    const retriesBeforeFetch = remotePortalAppEndpoint.retries;
    const result = await super.fetchPortalAppDataAndUpdateEndpoint(remotePortalAppEndpoint);
    if (retriesBeforeFetch < result.retries) {
      this._failureDelays[remotePortalAppEndpoint.url] = Date.now() + (2 ** Math.min(10, result.retries)) * 1000;
    } else {
      delete this._failureDelays[remotePortalAppEndpoint.url];
    }

    return result;
  }
}

export default RegisterPortalRemoteAppsBackgroundJobWithFailureDelay;
