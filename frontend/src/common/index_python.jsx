const backendDomain = "https://kpi-backend-python.onrender.com";

const SummaryApiPython = {
  sum: {
    url: `${backendDomain}/api/sum`,
    method: "post",
  },
  workerPickingUpload: {
    url: `${backendDomain}/api/worker-picking`,
    method: "post",
  },
  workerPackingUpload: {
    url: `${backendDomain}/api/worker-packing`,
    method: "post",
  },
  dpmoUpload: {
    url: `${backendDomain}/api/dpmo`,
    method: "post",
  },
  dnShipmentUpload: {
    url: `${backendDomain}/api/dn-shipment`,
    method: "post",
  },
  dnProductivityUpload: {
    url: `${backendDomain}/api/dn-productivity`,
    method: "post",
  },
  fsfFafUpload: {
    url: `${backendDomain}/api/upload/fsf-faf`,
    method: "post",
  },
  filterWorkerController: {
    url: `${backendDomain}/api/filter-worker`,
    method: "post",
  },
  filterDnController: {
    url: `${backendDomain}/api/filter-dn`,
    method: "post",
  },
  filterDpmoController: {
    url: `${backendDomain}/api/filter-dpmo`,
    method: "post",
  },
  uploadInventoryController: {
    url: `${backendDomain}/api/upload-inventory`,
    method: "post",
  },
  openDnController: {
    url: `${backendDomain}/api/open-dn`,
    method: "post",
  },
  productivityPickingController: {
    url: `${backendDomain}/api/productivity-picking`,
    method: "post",
  },
  filterProductivityPickerController: {
    url: `${backendDomain}/api/filter-productivity-picking`,
    method: "post",
  },
};

export default SummaryApiPython;