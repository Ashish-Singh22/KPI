# blueprint file (e.g., worker_upload.py)
from flask import Blueprint, request, jsonify
from .dn_shipment_kpi import process_worker_file  # Import from your file

dnShipmentController_bp = Blueprint('dnShipmentController_bp', __name__)

@dnShipmentController_bp.route('/dn-shipment', methods=['POST'])
def calculate_dnShipmentController():
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file part in request'})

        file = request.files['file']

        if file.filename == '':
            return jsonify({'success': False, 'message': 'No file selected'})

        # Pass the file stream to the.dn_shipment_kpi function
        result = process_worker_file(file)

        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})