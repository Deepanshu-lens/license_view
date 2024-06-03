# import requests
# import json 
# from datetime import datetime
# import flask 
# from flask_cors import CORS
# from requests.auth import HTTPBasicAuth, HTTPDigestAuth
# import xml.etree.ElementTree as ET
# import pdb 


# class nvrCheck():
#     def __init__(self): 
#         flag=1

#     def get_network_interfaces(self, nvr_ip, http_port, auth, folder_path): 
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/System/Network/interfaces"
#         try:
#             response = requests.get(url, auth=auth)
#             if response.status_code == 200:
#                 with open(folder_path + 'networkresponse.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting network interfaces")
#             return response.text    
#         except Exception as e:
#             print(e)
#             return None
    
#     def get_device_info(self, nvr_ip, http_port, auth, folder_path): 
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/System/deviceInfo"
#         try:
#             response = requests.get(url, auth=auth)

#             if response.status_code == 200:
#                 with open(folder_path + 'deviceresponse.xml', 'w') as file:
#                     file.write(response.text)

#             else:
#                 print("Error in getting device info")

#             return response.text
#         except Exception as e:
#             print(e)
#             return None
        
#     def get_channel_info(self, nvr_ip, http_port, auth, folder_path): 
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/InputProxy/channels"
#         try:
#             response = requests.get(url, auth=auth)

#             if response.status_code == 200:
#                 with open(folder_path + 'channelresponse.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting channel info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None
    
#     def get_status(self, nvr_ip, http_port,auth, folder_path): 
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/InputProxy/channels/status"
#         try:
#             response = requests.get(url, auth=auth)

#             if response.status_code == 200:
#                 with open(folder_path + 'statusresponse.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting status info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None

    
#     def get_time(self, nvr_ip, http_port, auth, folder_path):
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/System/time"
#         try:
#             response = requests.get(url, auth=auth)
#             if response.status_code == 200:
#                 with open(folder_path + 'timeresponse.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting time info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None
        
#     def get_recording_date(self, nvr_ip, http_port, auth, folder_path):
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/record/tracks/"
#         try:
#             response = requests.get(url, auth=auth)
#             if response.status_code == 200:
#                 with open(folder_path + 'recordDate.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting recording date info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None
        
#     def post_recording_date_with_time(self, nvr_ip, http_port, auth, folder_path, camera_id, year, month):
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/record/tracks/{camera_id}/dailyDistribution"
#         payload = f"<?xml version=\"1.0\" encoding=\"utf-8\"?><trackDailyParam><year>{year}</year><monthOfYear>{month}</monthOfYear></trackDailyParam>"
#         try:
#             headers = {'Content-Type': 'application/xml'}
#             response = requests.post(url, auth=auth, headers=headers, data=payload)
#             if response.status_code == 200:
#                 with open(folder_path + 'recordDate' + camera_id + '.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in posting recording date info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None
        
        
#     def get_device_capabilities(self, nvr_ip, http_port, auth, folder_path):
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/System/deviceInfo/capabilities"
#         try:
#             response = requests.get(url, auth=auth)
#             if response.status_code == 200:
#                 with open(folder_path + 'capabilities.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting capabilities info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None
        

#     def get_harddisk_storage(self, nvr_ip, http_port, auth, folder_path):
#         url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/Storage"
#         try:
#             response = requests.get(url, auth=auth)
#             if response.status_code == 200:
#                 with open(folder_path + 'storage.xml', 'w') as file:
#                     file.write(response.text)
#             else:
#                 print("Error in getting storage info")
#             return response.text
#         except Exception as e:
#             print(e)
#             return None
# # GoreGaon
# nvr_ip = "103.57.141.65"
# username = "admin"
# password = "Pass@321"
# http_port = 8080


# # CoreIP
# # nvr_ip = "116.68.244.148"
# # username = "admin"
# # password = "Admin@123"
# # http_port = 80

# # Phase 1 
# # nvr_ip = "50.168.139.59"
# # username = "admin"
# # password = "admin123"
# # http_port = 80

# # Blinkit WareHouse
# # nvr_ip = "118.185.230.121"
# # username = "admin"
# # password = "Grofers@123"
# # http_port = 9107


# camera_id = "101"
# folder_path = "./Response/"
# year = 2024
# month = 6

# auth = HTTPDigestAuth(username, password)
# nvr = nvrCheck()
# response = nvr.get_network_interfaces(nvr_ip, http_port, auth, folder_path)
# response = nvr.get_device_info(nvr_ip, http_port, auth, folder_path)
# response = nvr.get_channel_info(nvr_ip, http_port, auth, folder_path)
# response = nvr.get_status(nvr_ip, http_port, auth, folder_path)
# response = nvr.get_time(nvr_ip, http_port, auth, folder_path)
# response = nvr.get_recording_date(nvr_ip, http_port, auth, folder_path)
# response = nvr.post_recording_date_with_time(nvr_ip, http_port, auth, folder_path, camera_id, year, month)
# response = nvr.get_device_capabilities(nvr_ip, http_port, auth, folder_path)
# response = nvr.get_harddisk_storage(nvr_ip, http_port, auth, folder_path)

import requests
from requests.auth import HTTPDigestAuth
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

class nvrCheck():
    def __init__(self): 
        pass

    def get_network_interfaces(self, nvr_ip, http_port, auth): 
        url = f"http://{nvr_ip}:{http_port}/ISAPI/System/Network/interfaces"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting network interfaces"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def get_device_info(self, nvr_ip, http_port, auth): 
        url = f"http://{nvr_ip}:{http_port}/ISAPI/System/deviceInfo"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting device info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def get_channel_info(self, nvr_ip, http_port, auth): 
        url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/InputProxy/channels"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting channel info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    def get_status(self, nvr_ip, http_port, auth): 
        url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/InputProxy/channels/status"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting status info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    def get_time(self, nvr_ip, http_port, auth):
        url = f"http://{nvr_ip}:{http_port}/ISAPI/System/time"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting time info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def get_recording_date(self, nvr_ip, http_port, auth):
        url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/record/tracks/"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting recording date info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def post_recording_date_with_time(self, nvr_ip, http_port, auth, camera_id, year, month):
        url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/record/tracks/{camera_id}/dailyDistribution"
        payload = f"<?xml version=\"1.0\" encoding=\"utf-8\"?><trackDailyParam><year>{year}</year><monthOfYear>{month}</monthOfYear></trackDailyParam>"
        try:
            headers = {'Content-Type': 'application/xml'}
            response = requests.post(url, auth=auth, headers=headers, data=payload)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in posting recording date info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def get_device_capabilities(self, nvr_ip, http_port, auth):
        url = f"http://{nvr_ip}:{http_port}/ISAPI/System/deviceInfo/capabilities"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting capabilities info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    def get_harddisk_storage(self, nvr_ip, http_port, auth):
        url = f"http://{nvr_ip}:{http_port}/ISAPI/ContentMgmt/Storage"
        try:
            response = requests.get(url, auth=auth)
            if response.status_code == 200:
                return response.text
            else:
                return jsonify({"error": "Error in getting storage info"}), response.status_code
        except Exception as e:
            return jsonify({"error": str(e)}), 500


nvr = nvrCheck()

@app.route('/get_network_interfaces', methods=['POST'])
def get_network_interfaces():
    data = request.json
    response = nvr.get_network_interfaces(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/get_device_info', methods=['POST'])
def get_device_info():
    data = request.json
    response = nvr.get_device_info(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/get_channel_info', methods=['POST'])
def get_channel_info():
    data = request.json
    response = nvr.get_channel_info(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/get_status', methods=['POST'])
def get_status():
    data = request.json
    response = nvr.get_status(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/get_time', methods=['POST'])
def get_time():
    data = request.json
    response = nvr.get_time(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/get_recording_date', methods=['POST'])
def get_recording_date():
    data = request.json
    response = nvr.get_recording_date(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/post_recording_date_with_time', methods=['POST'])
def post_recording_date_with_time():
    data = request.json
    response = nvr.post_recording_date_with_time(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']), data['camera_id'], data['year'], data['month'])
    return response

@app.route('/get_device_capabilities', methods=['POST'])
def get_device_capabilities():
    data = request.json
    response = nvr.get_device_capabilities(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

@app.route('/get_harddisk_storage', methods=['POST'])
def get_harddisk_storage():
    data = request.json
    response = nvr.get_harddisk_storage(data['nvr_ip'], data['http_port'], HTTPDigestAuth(data['username'], data['password']))
    return response

if __name__ == '__main__':
    app.run(debug=True)
