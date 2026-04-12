'use strict';

const gearmanode = require('gearmanode');
const axios = require('axios');
require('dotenv').config();
// 🧩 Validate environment variables
const { GEARMAN_HOST, GEARMAN_PORT, BASE_URL } = process.env;
if (!GEARMAN_HOST || !GEARMAN_PORT || !BASE_URL) {
  console.error('❌ Missing required environment variables. Check your .env file.');
  process.exit(1);
}

// 🧠 Create Gearman worker
const worker = gearmanode.worker({
  servers: [{ host: GEARMAN_HOST, port: GEARMAN_PORT }]
});

console.log('✅ Gearman Worker Started - Listening for jobs');

// -----------------------------------------------------------------------------
// 🧰 Helper: Centralized async request handler
// -----------------------------------------------------------------------------
async function doAxiosReq(path, module) {
  try {
    let url = `${BASE_URL}${path}`;
    if (module) url += (url.includes('?') ? '&' : '?') + `index=${encodeURIComponent(module)}`;

    console.log('🌐 Requesting:', url);
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.error('⚠️ Axios request failed:', err.message);
    throw err;
  }
}

// -----------------------------------------------------------------------------
// 🧰 Helper: Standardized job handler
// -----------------------------------------------------------------------------
function addJobFunction(functionName, buildModuleParam) {
  worker.addFunction(functionName, async (job) => {
    try {
      const jsonData = JSON.parse(job.payload.toString('utf8'));
      console.log(`🛠 Processing job [${functionName}]:`, jsonData);

      const moduleParam = buildModuleParam(jsonData);
      const data = await doAxiosReq(jsonData.path, moduleParam);

      job.workComplete(JSON.stringify(data));
      console.log(`✅ Job [${functionName}] completed successfully.`);
    } catch (error) {
      console.error(`⚠️ Job [${functionName}] failed:`, error);
      job.workFail();
    }
  });
}

// -----------------------------------------------------------------------------
// 🧩 Register job functions
// -----------------------------------------------------------------------------
addJobFunction('sync_elastic_data', (data) => data.module);
addJobFunction('delete_elastic_data', (data) => `${data.module}&id=${data?.data}`);
addJobFunction('process_car_data', (data) => `${data.module}&slug=${data?.data}`);
