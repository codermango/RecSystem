# from vionaux.neoids import Vionelid
# from elasticsearch import Elasticsearch

def get_poster_url(imdbID):
    vi = Vionelid()
    vnlID = vi.get_vionelID('imdbID', imdbID)
    if not vnlID:
        print "no vnlID found"
        return ""
    url = get_poster_url_with_id(vnlID)
    return url

def get_poster_url_with_id(vnlID):
    # get image url with only vnlID
    es_client = Elasticsearch('52.17.103.114')
    query = {
            "query":{
                "match":{
                    "vionelID":vnlID
                    }
                },"_source":["portrait"]
            }
    try:
        res = es_client.search(body=query, index='movie')
        url = res["hits"]["hits"][0]["_source"]["portrait"]["url"]
    except Exception as e:
        print vnlID, e.message
        return ""
    return url

#print get_poster_url('tt0103518')