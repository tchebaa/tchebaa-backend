import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'tchebaaDrive',
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['list', 'write', 'get'])
    ],
    'picture-submissions/*': [
      allow.authenticated.to(['read','write']),
      allow.guest.to(['read', 'write'])
    ],
  })
});

