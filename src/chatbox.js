document.getElementById('toggleChat').addEventListener('click', function() {
  var messages = document.getElementById('messages');
  var chatInput = document.getElementById('chatInput');
  var chatbox = document.getElementById('chatbox');
  if (chatbox.style.height === '45px') {
    chatbox.style.height = '400px'; // Expand to original height
    chatbox.style.width = '300px';
  } else {
    chatbox.style.height = '45px'; // Collapse to just show the button
    chatbox.style.width = '50px';
  }
  if (messages.style.display === 'none') {
    messages.style.display = 'block';
    chatInput.style.display = 'block';
    this.textContent = '-';
  } else {
    messages.style.display = 'none';
    chatInput.style.display = 'none';
    this.textContent = '+';
  }
});

document.getElementById('chatForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent page refresh

  var input = document.getElementById('chatInput');
  var message = input.value.trim();

  if (message) {
    var messagesDiv = document.getElementById('messages');
    var newMessageDiv = document.createElement('div');
    newMessageDiv.textContent = 'You: ' + message;
    messagesDiv.appendChild(newMessageDiv);

    // Clear the input field after message is sent
    input.value = '';

    // Auto scroll to the latest message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  console.log('Input Message:', message);
  callLLMBackend(message).then(data => {
    if (data) {
        // Handle the successful response here
        console.log('Output:', data.response.message);  // Assuming 'response' is part of the JSON structure returned from your backend
        var newReplyDiv = document.createElement('div');
        newReplyDiv.textContent = 'Robot: ' + data.response.message;
        messagesDiv.appendChild(newReplyDiv);
      }
  });
  
  
});


async function callLLMBackend(inputData) {
  try {
      const response = await fetch('/api/predict/', {  // Using the '/api' prefix if you've set up a proxy in Vite
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              input: inputData,
          }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Response from the server:', data);
      return data;
  } catch (error) {
      console.error('Error making the request:', error);
  }
}
