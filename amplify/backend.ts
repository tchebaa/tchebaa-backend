
import * as osis from "aws-cdk-lib/aws-osis";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { RemovalPolicy } from "aws-cdk-lib";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import {storage} from './storage/resource'
import * as s3 from 'aws-cdk-lib/aws-s3';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage
});


const s3Bucket = backend.storage.resources.bucket;


const cfnBucket = s3Bucket.node.defaultChild as s3.CfnBucket;


cfnBucket.accelerateConfiguration = {
  accelerationStatus: "Enabled" // 'Suspended' if you want to disable transfer acceleration
}

//Event table
const eventTable = backend.data.resources.cfnResources.amplifyDynamoDbTables['Event'];

//User table

const usersTable = backend.data.resources.cfnResources.amplifyDynamoDbTables['User'];


// Update event table settings
eventTable.pointInTimeRecoveryEnabled = true;


// Update user table settings
usersTable.pointInTimeRecoveryEnabled = true;

//Event table
eventTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE
};

//User table
usersTable.streamSpecification = {
  streamViewType: dynamodb.StreamViewType.NEW_IMAGE
};


// Get the DynamoDB Event table ARN
const eventTableArn = backend.data.resources.tables['Event'].tableArn;
// Get the DynamoDB Event table name
const eventTableName = backend.data.resources.tables['Event'].tableName;


// Get the DynamoDB User table ARN
const usersTableArn = backend.data.resources.tables['User'].tableArn;
// Get the DynamoDB User table name
const usersTableName = backend.data.resources.tables['User'].tableName;


const openSearchDomain = new opensearch.Domain(
  backend.data.stack,
  'OpenSearchDomain',
  {
    version: opensearch.EngineVersion.OPENSEARCH_2_11,
    capacity: {
      // upgrade instance types for production use
      masterNodeInstanceType: "t3.small.search",
      masterNodes: 0,
      dataNodeInstanceType: "t3.small.search",
      dataNodes: 1,
    },
    nodeToNodeEncryption: true,
    // set removalPolicy to DESTROY to make sure the OpenSearch domain is deleted on stack deletion.
    removalPolicy: RemovalPolicy.DESTROY,
    encryptionAtRest: {
      enabled: true
    }
  }
);




// Get the S3Bucket ARN
const s3BucketArn = backend.storage.resources.bucket.bucketArn;
// Get the S3Bucket Name
const s3BucketName = backend.storage.resources.bucket.bucketName;


// Create an IAM role for OpenSearch integration
const openSearchIntegrationPipelineRole = new iam.Role(
  backend.data.stack,
  "OpenSearchIntegrationPipelineRole",
  {
    assumedBy: new iam.ServicePrincipal("osis-pipelines.amazonaws.com"),
    inlinePolicies: {
      openSearchPipelinePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: ["es:DescribeDomain"],
            resources: [
              openSearchDomain.domainArn,
              openSearchDomain.domainArn + "/*",
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            actions: ["es:ESHttp*"],
            resources: [
              openSearchDomain.domainArn,
              openSearchDomain.domainArn + "/*",
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "s3:GetObject",
              "s3:AbortMultipartUpload",
              "s3:PutObject",
              "s3:PutObjectAcl",
            ],
            resources: [s3BucketArn, s3BucketArn + "/*"],
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "dynamodb:DescribeTable",
              "dynamodb:DescribeContinuousBackups",
              "dynamodb:ExportTableToPointInTime",
              "dynamodb:DescribeExport",
              "dynamodb:DescribeStream",
              "dynamodb:GetRecords",
              "dynamodb:GetShardIterator",
            ],
            resources: [eventTableArn, eventTableArn + "/*", usersTableArn, usersTableArn + "/*"],
          }),
        ],
      }),
    },
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonOpenSearchIngestionFullAccess"
      ),
    ],
  }
);



// Define OpenSearch Event index mappings
const eventIndexName = "event";


const eventIndexMapping = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
  },
  mappings: {
    properties: {
      id: {
        type: "keyword",
      },
      eventName: {
        type: "text",
      },
      eventDecription:{
        type: "text"
      },
      email: {
        type: "text"
      },
      personType: {
        type: "boolean"
      },
      companyEmail: {
        type: "text"
      },
      companyName: {
        type: "text"
      },
      personName: {
        type: "text"
      },
      eventMainImage: {
        properties: {
          aspectRatio: {
            type: "text"
          },
          url: {
            type: "text"
          }
        }
      },
      eventImage2: {
        properties: {
          aspectRatio: {
            type: "text"
          },
          url: {
            type: "text"
          }
        }
      },
      eventImage3: {
        properties: {
          aspectRatio: {
            type: "text"
          },
          url: {
            type: "text"
          }
        }
      },
      eventImage4: {
        properties: {
          aspectRatio: {
            type: "text"
          },
          url: {
            type: "text"
          }
        }
      },
      dateTimePriceList: {
        type: "nested"
      },
      ageRestriction: {
        type: "text"
      },
      categories: {
        type: "text"
      },
      eventAddress: {
        type: "text"
      },
      location: {
        type: "geo_shape"
      }
    },
  },
};

// Define OpenSearch User index mappings

const usersIndexName = "user";

const usersIndexMapping = {
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
  },
  mappings: {
    properties: {
      id: { type: "keyword" },
      email: { type: "text" },
      eventPostLimit: { type: "float" },
      pushNotificationToken: { type: "text" },
      // Add other user attributes here...
    }
  }
};






//Event OpenSearch template definition
const eventOpenSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
    dynamodb:
      acknowledgments: true
      tables:
        - table_arn: "${eventTableArn}"
          stream:
            start_position: "LATEST"
          export:
            s3_bucket: "${s3BucketName}"
            s3_region: "${backend.storage.stack.region}"
            s3_prefix: "${eventTableName}/"
      aws:
        sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
        region: "${backend.data.stack.region}"
  sink:
    - opensearch:
        hosts:
          - "https://${openSearchDomain.domainEndpoint}"
        index: "${eventIndexName}"
        index_type: "custom"
        template_content: |
          ${JSON.stringify(eventIndexMapping)}
        document_id: '\${getMetadata("primary_key")}'
        action: '\${getMetadata("opensearch_action")}'
        document_version: '\${getMetadata("document_version")}'
        document_version_type: "external"
        bulk_size: 4
        aws:
          sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
          region: "${backend.data.stack.region}"
`;

//User OpenSearch template definition
const usersOpenSearchTemplate = `
version: "2"
dynamodb-pipeline:
  source:
    dynamodb:
      acknowledgments: true
      tables:
        - table_arn: "${usersTableArn}"
          stream:
            start_position: "LATEST"
          export:
            s3_bucket: "${s3BucketName}"
            s3_region: "${backend.storage.stack.region}"
            s3_prefix: "${usersTableName}/"
      aws:
        sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
        region: "${backend.data.stack.region}"
  sink:
    - opensearch:
        hosts:
          - "https://${openSearchDomain.domainEndpoint}"
        index: "${usersIndexName}"
        index_type: "custom"
        template_content: |
          ${JSON.stringify(usersIndexMapping)}
        document_id: '\${getMetadata("primary_key")}'
        action: '\${getMetadata("opensearch_action")}'
        document_version: '\${getMetadata("document_version")}'
        document_version_type: "external"
        bulk_size: 4
        aws:
          sts_role_arn: "${openSearchIntegrationPipelineRole.roleArn}"
          region: "${backend.data.stack.region}"
`;




// Create an Event CloudWatch log group
const eventsLogGroup = new logs.LogGroup(backend.data.stack, "LogGroup", {
  logGroupName: "/aws/vendedlogs/OpenSearchService/pipelines/events",
  removalPolicy: RemovalPolicy.DESTROY,
});

// Create a User CloudWatch log group

const usersLogGroup = new logs.LogGroup(backend.data.stack, "UsersLogGroup", {
  logGroupName: "/aws/vendedlogs/OpenSearchService/pipelines/users",
  removalPolicy: RemovalPolicy.DESTROY,
});


// Create an Event OpenSearch Integration Service pipeline
const eventsPipeline = new osis.CfnPipeline(
  backend.data.stack,
  "EventOpenSearchIntegrationPipeline",
  {
    maxUnits: 4,
    minUnits: 1,
    pipelineConfigurationBody: eventOpenSearchTemplate,
    pipelineName: "dynamodb-events-pipeline",
    logPublishingOptions: {
      isLoggingEnabled: true,
      cloudWatchLogDestination: {
        logGroup: eventsLogGroup.logGroupName,
      },
    },
  },
  
);

// Create a User OpenSearch Integration Service pipeline


const usersPipeline = new osis.CfnPipeline(
  backend.data.stack,
  "UsersOpenSearchIntegrationPipeline",
  {
    maxUnits: 4,
    minUnits: 1,
    pipelineConfigurationBody: usersOpenSearchTemplate,
    pipelineName: "dynamodb-users-pipeline",
    logPublishingOptions: {
      isLoggingEnabled: true,
      cloudWatchLogDestination: {
        logGroup: usersLogGroup.logGroupName,
      },
    },
  }
);


const osDataSource = backend.data.addOpenSearchDataSource(
  "osDataSource",
  openSearchDomain
);
