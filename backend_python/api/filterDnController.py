from flask import Blueprint, request, jsonify , send_file
from .filter_dn import process_Dn_file  # Import your processing logic

filterDnController_bp = Blueprint('filterDnController_bp', __name__)

@filterDnController_bp.route('/filter-dn', methods=['POST'])
def calculate_filterDnController():
    try:
        payload = request.get_json()
        # print(payload)
        if not payload:
            return jsonify({'success': False, 'message': 'No JSON body received'}), 400
        name = payload.get('name',"no_name")
        filter_data = payload.get('filterData', {})
        result = {}
        if name == "Shipment":
            Shipment_data = payload.get('ShipmentData', [])
            if not Shipment_data:                
                return jsonify({'success': False, 'message': 'Missing Shipment data'}), 400
            result = process_Dn_file(name,Shipment_data, filter_data)
        elif name == "Productivity":
            Productivity_data = payload.get('ProductivityData', {})
            if not Productivity_data:                
                return jsonify({'success': False, 'message': 'Missing Productivity data'}), 400
            result = process_Dn_file(name,Productivity_data, filter_data)
       
        



        # Now you can use both Shipment_data and filter_data
          # update your function if needed

        return jsonify(result)

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500