import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/rhino3dm.module.js"
import RhinoCompute from "compute-rhino3d"
import { store } from "@/stores/storeSingleton"

// Local RhinoCompute endpoint  
RhinoCompute.url = "http://localhost:8081/" //Rhino 7
//RhinoCompute.url = "http://localhost:5000/" //Rhino 8

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


export { loadRhino, runCompute };