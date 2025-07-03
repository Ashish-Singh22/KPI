import pandas as pd

def process_worker_file(file_stream):
    try:
      # # Step 1: Upload the Excel file
      # from google.colab import files
      # uploaded = files.upload()
      # # Step 2: Read the Excel file using pandas
      # import pandas as pd

      # # Get the uploaded file name
      # filename = list(uploaded.keys())[0]

      # Load Excel file into a DataFrame
      packer_data = pd.read_excel(file_stream)
      packer_data.head()  # Show the first few rows

      # List of columns you want to keep
      columns_to_keep = ['Task', 'Item', 'Quantity', 'Employee',
                        'Drop Off Time','Content LPN']

      # Filter the DataFrame
      packer_data = packer_data[columns_to_keep]

      # Show the filtered DataFrame
      packer_data.head()

      # Convert the Time columns to datetime and keep only the time part
      time_columns = ['Drop Off Time']

      for col in time_columns:
          packer_data[col] = pd.to_datetime(packer_data[col], errors='coerce').dt.time

      # Show the updated DataFrame
      packer_data.head()

      import datetime

      # Function to determine shift number from time
      def get_shift(time_val):
          if pd.isnull(time_val):
              return None
          if datetime.time(6, 0, 0) <= time_val <= datetime.time(13, 59, 59):
              return 1
          elif datetime.time(14, 0, 0) <= time_val <= datetime.time(21, 59, 59):
              return 2
          elif datetime.time(22, 0, 0) <= time_val <= datetime.time(23, 59, 59):
              return 3
          else:
              return 3  # Anything from 00:00:00 to 05:59:59 as Shift 3 (midnight hours)

      # Apply to the DataFrame
      packer_data['Drop Off Shift'] = packer_data['Drop Off Time'].apply(get_shift)

      # Show result
      packer_data

      from datetime import date

      my_date = date(2025, 6, 12)  # year, month, day
      print(my_date)

      # for Drop Off time
      import datetime
      h_a=[]
      obj = {
          "date": my_date,
          "shift":None,
          "count_basis":None,
          "time":None,
          "load_data":None
      }
      db_s1 = pd.DataFrame(columns=['Employee', '06:00:00-06:59:59','07:00:00-07:59:59','08:00:00-08:59:59','09:00:00-09:59:59','10:00:00-10:59:59','11:00:00-11:59:59','12:00:00-12:59:59','13:00:00-13:59:59','Total'])
      db_s2 = pd.DataFrame(columns=['Employee', '14:00:00-14:59:59','15:00:00-15:59:59','16:00:00-16:59:59','17:00:00-17:59:59','18:00:00-18:59:59','19:00:00-19:59:59','20:00:00-20:59:59','21:00:00-21:59:59','Total'])
      db_s3 = pd.DataFrame(columns=['Employee', '22:00:00-22:59:59','23:00:00-23:59:59','00:00:00-00:59:59','01:00:00-01:59:59','02:00:00-02:59:59','03:00:00-03:59:59','04:00:00-04:59:59','05:00:00-05:59:59','Total'])
      data = []
      columns_s1 = ['Employee', '06:00:00-06:59:59','07:00:00-07:59:59','08:00:00-08:59:59',
                    '09:00:00-09:59:59','10:00:00-10:59:59','11:00:00-11:59:59',
                    '12:00:00-12:59:59','13:00:00-13:59:59','Total']
      columns_s2 = ['Employee','14:00:00-14:59:59','15:00:00-15:59:59','16:00:00-16:59:59',
                    '17:00:00-17:59:59','18:00:00-18:59:59','19:00:00-19:59:59',
                    '20:00:00-20:59:59','21:00:00-21:59:59','Total']
      columns_s3 = ['Employee', '22:00:00-22:59:59','23:00:00-23:59:59','00:00:00-00:59:59','01:00:00-01:59:59','02:00:00-02:59:59','03:00:00-03:59:59','04:00:00-04:59:59','05:00:00-05:59:59','Total']



      # Item


      for index, row in packer_data.iterrows():
        sh = row['Drop Off Shift']
        c_b="Item"
        t = "Drop Off Time"
        hour = row["Drop Off Time"].hour
        h=hour
        if 6 <= hour < 14:
          hour=hour-5
        else:
          if 14 <= hour < 22:
            hour=hour-13
          else:
            if(hour<22):
              hour+=22
              h+=22
            hour=hour-21
        p=0
        h_a.append(hour)
        for ob in data:
          if ob["shift"] == sh and ob["count_basis"] == c_b and ob["time"] == t:
            for x,i in ob["load_data"].iterrows():
              if(row["Employee"] == i["Employee"]):
                ob["load_data"].iat[x,hour] += 1
                ob["load_data"].iat[x,-1] += 1
                p=1
                break
            if(p==0):
                new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
                new_row[hour] += 1  # +1 because column index 0 is 'Employee'
                new_row[-1] += 1
                if(6 <= h < 14):
                  new_df = pd.DataFrame([new_row], columns=columns_s1)
                else:
                  if(14 <= h< 22):
                    new_df = pd.DataFrame([new_row], columns=columns_s2)
                  else:
                    new_df = pd.DataFrame([new_row], columns=columns_s3)
                ob["load_data"] = pd.concat([ob["load_data"], new_df], ignore_index=True)
                p=1
                break;
        if p==0:
          if 6 <= h < 14:
                new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
                new_row[hour] += 1  # +1 because column index 0 is 'Employee'
                new_row[-1] += 1
                new_df = pd.DataFrame([new_row], columns=columns_s1)
                db_s1 = pd.concat([db_s1, new_df], ignore_index=True)
                data.append({
                  "date": my_date,
                  "shift":sh,
                  "count_basis":c_b,
                  "time":t,
                  "load_data":db_s1})
                p=1
          else:
            if 14<=h<22:
              new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
              new_row[hour] +=1  # +1 because column index 0 is 'Employee'
              new_row[-1] +=1
              new_df = pd.DataFrame([new_row], columns=columns_s2)
              db_s2 = pd.concat([db_s2, new_df], ignore_index=True)
              data.append({
                  "date": my_date,
                  "shift":sh,
                  "count_basis":c_b,
                  "time":t,
                  "load_data":db_s2})
              p=1
            else:
              #  print("Hello")
              new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
              new_row[hour] +=1  # +1 because column index 0 is 'Employee'
              new_row[-1] +=1
              new_df = pd.DataFrame([new_row], columns=columns_s3)
              db_s3 = pd.concat([db_s3, new_df], ignore_index=True)
              #  print(db_s3)
              #  print(len(data))
              data.append({
                  "date": my_date,
                  "shift":sh,
                  "count_basis":c_b,
                  "time":t,
                  "load_data":db_s3.copy(deep=True)})
              #  print(len(data))
              p=1



      db_s1.drop(db_s1.index, inplace=True)
      db_s2.drop(db_s2.index, inplace=True)
      db_s3.drop(db_s3.index, inplace=True)


      # Quantity

      for index, row in packer_data.iterrows():
        sh = row['Drop Off Shift']
        c_b="Quantity"
        t = "Drop Off Time"
        hour = row["Drop Off Time"].hour
        h=hour
        if 6 <= hour < 14:
          hour=hour-5
        else:
          if 14 <= hour < 22:
            hour=hour-13
          else:
            if(hour<22):
              hour+=22
              h+=22
            hour=hour-21
        p=0
        h_a.append(hour)
        for ob in data:
          if ob["shift"] == sh and ob["count_basis"] == c_b and ob["time"] == t:
            for x,i in ob["load_data"].iterrows():
              if(row["Employee"] == i["Employee"]):
                ob["load_data"].iat[x,hour] += row["Quantity"]
                ob["load_data"].iat[x,-1] += row["Quantity"]
                p=1
                break
            if(p==0):
                new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
                new_row[hour] += row["Quantity"]  # +1 because column index 0 is 'Employee'
                new_row[-1] += row["Quantity"]
                if(6 <= h < 14):
                  new_df = pd.DataFrame([new_row], columns=columns_s1)
                else:
                  if(14 <= h< 22):
                    new_df = pd.DataFrame([new_row], columns=columns_s2)
                  else:
                    new_df = pd.DataFrame([new_row], columns=columns_s3)
                ob["load_data"] = pd.concat([ob["load_data"], new_df], ignore_index=True)
                p=1
                break;
        if p==0:
          if 6 <= h < 14:
                new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
                new_row[hour] += row["Quantity"]  # +1 because column index 0 is 'Employee'
                new_row[-1] += row["Quantity"]
                new_df = pd.DataFrame([new_row], columns=columns_s1)
                db_s1 = pd.concat([db_s1, new_df], ignore_index=True)
                data.append({
                  "date": my_date,
                  "shift":sh,
                  "count_basis":c_b,
                  "time":t,
                  "load_data":db_s1})
                p=1
          else:
            if 14<=h<22:
              new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
              new_row[hour] += row["Quantity"]  # +1 because column index 0 is 'Employee'
              new_row[-1] += row["Quantity"]
              new_df = pd.DataFrame([new_row], columns=columns_s2)
              db_s2 = pd.concat([db_s2, new_df], ignore_index=True)
              data.append({
                  "date": my_date,
                  "shift":sh,
                  "count_basis":c_b,
                  "time":t,
                  "load_data":db_s2})
              p=1
            else:
              new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
              new_row[hour] += row["Quantity"]  # +1 because column index 0 is 'Employee'
              new_row[-1] += row["Quantity"]
              new_df = pd.DataFrame([new_row], columns=columns_s3)
              db_s3 = pd.concat([db_s3, new_df], ignore_index=True)
              data.append({
                  "date": my_date,
                  "shift":sh,
                  "count_basis":c_b,
                  "time":t,
                  "load_data":db_s3.copy(deep=True)})
              p=1

      db_s1.drop(db_s1.index, inplace=True)
      db_s2.drop(db_s2.index, inplace=True)
      db_s3.drop(db_s3.index, inplace=True)


      # Content LPN

      # 1. Initialize the dictionary
      worker = {}

      # 2. Function to insert worker
      def insert(name, value):
          if name not in worker:
              worker[name] = set()
          worker[name].add(value)

      # 3. Function to check if name and value exist
      def check(name, value):
          return name in worker and value in worker[name]

      for index, row in packer_data.iterrows():
          sh = row['Drop Off Shift']
          c_b = "Content LPN"
          t = "Drop Off Time"
          hour = row["Drop Off Time"].hour
          h = hour

          if 6 <= hour < 14:
              hour = hour - 5
          elif hour < 22:
              hour = hour - 13
          else:
              if 14 <= hour < 22:
                  hour += 22
                  h += 22
              hour = hour - 21

          p = 0
          h_a.append(hour)

          if not check(row["Employee"], row["Content LPN"]):
              insert(row["Employee"], row["Content LPN"])
              for ob in data:
                  if ob["shift"] == sh and ob["count_basis"] == c_b and ob["time"] == t:
                      for x, i in ob["load_data"].iterrows():
                          if row["Employee"] == i["Employee"]:
                              ob["load_data"].iat[x, hour] += 1
                              ob["load_data"].iat[x, -1] += 1
                              p = 1
                              break
                      if p == 0:
                          new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
                          new_row[hour] += 1
                          new_row[-1] += 1
                          if 6 <= h < 14:
                              new_df = pd.DataFrame([new_row], columns=columns_s1)
                          elif 14 <= h < 22:
                              new_df = pd.DataFrame([new_row], columns=columns_s2)
                          else:
                              new_df = pd.DataFrame([new_row], columns=columns_s3)
                          ob["load_data"] = pd.concat([ob["load_data"] , new_df], ignore_index=True)
                          p = 1
                          break

              if p == 0:
                  new_row = [row["Employee"], 0, 0, 0, 0, 0, 0, 0, 0, 0]
                  new_row[hour] += 1
                  new_row[-1] += 1
                  if 6 <= h < 14:
                      new_df = pd.DataFrame([new_row], columns=columns_s1)
                      db_s1 = pd.concat([db_s1, new_df], ignore_index=True)
                      data.append({
                          "date": my_date,
                          "shift": sh,
                          "count_basis": c_b,
                          "time": t,
                          "load_data": db_s1
                      })
                  elif 14<=h < 22:
                      new_df = pd.DataFrame([new_row], columns=columns_s2)
                      db_s2 = pd.concat([db_s2, new_df], ignore_index=True)
                      data.append({
                          "date": my_date,
                          "shift": sh,
                          "count_basis": c_b,
                          "time": t,
                          "load_data": db_s2
                      })
                  else:
                      new_df = pd.DataFrame([new_row], columns=columns_s3)
                      db_s3 = pd.concat([db_s3, new_df], ignore_index=True)
                      data.append({
                          "date": my_date,
                          "shift": sh,
                          "count_basis": c_b,
                          "time": t,
                          "load_data": db_s3.copy(deep=True)
                      })

      # Drop rows from intermediate DataFrames to reset for future use
      db_s1.drop(db_s1.index, inplace=True)
      db_s2.drop(db_s2.index, inplace=True)
      db_s3.drop(db_s3.index, inplace=True)

      print(data)

      print(len(data))

      import json

      # Assuming `data` is already created as per your current logic
      ready_to_send = []

      for entry in data:
          record = {
              "date": entry["date"].strftime("%Y-%m-%d"),  # Convert date to string
              "shift": entry["shift"],
              "count_basis": entry["count_basis"],
              "time": entry["time"],
              "load_data": entry["load_data"].to_dict(orient="records")  # DataFrame to list of dicts
          }
          ready_to_send.append(record)

      # # Now send `ready_to_send` using requests or save as JSON
      # print(ready_to_send)
      return {'success': True, 'data': ready_to_send}
    except Exception as e:
        return {'success': False, 'message': str(e)}