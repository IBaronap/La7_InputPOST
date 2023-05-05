const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, { path: '/real-time' });

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0);
}

function draw() {
    background(0, 5);
    newCursor(pmouseX, pmouseY);
    fill(255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);
}

//Inputs
let NameInput = document.getElementById('name');
let EmailInput = document.getElementById('email');
let BirthdateInput = document.getElementById('dob');
let PhoneInput = document.getElementById('phone');
let PrivacyCheckbox = document.getElementById('privacy-agreement');

//Disabled button
let submitBTN = document.getElementById('submit-btn');

PrivacyCheckbox.addEventListener('change', function () {
    if (this.checked && NameInput.value != '' && EmailInput.value != '' && BirthdateInput.value != '') {
        submitBTN.removeAttribute('disabled');
    } else {
        submitBTN.setAttribute('disabled', true);
    }
});

//User data
let userData = {
    Name: '',
    Email: '',
    Phone: '',
    Birth_Date: '',
    Location: '',
    Submit_Date: '',
    Interaction_Time: '',
    Submit_Time: '',
    Duration: '',
    DeviceType: '',
};

//Metadata

    //Location
    let locationObtained = false;

    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        userData.Location = 'latitude: ' + latitude + ', longitude: ' + longitude; //Añadido a userData
        locationObtained = true;
    });

    //Tiempo al momento de iniciar la interacción para Interaction_Time
    let pageLoadTime = 0;

    window.onload = function() {
        var InteractionTime = new Date();
        userData.Interaction_Time = InteractionTime.toLocaleTimeString(); //Añadido a userData

        //Lo siguiente se usa más adelante para calcular la duración de la interacción
        pageLoadTime = new Date().getTime();
    };

submitBTN.addEventListener("click", function () { //Boton clickeado
    //Datos añadidos por el usuario
    userData.Name = NameInput.value;
    userData.Email = EmailInput.value;
    userData.Phone = PhoneInput.value;
    userData.Birth_Date = BirthdateInput.value;
    
    //Metadata
        //Submit date
        userData.Submit_Date = new Date().toLocaleDateString(); //Añadido a userData

        //Submit time
        userData.Submit_Time = new Date().toLocaleTimeString(); //Añadido a userData

        //Duration
        let SubmitTime = new Date().getTime(); //Gets submit time

        let totalDuration = Math.floor((SubmitTime - pageLoadTime)/ 1000); //Calcula la duración en segundos

        userData.Duration = `${totalDuration} seconds`; //Añadido a userData
        
        //Device type
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            userData.DeviceType = 'iOS'; //Añadido a userData
        } else if (/Android/.test(navigator.userAgent)) {
            userData.DeviceType = 'Android'; //Añadido a userData
        } else {
            userData.DeviceType = 'Desktop'; //Añadido a userData
        }

    //Send data
    if (locationObtained) { //Para que si se envíe la ubicación
        console.log(userData);
        socket.emit('userData', userData);
        sendData(userData);
    } else {
        alert('Location data not available. Please try again.');
    }
});

//POST
async function sendData(data) {//Se envia a index
    const userData = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    };
    await fetch(`/Forms-Array`, userData);
}