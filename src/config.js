export const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID
};

export const auth0Config = {
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN
};

export const firebaseConfig = {
  apiKey: "AIzaSyCa08_y3n-_qRFvzR7Kw-R4VW8pKzj7WJI",
  authDomain: "seeing-is-beleiving.firebaseapp.com",
  databaseURL: "https://seeing-is-beleiving-default-rtdb.firebaseio.com",
  projectId: "seeing-is-beleiving",
  storageBucket: "seeing-is-beleiving.appspot.com",
  messagingSenderId: "955481005378",
  appId: "1:955481005378:web:d5145ada8733d1804d7cdb",
  measurementId: "G-41PZRQMEBP"
};

/*export const gtmConfig = {
  containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID
};*/