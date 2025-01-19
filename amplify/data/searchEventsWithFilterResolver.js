import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {

    if(ctx.args.categories && ctx.args.categories.length > 0 ) {

        if(ctx.args.searchTerm && ctx.args.searchTerm.length > 1) {

        } else {

        }


    } else {

         if(ctx.args.searchTerm && ctx.args.searchTerm.length > 1) {

         } else {
            return {
                operation: "GET",
                path: "/event/_search",
                params: {
                    body: {
                        query: {
                            bool: {
            
                                filter: [{
                                    "geo_distance": {
                                    "distance": "200km",
                                    "location": {
                                        "lat": ctx.args.latitude,
                                        "lon": ctx.args.longitude
                                    }
                                    }
                                }]
            
                            },
                            nested: {
                                path: "dateTimePriceList",
                                query: {
                                    bool:{
                                        must: [
                                            { range: { "dateTimePriceList.eventEndDate": { "lte": ctx.args.endDate} } }
                                        ]
                                        
                                    }
                                }
                            }
                        }
                    }
                }
                
              };
         }
    }


 
}

/**
 * Returns the fetched items
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result.hits.hits.map((hit) => hit._source);
}