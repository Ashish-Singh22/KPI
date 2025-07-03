from flask import Blueprint, request, jsonify , send_file
from .filter_worker import process_worker_file  # Import your processing logic

filterWorkerController_bp = Blueprint('filterWorkerController_bp', __name__)

@filterWorkerController_bp.route('/filter-worker', methods=['POST'])
def calculate_filterWorkerController():
    try:
        payload = request.get_json()
        print(payload)
        if not payload:
            return jsonify({'success': False, 'message': 'No JSON body received'}), 400
        name = payload.get('name',"no_name")
        filter_data = payload.get('filterData', {})
        result = {}
        if name == "Picker":
            picker_data = payload.get('pickerData', [])
            if not picker_data:                
                return jsonify({'success': False, 'message': 'Missing picker data'}), 400
            result = process_worker_file(name,picker_data, filter_data)
        elif name == "Packer":
            packer_data = payload.get('packerData', {})
            if not packer_data:                
                return jsonify({'success': False, 'message': 'Missing packer data'}), 400
            result = process_worker_file(name,packer_data, filter_data)
       
        



        # Now you can use both picker_data and filter_data
          # update your function if needed

        return jsonify(result)

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500