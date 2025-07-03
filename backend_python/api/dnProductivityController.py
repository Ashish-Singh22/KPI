# blueprint file (e.g., worker_upload.py)
from flask import Blueprint, request, jsonify
from .dn_productivity_kpi import process_worker_file  # Import from your file

dnProductivityController_bp = Blueprint('dnProductivityController_bp', __name__)

@dnProductivityController_bp.route('/dn-productivity', methods=['POST'])
def calculate_dnProductivityController():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request'})

        file = request.files['file']

        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'})

        # Pass the file stream to the.dn_Productivity_kpi function
        result = process_worker_file(file)

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})