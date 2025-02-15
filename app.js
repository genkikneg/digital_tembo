class Player {
    static players = [];

    constructor(divElement){
        this.element = divElement;

        this.myh2 = this.element.querySelector('.myScore');
        this.myh3 = document.createElement('h3');
        this.scores = this.element.querySelector('.scores');

        this.kamitya = this.element.querySelector('.left');
        this.toimen = this.element.querySelector('.top');
        this.shimotya = this.element.querySelector('.right');

        this.div = this.element.querySelector('.newTemboButton');
        this.riichiBtn = this.element.querySelector('.riichiBtn');

        this.myScore = 25000;
        this.myTempScore = 0;

        this.createdButtons = [];

        this.tembo100 = {
            btn: this.element.querySelector('.temboButton .btn100'),
            score: 100,
        };
        this.tembo1000 = {
            btn: this.element.querySelector('.temboButton .btn1000'),
            score: 1000,
        };
        this.tembo5000 = {
            btn: this.element.querySelector('.temboButton .btn5000'),
            score: 5000,
        };
        this.tembo10000 = {
            btn: this.element.querySelector('.temboButton .btn10000'),
            score: 10000,
        };

        Player.players.push(this);

        this.init();
    };

    updateMyScore = (score) => {
        this.myScore -= score;
        this.myh2.innerText = this.myScore;
        this.drowOrFin();
    };

    receiveScore = (scores) => {
        this.myScore += scores;
        this.myh2.innerText = this.myScore;
        this.drowOrFin();
    };

    drowOrFin = () => {
        this.riichiBtn.disabled = this.myScore < 1000;
        this.element.style.backgroundColor = 'lightgrey';
    };

    init(){        
        for (let tembo of [this.tembo100, this.tembo1000, this.tembo5000, this.tembo10000]){
            tembo.btn.addEventListener('click', () => {
                const tempBtn = document.createElement('button');
                tempBtn.innerText = tembo.score;
        
                this.createdButtons.push(tempBtn);
        
                this.div.append(tempBtn);
                this.myTempScore += tembo.score;
                tempBtn.addEventListener('click', () => {
                    tempBtn.remove();
                    this.myTempScore -= tembo.score;
                    this.myh3.innerText = this.myTempScore;
                });
        
                this.myh3.innerText = this.myTempScore;
                this.scores.append(this.myh3);
            });
            
        };
        this.riichiBtn.addEventListener('click', () => {
            this.updateMyScore(1000);
            riichiScore += 1000;
            riichiScoreH3.innerText = riichiScore;
            this.riichiBtn.disabled = true;
            this.element.style.backgroundColor = '#FFE87C';

            for(let p of [rStoTop, rStoLeft, rStoBottom, rStoRight]){
                p.style.backgroundColor = 'red';
            }
        });
        
        
        for (let sendPlayer of [this.kamitya, this.toimen, this.shimotya]){
            sendPlayer.addEventListener('click', () => {
                const targetPlayer = this.getTargetPlayer(sendPlayer);
                if(!targetPlayer) return;

                this.updateMyScore(this.myTempScore);
                targetPlayer.receiveScore(this.myTempScore);

                for (let createdButton of this.createdButtons){
                    createdButton.remove();
                }
                this.myTempScore = 0;
                this.myh3.innerText = this.myTempScore;
                this.drowOrFin();

                for(let p of Player.players){
                    p.drowOrFin();
                }
            });
        }
    }

    getTargetPlayer(element){
        const classes = element.classList;
        let count = 0;
        while(true){
            if(this === Player.players[count]){
                if(classes.contains('left')) return Player.players[(1 + count)%4]; //下家
                if(classes.contains('top')) return Player.players[(2 + count)%4]; //対面
                if(classes.contains('right')) return Player.players[(3 + count)%4]; //上家
            }
            if (count >= 4) return null;
            count ++;
        }
    }
}
const riichiScoreH3 = document.querySelector('.rS');
let riichiScore = parseInt(riichiScoreH3.textContent);
const rStoTop = document.querySelector('.getRiichiBtns .top');
const rStoLeft = document.querySelector('.getRiichiBtns .left');
const rStoBottom = document.querySelector('.getRiichiBtns .bottom');
const rStoRight = document.querySelector('.getRiichiBtns .right');

const drowBtn = document.querySelector('.drowBtn');

const playerAll = document.querySelectorAll('.player');

const player1 = new Player(playerAll[0]);
const player2 = new Player(playerAll[1]);
const player3 = new Player(playerAll[2]);
const player4 = new Player(playerAll[3]);

drowBtn.addEventListener('click', () => {
    [player1, player2, player3, player4].forEach(player => {
        player.drowOrFin();
    })
})

for(let rsGetter of [rStoTop, rStoLeft, rStoBottom, rStoRight]){
    const classes = rsGetter.classList;
    rsGetter.addEventListener('click', () => {
        if(classes.contains('top')){
            player4.receiveScore(riichiScore);
            riichiScore = 0;
            riichiScoreH3.innerText = '0';
            [player1, player2, player3, player4].forEach(player => {
                player.drowOrFin();
            })
        };
        if(classes.contains('left')){
            player3.receiveScore(riichiScore);
            riichiScore = 0;
            riichiScoreH3.innerText = '0';
            [player1, player2, player3, player4].forEach(player => {
                player.drowOrFin();
            })
        };
        if(classes.contains('bottom')){
            player2.receiveScore(riichiScore);
            riichiScore = 0;
            riichiScoreH3.innerText = '0';
            [player1, player2, player3, player4].forEach(player => {
                player.drowOrFin();
            })
        };
        if(classes.contains('right')){
            player1.receiveScore(riichiScore);
            riichiScore = 0;
            riichiScoreH3.innerText = '0';
            [player1, player2, player3, player4].forEach(player => {
                player.drowOrFin();
            })
        };
        for(let p of [rStoTop, rStoLeft, rStoBottom, rStoRight]){
            p.style.backgroundColor = '';
        }
    })
};