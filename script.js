// Select DOM elements
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message-btn");
const fileInput = document.querySelector("#file-input");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chat");
const uploadFileButton = document.querySelector("#upload-file-btn");

// API setup - using local server
const API_URL = "";  // Use your local IP


const userData = {
    message: null,
  file: null,
};

const chatHistory = [];

// Function to create a message element
const createMessageElement = (content, className) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
};

// Function to generate bot response
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userData.message }),
        });

        const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || `Server error: ${response.status}`);

        messageElement.textContent = data.response;
    } catch (error) {
        messageElement.textContent = `Error: ${error.message}`;
    }
};

// Handle user message submission
const handleOutgoingMessage = async (e) => {
    e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

    // Create and display user message
  const userMessageDiv = createMessageElement(
    `<div class="message-text">${message}</div>`,
    "user-message"
  );
    chatBody.appendChild(userMessageDiv);
    messageInput.value = "";

  // Create and display bot's thinking message
  const botMessageContent = `
        <img src="Robot_pic.png" alt="Chatbot" class="chatbot-avatar" width="80px" height="80px">
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;
  const botMessageDiv = createMessageElement(botMessageContent, "bot-message");
        chatBody.appendChild(botMessageDiv);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    const messageElement = botMessageDiv.querySelector(".message-text");
    messageElement.textContent = data.response;
  } catch (error) {
    console.error("Chat error:", error);
    const messageElement = botMessageDiv.querySelector(".message-text");
    messageElement.textContent =
      "Sorry, I couldn't process your request. Please try again.";
  }
};

// Event Listeners
sendMessageButton.addEventListener("click", handleOutgoingMessage);
document
  .querySelector(".chat-form")
  .addEventListener("submit", handleOutgoingMessage);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
closeChatbot.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

// File upload functionality
uploadFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    userData.file = file;
});

// Emoji Picker Setup
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewposition: "none",
    onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker-btn") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});
document.querySelector(".chat-form").appendChild(picker);
