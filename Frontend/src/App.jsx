import React, { useState } from 'react';
import { Upload, Activity, Layers, Code, Shield, Droplet, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const App = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // FIXED: Properly named state variables to resolve "Variable declaration expected" error
  const [imagePreview, setImagePreview] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle the file upload and call the Flask API
  const handleFileUpload = async (e) => {
    // Grab the first file from the FileList array
    const file = e.target.files[0];
  
    // Safeguard: If the user cancels the upload window, stop running the function
    if (!file) return;
  
    // 1. Show local preview immediately (This code is already working!)
    setImagePreview(URL.createObjectURL(file));
    setLoading(true); // Turn on the "NEURAL_NET_ANALYZING..." spinner
  
    // NEW: 2. Prepare the data for the API call
    const formData = new FormData();
    formData.append('image', file); // The key MUST be 'image' to match app.py
  
    try {
      // NEW: 3. Make the async POST request to your Flask backend
      const response = await fetch('http://127.0.0.1:5000/detect', {
        method: 'POST',
        body: formData,
        // Note: Do NOT set Content-Type header. The browser does it automatically for FormData.
      });
  
      if (!response.ok) {
        throw new Error(`API returned an error: ${response.status} ${response.statusText}`);
      }
  
      // NEW: 4. Parse the JSON response
      const data = await response.json();
      console.log("📡 Detections from Flask:", data); // Helpful for debugging
  
      // NEW: 5. Update your state with the results so React can draw the bounding boxes
      setDetections(data.objects);
      setLoading(false); // Turn off the loading spinner
  
    } catch (error) {
      console.error("❌ API Call Failed:", error);
      setLoading(false); // Turn off the spinner even on failure
      // Optional: add a 'setApiError' state to show an error message in the UI
    }
  };

  const features =[];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      
      {/* Background Mesh/Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Droplet size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Underwater<br/><span className="text-xs text-red-400 font-normal uppercase tracking-widest">Pollutant Detection</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors font-medium">Features</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors font-medium">Pricing</a>
          <a href="#docs" className="hover:text-cyan-400 transition-colors font-medium">Documentation</a>
        </div>
        <button className="bg-cyan-400 text-black px-6 py-2.5 rounded-full font-bold hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(0,255,245,0.4)]">
          Try Live Demo
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-6 backdrop-blur-md uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Powered by YOLOv11
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
            Eradicate <br/>Submerged <br/>Waste with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Real-Time AI</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
            Upload marine imagery and instantly detect plastics, metals, and biologicals with our YOLOv11-powered API. Sub-second detection. 99.2% accuracy.
          </p>
          <div className="flex gap-4">
            <button className="bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-300 transition-all shadow-[0_0_25px_rgba(0,255,245,0.3)]">
              Try the Demo <ArrowRight size={18} />
            </button>
            <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md">
              <Code size={18} className="text-cyan-400"/> Read the Docs
            </button>
          </div>
        </div>

        {/* Hero Image / Mockup */}
        <div className="relative p-2 rounded-3xl bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm border border-white/10 shadow-2xl overflow-hidden group">
          <div className="absolute top-4 left-4 flex gap-2 z-20">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="absolute top-3 left-0 right-0 flex justify-center z-20">
            <div className="bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] text-cyan-400/70 border border-white/5 font-mono">api.detectmarine.io/v2/analyze</div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1621447508323-271221cef62b?auto=format&fit=crop&q=80&w=1000" 
            alt="Underwater demo" 
            className="rounded-2xl w-full object-cover h-[450px] opacity-70 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-24 left-12 w-48 h-20 border-2 border-cyan-400 rounded-lg bg-cyan-400/5 shadow-[0_0_20px_rgba(0,255,245,0.4)]">
            <div className="absolute -top-7 left-[-2px] bg-cyan-400 text-black text-[10px] font-black px-2 py-1 rounded-t-md uppercase tracking-tighter">
              Plastic Bottle - 98.7%
            </div>
          </div>
        </div>
      </section>

      {/* Logo Bar */}
      <section className="border-y border-white/10 bg-white/5 backdrop-blur-md py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale">
          <h3 className="text-lg font-bold flex items-center gap-2"><Droplet size={20}/> OceanTech</h3>
          <h3 className="text-lg font-bold flex items-center gap-2"><Shield size={20}/> MarineLab</h3>
          <h3 className="text-lg font-bold flex items-center gap-2"><Activity size={20}/> AquaVision</h3>
          <h3 className="text-lg font-bold flex items-center gap-2"><Layers size={20}/> SeaGuard</h3>
          <h3 className="text-lg font-bold flex items-center gap-2"><Code size={20}/> EcoGlobal</h3>
        </div>
      </section>

      {/* Interactive Playground */}
      <section className="py-24 relative z-10 bg-black/40 border-b border-white/10" id="playground">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <button className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black border border-cyan-400/20 mb-4 uppercase tracking-widest">Live Engine</button>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Experience <span className="text-cyan-400">Real-Time Detection</span></h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">Upload any marine imagery and watch our YOLOv11 model instantly identify underwater objects with high-precision bounding boxes.</p>

          <div className="grid md:grid-cols-2 gap-8 border border-white/10 bg-white/5 rounded-[40px] p-8 backdrop-blur-2xl border-dashed border-cyan-900/50">
            {/* 1. Upload Zone */}
            <div className="flex flex-col h-full">
              <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2"><span className="bg-cyan-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black italic">1</span> UPLOAD IMAGE</h3>
              <div 
                className={`relative border-2 border-dashed rounded-[30px] h-72 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${isHovered? 'border-cyan-400 bg-cyan-400/5' : 'border-gray-800 bg-black/20 hover:border-cyan-400/50'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-30" 
                  onChange={handleFileUpload} 
                  accept="image/*"
                />
                
                {imagePreview? (
                  <img src={imagePreview} className="w-full h-full object-contain p-4 z-10" alt="Preview" />
                ) : (
                  <div className="z-10">
                    <div className="w-16 h-16 bg-cyan-400/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,245,0.1)]">
                      <Upload className="text-cyan-400" />
                    </div>
                    <p className="font-bold text-gray-400">Drop your image here</p>
                    <p className="text-xs text-gray-600 mt-2">or click to browse local files</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Results Zone */}
            <div className="flex flex-col h-full">
              <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2"><span className="bg-cyan-400 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black italic">2</span> DETECTION RESULTS</h3>
              <div className="border border-white/5 bg-black/40 rounded-[30px] h-72 flex flex-col items-center justify-center overflow-hidden">
                {loading? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-cyan-400" size={48} />
                    <p className="text-cyan-400 text-xs font-mono animate-pulse tracking-tighter">NEURAL_NET_ANALYZING...</p>
                  </div>
                ) : detections.length > 0? (
                  <div className="w-full h-full p-6 overflow-y-auto space-y-3 custom-scrollbar">
                    {detections.map((obj, i) => (
                      <div key={i} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping"></div>
                           <span className="capitalize font-bold text-gray-200 tracking-tight">{obj.class}</span>
                        </div>
                        <span className="text-emerald-400 font-mono text-sm bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">{(obj.confidence * 100).toFixed(1)}% MATCH</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Activity className="text-gray-800 mb-4 mx-auto" size={50} />
                    <p className="text-gray-600 text-sm leading-relaxed">No data yet. Upload an image<br/>to trigger YOLOv11 inference.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto relative z-10" id="features">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black mb-4 uppercase tracking-widest">Core Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Built for <span className="text-cyan-400 italic">Submarine Precision</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">Our specialized YOLOv11 model is optimized for the murky, low-light conditions of the deep sea.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-[30px] p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 backdrop-blur-md group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mb-6 group-hover:bg-cyan-400/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 relative z-10 pt-20 pb-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Clean Our <span className="text-cyan-400 italic">Oceans</span>?</h2>
          <div className="flex justify-center gap-4 mb-20">
            <button className="bg-cyan-400 text-black px-10 py-4 rounded-xl font-black hover:bg-cyan-300 transition-all flex items-center gap-2 uppercase text-sm tracking-tighter">Start Free Demo <ArrowRight size={18}/></button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <p>© 2026 Underwater Pollutant Detection. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
               <span className="flex items-center gap-2 text-emerald-500/70"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ALL_SYSTEMS_OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;