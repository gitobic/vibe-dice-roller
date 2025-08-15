class DiceRoller {
    constructor() {
        this.diceTypes = [2, 4, 6, 8, 10, 12, 20, 100];
        this.results = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const rollButton = document.getElementById('rollButton');
        const clearButton = document.getElementById('clearButton');
        
        rollButton.addEventListener('click', () => this.rollAllDice());
        clearButton.addEventListener('click', () => this.clearAll());
        
        this.diceTypes.forEach(sides => {
            const input = document.getElementById(`d${sides}`);
            input.addEventListener('change', () => this.validateInput(input));
        });
    }

    validateInput(input) {
        const value = parseInt(input.value);
        if (value < 0) input.value = 0;
        if (value > 20) input.value = 20;
    }

    rollDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    rollAllDice() {
        this.results = [];
        let total = 0;
        let hasAnyDice = false;

        this.diceTypes.forEach(sides => {
            const quantity = parseInt(document.getElementById(`d${sides}`).value) || 0;
            
            if (quantity > 0) {
                hasAnyDice = true;
                const diceGroup = {
                    type: `d${sides}`,
                    sides: sides,
                    rolls: []
                };

                for (let i = 0; i < quantity; i++) {
                    const roll = this.rollDie(sides);
                    diceGroup.rolls.push(roll);
                    total += roll;
                }

                this.results.push(diceGroup);
            }
        });

        if (!hasAnyDice) {
            this.displayMessage("Please select at least one die to roll!");
            return;
        }

        this.displayResults(total);
        this.animateRoll();
    }

    displayResults(total) {
        const totalElement = document.getElementById('totalResult');
        const resultsContainer = document.getElementById('diceResults');
        
        totalElement.textContent = total;
        resultsContainer.innerHTML = '';

        this.results.forEach(group => {
            const groupElement = this.createDiceGroupElement(group);
            resultsContainer.appendChild(groupElement);
        });
    }

    createDiceGroupElement(group) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'dice-group';

        const title = document.createElement('h4');
        title.textContent = `${group.type} (${group.rolls.length})`;
        groupDiv.appendChild(title);

        const diceContainer = document.createElement('div');
        diceContainer.className = 'dice-container';

        group.rolls.forEach((roll, index) => {
            const dieElement = this.createDieElement(group.type, roll, index);
            diceContainer.appendChild(dieElement);
        });

        groupDiv.appendChild(diceContainer);
        return groupDiv;
    }

    createDieElement(type, value, index) {
        const die = document.createElement('div');
        die.className = `die ${type}`;
        die.textContent = value;
        die.style.animationDelay = `${index * 0.1}s`;
        
        this.addDieGraphics(die, type, value);
        
        return die;
    }

    addDieGraphics(die, type, value) {
        const sides = parseInt(type.substring(1));
        
        if (sides === 6) {
            this.addDotPattern(die, value);
        }
        
        if (value === sides) {
            die.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
            die.style.border = '2px solid gold';
        }
        
        if (value === 1 && sides > 2) {
            die.style.boxShadow = '0 0 15px rgba(220, 20, 60, 0.6)';
        }
    }

    addDotPattern(die, value) {
        die.innerHTML = '';
        die.style.position = 'relative';
        die.style.fontSize = '0';

        const patterns = {
            1: [[50, 50]],
            2: [[25, 25], [75, 75]],
            3: [[25, 25], [50, 50], [75, 75]],
            4: [[25, 25], [75, 25], [25, 75], [75, 75]],
            5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
            6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
        };

        if (patterns[value]) {
            patterns[value].forEach(([x, y]) => {
                const dot = document.createElement('div');
                dot.style.position = 'absolute';
                dot.style.width = '8px';
                dot.style.height = '8px';
                dot.style.backgroundColor = 'white';
                dot.style.borderRadius = '50%';
                dot.style.left = `${x}%`;
                dot.style.top = `${y}%`;
                dot.style.transform = 'translate(-50%, -50%)';
                dot.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)';
                die.appendChild(dot);
            });
        } else {
            die.textContent = value;
            die.style.fontSize = '1.2em';
        }
    }

    animateRoll() {
        const dice = document.querySelectorAll('.die');
        dice.forEach((die, index) => {
            setTimeout(() => {
                die.classList.add('die-roll-animation');
                setTimeout(() => {
                    die.classList.remove('die-roll-animation');
                }, 600);
            }, index * 100);
        });
    }

    displayMessage(message) {
        const resultsContainer = document.getElementById('diceResults');
        resultsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px; 
                        background: #fff3cd; border: 1px solid #ffeaa7; 
                        border-radius: 10px; color: #856404;">
                ${message}
            </div>
        `;
    }

    clearAll() {
        this.diceTypes.forEach(sides => {
            document.getElementById(`d${sides}`).value = sides === 6 ? 1 : 0;
        });
        
        document.getElementById('totalResult').textContent = '0';
        document.getElementById('diceResults').innerHTML = '';
        this.results = [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiceRoller();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        document.getElementById('rollButton').click();
    }
    
    if (event.key === 'Escape') {
        document.getElementById('clearButton').click();
    }
});