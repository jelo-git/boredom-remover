export class Table{
    classes = { //classes for html elements 
        active: 'active', //active row
        entered: 'entered', //completed row
        contains: 'contains', //card containing char in wrong place
        correct: 'correct', //card containing char in correct place
        shake: 'shake', //shake effect, when input is invalid
        card: 'card', 
        row: 'row', 
        outcome: 'outcome', //won / lost card
    }
    constructor(root){
        this.root = root
    }
}
export class JWordle extends Table{
    #rows;
    #secret; 
    #input = '';
    #block = true; //animation check
    #words; //all words
    #guesses; 
    #y; //row
    #x; //card

    #verify() {
        if (this.#words[this.#secret] == this.#input){
            this.root.childNodes[this.#y].childNodes.forEach(e=>{e.classList.add(this
                .classes.correct)})
            return true
        }
        for (let n = 0; n < 5; n++) {
            if (this.#words[this.#secret][n] == this.#input[n]) {
                this.root.childNodes[this.#y].childNodes[n].classList.add(this.classes.correct)
                continue
            }
            if (this.#words[this.#secret].includes(this.#input[n]))
                this.root.childNodes[this.#y].childNodes[n].classList.add(this.classes.contains)
        }
        return false
    }

    diffs = { "easy": 8, 'medium': 6, 'hard': 4, 'custom': 0 };
    promptMessage = "Input number"

    constructor(...args) {
        super(...args)
        document.addEventListener('keydown',(e)=>{this.write(e)})
        fetch('/words.json')
            .then((res) => {
                return res.json();
            }).then((e)=>{
                this.#words = e
            });
    }

    main(){
        //show diff
        for (const key in this.diffs) {
            let btn = document.createElement('button')
            btn.innerHTML = key
            btn.addEventListener('click',(ev)=>{
                this.#rows = this.diffs[ev.target.innerHTML]
                while(this.#rows == 0){
                    let msg = Number(prompt(this.promptMessage))
                    if(isNaN(msg) || msg<=0){
                        alert("Not allowed, try again")
                        continue
                    }
                    this.#rows = msg
                }
                this.prepare()
            })
            this.root.appendChild(btn)
        }
    }
    prepare(){
        this.#secret = Math.floor(Math.random() * (this.#words.length))
        this.#y = 0
        this.#x = 0
        this.#input = ''
        this.#guesses = []
        this.#block = false
        this.clear()
        this.generate()
    }
    clear(){
        this.root.innerHTML = ''
    }
    generate(){
        for(let n = 0; n<this.#rows;n++){
            let row = document.createElement('div')
            row.classList.add(this.classes.row)
            if(n==0)
            row.classList.add(this.classes.active)
            for (let m = 0; m < 5; m++) {
                let card = document.createElement('div')
                card.classList.add(this.classes.card)
                row.appendChild(card)
            }
            this.root.appendChild(row)
        }
    }
    write(keyDownEvent){
        //animation
        if(this.#block){
            if(this.#y==-1){
                this.prepare()
            }
            return
        }
        //backspace
        if(keyDownEvent.keyCode == 8){
            if(this.#x==0)//nothing to remove
            return
            this.#x--
            let card = this.root.childNodes[this.#y].childNodes[this.#x]
            card.innerHTML = ''
            this.#input = this.#input.slice(0,-1)
        }
        //A-Z
        if(keyDownEvent.keyCode>=65 && keyDownEvent.keyCode<=90){
            let card = this.root.childNodes[this.#y].childNodes[this.#x]
            card.innerHTML = keyDownEvent.key
            this.#input += keyDownEvent.key
            this.#x++
            if(this.#x>=5){
                this.#x=0
                let row = this.root.childNodes[this.#y]
                if(!this.#words.includes(this.#input) || this.#guesses.includes(this.#input)){
                    this.#block = true
                    row.classList.add(this.classes.shake)
                    setTimeout(()=>{
                        row.childNodes.forEach(e=>{
                            e.innerHTML = ''
                        })
                        this.#input = ''
                        this.#block = false
                        row.classList.remove(this.classes.shake)
                    },500)
                    return
                }
                this.#guesses.push(this.#input)
                row.classList.remove(this.classes.active)
                row.classList.add(this.classes.entered)
                if(this.#verify()){
                    this.#block = true
                    this.finall(true)
                    return
                }
                this.#input = ''
                this.#y++
                if(this.#y>=this.#rows){
                    this.#block = true
                    this.finall(false)
                    return
                }
                this.root.childNodes[this.#y].classList.add(this.classes.active)
            }
        }
    }
    finall(status){
        let outcome = document.createElement('div')
        outcome.classList.add('outcome')
        let header = document.createElement('h2')
        header.innerHTML = status?"You won":"You lost"
        outcome.appendChild(header)
        let span = document.createElement('span')
        span.innerHTML = "Press any key to continue"
        outcome.appendChild(span)
        this.#y = -1
        this.root.appendChild(outcome)
    }

}