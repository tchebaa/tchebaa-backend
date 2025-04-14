import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */
export function request(ctx) {

  const { args } = ctx;
  const must = [];
  const filter = [];

  const hasSearchTerm = args.searchTerm?.length > 0;
  const hasStartDate = args.startDate?.length > 0;
  const hasEndDate = args.endDate?.length > 0;
  const hasCategories = args.categories?.length > 0;
  const hasLocation = args.latitude && args.longitude;

  // Date range filter
  if (hasStartDate || hasEndDate) {
    const range = {};
    if (hasStartDate) range.gte = args.startDate;
    if (hasEndDate) range.lte = args.endDate;

    must.push({
      nested: {
        path: "dateTimePriceList",
        query: {
          bool: {
            must: [{ range: { "dateTimePriceList.eventEndDate": range } }]
          }
        }
      }
    });
  }

  // Full-text search
  if (hasSearchTerm) {
    must.push({
      multi_match: {
        fields: ["eventName", "eventDescription", "categories", "eventAddress"],
        query: args.searchTerm,
        fuzziness: "AUTO"
      }
    });
  }

  // Geo filter
  if (hasLocation) {
    filter.push({
      geo_distance: {
        distance: "200km",
        location: {
          lat: args.latitude,
          lon: args.longitude
        }
      }
    });
  }

  // Categories filter
  if (hasCategories) {
    filter.push({
      terms: {
        categories: args.categories
      }
    });
  }

  return {
    operation: "GET",
    path: "/event/_search",
    params: {
      body: {
        query: {
          bool: {
            ...(must.length ? { must } : {}),
            ...(filter.length ? { filter } : {})
          }
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