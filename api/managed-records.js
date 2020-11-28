import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

/**
 * Function to retrieve data from the Records API using provided input options.
 * @param {Object} options Object containing options to use during retrieval.
 * @param {Number} options.page Page number to retrieve. Defaults to 1.
 * @param {Array} options.colors Array of color names to match. All colors matched by default.
 * @returns {Promise} Promise object represents results from the service call.
 */
const retrieve = ({
  page = 1,
  colors = [`red`, `brown`, `blue`, `yellow`, `green`],
} = {}) => {
  /** Constant value. Number of records to retrieve per page. */
  const ITEMS_PER_PAGE = 10;

  /** List of primary colors. */
  const primaryColors = [`red`, `blue`, `yellow`];

  /** Build the url with the query string using the options. */
  const endpoint = URI(window.path)
    .addSearch(`limit`, ITEMS_PER_PAGE)
    .addSearch({ offset: ITEMS_PER_PAGE * (page - 1), "color[]": colors });

  /** Make the service call and process results. */
  return fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw response.statusText;
      }
      return response.json();
    })
    .then((records) => {
      /** List of ids for all items returned. */
      const ids = records.map((record) => record.id);

      /** List of items with a disposition value of `open`, and a new
       * `isPrimary` flag indicating the item's color is a primary color. */
      const open = records
        .filter((record) => record.disposition === `open`)
        .map((record) => {
          return {
            ...record,
            isPrimary: primaryColors.includes(record.color),
          };
        });

      /** Total number of items that have a disposition value of `closed` and
       * is a primary color. */
      const closedPrimaryCount = records.filter(
        (record) =>
          record.disposition === `closed` &&
          primaryColors.includes(record.color)
      ).length;

      /** Previous page is null if we are on the first page. */
      const previousPage = page === 1 ? null : page - 1;

      /** There will be no next page if we are at displaying the last page, or the
       * results for this page are fewer than the maxmimum allowed per page. */
      const nextPage =
        page + 1 > 50 || ITEMS_PER_PAGE > records.length ? null : page + 1;

      /** Return an object with required properties. */
      return { ids, open, closedPrimaryCount, previousPage, nextPage };
    })
    .catch((errorMsg) => {
      console.log(errorMsg);
      return errorMsg;
    });
};

export default retrieve;
