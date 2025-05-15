import math
import os
import string
import nltk
import numpy as np
import pandas as pd
from natsort import natsorted
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

def run_retrieval(user_query):
    print(f"run_retrieval CALLED with query: {user_query}")

    path = "/Users/vritant/Documents/Saarthi-IR-Project/Documents" #Change your path
    os.chdir(path)
    file_list = natsorted(os.listdir(path))

    tokens_list = []
    all_words = []
    pos_index = {}
    file_no = 1
    file_map = {}

    def preprocessing(file_path):
        with open(file_path, 'r', encoding='latin-1') as f:
            word = f.read()
            all_stopwords = stopwords.words('english')

            custom_stopwords = ['<p>', '</p>', '<i>', '</i>']
            all_stopwords.extend(custom_stopwords)

            for sw in ['to', 'in', 'where', '<p>', '</p>', '<i>', '</i>']:
                if sw in all_stopwords:
                    all_stopwords.remove(sw)

            text_tokens = word_tokenize(word)

            stemmer = PorterStemmer()
            lemmatizer = WordNetLemmatizer()

            tokens_without_sw = [
                token for token in text_tokens
                if token.isalpha() and token.lower() not in all_stopwords and len(token) > 2
            ]

            processed_tokens = [
                lemmatizer.lemmatize(stemmer.stem(token)) for token in tokens_without_sw
            ]

            return processed_tokens

    for file in file_list:
        if file.endswith(".txt"):
            file_path = os.path.join(path, file)
            file_path = os.path.normpath(file_path)
            data = preprocessing(file_path)
            tokens_list.append(data)

    for token in tokens_list:
        for word in token:
            all_words.append(word)

    print("'Display all tokens after preprocessing':\n")
    print(tokens_list)

    for doc in tokens_list:
        for idx, word in enumerate(doc):
            idx = 1
            if word in pos_index:
                pos_index[word][0] = pos_index[word][0] + 1
                if file_no in pos_index[word][1]:
                    pos_index[word][1][file_no].append(idx)

                else:
                    pos_index[word][1][file_no] = [idx]
            else:
                pos_index[word] = []
                pos_index[word].append(1)
                pos_index[word].append({})
                pos_index[word][1][file_no] = [idx]

        file_map[file_no] = file_list
        file_no += 1

    print("\n'Display all Positional index for all tokens':\n")
    print(pos_index)
    print("\n")

    pd.set_option('display.max_rows', 500)
    pd.set_option('display.max_columns', 500)
    pd.set_option('display.width', 1000)
    pd.options.mode.chained_assignment = None

    print("'Before insert query':\n")

    def get_term_frequency(doc):
        words = dict.fromkeys(all_words, 0)
        for j in doc:
            words[j] += 1
        return words

    term_frequency = pd.DataFrame(get_term_frequency(tokens_list[0]).values(),
                                  index=get_term_frequency(tokens_list[0]).keys())
    
    for i in range(1, len(tokens_list)):
        term_frequency[i] = get_term_frequency(tokens_list[i]).values()

    term_frequency.columns = ['d' + str(i) for i in range(1, 101)]

    print("\n'TF results':\n")
    print(term_frequency)

    def get_w_term_frequency(doc):
        if doc > 0:
            return math.log(doc) + 1
        return 0

    for i in range(1, len(tokens_list) + 1):
        term_frequency['d' + str(i)] = term_frequency['d' +
                                                      str(i)].apply(get_w_term_frequency)

    print("\n'W-TF results':\n")
    print(term_frequency)

    df_idf = pd.DataFrame(columns=['df', 'idf'])
    for i in range(len(term_frequency)):
        freq = term_frequency.iloc[i].values.sum()
        df_idf.loc[i, 'df'] = freq
        df_idf.loc[i, 'idf'] = math.log10(len(tokens_list) / float(freq))
    df_idf.index = term_frequency.index
    print("\n'DF-IDF results':\n")
    print(df_idf)

    tf_idf = term_frequency.multiply(df_idf['idf'], axis=0)
    print("\n'TF-IDF results':\n")
    print(tf_idf)

    doc_length = pd.DataFrame()

    def get_length(doc):
        return np.sqrt(tf_idf[doc].apply(lambda x: x ** 2).sum())

    for doc in tf_idf.columns:
        doc_length.loc[0, doc + ' length'] = get_length(doc)

    print("\n'Doc length results':\n")
    print(doc_length)

    norm_tf_idf = pd.DataFrame()

    def get_Normalized_tf_idf(doc, l):
        try:
            return l / doc_length[doc + ' length'].values[0]
        except:
            return 0

    for doc in tf_idf.columns:
        norm_tf_idf[doc] = tf_idf[doc].apply(
            lambda l: get_Normalized_tf_idf(doc, l))

    print("\n'Normalized tf.idf results':\n")
    print(norm_tf_idf)

    print("\nAfter insert query\n")
    print("1-'Positional Index Result':\n")

    def query_preprocessing(user_query):
        for word in user_query.split():
            all_stopwords = stopwords.words('english')
            all_stopwords.remove('to')
            all_stopwords.remove('in')
            all_stopwords.remove('where')
            tokens_without_sw = [
                word for word in user_query.split() if not word in all_stopwords]
            return tokens_without_sw

    def listToString(s):
        str1 = " "
        return str1.join(s)

    final_query = query_preprocessing(user_query)
    final_query = listToString(final_query)

    def display_pos_index_query_result():
        for term in final_query.split():
            try:
                sample_pos_idx2 = [term, pos_index[term]]
                print(sample_pos_idx2)
            except:
                print("Not Found")

    print("\n'Positional Index Result for the query':\n")
    display_pos_index_query_result()

    def after_insert():
        query = pd.DataFrame(index=norm_tf_idf.index)

        query['tf-raw'] = [1 if i in final_query.split()
                           else 0 for i in list(norm_tf_idf.index)]
        query['w_tf'] = query['tf-raw'].apply(
            lambda l: get_w_term_frequency(l))
        product = norm_tf_idf.multiply(query['w_tf'], axis=0)
        query['idf'] = df_idf['idf'] * query['w_tf']
        query['tf_idf'] = query['w_tf'] * query['idf']

        query['normalized'] = 0
        for i in range(len(query)):
            query['normalized'].iloc[i] = float(
                query['idf'].iloc[i]) / math.sqrt(sum(query['idf'].values ** 2))

        product2 = product.multiply(query['normalized'], axis=0)

        query = query[(query.T != 0).any()]  
        print("\n'Vector space models calculations table for the query':\n")
        print(query)

        query_length = math.sqrt(
            sum([i ** 2 for i in query['idf'].loc[final_query.split()]]))
        print("\n'Query length':")
        print(query_length)

        cosine_scores = {}
        for doc in product2.columns:
            if 0 in product2[doc].loc[final_query.split()].values:
                pass
            else:
                cosine_scores[doc] = product2[doc].sum()
        print("\n'Cosine similarity scores for matched docs':")
        print(cosine_scores)

        returned_docs = sorted(cosine_scores.items(),
                               key=lambda x: x[1], reverse=True)[:10]

        top_docs = [doc[0] for doc in returned_docs]
        product_result = product2[top_docs].loc[final_query.split()]
        product_result_sum = product_result.sum()
        print("\n'Product (query * matched docs):'")
        print(product_result)

        print("\n'Sum Product'")
        print(product_result_sum)

        print("\n'Top 10 Returned Docs':")
        for doc in returned_docs:
            print(doc[0], "Score:", doc[1])
        print("\n")
        top_files = []
        for doc in returned_docs:
            doc_num = int(doc[0][1:])  
            filename = file_map[doc_num][doc_num - 1]  
            top_files.append(filename)

        return top_files

    print("\n'After insert query results':\n")
    try:
        return after_insert()
    except Exception as e:
        print("Query Not Found:", e)
