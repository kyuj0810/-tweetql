import { ApolloServer, gql } from "apollo-server";

let tweets = [
	{
		id: "1",
		text: "first one!",
		userId: "2",
	},
	{
		id: "2",
		text: "second one",
		userId: "1",
	},
];

let users = [
	{
		id: "1",
		firstName: "kim",
		lastName: "jin",
	},
	{
		id: "2",
		firstName: "elon",
		lastName: "bin",
	},
];

//grapql SDL : Schema definition language
const typeDefs = gql`
	type User {
		id: ID!
		firstName: String!
		lastName: String!
		"""
		Is the sum of firstName+lastName  as a string
		"""
		fullName: String!
	}
	"""
	Tweet object represents a resource fora Tweet
	"""
	type Tweet {
		id: ID!
		text: String!
		author: User
	}
	type Query {
		allUsers: [User]
		allTweets: [Tweet!]!
		tweet(id: ID!): Tweet
	}
	type Mutation {
		postTweet(text: String!, userId: ID!): Tweet!
		"""
		Deletes a Tweet if found, else return false
		"""
		deleteTweet(id: ID): Boolean!
	}
`;

const resolvers = {
	Query: {
		allTweets() {
			return tweets;
		},
		tweet(root, { id }) {
			// 두 번째는 query나 mutation 에서 유저가 보낸 argument가 됨
			return tweets.find((tweet) => tweet.id === id);
		},
		allUsers() {
			console.log("allUsers called");
			return users;
		},
	},
	Mutation: {
		postTweet(root, { text, userId }) {
			const newTweet = {
				id: tweets.length + 1,
				text,
				userId,
			};

			tweets.push(newTweet);
			return newTweet;
		},
		deleteTweet(root, { id }) {
			const tweet = tweets.find((tweet) => tweet.id === id);
			if (!tweet) return false;
			tweets = tweets.filter((tweet) => tweet.id !== id);
			return true;
		},
	},
	User: {
		fullName({ firstName, lastName }) {
			return `${firstName} ${lastName}`;
		},
	},
	Tweet: {
		author({ userId }) {
			return users.find((user) => user.id === userId);
		},
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Runnig on ${url}`);
});

/*
user database에 userId가 없는지를 체크
*/
