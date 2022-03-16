const core = require('@actions/core');
const axios = require('axios');

async function main() {
    try {
        const appCenterToken = core.getInput('appcenter-token');
        const branch = core.getInput('branch');
        const projectId = core.getInput('project-id');

        const url = `https://api.appcenter.ms/v0.1/apps/${projectId}/branches/${branch}/builds`;

        const config = {
            url,
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "x-api-token": appCenterToken
            },
            data: {
            }
        };

        const response = await axios(config);

        console.log(response);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
