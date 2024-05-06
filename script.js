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

// Add an event listener to your form's submit button
document.getElementById('submit-button').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the form from submitting in the traditional way
    collectInputValues();   // Call the function to collect and output values
});

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