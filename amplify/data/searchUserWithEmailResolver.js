import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {

     

    if(ctx.args.email.length > 2) {

      return {
        operation: "GET",
        path: "/user/_search",
        params: {
            body: {
                query: {
                    bool: {
    
                        must: [
                        {
                            multi_match: {
                                fields: ["email"],
                                query :  ctx.args.email,
                                fuzziness: "AUTO" 
                            }
                          }
                        
                        ],
    
                    },
                    
                }
            }
        }
        
      };


      
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