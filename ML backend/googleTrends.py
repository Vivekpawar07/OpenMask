from pytrends.request import TrendReq
import pandas as pd
import urllib3
import time

# Suppress InsecureRequestWarning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Initialize pytrends
pytrends = TrendReq(
    hl='en-US',
    tz=360,
    timeout=(10, 25),
    retries=2,
    backoff_factor=0.1,
    requests_args={'verify': False}
)

# Fetch trending searches in India
trending_searches_df = pytrends.trending_searches(pn='india')

# Display the trending searches
print("Current Trending Topics in India:")
print(trending_searches_df)

# Initialize a dictionary to store descriptions
descriptions = {}

# Loop through each trending search to get related queries
for topic in trending_searches_df[0]:
    try:
        pytrends.build_payload([topic], cat=0, timeframe='today 1-d', geo='IN', gprop='')
        related_queries_dict = pytrends.related_queries()

        # Store the related queries for the topic if available
        if topic in related_queries_dict and related_queries_dict[topic]['rising'] is not None:
            descriptions[topic] = related_queries_dict[topic]['rising']
        else:
            descriptions[topic] = pd.DataFrame({'query': [], 'value': []})

    except Exception as e:
        print(f"Error fetching related queries for {topic}: {e}")
        descriptions[topic] = pd.DataFrame({'query': [], 'value': []})

    time.sleep(2)  # Sleep to avoid rate limiting

# Display the trending topics with descriptions
print("\nTrending Topics with Related Queries:")
for topic, desc in descriptions.items():
    print(f"\n{topic}:")
    if not desc.empty:
        print(desc)
    else:
        print("No related queries available.")