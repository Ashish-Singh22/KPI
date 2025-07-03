
const backendDomain = "https://kpi-backend-mern.onrender.com"

const SummaryApi = {

  workerPickingUpload: {
    url: `${backendDomain}/api/workerPickingUpload`,
    method: "post",
  },
  workerPackingUpload: {
    url: `${backendDomain}/api/workerPackingUpload`,
    method: "post",
  },
  dpmoUpload: {
    url: `${backendDomain}/api/dpmo-upload`,
    method: "post",
  },
  dnShipmentUpload: {
    url: `${backendDomain}/api/shipment-upload`,
    method: "post",
  },
  dnProductivityUpload: {
    url: `${backendDomain}/api/productivity-upload`,
    method: "post",
  },
  fsfFafUpload: {
    url: `${backendDomain}/api/fsf-faf`,
    method: "post",
  },
  inventoryUpload:{
    url: `${backendDomain}/api/inventory-upload`,
    method: "post",
  },
  findPicker: {
    url: `${backendDomain}/api/find-picker`,
    method: "post",
  },
  findPacker: {
    url: `${backendDomain}/api/find-packer`,
    method: "post",
  },
  findShipment: {
    url: `${backendDomain}/api/find-shipment`,
    method: "post",
  },  
  findProductivity: {
    url: `${backendDomain}/api/find-productivity`,
    method: "post",
  },
  findDpmo: {
    url: `${backendDomain}/api/find-dpmo`,
    method: "post",
  },
  findInventory: {
    url: `${backendDomain}/api/find-inventory`,
    method: "post",
  },
  
  productivityPickingUploadController: {
    url: `${backendDomain}/api/productivity-picking-upload`,
    method: "post",
  },
  productivityPickingFindController: {
    url: `${backendDomain}/api/productivity-picking-find`,
    method: "post",
  },
};
export default SummaryApi