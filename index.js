const core = require('@actions/core');
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs');

// Deploy to a service that uses the 'ECS' deployment controller
async function runECSTask(client, params) {
    core.debug('Creating ECS Task');
    const command = new RunTaskCommand(params);
    core.info(`Deployment started. Watch this deployment's progress in the Amazon ECS console: https://console.aws.amazon.com/ecs/home?region=${aws.config.region}#/clusters/${clusterName}/services/${service}/events`);
    const response = await client.send(command);
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


async function run() {
    try {
        const awsCredentials = JSON.parse(core.getInput('awsCredentials', { required: true }));
        const client = new ECSClient({
            customUserAgent: 'amazon-ecs-run-task-for-github-actions',
            region: awsCredentials.region,
            credentials: {
                accessKeyId: awsCredentials.accessKeyId,
                secretAccessKey: awsCredentials.secretAccessKey
            }
        });
        // Get Inputs From ECS

        const capacityProviderStrategy = core.getInput('capacity-provider-strategy', { required: false });
        const cluster = core.getInput('cluster', { required: false });
        const count = core.getInput('count', { required: false });
        const enableECSManagedTags = core.getInput('enable-ecs-managed-tags', { required: false });
        const enableExecuteCommand = core.getInput('enable-execute-command', { required: false });
        const group = core.getInput('group', { required: false });
        const launchType = core.getInput('launch-type', { required: false });
        const networkConfiguration = core.getInput('network-configuration', { required: false });
        const overrides = core.getInput('overrides', { required: false });
        const placementConstraints = core.getInput('placement-constraints', { required: false });
        const placementStrategy = core.getInput('placement-strategy', { required: false });
        const placementVersion = core.getInput('placement-version', { required: false });
        const propagateTags = core.getInput('propagate-tags', { required: false });
        const referenceId = core.getInput('reference-id', { required: false });
        const startedBy = core.getInput('started-by', { required: false });
        const tags = core.getInput('tags', { required: false });
        const taskDefinition = core.getInput('task-definition', { required: true });

        const params = {
            capacityProviderStrategy: this.capacityProviderStrategy, // The name of the bucket. For example, 'sample_bucket_101'.
            cluster: this.cluster, // The name of the object. For example, 'sample_upload.txt'.
            count: this.count, // The content of the object. For example, 'Hello world!".
            enableECSManagedTags: this.enableECSManagedTags,
            enableExecuteCommand: this.enableExecuteCommand,
            group: this.group,
            launchType: this.launchType,
            networkConfiguration: this.networkConfiguration,
            overrides: this.overrides,
            placementConstraints: this.placementConstraints,
            placementStrategy: this.placementStrategy,
            platformVersion : this.platformVersion,
            propagateTags: this.propagateTags,
            referenceId: this.referenceId,
            startedBy: this.startedBy,
            tags: this.tags,
            taskDefinition: this.taskDefinition
        };
        const result = runECSTask(client,params)
    }
    catch (error) {
        core.setFailed(error.message);
    }
}


run();