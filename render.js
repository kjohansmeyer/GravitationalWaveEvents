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
}

//=============================================================================//
// ----------------------------- Information Box ----------------------------- //
//=============================================================================//

// // Set up time values
let NFixed = 60000 //rounded up number of indices for longest event (GW191219_163120 with f0 = 20 Hz)
let tFixed = new Float32Array(NFixed).fill(0); //probably can define with time steps instead of defining with zeros
tFixed[0] = 0; //fills t array with [0, deltat, 2*deltat, 3*deltat...]
for (let i = 1; i < NFixed; i++) {
    tFixed[i] = tFixed[i - 1] + 1/4096;
}

//=============================================================================//
// ----------------------------- Update function ----------------------------- //
//=============================================================================//
// This entire function updates every time a slider is changed
function updateFunction(normalizedStrainData) {

    //----------------- Importing Data From GWevents.js ------------------- //
    var data = GWevents[selectGWEvent.selectedIndex].data;
    var eventName = GWevents[selectGWEvent.selectedIndex].name;
    var normalizedStrainData = new Float32Array(data);
    console.log({eventName});
    
    // ------------------------ Information Box ------------------------ //
    // Mass #1:
    var mass1 = GWevents[selectGWEvent.selectedIndex].mass1;
    document.getElementById('mass1').innerHTML = mass1;

    var spin1x = GWevents[selectGWEvent.selectedIndex].spin1x;
    document.getElementById('spin1x').innerHTML = spin1x;

    var spin1y = GWevents[selectGWEvent.selectedIndex].spin1y;
    document.getElementById('spin1y').innerHTML = spin1y;

    var spin1z = GWevents[selectGWEvent.selectedIndex].spin1z;
    document.getElementById('spin1z').innerHTML = spin1z;

    // Mass #2:
    var mass2 = GWevents[selectGWEvent.selectedIndex].mass2;
    document.getElementById('mass2').innerHTML = mass2;

    var spin2x = GWevents[selectGWEvent.selectedIndex].spin2x;
    document.getElementById('spin2x').innerHTML = spin2x;

    var spin2y = GWevents[selectGWEvent.selectedIndex].spin2y;
    document.getElementById('spin2y').innerHTML = spin2y;

    var spin2z = GWevents[selectGWEvent.selectedIndex].spin2z;
    document.getElementById('spin2z').innerHTML = spin2z;

    // Other Parameters:
    var rightAscension = GWevents[selectGWEvent.selectedIndex].rightAscension;
    document.getElementById('rightAscension').innerHTML = rightAscension;

    var declination = GWevents[selectGWEvent.selectedIndex].declination;
    document.getElementById('declination').innerHTML = declination;

    var inclination = GWevents[selectGWEvent.selectedIndex].inclination;
    document.getElementById('inclination').innerHTML = inclination;

    var psi = GWevents[selectGWEvent.selectedIndex].psi;
    document.getElementById('psi').innerHTML = psi;

    var luminosityDistance = GWevents[selectGWEvent.selectedIndex].luminosityDistance;
    document.getElementById('luminosityDistance').innerHTML = luminosityDistance;

    var chi_eff = GWevents[selectGWEvent.selectedIndex].chi_eff;
    document.getElementById('chi_eff').innerHTML = chi_eff;

    var totalMass = GWevents[selectGWEvent.selectedIndex].totalMass;
    document.getElementById('totalMass').innerHTML = totalMass;

    var geocentricGPSTime = GWevents[selectGWEvent.selectedIndex].geocentricGPSTime;
    document.getElementById('geocentricGPSTime').innerHTML = geocentricGPSTime;

    // Event URL:
    var eventURL = GWevents[selectGWEvent.selectedIndex].url;
    document.getElementById('infoURL').href = eventURL;

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
        margin: {l: 100, r: 50, b: 100, t: 75, pad: 10},
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

    function startAudio({ array }) {
        let wav = new WAV(sampleRate,1); //1 = mono, 2 = stereo
        wav.addSamples([array]);
        wav.play();

        // Disables startAudioBtn for duration of sound
        // Citation: https://stackoverflow.com/questions/30558587/javascript-disable-button-and-reenable-it-after-5-seconds
        let tf = normalizedStrainData.length/sampleRate;
        document.getElementById("startAudioBtn").disabled = true;
            setTimeout(function(){document.getElementById("startAudioBtn").disabled = false;},1000*tf); //change disable time to reflect each event
        }

    function playAudio() {
        startAudio({ array: normalizedStrainData, sampleRate });
    }

    // Download Audio
    document.getElementById("downloadAudio").onclick = function() {prepareDownload()};

    function downloadAudio({ array }) {
        let wav = new WAV(sampleRate,1); //1 = mono, 2 = stereo
        wav.addSamples([array]);
        wav.download(eventName+'.wav');
    }
    
    function prepareDownload() {
        downloadAudio({ array: normalizedStrainData, sampleRate });
    }

} // ----------------------- End of Update Function ---------------------- //

// --------------------------- Side Bar Functionality --------------------------- //
// Citation: https://stackoverflow.com/questions/48066685/text-collapsing-on-side-menu-close
function openNav() {
    document.getElementById("mySideNav").style.left = "0px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySideNav").style.left = "-400px";
}

// ------------------ Execute update Function for initial time ------------------ //
updateFunction();