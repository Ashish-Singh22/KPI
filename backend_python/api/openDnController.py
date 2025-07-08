# blueprint file (e.g.,_openDn_upload.py)
from flask import Blueprint, request, jsonify
from .opendn import process_openDn_file  # Import from your file

openDnController_bp = Blueprint('openDnController_bp', __name__)

@openDnController_bp.route('/open-dn', methods=['POST'])
def calculate_openDnController():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request'})

        file = request.files['file']

        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'})

        # Pass the file stream to the_openDn_picker_kpi function
        result = process_openDn_file(file)

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})