
import Pinecone from "@pinecone-io/client";
const pinecone = new Pinecone("API_KEY");

const index = pinecone.index("example-index");
const queryResponse = await Index.query({
    query: {
        vector: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
        topK: 3,
        includeValues: true,
    },
    namespace: "example-namespace",
});