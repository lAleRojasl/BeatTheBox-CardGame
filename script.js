// Create a deck of cards
let deck = [];
const suits = ["hearts", "diamonds", "clubs", "spades"];
const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

// Track disabled cards
let disabledCards = new Set(); // Set to track disabled card indices

// Function to create the deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: value, suit: suit });
        }
    }
    deck = shuffle(deck); // Shuffle the deck
    updateCardsLeftText(); // Update cards left count
}

// Fisher-Yates Shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to get image file name based on card
function getCardImageFileName(card) {
    return `images/cards/${card.value}_of_${card.suit}.png`;
}

// Back of card image
const backOfCardImage = 'images/back_of_card.png';

// Initial game setup
let grid = []; // The 3x3 grid of cards
let selectedCardIndex = null; // The index of the selected card
createDeck();

// Deal the initial 9 cards to the grid
function dealGrid() {
    grid = deck.splice(0, 9);  // Take 9 cards from the deck for the grid
    grid.forEach((card, index) => {
        const imgElement = document.getElementById(`card${index + 1}Image`);
        imgElement.src = getCardImageFileName(card); // Update the image for each card
    });
    disabledCards.clear(); // Reset disabled cards for a new game
	document.getElementById(`card${selectedCardIndex + 1}`).classList.remove('selected'); // Clear the selected card display
    selectedCardIndex = null; // Clear the selected card
    document.getElementById('drawnCardImage').src = 'images/cards_placeholder.png'; // Reset drawn card display
    updateCardsLeftText(); // Update cards left count
}

// Select a card in the grid
function selectCard(index) {
    // Check if the card is already disabled (flipped over)
    if (disabledCards.has(index)) {
        return; // Do nothing if the card is already disabled
    }

    if (selectedCardIndex !== null) {
        // Deselect the currently selected card
        document.getElementById(`card${selectedCardIndex + 1}`).classList.remove('selected');
    }
    selectedCardIndex = index;
    // Highlight the new selected card
    document.getElementById(`card${index + 1}`).classList.add('selected');
}

// Guess whether the next card is higher or lower
function guess(isHigher) {
    if (deck.length > 0) {
		if(selectedCardIndex !== null){
			const currentCard = deck.shift(); // Draw the next card from the deck
			const selectedCard = grid[selectedCardIndex]; // Get the selected card from the grid
			const result = compareCards(currentCard, selectedCard, isHigher);
			
			if (result) {
				alert("Correct!");
				// Replace the selected card with the new card
				grid[selectedCardIndex] = currentCard;
				document.getElementById(`card${selectedCardIndex + 1}Image`).src = getCardImageFileName(currentCard);
			} else {
				alert("Wrong!");
				// Disable the selected card (flip it over)
				document.getElementById(`card${selectedCardIndex + 1}Image`).src = backOfCardImage;
				disabledCards.add(selectedCardIndex); // Mark the card as disabled
				if(disabledCards.size == 9){
					alert("You are out of luck! Keep Trying :)");
					restartGame()
				}
			}

			// Display the drawn card image
			document.getElementById('drawnCardImage').src = getCardImageFileName(currentCard);
			
			// Update the cards left text
        	updateCardsLeftText();
			
			// Deselect the card after guessing
			document.getElementById(`card${selectedCardIndex + 1}`).classList.remove('selected');
			selectedCardIndex = null;	
		}
		else {
			alert("Please select a card before guessing.");
		}
    }
	else{
		alert("No cards left! You BEAT THE BOX!");
	}
}

// Compare cards to determine if the guess was correct
function compareCards(card1, card2, isHigher) {
    const cardValues = {
        "ace": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
        "8": 8, "9": 9, "10": 10, "jack": 11, "queen": 12, "king": 13
    };
    if (isHigher) {
        return cardValues[card1.value] >= cardValues[card2.value];
    } else {
        return cardValues[card1.value] <= cardValues[card2.value];
    }
}

// Update the number of cards left in the deck
function updateCardsLeftText() {
    document.getElementById('cardsLeftText').textContent = `Cards left: ${deck.length}`;
}

// Restart the game
function restartGame() {
    createDeck(); // Create and shuffle a new deck
    dealGrid();   // Deal new cards to the grid
}

// Event listeners for the buttons
document.getElementById('guessHigher').addEventListener('click', () => guess(true));
document.getElementById('guessLower').addEventListener('click', () => guess(false));
document.getElementById('restartGame').addEventListener('click', restartGame); // Add restart button functionality

// Start the game by dealing the grid
dealGrid();
