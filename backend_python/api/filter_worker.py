import pandas as pd
import json
import pandas as pd
from datetime import datetime
from flask import send_file
from collections import Counter


def process_worker_file(name,uploaded_data, filter_data):
    try:
        if name ==  'Packer':    
            selectionData = filter_data

            # Convert string to datetime
            start = datetime.strptime(selectionData["startDate"], "%Y-%m-%d")
            end = datetime.strptime(selectionData["endDate"], "%Y-%m-%d")

            # Calculate date difference
            diff_date = (end - start).days

            # print("Date Difference in Days:", diff_date)  # Output: 7

            # import pickle
            # import datetime

            data = []

            for record in uploaded_data:
                entry = {
                    "date": datetime.strptime(record["date"], "%Y-%m-%d"),  # Convert string to datetime
                    "shift": record["shift"],
                    "count_basis": record["count_basis"],
                    "time": record["time"],
                    "load_data": pd.DataFrame(record["load_data"])  # Convert list of dicts to DataFrame
                }
                data.append(entry)


            final_data = {}

            # import pandas as pd

            # Utility function
            def check(dic, name):
                return name in dic

            all_cols = set()
            final_data = {}

            # Main logic
            if diff_date == 0:
                print("1")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        for col in ob["load_data"].columns[1:-1]:  # skip Employee and Total
                            all_cols.add(str(col))
                            emp = row["Employee"]
                            if check(final_data, emp):
                                if check(final_data[emp], col):
                                    final_data[emp][col] += row[col]
                                else:
                                    final_data[emp][col] = row[col]
                            else:
                                final_data[emp] = {col: row[col]}

            elif 0 < diff_date <= 13:
                print("2")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        emp = row["Employee"]
                        col = str(ob["date"])
                        all_cols.add(col)
                        value = row.iloc[-1]
                        if check(final_data, emp):
                            if check(final_data[emp], col):
                                final_data[emp][col] += value
                            else:
                                final_data[emp][col] = value
                        else:
                            final_data[emp] = {col: value}

            elif 13 < diff_date <= 59:
                print("3")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        emp = row["Employee"]
                        curr_week = (((ob["date"]).date() - start.date()).days // 7) + 1
                        week_key = f"Week {int(curr_week)}"
                        value = row.iloc[-1]

                        if check(final_data, emp):
                            if week_key not in final_data[emp]:
                                final_data[emp][week_key] = 0
                            final_data[emp][week_key] += value
                        else:
                            # Prepare all weeks for the employee
                            w_n = (diff_date // 7) + (1 if diff_date % 7 != 0 else 0)
                            cols = [f"Week {i}" for i in range(1, w_n + 1)]
                            week_dict = {col: 0 for col in cols}
                            final_data[emp] = week_dict
                            if curr_week <= w_n:
                                final_data[emp][week_key] += value
                            all_cols.update(cols)

            elif diff_date > 59:
                print("4")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        emp = row["Employee"]
                        curr_month = (((ob["date"]).date() - start.date()).days // 30) + 1
                        month_key = f"Month {int(curr_month)}"
                        value = row.iloc[-1]

                        if check(final_data, emp):
                            if month_key not in final_data[emp]:
                                final_data[emp][month_key] = 0
                            final_data[emp][month_key] += value
                        else:
                            # Prepare all months for the employee
                            m_n = (diff_date // 30) + (1 if diff_date % 30 != 0 else 0)
                            cols = [f"Month {i}" for i in range(1, m_n + 1)]
                            month_dict = {col: 0 for col in cols}
                            final_data[emp] = month_dict
                            if curr_month <= m_n:
                                final_data[emp][month_key] += value
                            all_cols.update(cols)

            # Final DataFrame construction
            records = []
            col_list = sorted([str(col) for col in all_cols])
            print(final_data)

            if 'workerName' in selectionData:
                for employee, hour_data in final_data.items():
                    if selectionData['workerName'] != employee:
                        continue
                    row = {'Employee': employee}
                    for col in col_list:
                        row[col] = hour_data.get(col, 0)
                    records.append(row)
            else:
                for employee, hour_data in final_data.items():
                    row = {'Employee': employee}
                    for col in col_list:
                        row[col] = hour_data.get(col, 0)
                    records.append(row)

            # Build dataframe at once — safer and faster
            send_data = pd.DataFrame(records)

            # Reset index to avoid index-related issues
            send_data.reset_index(drop=True, inplace=True)

            # Replace the last part of the try block
            send_data_dict = send_data.to_dict(orient="records")
            columns = list(send_data.columns)
            # print(send_data_dict)
            return {
                'success': True,
                'data': send_data_dict,
                'columns': columns
            }
        else:
            selectionData = filter_data

            # Convert string to datetime
            start = datetime.strptime(selectionData["startDate"], "%Y-%m-%d")
            end = datetime.strptime(selectionData["endDate"], "%Y-%m-%d")

            # Calculate date difference
            diff_date = (end - start).days

            # print("Date Difference in Days:", diff_date)  # Output: 7

            # import pickle
            # import datetime

            data = []

            for record in uploaded_data:
                df = pd.DataFrame(record["load_data"])

                entry = {
                    "date": datetime.strptime(record["date"], "%Y-%m-%d"),  # Convert string to datetime
                    "shift": record["shift"],
                    "count_basis": record["count_basis"],
                    "time": record["time"],
                    "load_data": df
                }
                data.append(entry)



            final_data = {}

            # import pandas as pd

            # Utility function
            def check(dic, name):
                return name in dic

            all_cols = set()
            final_data = {}
            vehicle_used = {}
            # Main logic
            if diff_date == 0:
                print("1")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        if row["Employee"] in vehicle_used:
                            vehicle_used[row["Employee"]] = dict(Counter( vehicle_used[row["Employee"]]) + Counter(row[-1]))
                        else:
                            vehicle_used[row["Employee"]] = (row[-1])
                        for col in ob["load_data"].columns[1:-2]:  # skip Employee and Total
                            all_cols.add(str(col))
                            emp = row["Employee"]
                            if check(final_data, emp):
                                if check(final_data[emp], col):
                                    final_data[emp][col] += row[col]
                                else:
                                    final_data[emp][col] = row[col]
                            else:
                                final_data[emp] = {col: row[col]}

            elif 0 < diff_date <= 13:
                print("2")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        if row["Employee"] in vehicle_used:
                            vehicle_used[row["Employee"]] = dict(Counter( vehicle_used[row["Employee"]]) + Counter(row[-1]))
                        else:
                            vehicle_used[row["Employee"]] = (row[-1])
                        emp = row["Employee"]
                        col = str(ob["date"])
                        all_cols.add(col)
                        value = row.iloc[-2]
                        if check(final_data, emp):
                            if check(final_data[emp], col):
                                final_data[emp][col] += value
                            else:
                                final_data[emp][col] = value
                        else:
                            final_data[emp] = {col: value}

            elif 13 < diff_date <= 59:
                print("3")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        if row["Employee"] in vehicle_used:
                            vehicle_used[row["Employee"]] = dict(Counter( vehicle_used[row["Employee"]]) + Counter(row[-1]))
                        else:
                            vehicle_used[row["Employee"]] = (row[-1])
                        emp = row["Employee"]
                        curr_week = (((ob["date"]).date() - start.date()).days // 7) + 1
                        week_key = f"Week {int(curr_week)}"
                        value = row.iloc[-2]

                        if check(final_data, emp):
                            if week_key not in final_data[emp]:
                                final_data[emp][week_key] = 0
                            final_data[emp][week_key] += value
                        else:
                            # Prepare all weeks for the employee
                            w_n = (diff_date // 7) + (1 if diff_date % 7 != 0 else 0)
                            cols = [f"Week {i}" for i in range(1, w_n + 1)]
                            week_dict = {col: 0 for col in cols}
                            final_data[emp] = week_dict
                            if curr_week <= w_n:
                                final_data[emp][week_key] += value
                            all_cols.update(cols)

            elif diff_date > 59:
                print("4")
                for ob in data:
                    for idx, row in ob["load_data"].iterrows():
                        if row["Employee"] in vehicle_used:
                            vehicle_used[row["Employee"]] = dict(Counter( vehicle_used[row["Employee"]]) + Counter(row[-1]))
                        else:
                            vehicle_used[row["Employee"]] = (row[-1])
                        emp = row["Employee"]
                        curr_month = (((ob["date"]).date() - start.date()).days // 30) + 1
                        month_key = f"Month {int(curr_month)}"
                        value = row.iloc[-2]

                        if check(final_data, emp):
                            if month_key not in final_data[emp]:
                                final_data[emp][month_key] = 0
                            final_data[emp][month_key] += value
                        else:
                            # Prepare all months for the employee
                            m_n = (diff_date // 30) + (1 if diff_date % 30 != 0 else 0)
                            cols = [f"Month {i}" for i in range(1, m_n + 1)]
                            month_dict = {col: 0 for col in cols}
                            final_data[emp] = month_dict
                            if curr_month <= m_n:
                                final_data[emp][month_key] += value
                            all_cols.update(cols)

            # Final DataFrame construction
            records = []
            col_list = sorted([str(col) for col in all_cols])
            print(final_data)

            if 'workerName' in selectionData:
                for employee, hour_data in final_data.items():
                    if selectionData['workerName'] != employee:
                        continue
                    row = {'Employee': employee}
                    for col in col_list:
                        row[col] = hour_data.get(col, 0)
                    records.append(row)
            else:
                for employee, hour_data in final_data.items():
                    row = {'Employee': employee}
                    for col in col_list:
                        row[col] = hour_data.get(col, 0)
                    records.append(row)

            # Build dataframe at once — safer and faster
            send_data = pd.DataFrame(records)
            
            vehicle_list = []

            for emp in send_data['Employee']:
                vehicles = vehicle_used.get(emp, set())
                vehicle_list.append((emp, vehicles))  # Store as (key, value) tuple

            # Insert the entire key-value pair list as the first column
            send_data.insert(1, 'Vehicle Used', vehicle_list)


            # Reset index to avoid index-related issues
            send_data.reset_index(drop=True, inplace=True)

            # Replace the last part of the try block
            send_data_dict = send_data.to_dict(orient="records")
            columns = list(send_data.columns)
            # print(send_data_dict)
            return {
                'success': True,
                'data': send_data_dict,
                'columns': columns
            }
    except Exception as e:
        return {'success': False, 'message': str(e)}




