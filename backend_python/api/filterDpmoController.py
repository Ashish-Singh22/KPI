from flask import Blueprint, request, jsonify , send_file
from .filter_dpmo import process_dpmo_file  # Import your processing logic

filterDpmoController_bp = Blueprint('filterDpmoController_bp', __name__)

@filterDpmoController_bp.route('/filter-dpmo', methods=['POST'])
def calculate_filterDpmoController():
    try:
        payload = request.get_json()
        dpmoData = payload.get('dpmoData',[])
        result = process_dpmo_file(dpmoData)

        return jsonify(result)

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500