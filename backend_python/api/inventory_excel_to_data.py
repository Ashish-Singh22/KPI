import pandas as pd
import numpy as np
from flask import jsonify

def process_inventory_file(file_stream):
    try:
        inventory_data = pd.read_excel(file_stream)

        columns_to_keep = ['Cycle Count Header Name', 'Storage Location Name', 'Gross Qty', 'Adjustment Date',
                            'Adjustment Amount', 'Gross Amount', 'Total Cost','System Inventory Quantity','48Hrs Compliance']

        inventory_data = inventory_data[columns_to_keep]

        data = {
            "Count of Storage Location Name" : inventory_data["Storage Location Name"].count(),
            "Count of Adjustment Date" : inventory_data["Adjustment Date"].count(),
            "Sum of Adjustment Amount" : inventory_data["Adjustment Amount"].sum(),
            "Sum of Gross Amount" : inventory_data["Gross Amount"].sum(),
            "Sum of Total Cost" : inventory_data["Total Cost"].sum(),
            "Sum of Gross Qty" : inventory_data["Gross Qty"].sum(),
            "Sum of System Inventory Quantity" : inventory_data["System Inventory Quantity"].sum(),
            "Number of Tasks generated" : len(inventory_data),
            "Completion Within 48Hrs" : inventory_data["48Hrs Compliance"].value_counts()["<=48 Hours"],
            "Pending beyond 48Hrs" : len(inventory_data)-inventory_data["48Hrs Compliance"].value_counts()["<=48 Hours"],
            "Number of Tasks Accepted with 0 Variance" : len(inventory_data)-inventory_data["Adjustment Date"].count(),
            "Number of Tasks Rejected with Variance" : inventory_data["Adjustment Date"].count(),
        }

        # Convert NumPy data types to native Python types
        cleaned_data = {
            k: (int(v) if isinstance(v, np.integer)
                else float(v) if isinstance(v, np.floating)
                else v)
            for k, v in data.items()
        }

        return cleaned_data

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})