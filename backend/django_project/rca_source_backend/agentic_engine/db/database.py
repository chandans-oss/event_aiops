import psycopg2
from sentence_transformers import SentenceTransformer

POSTGRES_HOST = "10.0.4.89"
POSTGRES_PORT = "5432"
POSTGRES_DB =  "infraondb"
POSTGRES_USER =  "postgres"
POSTGRES_PASSWORD = "Infraon@123"
EMBEDING_MODEL = "intfloat/e5-base-v2"

def get_db_connection():
    return psycopg2.connect(
        host=POSTGRES_HOST,
        port=POSTGRES_PORT,
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD
    )

def historical_retriever(incident, k=1):
    try:
        current_situation = incident["situation_card"]['situation_text']
        model = SentenceTransformer(EMBEDING_MODEL)  
        query_embedding = model.encode(current_situation).tolist()
        query_embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"
        conn = get_db_connection()
    
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    incident_id,
                    situation_summary,
                    intent,
                    root_cause_prediction,
                    confidence_score,
                    remediation,
                    1 - (embedding <=> %s::vector) AS similarity_score
                FROM historical_rca_cases
                where intent = %s and subintent = %s
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
            """, (query_embedding_str, incident['intent'], incident['subintent'], query_embedding_str, k))

            results = cur.fetchall()
            ret_cases = []
            for i, row in enumerate(results, 1):
                incident_id, sit_summary, intent, rca, conf, rem, sim_score = row
                ret_cases.append({'case_id': incident_id, "intent":intent, "rca":rca, "sim_score":sim_score,"remedy":rem, "sit_summary":sit_summary})

    except Exception as e:
        print("Historical DB failed, falling back to dummy response: ", e)
        ret_cases = []

    if not ret_cases:
        dummy_response = { "retrieved_cases":[ { "case_id":"INFRAON-ALARM-3467", "intent":"performance", "rca":"QoS misclassification", "sim_score":0.86, "remedy":"apply WAN-QoS policy", "sit_summary": "High utilization on Core router." }, { "case_id":"INFRAON-ALARM-092", "intent":"performance", "rca":"Link capacity exhaustion", "sim_score":0.63, "remedy":"Upgrade link capacity", "sit_summary": "Sustained port limits hit." } ], "top_case":"INFRAON-ALARM-3467", "average_similarity":0.78 }
        return dummy_response

    response = {"retrieved_cases":ret_cases, "top_case":ret_cases[0].get("case_id") if ret_cases else "", "average_similarity": sum([item["sim_score"] for item in ret_cases])/len(ret_cases) if ret_cases else 0}
    print("Historical Retrieval Response: ",response)
    return response
