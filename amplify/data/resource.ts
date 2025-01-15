import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
    TicketPrice: a.customType({
      adultPrice: a.float(),
      adolescentPrice: a.float(),
      childPrice: a.float(),
      ticketTitle: a.string(),
      ticketNumber: a.float()
    }),
    DateTimePrice: a.customType({
      evenDate: a.datetime(),
      eventDays: a.float(),
      eventHours: a.float(),
      eventMinutes: a.float(),
      eventEndDate: a.datetime(),
      ticketPriceList: a.ref('TicketPrice').array(),
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
    .authorization((allow) => [allow.guest()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
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
