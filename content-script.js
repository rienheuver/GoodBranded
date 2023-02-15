const style = document.createElement("style");
style.innerHTML = `
  .goy-good:after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #038f16;
  }

  .goy-start:after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #f59b42;
  }

  .goy-not-good:after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #b51414;
  }

  .goy-avoid:after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #5e0505;
  }
`;
var ref = document.querySelector("script");
ref.parentNode.insertBefore(style, ref);

(async () => {
  /* TODO Opties voor implementatie
  1. Lokaal cachen van merken die ik gehad heb
  2. Onclick ofzo (meh)
  3. Proberen een lijst van rated brands van goodonyou te crawlen elke dag/week ofzo en daarmee te vergelijken (geen ratelimit)
  */

  document.addEventListener("mouseover", async (event) => {
    const score = await search(event.target.innerText);
    event.target.classList.add(getClass(score));
  });
})();

async function search(query) {
  let url =
    "https://b2rh59ampxfe8ugyp.a1.typesense.net/collections/brands_PROD/documents/search";
  const params = {
    q: encodeURIComponent(query),
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
  console.log(response);
  const hits = (await response.json()).hits;
  if (hits.length > 0) {
    const match = hits[0];
    if (query.includes(match.document.name)) {
      return match.document.dots;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getClass(score) {
  switch (score) {
    case 0:
      return "";

    case 1:
      return "goy-avoid";

    case 2:
      return "goy-not-good";

    case 3:
      return "goy-start";

    case 4:
      return "goy-good";
  }
}
