# Transactions CLI Typescript

We would like you to write an app that we can run from the command line, which:

---
## Requirements

For development, you will only need Node.js and npm, installed in your environement.

If the installation of nodejs was successful, you should be able to run the following command.

    $ node --version
    v16.9.0

    $ npm --version
    8.1.3

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

## Install, build, and test

    $ git clone https://github.com/hassan-abdi/transactions-cli-ts.git
    $ cd transactions-cli-ts
    $ npm install
    $ npm run create

## Run the app using npm

    $ npm run create && npm run start

## Configure app

You are able to change environment variables in the .env file which is located in root of the project.

    SERVICE_URL=https://resttest.bench.co
    CONCURRENT_REQUEST=5


## Installing and executing the cli app

    $ npm run local

This command will install the app as an executable standalone cli application. After successfull installation you should be able to execute the app in the command line without calling npm.

    $ trx

After execution, you should see report in the output stream:

    2013-12-12 -227.35
    2013-12-13 -1229.58
    2013-12-15 -5.39
    2013-12-16 -4575.53
    2013-12-17 10686.27
    2013-12-18 -1841.29
    2013-12-19 19753.30
    2013-12-20 -4054.60
    2013-12-21 -17.98
    2013-12-22 -110.71


### Scalability
In the aggregation process, on the first cycle, it tries to get the first page with just a single HTTP request. Once the aggregator receives the first page, it will automatically increase the number of concurrent HTTP requests for the subsequent cycles. Users are able to set a threshold for maximum concurrent HTTP requests.  

    CONCURRENT_REQUEST=5

>DefaultTransactionSummaryReport.aggregateAllTransactionsByDate()


## Technology Stack
- NodeJS
- Typescript
- Yargs
- Axios
- Jest

## Todo
- Enable users to set environment variables in arguments
