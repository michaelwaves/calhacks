import pandas as pd
import tiktoken
import numpy as np
import openai
import os
openai.api_key ="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"
from openai.embeddings_utils import get_embedding, distances_from_embeddings

embedding_model = "text-embedding-ada-002"
embedding_encoding = "cl100k_base"
max_tokens = 4000
tokenizer = tiktoken.get_encoding(embedding_encoding)
if not os.path.isfile("./embeddings2.csv"):
   df = pd.read_csv("./finetuning_dataset.csv", encoding="latin-1")
   #print(df.columns)

   df['embeddings'] = df['text'].apply(lambda x: get_embedding(x, engine = embedding_model))
   df.to_csv('embeddings2.csv')

df = pd.read_csv("./embeddings2.csv")
#print(df.columns)
df['embeddings'] = df['embeddings'].apply(eval).apply(np.array)
df['n_tokens'] = df.text.apply(lambda x: len(tokenizer.encode(x)))
df.head()

def create_context(question, df, max_len=1800, size="ada"):
   q_embeddings = openai.Embedding.create(input=question, engine = embedding_model)['data'][0]['embedding']
   df['distances'] = distances_from_embeddings(q_embeddings, df['embeddings'].values, distance_metric="cosine")

   returns = []
   cur_len = 0
   for i, row in df.sort_values('distances', ascending=True).iterrows():
      cur_len += row['n_tokens'] + 4
      if cur_len > max_len:
         break
      returns.append(row['text'])

   return "\n\n###\n\n".join(returns)

def answer_question(
      df, 
      model="text-curie-001", 
      question = "What is Magic Noodle?",
      max_len = 1800,
      size = "ada",
      debug = False,
      max_tokens = 150,
      stop_sequence = None
):
   context = create_context(
      question,
      df,
      max_len = max_len,
      size = size
   )
   if debug:
      print("Context:\n" + context)
      print("\n\n")
   
   try:
      response = openai.Completion.create(
         prompt = f"Answer the question based on the context below, and if the question can't be answered based on the context, say \"I don't know\"\n\nContext: {context}\n\n---\n\nQuestion: {question}\nAnswer:",
         temperature = 0,
         max_tokens = max_tokens,
         top_p = 1,
         frequency_penalty = 0,
         presence_penalty = 0,
         stop = stop_sequence,
         model = model,
      )
      return response["choices"][0]["text"].strip()
   except Exception as e:
      print(e)
      return ""

if __name__ == "__main__":
   print(answer_question(df, question = "What is Magic Noodle?", max_len = 250))   
   print(answer_question(df, question = "Where is the Markham location?", max_len=250))
   print(answer_question(df, question = "What are the ingredients in the Dan Dan Noodles?", max_len=250))
   print(answer_question(df, question = "What hot drinks are served here?", max_len=250))
   print(answer_question(df, question = "What jobs are there  ?", max_len=250))