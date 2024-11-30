/* @author: Harshith Reddy Ganta*/

class DiceGame {
    constructor() {
        this.playerTotalScore = 0;
        this.computerTotalScore = 0;
        this.currentRound = 0;
        this.maxRounds = 3;
        this.roundHistory = [];
        this.rotationInterval = null;

        this.elements = {
            playerRoll: $("#player-roll"),
            computerRoll: $("#computer-roll"),
            playerRoundScore: $("#player-round-score"),
            computerRoundScore: $("#computer-round-score"),
            playerTotalScore: $("#player-total-score"),
            computerTotalScore: $("#computer-total-score"),
            rollButton: $("#roll-button"),
            stopButton: $("#stop-button"),
            resetButton: $("#reset-button"),
            winnerMessage: $("#winner-message"),
            winnerImage: $("#winner-image"),
            rulesPopup: $("#rules-popup"),
            startGame: $("#start-game"),
            diceImages: {
                player: [$("#player-dice1"), $("#player-dice2")],
                computer: [$("#computer-dice1"), $("#computer-dice2")],
            },
            popup: $(".popup"),  
            popupContent: $(".popup-content"),  
            popupButton: $(".popup-content button"),
            playerBox: document.querySelector('.player-box'),
            computerBox: document.querySelector('.computer-box'),
            playerNameDisplay: $("#player-name-display"), 
            namePopup: $("#name-popup"), 
            nameInput: $("#player-name-input"),
            submitNameButton: $("#submit-name")
        };

        this.init();
    }

    init() {

        this.elements.namePopup.show(); 

        this.elements.submitNameButton.on("click", () => {
            const name = this.elements.nameInput.val().trim();
            if (name) {
                this.playerName = name;
                this.elements.playerNameDisplay.text(this.playerName); 
                this.elements.namePopup.hide(); 
                this.showRulesPopup(); 
            } else {
                alert("Please enter a valid name!");
            }
        });

        this.elements.startGame.on("click", () => {
            this.elements.rulesPopup.hide();
        });

        this.elements.rollButton.on("click", () => this.startDiceRotation());
        this.elements.stopButton.on("click", () => this.playRound());
        this.elements.resetButton.on("click", () => this.resetGame());
        this.elements.popupButton.on("click", () => this.closePopup());
    }

    askPlayerName() {
        this.elements.namePopup.show();

        this.elements.submitNameButton.on("click", () => {
            const name = this.elements.nameInput.val().trim();
            if (name) {
                this.playerName = name; 
                this.elements.playerNameDisplay.text(this.playerName); 
                this.elements.namePopup.hide(); 
            } else {
                alert("Please enter your name.");
            }
        });
    }


    showRulesPopup() {
        this.elements.rulesPopup.show();
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    calculateScore(dice1, dice2) {
        if (dice1 === 1 || dice2 === 1) return 0;
        if (dice1 === dice2) return (dice1 + dice2) * 2;
        return dice1 + dice2;
    }

    updateDiceImages(dice1, dice2, elements) {
        elements[0].attr("src", `../images/dice-${dice1}.png`);
        elements[1].attr("src", `../images/dice-${dice2}.png`);
    }

    startDiceRotation() {
        this.elements.rollButton.prop("disabled", true);
        this.elements.stopButton.prop("disabled", false);

        this.rotationInterval = setInterval(() => {
            this.updateDiceImages(this.rollDice(), this.rollDice(), this.elements.diceImages.player);
            this.updateDiceImages(this.rollDice(), this.rollDice(), this.elements.diceImages.computer);
        }, 100);
    }

    stopDiceRotation() {
        clearInterval(this.rotationInterval);
        this.elements.stopButton.prop("disabled", true);
        this.elements.rollButton.prop("disabled", false);
    }

    playRound() {
        this.stopDiceRotation();
        if (this.currentRound >= this.maxRounds) return;
    
        const playerDice = [this.rollDice(), this.rollDice()];
        const computerDice = [this.rollDice(), this.rollDice()];
    
        const playerScore = this.calculateScore(playerDice[0], playerDice[1]);
        const computerScore = this.calculateScore(computerDice[0], computerDice[1]);
    
        this.playerTotalScore += playerScore;
        this.computerTotalScore += computerScore;
    
        this.elements.playerRoll.text(`${playerDice[0]}, ${playerDice[1]}`);
        this.elements.computerRoll.text(`${computerDice[0]}, ${computerDice[1]}`);
        this.elements.playerRoundScore.text(playerScore);
        this.elements.computerRoundScore.text(computerScore);
        this.elements.playerTotalScore.text(this.playerTotalScore);
        this.elements.computerTotalScore.text(this.computerTotalScore);
    
        this.updateDiceImages(playerDice[0], playerDice[1], this.elements.diceImages.player);
        this.updateDiceImages(computerDice[0], computerDice[1], this.elements.diceImages.computer);
    
        this.roundHistory.push({
            round: this.currentRound + 1,
            playerDice,
            computerDice,
            playerScore,
            computerScore,
        });
    
        this.currentRound++;
    
        if (this.currentRound === this.maxRounds) {
            this.showRoundResult(playerScore, computerScore);
            this.endGame(); 
        } else {
            this.showRoundResult(playerScore, computerScore);
        }
    }
    
    

    showRoundResult(playerScore, computerScore) {
        const currentRoundData = this.roundHistory[this.currentRound - 1];
    
        const playerRoundResult = `
            <li>Round ${currentRoundData.round}: 
            Dice: ${currentRoundData.playerDice.join(", ")}, 
            Score: ${currentRoundData.playerScore}</li>`;
        const computerRoundResult = `
            <li>Round ${currentRoundData.round}: 
            Dice: ${currentRoundData.computerDice.join(", ")}, 
            Score: ${currentRoundData.computerScore}</li>`;
    
        $("#player-history").append(playerRoundResult);
        $("#computer-history").append(computerRoundResult);
    
        const winnerText = playerScore > computerScore ? "Player Wins this Round!" : playerScore < computerScore ? "Computer Wins this Round!" : "It's a Tie!";
        const winnerImage = playerScore > computerScore ? "../images/player-wins2.png" : playerScore < computerScore ? "../images/computer-wins.png" : "../images/tie.png";
    
        this.elements.popupContent.html(`
            <h3>${winnerText}</h3>
            <p>Player Score: ${playerScore}</p>
            <p>Computer Score: ${computerScore}</p>
            <img src="${winnerImage}" alt="${winnerText}">
        `);
        this.elements.popup.addClass("show");
    
        setTimeout(() => {
            this.closePopup();
        }, 5000);
    
        if (playerScore > computerScore) {
            this.updateBoxColors('player');
        } else if (playerScore < computerScore) {
            this.updateBoxColors('computer');
        } else {
            this.updateBoxColors('tie');
        }
    }
    

    closePopup() {
        this.elements.popup.removeClass("show");
    }

    endGame() {
        this.elements.rollButton.prop("disabled", true);
        this.elements.resetButton.prop("disabled", false);
    
        let winner;
        let winnerImage;
    
        if (this.playerTotalScore > this.computerTotalScore) {
            winner = "Player Wins the Game!";
            winnerImage = "../images/player-wins2.png";
            this.updateBoxColors('player');
        } else if (this.playerTotalScore < this.computerTotalScore) {
            winner = "Computer Wins the Game!";
            winnerImage = "../images/computer-wins.png";
            this.updateBoxColors('computer');
        } else {
            winner = "It's a Tie!";
            winnerImage = "../images/tie.png";
            this.updateBoxColors('tie');
        }
    
        this.elements.winnerMessage.text(winner).fadeIn(200);
        this.elements.winnerImage.attr("src", winnerImage).fadeIn(200);

        const historyList = $("#round-history");
        historyList.empty(); 
        this.roundHistory.forEach((round) => {
            const roundItem = `
                <li>
                    Round ${round.round}:
                    Player Dice: ${round.playerDice.join(", ")}, 
                    Player Score: ${round.playerScore}, 
                    Computer Dice: ${round.computerDice.join(", ")}, 
                    Computer Score: ${round.computerScore}
                </li>`;
            historyList.append(roundItem);
        });
    
        this.elements.popupContent.html(`
            <h3>${winner}</h3>
            <img src="${winnerImage}" alt="${winner}">
            <button class="close-popup">Close</button>
        `);
        this.elements.popup.addClass("show");
    this.elements.popupContent.find(".close-popup").on("click", () => this.closePopup());
    }

    resetGame() {
        this.playerTotalScore = 0;
        this.computerTotalScore = 0;
        this.currentRound = 0;
    
        this.elements.playerRoll.text("-");
        this.elements.computerRoll.text("-");
        this.elements.playerRoundScore.text("0");
        this.elements.computerRoundScore.text("0");
        this.elements.playerTotalScore.text("0");
        this.elements.computerTotalScore.text("0");
        this.elements.winnerMessage.text("").fadeOut(200);
    
        this.elements.rollButton.prop("disabled", false);
        this.elements.resetButton.prop("disabled", true);
    
        this.updateDiceImages(1, 1, this.elements.diceImages.player);
        this.updateDiceImages(1, 1, this.elements.diceImages.computer);

        this.roundHistory = [];

    $("#player-history").empty();
    $("#computer-history").empty();

            this.elements.playerBox.classList.remove('winner', 'loser', 'tie', 'default');
        this.elements.computerBox.classList.remove('winner', 'loser', 'tie', 'default');
    }

    updateBoxColors(winner) {
        this.elements.playerBox.classList.remove('winner', 'loser', 'tie');
        this.elements.computerBox.classList.remove('winner', 'loser', 'tie');
        this.elements.playerBox.classList.add('default');
        this.elements.computerBox.classList.add('default');
    
        if (winner === 'player') {
            this.elements.playerBox.classList.add('winner');
            this.elements.playerBox.classList.remove('default');
            this.elements.computerBox.classList.add('loser');
            this.elements.computerBox.classList.remove('default');
        } else if (winner === 'computer') {
            this.elements.computerBox.classList.add('winner');
            this.elements.computerBox.classList.remove('default');
            this.elements.playerBox.classList.add('loser');
            this.elements.playerBox.classList.remove('default');
        } else if (winner === 'tie') {
            this.elements.playerBox.classList.add('tie');
            this.elements.playerBox.classList.remove('default');
            this.elements.computerBox.classList.add('tie');
            this.elements.computerBox.classList.remove('default');
        }
    }
}

$(document).ready(() => {
    new DiceGame();
});