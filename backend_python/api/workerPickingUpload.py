# blueprint file (e.g., worker_upload.py)
from flask import Blueprint, request, jsonify
from .worker_picker_kpi import process_worker_file  # Import from your file

workerPickingUpload_bp = Blueprint('workerPickingUpload_bp', __name__)

@workerPickingUpload_bp.route('/worker-picking', methods=['POST'])
def calculate_workerPickingUpload():
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