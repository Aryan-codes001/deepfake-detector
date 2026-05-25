import { motion } from "framer-motion"
import { useState } from "react"
import { Shield, Brain, Cpu } from "lucide-react"

export default function App() {
const [loading,setLoading]=useState(false)
const [uploadedFile,setUploadedFile]=useState(null)
const [result,setResult]=useState(null)
const pipeline=[
"Image Upload",
"Image Augmentation",
"Data Augmentation",
"Xception Transfer Learning",
"Feature Extraction",
"Fine Tuning",
"Classification",
"Confidence Score",
"Prediction Result"
]

return(

<div className="min-h-screen bg-black text-white">

<div className="fixed inset-0 overflow-hidden -z-10">

<div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-purple-600 rounded-full blur-[120px] opacity-20 animate-pulse"></div>

<div className="absolute bottom-0 right-[10%] w-[350px] h-[350px] bg-blue-600 rounded-full blur-[140px] opacity-20 animate-pulse"></div>

</div>

<nav className="border-b border-purple-900">

<div className="max-w-7xl mx-auto flex justify-between p-6">

<h1 className="text-3xl font-bold">
DeepFake <span className="text-purple-500">Detector</span>
</h1>

<div className="flex items-center gap-8 text-gray-300">

<p
onClick={()=>document.getElementById("home").scrollIntoView({behavior:"smooth"})}
className="cursor-pointer hover:text-purple-500 transition duration-300"
>
Home
</p>

<p
onClick={()=>document.getElementById("pipeline").scrollIntoView({behavior:"smooth"})}
className="cursor-pointer hover:text-purple-500 transition duration-300"
>
Pipeline
</p>

<p
onClick={()=>document.getElementById("architecture").scrollIntoView({behavior:"smooth"})}
className="cursor-pointer hover:text-purple-500 transition duration-300"
>
Architecture
</p>

<p
onClick={()=>document.getElementById("model").scrollIntoView({behavior:"smooth"})}
className="cursor-pointer hover:text-purple-500 transition duration-300"
>
Model
</p>

<a
href="/code"
className="cursor-pointer hover:text-purple-500 transition duration-300"
>
Code
</a>

<p
onClick={()=>document.getElementById("demo").scrollIntoView({behavior:"smooth"})}
className="cursor-pointer hover:text-purple-500 transition duration-300"
>
Try Demo
</p>

</div>

</div>

</nav>

<div
id="home"
className="max-w-7xl mx-auto p-10"
>
    

<div className="grid lg:grid-cols-2 gap-14 items-center">

<div>

<h1 className="text-7xl font-bold leading-tight">
AI <span className="text-purple-500">Deepfake</span>
<br/>
Detection
<br/>
System
</h1>

<p className="text-gray-400 mt-8 text-xl">
Advanced AI system using Xception  Transfer Learning to detect REAL and FAKE images using deep learning</p>

<div className="flex gap-5 mt-8">

<button className="bg-purple-600 px-8 py-4 rounded-2xl hover:scale-105 transition">
Try Demo
</button>

<button className="border border-purple-600 px-8 py-4 rounded-2xl hover:scale-105 transition">
Github
</button>

</div>

<motion.div
id="demo"
initial={{opacity:0,y:50}}
animate={{opacity:1,y:0}}
transition={{duration:1}}
className="grid grid-cols-3 gap-4 mt-10"
>

<div className="bg-slate-900 p-5 rounded-xl border border-purple-900 hover:scale-105 transition">
<Shield className="text-purple-500 mb-2"/>
97% Accuracy
</div>

<div className="bg-slate-900 p-5 rounded-xl border border-purple-900 hover:scale-105 transition">
<Brain className="text-purple-500 mb-2"/>
Xception
</div>

<div className="bg-slate-900 p-5 rounded-xl border border-purple-900 hover:scale-105 transition">
<Cpu className="text-purple-500 mb-2"/>
Grad-CAM
</div>

</motion.div>

</div>


<div className="relative">

<div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-[40px] border border-purple-500 shadow-[0_0_50px_rgba(168,85,247,.5)] overflow-hidden h-[500px] flex flex-col items-center justify-center">

<div className="w-60 h-60 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">

<img
src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500"
className="w-48 h-48 rounded-full object-cover"
/>

</div>

<h1 className="text-red-500 text-5xl font-bold mt-8">
DEEPFAKE DETECTED
</h1>

<p className="text-gray-400 mt-2">
</p>

<div className="w-72 h-3 bg-slate-800 rounded-full mt-5">

<div
className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-red-500"
style={{width:'92%'}}
></div>

</div>

</div>

</div>

</div>


<div
id="pipeline"
className="mt-20 bg-slate-950 border border-purple-900 p-10 rounded-3xl"
>

<h1 className="text-4xl font-bold mb-8">
Machine Learning Pipeline
</h1>

<div className="grid lg:grid-cols-9 gap-4">

{pipeline.map((step,index)=>(

<div
key={index}
className="bg-slate-900 p-5 rounded-xl text-center hover:scale-105 transition"
>

<h1 className="text-purple-500 text-3xl">
{index+1}
</h1>

<p>{step}</p>

</div>

))}

</div>

</div>


<motion.div
initial={{opacity:0,y:50}}
whileInView={{opacity:1,y:0}}
transition={{duration:1}}
className="mt-16"
>

<div className="border-2 border-dashed border-purple-500 rounded-[40px] bg-slate-950 p-14 text-center hover:bg-slate-900 transition">

<h1 className="text-4xl font-bold">
Upload Image For Detection
</h1>

<p className="text-gray-400 mt-4">
Upload an image for AI analysis
</p>

<div className="mt-8">

<label
className="
bg-purple-600
px-10
py-4
rounded-2xl
hover:scale-105
transition
cursor-pointer
inline-block
"
>

Choose File

<input
type="file"
accept="image/*"
hidden
onChange={async(e)=>{

const file=e.target.files[0]

if(!file)return

setUploadedFile({
url:URL.createObjectURL(file)
})

setLoading(true)

const formData=new FormData()

formData.append(
"file",
file
)

try{

const res=await fetch(
"https://aryansaini07123-deepfake-detector.hf.space/predict",
{
method:"POST",
body:formData
}
)

const data=await res.json()

setResult({
label:data.prediction,
confidence:data.confidence
})

}

catch(error){

console.log("Error:",error)

setResult({
label:"ERROR",
confidence:0
})

}

setLoading(false)

}}
/>

</label>

</div>

<p className="text-gray-500 mt-5">
Supported: JPG, PNG
</p>
{uploadedFile && (

<div className="mt-10">
<img
src={uploadedFile.url}
className="
w-full
max-w-2xl
mx-auto

border
border-purple-500
rounded-3xl
"
/>

</div>

)}
{loading && (

<div className="mt-10 text-center">

<div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-500 mx-auto"></div>

<p className="mt-5 text-purple-400 text-xl">
AI analyzing media...
</p>

</div>

)}
{result && (

<div className="
mt-10
bg-slate-950
border
border-purple-500
rounded-3xl
p-8
">

<h1 className="text-3xl font-bold">
Prediction Result
</h1>

<h2 className={`text-5xl mt-5 font-bold ${
result.label==="FAKE"
?"text-red-500"
:"text-green-500"
}`}>

{result.label}

</h2>

<p className="mt-4 text-gray-400">
Confidence: {result.confidence}%
</p>

</div>

)}

</div>

</motion.div>


</div>
<motion.div
id="architecture"
initial={{opacity:0,y:80}}
whileInView={{opacity:1,y:0}}
transition={{duration:1}}
className="mt-20"
>

<h1 className="text-4xl font-bold mb-10">
System Architecture
</h1>

<div className="grid lg:grid-cols-5 gap-5">

{[
"Frontend",
"FastAPI",
"Image Preprocessing",
"Xception",
"Prediction"
].map((item,index)=>(

<div
key={index}
className="
bg-slate-950
border
border-purple-500
rounded-3xl
p-8
text-center
hover:scale-105
transition
"
>

<div className="text-purple-500 text-3xl mb-3">
{index+1}
</div>

<p>{item}</p>

</div>

))}

</div>

<div className="flex justify-center mt-8 text-purple-400 text-2xl">
React → FastAPI → Image Preprocessing → Xception → Prediction 
</div>

</motion.div>
<motion.div
id="model"
initial={{opacity:0,y:80}}
whileInView={{opacity:1,y:0}}
transition={{duration:1}}
className="mt-20"
>

<h1 className="text-4xl font-bold mb-10">
Model Performance
</h1>

<div className="grid md:grid-cols-4 gap-6">

<div className="bg-slate-950 border border-purple-500 rounded-3xl p-8 text-center">
<h2 className="text-5xl font-bold text-purple-500">93.6%</h2>
<p className="mt-3 text-gray-400">Validation Accuracy</p>
</div>

<div className="bg-slate-950 border border-purple-500 rounded-3xl p-8 text-center">
<h2 className="text-5xl font-bold text-blue-500">90.7%</h2>
<p className="mt-3 text-gray-400">Traning Accuracy</p>
</div>

<div className="bg-slate-950 border border-purple-500 rounded-3xl p-8 text-center">
<h2 className="text-5xl font-bold text-green-500">0.173</h2>
<p className="mt-3 text-gray-400">Validation Loss</p>
</div>

<div className="bg-slate-950 border border-purple-500 rounded-3xl p-8 text-center">
<h2 className="text-5xl font-bold text-red-500">395K+</h2>
<p className="mt-3 text-gray-400">Image Used</p>
</div>

</div>

</motion.div>

<motion.div
initial={{opacity:0,y:80}}
whileInView={{opacity:1,y:0}}
transition={{duration:1}}
className="mt-20"
>

<h1 className="text-4xl font-bold mb-10">
Datasets & Technologies
</h1>

<div className="grid md:grid-cols-2 gap-8">

<div className="bg-slate-950 border border-purple-500 rounded-3xl p-8">

<h2 className="text-2xl font-bold mb-6 text-purple-400">
Datasets
</h2>

<div className="space-y-4">

<div className="bg-slate-900 p-4 rounded-xl">
FaceForensics++
</div>

<div className="bg-slate-900 p-4 rounded-xl">
Celeb-DF
</div>

<div className="bg-slate-900 p-4 rounded-xl">
DFDC Dataset
</div>

</div>

</div>


<div className="bg-slate-950 border border-purple-500 rounded-3xl p-8">

<h2 className="text-2xl font-bold mb-6 text-purple-400">
Tech Stack
</h2>

<div className="grid grid-cols-2 gap-4">

<div className="bg-slate-900 p-4 rounded-xl">
React
</div>

<div className="bg-slate-900 p-4 rounded-xl">
Tailwind CSS
</div>

<div className="bg-slate-900 p-4 rounded-xl">
TensorFlow
</div>

<div className="bg-slate-900 p-4 rounded-xl">
Xception
</div>

<div className="bg-slate-900 p-4 rounded-xl">
Python
</div>

<div className="bg-slate-900 p-4 rounded-xl">
FastAPI
</div>


</div>

</div>

</div>

</motion.div>
</div>

)

}