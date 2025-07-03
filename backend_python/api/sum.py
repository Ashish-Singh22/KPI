from flask import Blueprint, request, jsonify

sum_bp = Blueprint('sum_bp', __name__)

@sum_bp.route('/sum', methods=['POST'])
def calculate_sum():
    try:
        data = request.get_json()
        x = data.get('x', 0)
        y = data.get('y', 0)
        result = x + y
        return jsonify({'success': True, 'message': f'Sum is {result}', 'z': result})
    except Exception as e:
        return jsonify({'error': True, 'message': str(e)})
