## Prerequisites

- Node.js (version 20.x or later)
- npm (Node Package Manager)
- Serverless Framework installed globally (`npm install -g serverless`)
- AWS account with IAM permissions to deploy Lambda functions

## Project Structure

```
aws-node-http-api-typescript-dynamodb
├── src
│   └── test.ts           # Handler function for AWS Lambda (/test endpoint)
├── serverless.yml        # Serverless Framework configuration
├── package.json          # npm configuration and dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Setup Instructions

1. Clone the repository or download the project files.
2. Install aws credentials with:
   ```
   aws configure
   ```
3. Install the project dependencies:
   ```
   npm install
   ```

## Deployment

To deploy the application to AWS Lambda, run:
```
serverless deploy
```
After deployment, note the endpoint URL provided in the output.

## Usage

You can test the deployed Lambda function by sending a GET request to the `/test` endpoint:
```
curl https://<your-api-id>.execute-api.<region>.amazonaws.com/test
```
It should return:
```json
{ "message": "TEST" }
```