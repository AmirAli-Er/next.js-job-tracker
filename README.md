## Next.js Job tracker

### you can work with this app online:      https://next-js-job-tracker.onrender.com/
also there is a good document for this project if you get confused.

***

next.js Concepts and tools in job-tracker:

- cache
- proxy
- connecting to database
- mongoDB schemas(with mongoose) and queries
- authentication with BetterAuth
- react DND(*drag and drop*)
- hooks

* * *

## cache

Caching allows an application to **reuse** a previously computed result instead of repeating the same expensive work  
first we must know that **React Server Components and Next.js cached results work best with serializable values**. This conversion **converts the Mongoose document into a plain object**.:

```
const board = JSON.parse(JSON.stringify(boardDoc));
```

and it has drawbacks:

1.  `ObjectId` values become strings
2.  Date values become strings
3.  `Undefined` values may be removed
4.  It performs an extra serialization and parsing step

it is very important to know that :

## Caching is useful only if your application knows when cached data must be refreshed.

After changing the database, you should **invalidate** or **refresh the relevant cached data**. Common Next.js invalidation tools include:

1.  `revalidatePath()`
2.  `revalidateTag()`
3.  Cache lifetime configuration
4.  A redirect or refresh after a mutation

### connection caching VS Query-result caching

`connectDB()` should usually reuse an existing MongoDB connection instead of creating a new connection for every request.  
`"use cache"` can reuse the result of the board query.

* * *

## Proxy

In Next.js, Proxy is a server-side entry point that runs before a request reaches a page, route handler, or other application route  
in this project :

```
Browser requests /dashboard
        ↓
proxy.ts runs
        ↓
Check pathname, cookies, or headers
        ↓
 ┌───────────────┬────────────────┐
 │ Authorized    │ Unauthorized   │
 ↓               ↓
Continue         Redirect
to dashboard     to sign-in
```

* * *

## Creating and Initializing a Mongoose Connection

The db.ts file is responsible for creating and reusing the MongoDB connection used by the application.

In a Next.js application, database code can run multiple times during development **because of hot reloading**. If a new connection is created every time a file reloads, MongoDB may receive too many connections.

The solution is to:

1.  Read the MongoDB URI from environment variables.  
    **2\. Check whether a connection already exists.**
2.  Reuse the existing connection if available.
3.  Store the connection and connection promise globally during development.
4.  Reset the promise if the connection fails.

`MongooseCache(interface)` stores two values:

- `conn`: The completed Mongoose connection.

- `promise`: The connection currently being established.

```
let cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};
```

### Why use **`declare global`**?

Next.js may reload modules during development. Module-level variables can be recreated during this process, but values stored on global can survive those reloads.

This prevents repeated connections

you should know that With `bufferCommands: false`, Mongoose does not silently queue operations. **It fails faster when the connection is unavailable.**

for connecting to data base, we can use `connectDB()` safety

**the point is The first call establishes the connection. `Later calls reuse the cached connection`.**  
**`You do not need to manually disconnect after every query`. In a Next.js server application, repeatedly calling mongoose.disconnect() is usually incorrect because it forces future requests to reconnect.**

* * *

## MongoDB schemas

A **MongoDB document** is similar to a JavaScript object:

```
{
  title: "Frontend Developer",
  company: "Example Inc.",
  status: "applied",
  location: "Remote"
}
```

documents are stored inside collections:

```
job-tracker database
└── jobs collection
    ├── job document
    ├── job document
    └── job document
```

**Schema** defines the structure of a document, and a model provides methods for interacting with the collection.

in Next.js development, files can be evaluated multiple times because of hot reloading, so we must check wether schema has been created .

```
export default mongoose.models.Column ||
  mongoose.model<IColumn>("Column", ColumnSchema);
```

### Common Schema Field Options

1.  type
    
2.  required(it can be accompanied by an error: `required: [true, "Job title is required"]`)
    
3.  default
    
4.  index(index improves query performance by allowing MongoDB to find documents without scanning the entire collection.)
    
5.  enum(Restricts a field to specific values)
    
6.  trim(Removes whitespace from the beginning and end of strings)
    
7.  maxlength or minlength
    
8.  timestamps:Use timestamps for fields that track creation and modification time:
    

### ObjectId refrences

in this project , A column belongs to a specific board, so that column shold contain boardID:

```
boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    }
```

and we can query jobs for a specific column:

```
const column = await Job.find({
  boardId,
});
```

there is an important thing that we can use `populate()`method which replaces a referenced ObjectId with the related MongoDB document.

```
const userSchema = new mongoose.Schema({
    username: String,
    email: String
})

const postSchema = new mongoose.Schema({
    title: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

// Creating models from userSchema and postSchema
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

Post.find()
    .populate("postedBy")
    .then(posts=>console.log(posts))
    .catch(error=>console.log(error));
```
we can also use an array for `populate()` :
```
const job = await Job.findById(jobId).populate([
  {
    path: "userId",
    select: "name email",
  },
  {
    path: "companyId",
    select: "name website",
  },
]);

```

another important thing that you must know for working with mongoDB is **MongoDB Update Operators :** MongoDB update operators **modify documents without replacing the entire document.**
1. `$set` changes or creates fields.
2. `$unset` removes fields.
3. `$push` adds items to arrays and allows duplicates.
4. `$addToSet` adds items only if they are not already present.
5. `$pull` removes matching array items.
6. `$inc` changes numeric counters atomically.
7. `$` updates the first matching array item.

***
## 
## Authentication with Better Auth

   The authentication system has two parts:

- Server-side authentication: `lib/auth.ts`
- Client-side authentication: `lib/auth-client.ts`

###  Important distinction
Mongoose and Better Auth are using the same underlying MongoDB connection, but they serve different purposes:
- Mongoose: Used for application models, schemas, and queries.
- MongoDB client: Used by Better Auth through its MongoDB adapter.

This avoids creating a completely separate MongoDB connection for Better Auth.
***
## Hook
the most important thing in the useBoard hook in this project is **optimistic update** which is really necessary for drag and drop . it means that **The hook updates the UI before the database request finishes.**

### without it:
```
User moves job
      ↓
Request is sent
      ↓
Database updates
      ↓
New data is returned
      ↓
UI changes
```
but with optimistic update:
```
User moves job
      ↓
UI changes immediately
      ↓
Request is sent in the background
      ↓
Database updates

```
