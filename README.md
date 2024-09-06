<p align="left">
   <img src="https://github.com/user-attachments/assets/90fd3e8c-0fff-4849-a11b-a47cca08983b" alt="AECtech-Conference-flat" width="200"/>
  <img src="https://github.com/just-ajs/aectech-2024-kpf-ttcore-worskhop/assets/35227625/da2c1f10-eb52-4463-9526-8ad3c58244a4" alt="download" width="200"/>

</p>

# Grasshopper on the Web: Creating Websites with Rhino.Compute, Vue, and Three.js. 

This is repository with materials used during the AEC TECH Barcelona and AEC TECH NYC workshops. 

Learn to build a custom web interface for real-time control and display of Grasshopper definitions. In this workshop, you will learn how to prepare your Grasshopper scripts to run on the web with Rhino.Compute. You will also explore the basics of Vue.js, a user-friendly web framework, enabling you to create a beautiful and reusable web interfaces that can control your Grasshopper definition inputs. Additionally, you will gain experience with Three.js web geometry library to develop dynamic and custom 3D scenes in your website. 



## Prerequisites
[Installation Instructions](https://docs.google.com/document/d/17hXwG_7kRkxQQLEcFkq0k_4eD659sB39gbIIzKDqi_0)
- Rhino 7
- Hops
- Visual Studio Code
- Node
- Git
- Github


## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

 
## Run project locally


### Start Rhino.Compute

Start your local Rhino.Compute server either by running your Grasshopper (with Hops installed) or by directly starting Rhino.Compute from `%AppData%\McNeel\Rhinoceros\packages\7.0\Hops\0.16.2\compute.geometry\compute.geometry`. 

You know that Rhino.Compute is running if you can see in your console `Listening on..`

![image](https://github.com/just-ajs/aectech-2024-kpf-ttcore-worskhop/assets/35227625/f41a0b9b-d4a8-4e07-9fdf-4051a14b02a8)

When you have Rhino.Compute running, have a look at the number of the localhost. The example above has a localhost number 8081. This number needs to match the host number in the `source/scripts/compute.js` file (line 6).


![image](https://github.com/just-ajs/aectech-2024-kpf-ttcore-worskhop/assets/35227625/85246a48-a91d-41e6-aaca-4654cabc79e4)

If your Rhino.Compute localhost number is different, adjust `compute.js` file to match it. 


### Run front-end

In the terminal, run following commands:

#### Install packages needed to run the project

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Compile and Minify for Production

```sh
npm run build
```


