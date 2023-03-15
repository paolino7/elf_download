# Utility to download Event Monitoring and Real Time Event Monitoring data

## Setup

1. Download and install SFDX: https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_install_cli.htm
2. Downalod and install nodejs >= 18
3. Authenticate SF org with SFDX (eg. `sfdx org login web`)
4. `npm install` or `yarn install` *elf* project
5. Where you want to save the data create an `.env` file like `example.env` file to specified the Event do you want to download and configure the SF org

## Run

execute download with `node elf.js`

## Advanced

In *query* folder there are all the query to download the data