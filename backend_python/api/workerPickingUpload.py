# blueprint file (e.g., worker_upload.py)
from flask import Blueprint, request, jsonify
from .worker_picker_kpi import process_worker_file  # Import from your file

workerPickingUpload_bp = Blueprint('workerPickingUpload_bp', __name__)

@workerPickingUpload_bp.route('/worker-picking', methods=['POST','OPTIONS'])
def calculate_workerPickingUpload():

    print("✅ worker-picking route hit:", request.method)

    if request.method == 'OPTIONS':
        response = jsonify({"message": "CORS preflight passed"})
        response.headers.add("Access-Control-Allow-Origin", "https://kpi-ft5w.onrender.com")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request'})

        file = request.files['file']

        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'})

        # Pass the file stream to the worker_picker_kpi function
        result = process_worker_file(file)

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})