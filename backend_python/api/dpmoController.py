# blueprint file (e.g., worker_upload.py)
from flask import Blueprint, request, jsonify
from .dpmo import process_worker_file  # Import from your file

dpmoController_bp = Blueprint('dpmoController_bp', __name__)

@dpmoController_bp.route('/dpmo', methods=['POST'])
def calculate_dpmoController():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request'})

        file = request.files['file']
        print("Hyy")
        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'})

        # Pass the file stream to the.dn_DPMO_kpi function
        result = process_worker_file(file)

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})