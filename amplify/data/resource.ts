import { type ClientSchema, a, defineData } from '@aws-amplify/backend';


//Schema

const schema = a.schema({
  Admin: a.model({
    email: a.string(),
    adminName: a.string(),
    postEventPermissions: a.boolean(),
    deleteEventPermissions: a.boolean(),
    editEventPermissions: a.boolean(),
    addAdminPermissions: a.boolean(),
    editAdminPermissions: a.boolean(),
    ticketCancelPermissions: a.boolean(),
    deleteAdminPermissions: a.boolean(),
    chatPermissions: a.boolean()
  }).authorization((allow) => [allow.publicApiKey()]),
  EventViewed: a.model({
    email: a.string(),
    eventId: a.string(),
    locationAddress: a.string(),
    location: a.customType({
      type: a.string(),
      coordinates: a.float().array()
    })
  }).authorization((allow) => [allow.publicApiKey()]),
  OnlineUser: a.model({
    email: a.string(),
    locationAddress: a.string(),
    location: a.customType({
      type: a.string(),
      coordinates: a.float().array()
    })
  }).authorization((allow) => [allow.publicApiKey()]),
  User: a.model({
    email: a.string(),
    postEventLimit: a.float(),
    pushNotificationToken: a.string()
  }).authorization((allow) => [allow.publicApiKey()]),
    TicketPrice: a.customType({
      adultPrice: a.float(),
      adolescentPrice: a.float(),
      childPrice: a.float(),
      ticketTitle: a.string(),
      ticketNumber: a.float(),
      
    }),
    DateTimePrice: a.customType({
      eventDate: a.string(),
      eventDays: a.float(),
      eventHours: a.float(),
      eventMinutes: a.float(),
      eventEndDate: a.string(),
      ticketPriceArray: a.ref('TicketPrice').array(),
    }),
    Event: a
    .model({
      eventName: a.string(),
      eventDescription: a.string(),
      email: a.string(),
      personType: a.boolean(),
      companyEmail: a.string(),
      companyName: a.string(),
      personName: a.string(),
      sponsored: a.boolean(),
      eventMainImage: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventImage2: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventImage3: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventImage4: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      dateTimePriceList: a.ref('DateTimePrice').array(),
      ageRestriction: a.string().array(),
      categories: a.string().array(),
      eventAddress: a.string(),
      location: a.customType({
        type: a.string(),
        coordinates: a.float().array()
      })
    })
    .authorization((allow) => [allow.publicApiKey()]),
    LikedEvent:a.model({
      userEmail: a.string(),
      eventId:a.string(),
      eventName: a.string(),
      eventDescription: a.string(),
      email: a.string(),
      personType: a.boolean(),
      companyEmail: a.string(),
      companyName: a.string(),
      personName: a.string(),
      sponsored: a.boolean(),
      eventMainImage: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventImage2: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventImage3: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventImage4: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      dateTimePriceList: a.ref('DateTimePrice').array(),
      ageRestriction: a.string().array(),
      categories: a.string().array(),
      eventAddress: a.string(),
      location: a.customType({
        type: a.string(),
        coordinates: a.float().array()
      })
      
    }).authorization((allow) => [allow.publicApiKey()]),
    Conversation:a.model({
      participants: a.string().array(),
      lastMessage: a.string()
    }).authorization((allow) => [allow.publicApiKey()]),
    Message:a.model({
      sender: a.string(),
      conversationId: a.string(),
      content: a.string(),
      status: a.string()
    }).authorization((allow) => [allow.publicApiKey()]),  
    EventTicket:a.model({
      eventMainImage: a.customType({
        aspectRatio: a.string(),
        url: a.string()
      }),
      eventName: a.string(),
      eventAddress: a.string(),
      eventDate: a.string(),
      eventEndDate: a.string(),
      eventTotalPrice: a.float(),
      totalTicketNumber: a.float(),
      adultNumber: a.float(),
      childNumber: a.float(),
      adolescentNumber: a.float(),
      userEmail: a.string(),
      organizerEmail: a.string(),
      eventId: a.string(),
      eventDescription: a.string(),
      ageRestriction: a.string().array(),
      location: a.customType({
        type: a.string(),
        coordinates: a.float().array()
      })
    }).authorization((allow) => [allow.publicApiKey()]),  
    searchEventsWithFilter: a
    .query()
    .arguments({ startDate: a.string(), endDate: a.string(), searchTerm: a.string(), categories: a.string().array(), longitude: a.float(), latitude: a.float() })
    .returns(a.ref("Event").array())
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        entry: "./searchEventsWithFilterResolver.js",
        dataSource: "osDataSource",
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
