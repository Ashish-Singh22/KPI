# worker_picker_kpi.py
import pandas as pd
import numpy as np
import json
from datetime import datetime

def convert_to_json_serializable(df):
    """
    Convert DataFrame to JSON serializable format
    - Replace NaN with None
    - Convert timestamps to string format
    - Convert time objects to string format
    - Handle other non-serializable objects
    """
    # Make a copy to avoid modifying original
    df_copy = df.copy()
    
    # Handle different data types column by column
    for col in df_copy.columns:
        if df_copy[col].dtype == 'datetime64[ns]' or pd.api.types.is_datetime64_any_dtype(df_copy[col]):
            # Handle datetime conversion with proper null handling
            df_copy[col] = df_copy[col].dt.strftime('%Y-%m-%d %H:%M:%S')
            # Replace NaT (Not a Time) with None for datetime columns
            df_copy[col] = df_copy[col].where(pd.notnull(df_copy[col]), None)
        elif df_copy[col].dtype == 'object':
            # Check if the column contains time objects or other non-serializable types
            def convert_value(val):
                if pd.isna(val) or val is None:
                    return None
                elif hasattr(val, 'strftime'):  # datetime, date, time objects
                    return val.strftime('%H:%M:%S') if hasattr(val, 'hour') else str(val)
                elif isinstance(val, (np.integer, np.floating)):
                    return val.item()  # Convert numpy types to Python types
                elif isinstance(val, np.bool_):
                    return bool(val)
                else:
                    return val
            
            df_copy[col] = df_copy[col].apply(convert_value)
    
    # Replace any remaining NaN with None for JSON serialization
    df_copy = df_copy.where(pd.notnull(df_copy), None)
    
    # Convert to dictionary (records format for frontend)
    records = df_copy.to_dict('records')
    
    # Final cleanup: recursively replace any remaining NaN values
    def clean_record(obj):
        if isinstance(obj, dict):
            return {k: clean_record(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [clean_record(item) for item in obj]
        elif pd.isna(obj) or (isinstance(obj, float) and np.isnan(obj)):
            return None
        elif isinstance(obj, (np.integer, np.floating)):
            return obj.item()
        elif isinstance(obj, np.bool_):
            return bool(obj)
        else:
            return obj
    
    return [clean_record(record) for record in records]

def process_openDn_file(file_stream):
    try:
        # Read the Excel file using pandas
        opendn_data = pd.read_excel(file_stream)
        
        from collections import Counter

        # Make a dictionary of These Two
        lob_dict = {
            "CSS Internal Sale Orders": "ISO",
            "CSS Parts Sales - CPSL": "Direct / OEM",
            "CSS Stock Out Dealer Order": "Dealer",
            "D0M Auto Dealer Sale": "Auto",
            "D0M Break Down Order": "Dealer",
            "D0M List Price Sale": "Direct / OEM",
            "D0M OEM Customer Sale": "Direct / OEM",
            "D0M RC DDo Status Indigenous": "Direct / OEM",
            "D0M RC Exclusive List Sale": "Direct / OEM",
            "D0M RC Indigenous Sale": "Direct / OEM",
            "D0M Sale-In-Transit Orders": "Dealer",
            "D0M SCM BDE Web Orders": "Dealer",
            "D0M SCM Web Orders": "Dealer",
            "D0N RC Exclusive List Sale": "Direct / OEM",
            "DC1 - IND MIN COST CAP": "MINING",
            "DS1 EDO Parts Sale": "EDO",
            "PDC NEW ENGINE SALE": "NEB",
            "PDC ReCon Auto Comp Sale-Core": "Dealer",
            "CSS Campaign EDO": "EDO",
            "CSS Dealer Special Order": "Dealer",
            "PDC NRP DOM SPR SALE": "ABU (AM2 Domestic)",
            "CSS PART SALE ICF 700HP": "Dealer",
            "CSS PART SALE ICF 1400HP": "Dealer",
            "NRPI PDC SPDC EDI Order": "Parts P/L (AM2 Exports)",
            "NRPI PDC MDC EDI Order": "Parts P/L (AM2 Exports)",
            "NRPI PDC RUMST EDI Order": "Parts P/L (AM2 Exports)",
            "PDC NRP MDC EXP EDO": "Parts P/L (AM2 Exports)",
            "PDC NRP SLP EXP SPR SALE": "Parts P/L (AM2 Exports)",
            "PDC NRP RUMST EXP SPR SALE": "Parts P/L (AM2 Exports)",
            "LS2 SPDC EDI Order": "PGBU Exports (LS2)",
            "LS2 SPARES MEMPHIS": "PGBU Exports (LS2)",
            "LS2 Rumst Order": "PGBU Exports (LS2)",
            "PDC IC PARTS SPDC ORDER": "Intercompany",
            "PDC IC PARTS RUMST ORDER": "Intercompany",
            "PDC IC PARTS MDC ORDER": "Intercompany",
            "CSS_SPARES_CME_Export": "Intercompany",
            "PDC CBU FOC ORDER": "CBU (CA1)",
            "PDC CBU VOR FOC ORDER": "CBU (CA1)",
            "PDC CBU SCM SALE ORDER": "CBU (CA1)",
            "CSS Parts Sales - CES": "Direct / OEM",
            "D0M CTIL ITC Part Sale": "Direct / OEM",
            "LS2 EXP EDO": "PGBU Exports (LS2)",
            "PDC IC PARTS JVK ORDER": "Intercompany",
            "PDC NRP SPDC EXP EDO": "Parts P/L (AM2 Exports)",
            "PDC NRP RUMST EXP EDO": "Parts P/L (AM2 Exports)",
            "PDC NRP CUSTOMER EXP SPR SALE": "Parts P/L (AM2 Exports)",
            "PDC CTIL HHP DTA-SEZ": "Direct / OEM",
            "PDC NRP Supplier Sale": "CBU (CA1)",
            "D0M MBD Web Orders": "Dealer",
            "PDC CBU VOR- SALE ORDER": "CBU (CA1)",
            "PDC CBU OEM ORDER": "CBU (CA1)",
            "DEF List Price Sale": "D9N Direct / OEM",
            "DEF RC Exclusive List Sale": "D9N Direct / OEM",
            "PDC NRP DOM VOR": "ABU (AM2 Domestic)",
            "PDC CBU Intercompany Sale": "CBU (CA1)",
            "PDC CIL CPG-SEZ": "Direct / OEM",
            "CES Internal Transfer Order": "CBU (CA1)",
            "PDC CBU SPDC Sales Order": "CBU (CA1)",
            "PDC CBU NRP PARTS SALE ORDER": "CBU (CA1)",
            "PDC NRP BRASIL EXP SPR ORDER": "Parts P/L (AM2 Exports)",
            "NRPI PDC CPDC EDI Order": "Parts P/L (AM2 Exports)",
            "CSS Parts Sale-CTIL CES": "Direct / OEM",
            "PDC NRP MDC EXP SPR SALE": "Parts P/L (AM2 Exports)",
            "PDC NRP SPDC EXP SPR SALE": "Parts P/L (AM2 Exports)",
            "PDC NRP Cummins UK Sales Order": "Parts P/L (AM2 Exports)",
            "NRPO CTIPL EXP STK ORD - SPDC": "AC1 EXPORT",
            "NRPO IC SALE": "AC1 INTERNAL",
            "NRPO CTIPL CBU SCM SALE ORDER": "AC1 Domestics",
            "NRPO CTIPL DMS FOC Order": "AC1 Domestics",
            "NRPO CTIPL CBU OEM ORDER": "AC1 Domestics",
            "NRPO CTIPL DMS FOC TO SALE": "AC1 Domestics",
            "AC1 D9M REGULAR": "AC1 Internal",
            "AC1 NRPI CIL REGULAR": "AC1 Internal",
            "NRPO CTIPL DMS VOR- SALE ORDER": "AC1 Domestics",
            "CSS Parts FOC Order": "Dealer",
            "NRPI-CTIPL MDC EDI Order": "AC1 EXPORT",
            "NRPO CTIPL CBU NRP SALE ORDER": "AC1 Internal",
            "CSS IND POWERGEN LHP": "Direct / OEM",
            "CSS IND POWERGEN HHP": "Direct / OEM",
            "NRPI CTIPL Internal SalesOrder": "AC1 Domestics",
            "AC1 OEM REGULAR": "AC1 Domestics",
            "NRPO CTIPL OEM - VOR Orders": "AC1 Domestics",
            "NRPO CTIPL OEM Orders": "AC1 Domestics",
            "CSS IND DOEM NEB": "NEB",
            "NRPI - Internal Sales Order": "AM2 Internal",
            "NRPI-CTIPL SPDC EDI Order": "AC1 EXPORT",
            "NRPI-CTIPL RUMST EDI Order": "AC1 EXPORT",
            "NRPO CTIPL CBU RMA W/O REF CR": "RMA",
            "PDC CBU WARRANTY SERVICE CHRGE": "Service bill",
            "D9M Scrap Sale Exciseable": "SCRAP",
            "D0M RMA (Ref/Recpt/Credit)": "RMA",
            "CSS Parts Back Order": "FOC",
            "NRPO CTIPL DMS WARRANTY SC": "AC1-BILL ONLY",
            "PDC NRP EXP RMA WITH REF": "RMA",
            "PDC DBU Dealer FAR Firm Orders": "Dealer",
            "CSS FOC Scrap Sale Exciseable": "SCRAP",
            "PDC CBU WARRANTY RETURN": "CA1",
            "NRPO CTIPL EXP STK ORD - Rumst": "AC1 EXPORT",
            "CSS - IND RAILWAY & ONGC": "Direct / OEM",
            "NRPO CTIPL EXP STK ORD - MDC": "AC1 EXPORT",
            "PDC CSS Sing (BD) Exp Sale": "JAKSON SGP EXP",
            "NRPO CTIPL DMS VOR FOC ORDER": "AC1 FOC",
            "NRPO CTIPL DMS WARRANTY RETURN": "RMA",
            "PDC RMA-Receipt Without Credit": "RMA",
            "RMA W Ref/ Recp/Cr for PDC Exp": "RMA",
            "CSS CDOS RMA With Ref": "RMA",
            "PDC Dealer Inspection Order": "D9N Dealer",
            "D0M CTIL Part Sale": "D9M  Internal",
            "NRPO CTIPL SEP PARTS ORDER": "AC1 EXPORT",
            "PDC NRP DOM RMA": "RMA",
            "NRPOCTIPL RMA DOM(Ref/Rcpt/Cr)": "RMA",
            "D0M RMA W/O Ref W Recpt/Credit": "RMA",
            "PDC NRP CUMMINS SA SO": "Parts P/L (AM2 Exports)",
        }

        # Create the new column L_O_B by mapping ORDER_TYPE with lob_dict
        opendn_data['L_O_B'] = opendn_data['ORDER_TYPE'].map(lob_dict)

        # # List of columns you want to keep
        # columns_to_keep = ['WAREHOUSE', 'SHIPMENT_PRIORITY_CODE', 'NO_OF_LINES', 'HASH_QTY',
        #                   'DNVALUE','REMARK','AGING','TO_SUBINVENTORY','SHIP_TO_LOCATION',
        #                   'ORDER_TYPE','NO_OF_LINES_PROMISE_TODAY','L_O_B','PACKING_STATUS']

        # # Filter the DataFrame
        # opendn_data = opendn_data[columns_to_keep]

        # Define conditions for AGING
        conditions = [
            (opendn_data['AGING'] <= 3),
            (opendn_data['AGING'] >= 4) & (opendn_data['AGING'] <= 6),
            (opendn_data['AGING'] > 6)
        ]

        # Define corresponding labels
        choices = [
            '0 to 3 days DN Details',
            '4 to 6 days DN Details',
            '>=7 days DN Details'
        ]

        # Create new column 'AGING_CATEGORY' based on conditions
        opendn_data['AGING'] = np.select(conditions, choices, default='Unknown')

        # Create the condition: contains 'filter' in SHIPMENT_PRIORITY_CODE
        filter_condition = (
            opendn_data['SHIPMENT_PRIORITY_CODE'].str.contains('filter', case=False, na=False)
        )

        # Append ' Filter' to existing L_O_B values that meet the condition
        opendn_data.loc[filter_condition, 'L_O_B'] = opendn_data.loc[filter_condition, 'L_O_B'] + ' Filter'

        # Define the list of target locations
        target_locations = ['AP3-LOC-ILC ', 'D2S-LOC-ILC ', 'DPN-LOC-01 ']

        # Update L_O_B where SHIP_TO_LOCATION is in target_locations
        opendn_data.loc[opendn_data['SHIP_TO_LOCATION'].isin(target_locations), 'L_O_B'] = \
            opendn_data['SHIP_TO_LOCATION']

        # Condition 1: If 'REMARK' contains 'D2S HOLD'
        condition1 = opendn_data['REMARK'].str.contains('D2S HOLD', case=False, na=False)

        # Condition 2: If 'REMARK' contains 'HOLD' AND 'WAREHOUSE' is 'D2S'
        condition2 = (opendn_data['REMARK'].str.contains('HOLD', case=False, na=False)) & (opendn_data['WAREHOUSE'] == 'D2S')

        # Apply the logic to set 'L_O_B'
        opendn_data['L_O_B'] = np.where(condition1 | condition2, 'D2S HOLD', opendn_data['L_O_B'])

        # Define the list of target locations
        target_locations = ['COO ISSUE','COO MISSING', 'FOC', 'HHP DN','HOLD BY CS','HOLD BY MLL','INSPECTION HOLD','D9N INTERNAL','ASSESABLE PRICE ISSUE']

        # Update L_O_B where REMARK is in target_locations
        opendn_data.loc[opendn_data['REMARK'].isin(target_locations), 'L_O_B'] = \
            opendn_data['REMARK']

        # Condition: REMARK contains 'HOLD' and L_O_B is 'ISO'
        condition_iso_hold = (opendn_data['REMARK'].str.contains('HOLD', case=False, na=False)) & \
                            (opendn_data['L_O_B'].str.contains('ISO',case=False,na=False))

        opendn_data['L_O_B'] = np.where(condition_iso_hold, 'ISO HOLD', opendn_data['L_O_B'])

        # Condition: REMARK contains 'HOLD' and L_O_B is 'Dealer'
        condition_dealer_hold = (opendn_data['REMARK'].str.contains('HOLD', case=False, na=False)) & \
                                (opendn_data['L_O_B'].str.contains('Dealer',case=False,na=False))

        opendn_data['L_O_B'] = np.where(condition_dealer_hold, 'Dealer HOLD', opendn_data['L_O_B'])
        
        # Store final_data before further processing
        final_data = opendn_data.copy()

        hold_values = [
            'AC1 INTERNAL','AM2 Internal','AP3-LOC-ILC','COO ISSUE','D2S HOLD','D2S-LOC-ILC',
            'D9N INTERNAL','Dealer HOLD','DPN-LOC-01','FOC','HHP DN','HOLD BY CS',
            'HOLD BY MLL','INSPECTION HOLD','ISO HOLD','ASSESABLE PRICE ISSUE','COO MISSING'
        ]

        condition_hold = opendn_data['REMARK'].notnull() & ~opendn_data['REMARK'].isin(hold_values)

        opendn_data['L_O_B'] = np.where(condition_hold, 'Other HOLD', opendn_data['L_O_B'])

        # Step 1: Define the HOLD-related values
        hold_values = [
            'AC1 INTERNAL','AM2 Internal','AP3-LOC-ILC','COO ISSUE','D2S HOLD','D2S-LOC-ILC',
            'D9N INTERNAL','Dealer HOLD','DPN-LOC-01','FOC','HHP DN','HOLD BY CS',
            'HOLD BY MLL','INSPECTION HOLD','ISO HOLD','ASSESABLE PRICE ISSUE','COO MISSING','Other HOLD'
        ]

        # Step 2: Extract hold_data and drop from opendn_data
        hold_data = opendn_data[opendn_data['L_O_B'].str.strip().isin(hold_values)].copy()
        opendn_data = opendn_data[~opendn_data.index.isin(hold_data.index)]

        # Step 3: Extract filter_data from remaining rows
        filter_condition = opendn_data['L_O_B'].str.contains('filter', case=False, na=False)
        filter_data = opendn_data[filter_condition].copy()

        # Step 4: Remaining data is parts_data
        parts_data = opendn_data[~opendn_data.index.isin(filter_data.index)].copy()

        # Process parts_data
        p_d = {}
        for index, row in parts_data.iterrows():
            # Skip if WAREHOUSE is NaN
            if pd.isna(row['WAREHOUSE']):
                continue

            warehouse = row['WAREHOUSE']
            aging = row['AGING']
            lob = row['L_O_B']

            if warehouse not in p_d:
                p_d[warehouse] = {}
            if lob not in p_d[warehouse]:
                p_d[warehouse][lob] = {}
            if aging not in p_d[warehouse][lob]:
                p_d[warehouse][lob][aging] = [0, 0, 0]
            
            p_d[warehouse][lob][aging][0] += row['NO_OF_LINES']
            p_d[warehouse][lob][aging][1] += row['HASH_QTY']
            p_d[warehouse][lob][aging][2] += row['DNVALUE']

        # Process filter_data
        f_d = {}
        for index, row in filter_data.iterrows():
            # Skip if WAREHOUSE is NaN
            if pd.isna(row['WAREHOUSE']):
                continue

            warehouse = row['WAREHOUSE']
            aging = row['AGING']
            lob = row['L_O_B']

            if warehouse not in f_d:
                f_d[warehouse] = {}
            if lob not in f_d[warehouse]:
                f_d[warehouse][lob] = {}
            if aging not in f_d[warehouse][lob]:
                f_d[warehouse][lob][aging] = [0, 0, 0]
                
            f_d[warehouse][lob][aging][0] += row['NO_OF_LINES']
            f_d[warehouse][lob][aging][1] += row['HASH_QTY']
            f_d[warehouse][lob][aging][2] += row['DNVALUE']

        # Process hold_data
        h_d = {}
        for index, row in hold_data.iterrows():
            # Skip if WAREHOUSE is NaN
            if pd.isna(row['WAREHOUSE']):
                continue

            lob = row['L_O_B']

            if lob not in h_d:
                h_d[lob] = [0, 0, 0]
                
            h_d[lob][0] += row['NO_OF_LINES']
            h_d[lob][1] += row['HASH_QTY']
            h_d[lob][2] += row['DNVALUE']

        # Convert final_data to JSON serializable format
        final_data_json = convert_to_json_serializable(final_data)

        return {
            'success': True,
            'p_d': p_d,
            'f_d': f_d,
            'h_d': h_d,
            'final_data': final_data_json,
            'message': "Data processed and final_data sent successfully"
        }
        
    except Exception as e:
        return {'success': False, 'message': str(e)}