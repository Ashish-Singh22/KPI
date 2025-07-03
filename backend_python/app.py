from flask import Flask
from flask_cors import CORS
from api.sum import sum_bp
from api.workerPickingUpload import workerPickingUpload_bp
from api.filterWorkerController import filterWorkerController_bp
from api.workerPackingUpload import workerPackingUpload_bp
from api.dnShipmentController import dnShipmentController_bp
from api.dnProductivityController import dnProductivityController_bp
from api.dpmoController import dpmoController_bp
from api.filterDnController import filterDnController_bp
from api.filterDpmoController import filterDpmoController_bp
from api.uploadInventoryController import uploadInventoryController_bp
from api.openDnController import openDnController_bp
from api.productivityPickerController import productivityPickingController_bp
from api.filterProductivityPickerController import filterProductivityPickerController_bp

app = Flask(__name__)

# ✅ Correct CORS config
CORS(
    app,
    origins=["http://localhost:5173"],  # your React dev server
    supports_credentials=True           # allows cookies, sessions
)

# Register blueprint
app.register_blueprint(sum_bp, url_prefix='/api')
# for picker
app.register_blueprint(workerPickingUpload_bp, url_prefix='/api')
app.register_blueprint(filterWorkerController_bp, url_prefix='/api')
#for packer
app.register_blueprint(workerPackingUpload_bp, url_prefix='/api')
#for dn-shipment
app.register_blueprint(dnShipmentController_bp, url_prefix='/api')
app.register_blueprint(filterDnController_bp,url_prefix='/api')
app.register_blueprint(openDnController_bp,url_prefix='/api')
#for dn-shipment
app.register_blueprint(dnProductivityController_bp, url_prefix='/api')
#dpmo
app.register_blueprint(dpmoController_bp, url_prefix='/api')
app.register_blueprint(filterDpmoController_bp, url_prefix='/api')
#inventory
app.register_blueprint(uploadInventoryController_bp, url_prefix='/api')
#productivity

app.register_blueprint(productivityPickingController_bp, url_prefix='/api')
app.register_blueprint(filterProductivityPickerController_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)