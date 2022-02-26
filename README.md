# Mashroom Portal Remote App Background Job Failure Delay

Background job for fetching remote apps included in the official mashroom server fetches remote apps - independent of theit state once a minute.
It leads to huge amount of error message in the console and logfiles when working on portal localy having once one (or several) running

This plugin solves this issue by replacing background job for fetching apps with a version adding delayed fetch when remote app does not respond

Delay is done using exponential backoff. It means - after first failure, fetch is delayed by 10 seconds, after second by 20 seconds, third by 40 seconds, etx

To replace default background job with this one add

    "Mashroom Portal Remote App Background Job"

to "ignorePlaugins" section in your mashroom.json file and add

```
{
      "path": "<path_to_the_project>/mashroom-portal-remote-app-background-job"
}
```

to list of "pluginPackageFolders"
