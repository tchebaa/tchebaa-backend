import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {

    /** 

    if(ctx.args.categories && ctx.args.categories.length > 0) {

    } else {

        if(ctx.args.searchTerm && ctx.args.searchTerm.length > 0) {

        } else {

        }
    }
    */
    return {
        operation: "GET",
        path: "/event/_search",
        params: {
            body: {
                query: {
                    bool: {
    
                        must: [

                            {
                            nested: {
                                path: "dateTimePriceList",
                                query: {
                                    bool:{
                                        must: [
                                            { range: { "dateTimePriceList.eventEndDate": { "gte": ctx.args.startDate} } }
                                        ]
                                        
                                    }
                                }
                            }
                        }
                        
                        ],
                        should: [
                            {
                                multi_match: {
                                    fields: ["eventName", "eventDescription", "categories"],
                                    query :  ctx.args.searchTerm,
                                    fuzziness: "AUTO" 
                                }
                              }

                        ],
                        filter: [{
                            geo_distance: {
                            distance: "200km",
                            location: {
                                lat: ctx.args.latitude,
                                lon: ctx.args.longitude
                            }
                            }
                        },
                        {
                            terms: {
                                categories: ctx.args.categories,
                            
                            }
                        }
                    ]
    
                    },
                    
                }
            }
        }
        
      };


 
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