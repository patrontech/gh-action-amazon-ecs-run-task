const core = require('@actions/core');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');

// Deploy to a service that uses the 'ECS' deployment controller
function runECSTask(client, params) {
    console.log('Creating ECS Task');
    console.log(JSON.stringify(params));
//    core.info(`Deployment started. Watch this deployment's progress in the Amazon ECS console: https://console.aws.amazon.com/ecs/home?region=${aws.config.region}#/clusters/${clusterName}/services/${service}/events`);
    try{
        const command = new RunTaskCommand(params);
        console.log((command))
        const response = client.send(command);
        console.log((response))
        return response;
    }
    catch (error) {
        console.log(error.toString())
        core.setFailed(error.message);
    }
    /***
     // Wait for service stability
     if (waitForService && waitForService.toLowerCase() === 'true') {
        core.debug(`Waiting for the service to become stable. Will wait for ${waitForMinutes} minutes`);
        const maxAttempts = (waitForMinutes * 60) / WAIT_DEFAULT_DELAY_SEC;
        await ecs.waitFor('servicesStable', {
            services: [service],
            cluster: clusterName,
            $waiter: {
                delay: WAIT_DEFAULT_DELAY_SEC,
                maxAttempts: maxAttempts
            }
        }).promise();
    } else {
        core.debug('Not waiting for the service to become stable');
    }
     ***/
}

function run() {
    try {
        const awsCredentials = JSON.parse(core.getInput('aws-credentials', { required: true }));
        const client = new ECSClient({
            customUserAgent: 'amazon-ecs-run-task-for-github-actions',
            region: awsCredentials.region,
            credentials: {
                accessKeyId: awsCredentials.accessKeyId,
                secretAccessKey: awsCredentials.secretAccessKey
            }
        });
        // Get Inputs From Action.
        const capacityProviderStrategy = JSON.parse(core.getInput('capacity-provider-strategy', { required: false }));
        const cluster = core.getInput('cluster', { required: false });
        const count = parseInt(core.getInput('count', { required: false }));
        const enableECSManagedTags = core.getBooleanInput('enable-ecs-managed-tags', { required: false });
        const enableExecuteCommand = core.getBooleanInput('enable-execute-command', { required: false });
        const group = core.getInput('group', { required: false });
        let launchType = null;
        if (capacityProviderStrategy.length !== 0) {
            launchType = core.getInput('launch-type', {required: false});
        }
        const networkConfiguration = JSON.parse(core.getInput('network-configuration', { required: false }));
        const overrides = JSON.parse(core.getInput('overrides', { required: false }));
        const placementConstraints = JSON.parse(core.getInput('placement-constraints', { required: false }));
        const placementStrategy = JSON.parse(core.getInput('placement-strategy', { required: false }));
        const placementVersion = core.getInput('placement-version', { required: false });
        const propagateTags = core.getInput('propagate-tags', { required: false });
        const referenceId = core.getInput('reference-id', { required: false });
        const startedBy = core.getInput('started-by', { required: false });
        const tags = JSON.parse(core.getInput('tags', { required: false }));
        const platformVersion = core.getInput('platform-version', { required: false });
        const taskDefinition = core.getInput('task-definition', { required: true });
        const params = {
            capacityProviderStrategy: capacityProviderStrategy, // The name of the bucket. For example, 'sample_bucket_101'.
            cluster: cluster, // The name of the object. For example, 'sample_upload.txt'.
            count: count, // The content of the object. For example, 'Hello world!".
            enableECSManagedTags: enableECSManagedTags,
            enableExecuteCommand: enableExecuteCommand,
            group: group,
            ...!(launchType) && {launchType: launchType},
            networkConfiguration: networkConfiguration,
            overrides: overrides,
            placementConstraints: placementConstraints,
            placementStrategy: placementStrategy,
            platformVersion : platformVersion,
            propagateTags: propagateTags,
            referenceId: referenceId,
            startedBy: startedBy,
            tags: tags,
            taskDefinition: taskDefinition
        };
        console.log(JSON.stringify(params));
        const result = runECSTask(client,params)
    }
    catch (error) {
        core.setFailed(error.message);
    }
}


run();