from flask import Blueprint, request, jsonify

filterProductivityPickerController_bp = Blueprint('filterProductivityPickerController_bp', __name__)

@filterProductivityPickerController_bp.route('/filter-productivity-picking', methods=['POST'])
def calculate_filterProductivityPickerController():
    try:
        payload = request.get_json()
        print(payload)
        if not payload:
            return jsonify({'success': False, 'message': 'No JSON body received'}), 400

        productivity_data = payload.get('productivityData', [])      

        # Step 1: Aggregate sums and counts
        temp_data = {}

        for record in productivity_data:
            data = record.get("data", {})
            for person, metrics in data.items():
                if person not in temp_data:
                    temp_data[person] = {"count": 0, "d_t": 0, "fr_t": 0, "l_t": 0, "lines": 0, "quantity": 0}
                
                temp_data[person]["count"] += 1
                temp_data[person]["d_t"] += metrics.get("d_t", 0)
                temp_data[person]["fr_t"] += metrics.get("fr_t", 0)
                temp_data[person]["l_t"] += metrics.get("l_t", 0)
                temp_data[person]["lines"] += metrics.get("lines", 0)
                temp_data[person]["quantity"] += metrics.get("quantity", 0)

        # Step 2: Compute averages
        final_data = {}
        for person, stats in temp_data.items():
            count = stats["count"]
            final_data[person] = {
                "average_d_t": round(stats["d_t"] / count, 3),
                "average_fr_t": round(stats["fr_t"] / count, 3),
                "average_l_t": round(stats["l_t"] / count, 3),
                "average_lines": round(stats["lines"] / count, 3),
                "average_quantity": round(stats["quantity"] / count, 3),
                "count": count
            }

        return jsonify({"success": True, "final_data": final_data})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
