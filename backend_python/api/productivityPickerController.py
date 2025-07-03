# blueprint file (e.g., picker_upload.py)
from flask import Blueprint, request, jsonify
from .productivity_pickers import process_picker_file  # Import from your file

productivityPickingController_bp = Blueprint('productivityPickingController_bp', __name__)

@productivityPickingController_bp.route('/productivity-picking', methods=['POST'])
def calculate_pickerPickingUpload():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request'})

        file = request.files['file']

        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'})

        # Pass the file stream to the picker_picker_kpi function
        result = process_picker_file(file)

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})