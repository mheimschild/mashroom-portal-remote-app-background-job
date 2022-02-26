
import context from '@mashroom/mashroom-portal-remote-app-registry/dist/context';
import type {MashroomBackgroundJobPluginBootstrapFunction} from '@mashroom/mashroom-background-jobs/type-definitions';
import RegisterPortalRemoteAppsBackgroundJobWithFailureDelay from './RegisterPortalRemoteAppsBackgroundJobWithFailureDelay';

const bootstrap: MashroomBackgroundJobPluginBootstrapFunction = (pluginName, pluginConfig, pluginContextHolder) => {
    const { socketTimeoutSec, registrationRefreshIntervalSec } = pluginConfig;

    const registerBackgroundJob = new RegisterPortalRemoteAppsBackgroundJobWithFailureDelay(socketTimeoutSec, registrationRefreshIntervalSec, pluginContextHolder);
    context.backgroundJob = registerBackgroundJob;

    // Run immediately
    registerBackgroundJob.run();

    return registerBackgroundJob.run.bind(registerBackgroundJob);
};

export default bootstrap;
