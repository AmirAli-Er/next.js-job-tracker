import { MongoClient } from "mongodb";
import mongoose from "mongoose";
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


const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;




// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     const mongoClient = new MongoClient(uri, options);
//     global._mongoClientPromise = mongoClient.connect();
//   }

//   clientPromise = global._mongoClientPromise;
// } else {
//   const mongoClient = new MongoClient(uri, options);
//   clientPromise = mongoClient.connect();
// }

// export async function getMongoClient() {
//   return clientPromise;
// }



// export async function getMongoDatabase() {
//   const client = await getMongoClient();
//   return client.db();
// }
