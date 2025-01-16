import { defineStorage } from '@aws-amplify/backend';

export const firstBucket = defineStorage({
  name: 'tchebaaDrive',
  isDefault: true
});

export const secondBucket = defineStorage({
  name: "opensearch-backup-bucket-amplify-gen-2",
  access: allow => ({
    'public/*': [
      allow.guest.to(['list', 'write', 'get'])
    ]
  })
})