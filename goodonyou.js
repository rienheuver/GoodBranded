(async () => {
  const searchName = "adi";
  let url =
    "https://b2rh59ampxfe8ugyp.a1.typesense.net/collections/brands_PROD/documents/search";
  const params = {
    q: searchName,
    sort_by: "_text_match:desc,dots:desc",
    query_by: "name",
    include_fields: "name,+dots",
    limit_hits: 1,
    page: 1,
    per_page: 1,
  };
  for (const [i, [key, value]] of Object.entries(Object.entries(params))) {
    if (i == 0) {
      url += `?${key}=${value}`;
    } else {
      url += `&${key}=${value}`;
    }
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      "x-typesense-api-key": "FVXmpKATSX8eIijcrZ5g0KCs0Y5TMP9x",
    },
    body: null,
    method: "GET",
  });
  const hits = (await response.json()).hits;
  if (hits.length > 0) {
    const match = hits[0];
    if (match.document.name.toLowerCase() == searchName) {
      console.log("match", match.document.dots);
    } else {
      console.log("no match");
    }
  }
})();
