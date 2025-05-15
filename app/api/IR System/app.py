from flask import Flask, request, jsonify
from retrieval import run_retrieval

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

@app.route('/upload', methods=['POST'])
def search():
    print("Flask /upload endpoint hit") 
    data = request.get_json()
    query = data.get('query', '')

    try:
        results = run_retrieval(query)
        print("Retrieved results:", results)
        return jsonify({'status': 'success', 'results': results})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)