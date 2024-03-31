import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/rhino3dm.module.js"
import RhinoCompute from "compute-rhino3d"
import { store } from "@/stores/storeSingleton"

RhinoCompute.url = "http://localhost:8081/" //if debugging locally.

// If accessing the compute server from a remote domain, you will need to enable CORS.
//RhinoCompute.url = "https://compute-server.iaac.net/"
//RhinoCompute.apiKey = "datamgmt20242" 


let rhino, doc, res

async function runCompute(data, path) {
  store.computing = true;
  let def = await loadGH(path);
  res = await compute(def, data);
  doc = createDoc(res);

  //downlod 3dm model, optionally
  //download(doc)
  store.computing = false;
  return doc;
}

async function loadRhino() {
  return new Promise((resolve, reject) => {
    rhino3dm().then(async (m) => {
      console.log("Loaded rhino3dm.");
      rhino = m; // global
      resolve(true)
    });
  })

}

async function loadGH(definitionPath) {
  const url = definitionPath;
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const def = new Uint8Array(buffer);
  return def;
}

async function compute(definition, definitionInputs) {
  // Save start time
  const startTime = performance.now();

  const trees = [];
  for (let [key, value] of Object.entries(definitionInputs)) {
    let param = new RhinoCompute.Grasshopper.DataTree(key);
    param.append([0], Array.isArray(value) ? value : [value]);
    trees.push(param);
  }

  const res = await RhinoCompute.Grasshopper.evaluateDefinition(
    definition,
    trees
  );

  // Save end time
  const endTime = performance.now();

  // Calculate the duration in milliseconds
  const duration = (endTime - startTime) / 1000;
  // Log the duration to the console
  console.log(`Gh script: ${duration.toFixed(3)} seconds`);
  return res;
}

function createDoc(res) {
  doc = new rhino.File3dm()

  // hide spinner
  //document.getElementById("loader").style.display = "none";
  let data;
  let metadata = [];

  //decode grasshopper objects and put them into a rhino document
  for (let i = 0; i < res.values.length; i++) {
    for (const [key, value] of Object.entries(res.values[i].InnerTree)) {
      for (const d of value) {
        const dataType = String(d.type);

        // Geometry
        if (dataType.includes("Geometry")) {
          data = JSON.parse(d.data);
          const rhinoObject = rhino.CommonObject.decode(data);
          doc.objects().add(rhinoObject, null);
        } else {
          // Other ouputs
          const outputParameter = {
            name: res.values[i].ParamName,
            value: JSON.parse(d.data),
          };
          metadata.push(outputParameter);
        }
      }
    }
  }

  doc.metadata = metadata;

  // go through the objects in the Rhino document
  let objects = doc.objects();
  for (let i = 0; i < objects.count; i++) {
    const rhinoObject = objects.get(i);
    // asign geometry userstrings to object attributes
    if (rhinoObject.geometry().userStringCount > 0) {
      const g_userStrings = rhinoObject.geometry().getUserStrings();

      //iterate through userData and store all userdata to geometry
      for (let j = 0; j < g_userStrings.length; j++) {
        rhinoObject
          .attributes()
          .setUserString(g_userStrings[j][0], g_userStrings[j][1]);
      }
    }
  }
  return doc;
}

// download button handler
function download(fileName) {
  const options = new rhino.File3dmWriteOptions();
  options.version = 7;
  let buffer = doc.toByteArrayOptions(options);
  let blob = new Blob([buffer], { type: "application/octect-stream" });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName+'.3dm';
  link.click();
}



function base64ByteArray(bytes) {
  var base64 = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  // var bytes         = new Uint8Array(arrayBuffer)

  // strip bom
  if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191)
    bytes = bytes.slice(3)

  var byteLength = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}

export { loadRhino, runCompute, base64ByteArray, download };