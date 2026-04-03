const url = 'https://magento.goline.com.co/graphql';
const query = `
  query {
    country(id: "CO") {
      id
      available_regions {
        id
        code
        name
      }
    }
  }
`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
