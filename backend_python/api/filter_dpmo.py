import pandas as pd
import json
import pandas as pd
from datetime import datetime
from flask import send_file

def process_dpmo_file(dpmoData):
    try:
        final_data = {
            "t_claim" : 0,
            "t_quantity":0,
            "t_claim_value":0,
            "t_accepted_claim":0,
            "t_accepted_quantity":0,
            "t_accepted_claim_value":0,
            "load_data":{},
            "bar_data":{}
        }

        for ob in dpmoData:
            final_data["t_claim"] += ob["t_claim"]
            final_data["t_quantity"] += ob["t_quantity"]
            final_data["t_claim_value"] += ob["t_claim_value"]
            if ob["claim_status"] == 'Accepted':
                final_data["t_accepted_claim"] += ob["t_claim"]
                final_data["t_accepted_quantity"] += ob["t_quantity"]
                final_data["t_accepted_claim_value"] += ob["t_claim_value"]
                if ob["claim_resp"].lower() not in final_data["load_data"]:
                    final_data["load_data"][ob["claim_resp"].lower()]={}
                for key,value in ob["claim_data"].items():
                    for key_1,value_1 in value.items():
                        if ob["claim_resp"].lower() in final_data["bar_data"]:
                            final_data["bar_data"][ob["claim_resp"].lower()][0] += ob["claim_data"][key][key_1][0]
                            final_data["bar_data"][ob["claim_resp"].lower()][1] += ob["claim_data"][key][key_1][1]
                            final_data["bar_data"][ob["claim_resp"].lower()][2] += ob["claim_data"][key][key_1][2]
                        else:
                            final_data["bar_data"][ob["claim_resp"].lower()] = [ob["claim_data"][key][key_1][0],ob["claim_data"][key][key_1][1],ob["claim_data"][key][key_1][2]]
                        if key_1 in final_data["load_data"][ob["claim_resp"].lower()]:
                            if key in final_data["load_data"][ob["claim_resp"].lower()][key_1]:
                                final_data["load_data"][ob["claim_resp"].lower()][key_1][key][0] += ob["claim_data"][key][key_1][0]
                                final_data["load_data"][ob["claim_resp"].lower()][key_1][key][1] += ob["claim_data"][key][key_1][1]
                                final_data["load_data"][ob["claim_resp"].lower()][key_1][key][2] += ob["claim_data"][key][key_1][2]
                            else:
                                final_data["load_data"][ob["claim_resp"].lower()][key_1][key] = [ob["claim_data"][key][key_1][0],ob["claim_data"][key][key_1][1],ob["claim_data"][key][key_1][2]]
                        else:
                            final_data["load_data"][ob["claim_resp"].lower()][key_1] = {key : [ob["claim_data"][key][key_1][0],ob["claim_data"][key][key_1][1],ob["claim_data"][key][key_1][2]]}
        
        return {
            'success': True,
            'data': final_data,
            'message':"final_data send successfully"
        }
    except Exception as e:
        return {'success': False, 'message': str(e)}
                    

                                