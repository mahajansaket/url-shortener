import { gql } from "apollo-boost";

export const GET_URL = gql`
  {
    url_shortener {
      id
      created_at
      tinyurl
      url
    }
  }
`;

export const INSERT_URL = gql`
  mutation($url: String!, $tinyurl: String!) {
    insert_url_shortener(
      objects: { url: $url, tinyurl: $tinyurl }
      on_conflict: { constraint: url_pkey, update_columns: id }
    ) {
      affected_rows
      returning {
        id
        url
        tinyurl
      }
    }
  }
`;