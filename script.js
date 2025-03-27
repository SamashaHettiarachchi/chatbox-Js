// Select DOM elements
const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message-btn");
const fileInput = document.querySelector("#file-input");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chat");
const uploadFileButton = document.querySelector("#upload-file-btn");

// API setup - using local server
const API_URL = "http://localhost:3000/chat";

const userData = {
    message: null,
    file: null
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
            body: JSON.stringify({ message: userData.message })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Server error: ${response.status}`);

        messageElement.textContent = data.response;
    } catch (error) {
        messageElement.textContent = `Error: ${error.message}`;
    }
};

// Handle user message submission
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message) return;

    // Create and display user message
    const userMessageDiv = createMessageElement(`<div class="message-text">${userData.message}</div>`, "user-message");
    chatBody.appendChild(userMessageDiv);
    messageInput.value = "";

    // Display bot response
    setTimeout(() => {
        const botMessageDiv = createMessageElement('<div class="message-text">Thinking...</div>', "bot-message");
        chatBody.appendChild(botMessageDiv);
        generateBotResponse(botMessageDiv);
    }, 600);
};

// Event Listeners
sendMessageButton.addEventListener("click", handleOutgoingMessage);
document.querySelector(".chat-form").addEventListener("submit", handleOutgoingMessage);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// File upload functionality
uploadFileButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    userData.file = file;
});

// Emoji Picker Setup
const picker = new EmojiMart.Picker({
    onEmojiSelect: (emoji) => {
        messageInput.value += emoji.native;
        messageInput.focus();
    }
});
document.querySelector(".chat-form").appendChild(picker);
