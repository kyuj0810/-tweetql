import { ApolloServer, gql } from "apollo-server";

let tweets = [
	{
		id: "1",
		text: "first one!",
	},
	{
		id: "2",
		text: "second one",
	},
];

//grapql SDL : Schema definition language
const typeDefs = gql`
	type User {
		id: ID!
		username: String!
		firstname: String!
		lastName: String!
	}
	type Tweet {
		id: ID!
		text: String!
		author: User
	}
	type Query {
		allTweets: [Tweet!]!
		tweet(id: ID!): Tweet
	}
	type Mutation {
		postTweet(text: String!, userId: ID!): Tweet!
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
	},
	Mutation: {
		postTweet(root, { text, userId }) {
			const newTweet = {
				id: tweets.length + 1,
				text,
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
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Runnig on ${url}`);
});
