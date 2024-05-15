let temp_otp = 8808;
const NodeMCU_IP = "192.168.50.106";

function displayOTP(otp) {
    let otpStr = otp.toString();
    document.getElementById('otp1').textContent = otpStr.charAt(0);
    document.getElementById('otp2').textContent = otpStr.charAt(1);
    document.getElementById('otp3').textContent = otpStr.charAt(2);
    document.getElementById('otp4').textContent = otpStr.charAt(3);
}

function collectInputValues() {
    const inputs = document.querySelectorAll('input.otp-input');
    let concatenatedResult = '';
    inputs.forEach(input => {
        concatenatedResult += input.value;
    });
    console.log(concatenatedResult);
    return concatenatedResult;
}

const inputs = document.querySelectorAll('#rider .otp-input[type="text"]');
inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '');
    const nextInput = inputs[index + 1];
    if (nextInput && input.value) {
      nextInput.focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === "Backspace" && !input.value && index !== 0) {
      inputs[index - 1].focus();
    }
  });
});

document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault(); 
    var riderNum = '9' + collectInputValues();  
    sendToSim(otp = 8808, riderNum);
});

document.getElementById('generateButton').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the form from submitting in the traditional way
    document.getElementById('submit-button').disabled = false;
    if(otp =! null) {var otp = temp_otp} //generateOTP();   // Call the function to generate OTP 
    displayOTP(otp);
});

function generateOTP(){
  sendData('R');
  var otp = getData();
  return otp;
}

function sendToSim(otp, riderNum) {
  let txt = 'S' + otp + '09' + riderNum;
  sendPhoneNumber(txt);
}

function sendData(data) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://" + NodeMCU_IP + "/data?value=" + data, true);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('response').innerText = this.responseText;
    }
  };
  xhr.send();
}

function sendPhoneNumber(input) {
  var xhr = new XMLHttpRequest();
  var url = "http://192.168.50.106/submit";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      var response = xhr.responseText;
    }
  };
  var data = "phone=" + encodeURIComponent(input);
  xhr.send(data);
  console.log(data);
}

function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://" + NodeMCU_IP + "/update", true);
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var respo = xhr.responseText;
      return respo; 
    }
  };
  xhr.onerror = function () {
    console.error('An error occurred fetching the data.');
  };
  xhr.send();
}

setInterval(getData, 5000); // Update sensor value every 5 seconds
