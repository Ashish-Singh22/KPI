from flask import Blueprint, request, jsonify
from .inventory_excel_to_data import process_inventory_file

uploadInventoryController_bp = Blueprint('uploadInventoryController_bp', __name__)

@uploadInventoryController_bp.route('/upload-inventory', methods=['POST'])
def calculate_uploadInventoryController():
    try:
        if 'scheduleReport' not in request.files or 'exceptionReport' not in request.files:
            return jsonify({'success': False, 'message': 'Missing files in request'}), 400

        schedule_file = request.files['scheduleReport']
        exception_file = request.files['exceptionReport']
        week = request.form.get("week")
        month = request.form.get("month")
        print("Week:", week)
        print("Month:", month)

        # You can now process files independently
        scheduleData = process_inventory_file(schedule_file)
        exceptionData = process_inventory_file(exception_file)
        print("Schedule Data:", scheduleData)
        print("Exception Data:", exceptionData)
        Total_Storage_Location_Name = scheduleData["Count of Storage Location Name"]+ exceptionData["Count of Storage Location Name"]
        Total_Adjustment_Date = scheduleData["Count of Adjustment Date"] + exceptionData["Count of Adjustment Date"]
        Total_Adjustment_Amount = scheduleData["Sum of Adjustment Amount"] + exceptionData["Sum of Adjustment Amount"]
        Total_Gross_Amount = scheduleData["Sum of Gross Amount"] + exceptionData["Sum of Gross Amount"]
        Total_Total_Cost = scheduleData["Sum of Total Cost"] + exceptionData["Sum of Total Cost"]
        Total_Gross_Qty = scheduleData["Sum of Gross Qty"] + exceptionData["Sum of Gross Qty"]
        Total_System_Inventory_Quantity = scheduleData["Sum of System Inventory Quantity"] + exceptionData["Sum of System Inventory Quantity"]
        Difference = Total_Storage_Location_Name - Total_Adjustment_Date
        Inventory_discrepancy_Net = Total_Adjustment_Amount/100000
        Inventory_discrepancy_Gross = Total_Gross_Amount/100000
        Inventory_Count_Accuracy_By_Location = (Difference/Total_Storage_Location_Name)*100
        Inventory_Count_Accuracy_By_Dollars_Net = ((Total_Total_Cost - abs(Total_Adjustment_Amount))/Total_Total_Cost)*100 
        Inventory_Count_Accuracy_By_Dollars_Gross = ((Total_Total_Cost - abs(Total_Gross_Amount))/Total_Total_Cost)*100 
        Inventory_Count_Accuracy_By_Pieces_Gross = ((Total_System_Inventory_Quantity-Total_Gross_Qty)/Total_System_Inventory_Quantity)*100
        Total_Number_of_Tasks_generated = scheduleData["Number of Tasks generated"]+exceptionData["Number of Tasks generated"]
        Total_Completion_Within_48Hrs = scheduleData["Completion Within 48Hrs"]+exceptionData["Completion Within 48Hrs"]
        Total_Pending_beyond_48Hrs = scheduleData["Pending beyond 48Hrs"]+exceptionData["Pending beyond 48Hrs"]
        Total_Number_of_Tasks_Accepted_with_0_Variance = scheduleData["Number of Tasks Accepted with 0 Variance"]+exceptionData["Number of Tasks Accepted with 0 Variance"]
        Total_Number_of_Tasks_Rejected_with_Variance = scheduleData["Number of Tasks Rejected with Variance"]+exceptionData["Number of Tasks Rejected with Variance"]
  


        return jsonify({
            'success': True,
            'data': {
                'scheduleData': scheduleData,
                'exceptionData': exceptionData,
                'week': week,
                'month': month,
                'Total Storage Location Name': Total_Storage_Location_Name,
                'Total Adjustment Date': Total_Adjustment_Date,
                'Total Adjustment Amount': Total_Adjustment_Amount,
                'Total Gross Amount': Total_Gross_Amount,
                'Total Total Cost': Total_Total_Cost,
                'Total Gross Qty': Total_Gross_Qty,
                'Total System Inventory Quantity': Total_System_Inventory_Quantity,
                'Difference': Difference,
                "Inventory discrepancy Net": Inventory_discrepancy_Net ,
                "Inventory discrepancy Gross":Inventory_discrepancy_Gross,
                "Inventory Count Accuracy(By Location)":Inventory_Count_Accuracy_By_Location,
                "Inventory Count Accuracy(By Dollars) Net":Inventory_Count_Accuracy_By_Dollars_Net,
                "Inventory Count Accuracy(By Dollars) Gross":Inventory_Count_Accuracy_By_Dollars_Gross,
                "Inventory Count Accuracy(By Pieces) Gross":Inventory_Count_Accuracy_By_Pieces_Gross,
                "Total Number of Tasks generated" : Total_Number_of_Tasks_generated,
                "Total Completion Within 48Hrs" : Total_Completion_Within_48Hrs,
                "Total Pending beyond 48Hrs" : Total_Pending_beyond_48Hrs,
                "Total Number of Tasks Accepted with 0 Variance" : Total_Number_of_Tasks_Accepted_with_0_Variance,
                "Total Number of Tasks Rejected with Variance" : Total_Number_of_Tasks_Rejected_with_Variance,
                }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500