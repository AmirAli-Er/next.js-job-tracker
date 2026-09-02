import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}



const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Prevent TypeScript errors and duplicate connections during development.
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    const mongoClient = new MongoClient(uri, options);
    global._mongoClientPromise = mongoClient.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  const mongoClient = new MongoClient(uri, options);
  clientPromise = mongoClient.connect();
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getMongoDatabase() {
  const client = await getMongoClient();
  return client.db();
}
