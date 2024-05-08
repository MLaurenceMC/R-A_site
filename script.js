let temp_otp = 8808;

function displayOTP(otp) {
    // Convert the number to a string
    let otpStr = otp.toString();
    // Assign each digit to the corresponding div
    document.getElementById('otp1').textContent = otpStr.charAt(0);
    document.getElementById('otp2').textContent = otpStr.charAt(1);
    document.getElementById('otp3').textContent = otpStr.charAt(2);
    document.getElementById('otp4').textContent = otpStr.charAt(3);
}

// Function to collect and concatenate input values
function collectInputValues() {
    // Select all input elements that are part of the chain
    const inputs = document.querySelectorAll('.chained-input');
    // Initialize an empty string to hold the concatenated result
    let concatenatedResult = '';
    // Iterate over each input and append its value to the result string
    inputs.forEach(input => {
        concatenatedResult += input.value;
    });
    // Optional: Output the result to the console or elsewhere
    console.log(concatenatedResult);
    // Return the concatenated string
    return concatenatedResult;
}

// File: input-behavior.js
const inputs = document.querySelectorAll('#rider .otp-input[type="text"]');
inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    // Ensure only numeric input
    input.value = input.value.replace(/[^0-9]/g, '');
    // Move focus to the next input if the current one is filled
    const nextInput = inputs[index + 1];
    if (nextInput && input.value) {
      nextInput.focus();
    }
  });
  input.addEventListener('keydown', (e) => {
    // Move focus to the previous input on backspace if the current input is empty
    if (e.key === "Backspace" && !input.value && index !== 0) {
      inputs[index - 1].focus();
    }
  });
});


// Add an event listener to your form's submit button
document.getElementById('submit-button').addEventListener('click', function(event) {
    var riderNum = collectInputValues();   // Call the function to collect and output values
    console.log(riderNum);
    sendToSim(otp = null, riderNum);
});

document.getElementById('generateButton').addEventListener('click', function(event) {
    var otp = temp_otp// generateOTP();   // Call the function to generate OTP
    if(otp =! null) document.getElementById('submit-Button').disabled = false;
  displayOTP(otp);
});

function generateOTP(){
  //send request to arduino
  sendData('R');
  var otp = getData();
  return otp;
}

function sendToSim(otp, riderNum) {
  //send to arduino the two data
  let txt = 'S' + otp + '09' + riderNum;
  sendData(txt);
}

function sendData(data) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://<NodeMCU-IP>/data?value=" + data, true);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('response').innerText = this.responseText;
    }
  };
  xhr.send();
}

function getData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://<NodeMCU-IP>/update", true);
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

//setInterval(getData, 5000); // Update sensor value every 5 seconds
