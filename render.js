//=============================================================================//
// --------------------------------- Header ---------------------------------- //
//=============================================================================//
//                 Gravitational Wave Events Application                       //
//                      Created by Kevin Johansmeyer                           //
//                    Email: kevinjohansmeyer@gmail.com                        //
//                 University: Montclair State University                      //
//                        Advisor: Dr. Marc Favata                             //
//                        www.soundsofspacetime.org                            //
//=============================================================================//

'use strict'

// Timer needed in order to make page load before alert shows
//let myTimer = setTimeout(headphoneAlert, 10);
function headphoneAlert() {
    window.alert("Headphones are recommended for the best user experience. Cellphone and laptops may not be able to produce frequencies near 90 Hz.");
}

//=============================================================================//
// ------------------------- Populate Dropdown Menu -------------------------- //
//=============================================================================//

// // Citation: https://1bestcsharp.blogspot.com/2017/03/javascript-populate-select-option-from-array.html
var select = document.getElementById("selectGWEvent");
for(var j = 1; j < GWevents.length; j++) { //j = 1 since j = 0 already in dropdown by default
    var option = document.createElement("OPTION"),
        txt = document.createTextNode(GWevents[j].name);
    option.appendChild(txt);
    option.setAttribute("value",GWevents[j].name);
    select.insertBefore(option,select.lastChild);
    console.log(selectGWEvent.selectedIndex);
}

//=============================================================================//
// ------------------------------ Slider Debug ------------------------------- //
//=============================================================================//
function printVars() {
    console.log({alpha}, {m1sliderval}, {m2sliderval});
}

//=============================================================================//
// ----------------------------- Information Box ----------------------------- //
//=============================================================================//

// // Citation: https://www.codeproject.com/Questions/699630/How-to-display-the-specific-Text-on-change-of-HTML
// var infoBoxArray = new Array();
// infoBoxArray[0] = "Basic Binaries Sample Text: Learn a bit about the gravitational-wave signal from two coalescing black holes, including the different phases of the signal. We also explore the role of the total mass of the binary and the effect of neglecting the final merger of the two black holes.";
// infoBoxArray[1] = "Circular Binaries Sample Text: Here we focus on two compact objects (neutron stars or black holes) in a circular orbit that is shrinking due to the gravitational waves that are emitted. We expect this to be the most common LIGO source.";
// infoBoxArray[2] = "Spinning Binaries Sample Text: Now we allow our individual stars to spin about each of their axes. Because the spin of a body affects its gravity in Einstein's theory, we will see that the gravitational-wave signal (and the corresponding sound) is likewise affected.";
// infoBoxArray[3] = 'Elliptical Binaries Sample Text: When we allow the binary orbit to be elliptical the "sound" of the signal become even more interesting.';

// function getInfoText(slction){
//     var txtSelected = slction.selectedIndex;
//     document.getElementById('infoBox').innerHTML = infoBoxArray[txtSelected];
// }

// // Set up time values
let NFixed = 17708 //number of indices for GW200316 (f0 = 20 Hz)
let tFixed = new Float32Array(NFixed).fill(0); //probably can define with time steps instead of defining with zeros
tFixed[0] = 0; //fills t array with [0, deltat, 2*deltat, 3*deltat...]
for (let i = 1; i < NFixed; i++) {
    tFixed[i] = tFixed[i - 1] + 1/4096;
}

//=============================================================================//
// ----------------------------- Update function ----------------------------- //
//=============================================================================//
// This entire function updates every time a slider is changed
function updateFunction() { 

    //----------------- Importing Data From GWevents.js ------------------- //
    var data = GWevents[selectGWEvent.selectedIndex].data;
    var normalizedStrainData = new Float32Array(data);
    
    // ----------------------------- Plotting ----------------------------- //
    // ----------------------- Strain vs. Time Plot ----------------------- //
    let layout0 = {
        title: {text: 'Strain vs. Time', font: {family: 'Times New Roman', size: 32, color: 'white'}},
        xaxis: {
            title: {
                text: 'Time (sec)',
                font: {family: 'Times New Roman', size: 26,color: 'white'}
            },
            tickfont: {family: 'Times New Roman', size: 18, color: 'white'},
            color: 'white',
            rangemode: 'nonnegative', // does this work?
            showgrid: false,
            ticks: 'outside'
        },
        yaxis: {
            title: {
                text: 'Normalized Strain',
                font: {family: 'Times New Roman', size: 26,color: 'white'}
            },
            tickfont: {family: 'Times New Roman', size: 18,color: 'white'},
            color: 'white',
            showgrid: false,
            ticks: 'outside',
            range: [-1, 1] //h.length - 1 is the last element in the array

        },
        shapes: [ //Horizontal line for h vs. t plot
            {
                type: 'line',
                xref: 'x',
                x0: 0,
                y0: -10,
                x1: 0,
                y1: 10,
                line:{
                    color: 'black',
                    width: 1,
                    dash:'solid'
                }
            }
        ],
        margin: {l: 100, r: 50, b: 60, t: 75, pad: 4},
        plot_bgcolor: 'white', //"#383838",
        paper_bgcolor: '#181818'
    }
    
    let trace0 = {
        x: tFixed,
        y: normalizedStrainData,
        name: 'Strain vs. Time',
        type: 'scatter',
        line: {
            color: '#ff3d3d',//'#282828',
            width: 3,
            shape: 'spline', // Spline used to smooth curve between points
            smoothing: 1.3 // Smoothing value between 0 and 1
          }
    };

    var config0 = {
        toImageButtonOptions: {
          format: 'png', // one of png, svg, jpeg, webp
          filename: 'GWStrainVsTimePlot',
          height: 500,
          width: 1754,
          scale: 2 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtonsToRemove: ['autoScale2d','toggleSpikelines','hoverClosestCartesian','hoverCompareCartesian']
    };

    let data0 = [trace0];

    Plotly.newPlot('strainVsTimePlot', data0, layout0, config0);
    
    // ----------------------------- Audio ----------------------------- //
    document.getElementById("startAudioBtn").onclick = function() {playAudio()};
    
    // Citation: wavJS - https://github.com/taweisse/wavJS
    const sampleRate = 4096;
    let wav = new WAV(sampleRate,1); //1 = mono, 2 = stereo

    function startAudio({ array }) {
        wav.addSamples([array]);
        wav.play();

        // Disables startAudioBtn for duration of sound
        // Citation: https://stackoverflow.com/questions/30558587/javascript-disable-button-and-reenable-it-after-5-seconds
        document.getElementById("startAudioBtn").disabled = true;
            setTimeout(function(){document.getElementById("startAudioBtn").disabled = false;},1000*tf); //change disable time to reflect each event
        }

    function playAudio() {
        startAudio({ array: normalizedStrainData, sampleRate });
    }

    // Download Audio
    document.getElementById("downloadAudio").onclick = function() {prepareDownload()};

    function downloadAudio({ array }) {
        wav.addSamples([array]);
        wav.download('GWaudio.wav');
    }
    
    function prepareDownload() {
        downloadAudio({ array: normalizedStrainData, sampleRate });
    }

} // ----------------------- End of Update Function ---------------------- //

// ----------------------------- UI Elements ----------------------------- //
// const alphaSlider = document.getElementById("alphaSlider");
// const m1slider = document.getElementById("m1slider");
// const m2slider = document.getElementById("m2slider");

// let alpha = Number(alphaSlider.value),
//     m1sliderval = Number(m1slider.value),
//     m2sliderval = Number(m2slider.value),
//     deviceSelection = new String("Laptop");

// console.log({ alpha }, { m1sliderval }, { m2sliderval });

// --------------------------- Side Bar Functionality --------------------------- //
function openNav() {
    document.getElementById("mySidebar").style.width = "200px";
    document.getElementById("main").style.marginLeft = "200px";
  }
  
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

// ------------------ Execute update Function for initial time ------------------ //
updateFunction();