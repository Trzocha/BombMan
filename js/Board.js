Board.templates = [
    [
        'WWWWWWWWWWWWWWW',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'W X X X X X X W',
        'W             W',
        'WWWWWWWWWWWWWWW'
    ],
    [
        'WWWWWWWWWWWWWWW',
        'W             W',
        'W XXX X X X X W',
        'W             W',
        'W X X XXX X X W',
        'W             W',
        'W X X X X XXX W',
        'W             W',
        'W XXX XXX X X W',
        'W             W',
        'WWWWWWWWWWWWWWW'
    ]
    
];

Board.elements = {
    'floor':{sx:174,sy:16,type:'empty',sub_type:'board'},
    'W':{sx:190,sy:16,type:'solid',sub_type:'board'},
    'X':{sx:206,sy:16,type:'solid',sub_type:'board'},
    'box':{sx:126,sy:0,type:'soft',sub_type:'board',ko_obj: 'Crate'},
    'bonus':{sx:190,sy:32,type:'empty',sub_type:'board',extra:'speed'}
};

function Board(){
    this.fW = 16;
    this.fH = 16;
    this.parse(Board.templates[VAR.rand(0,Board.templates.length-1)]);
    this.array_Crate = [];    //tablica na bonusy + dzwi
    
    for(var i=0;i<VAR.crate;i++){
        this.array_Crate[i] = this.addCrate();
    }
    
    this.array_Crate = VAR.shuffle(this.array_Crate);  //tasowanie pol tam gdzie jest skrzynka
    
    this.addBonus();
    
}
Board.prototype.draw = function(){
    
    if(!this.temp_board){   // za pierwszym razem rysuje cała mape
        this.temp_board = true;
        
        for(var i=0;i<this.b.length;i++){
          for(var j=0;j<this.b[i].length;j++){
              Game.ctx.drawImage(
                Game.spr,
                this.b[i][j].sx,
                this.b[i][j].sy,
                this.fW,
                this.fH,
                j*this.fW*VAR.scale,
                i*this.fH*VAR.scale,
                this.fW*VAR.scale,
                this.fH*VAR.scale
              );
          }
        }
    }else{                  //za n-tym razem akcje na mapie, bez stałych elementów
        
        for(var i=0;i<this.b.length-1;i++){
            for(var j=1;j<this.b[i].length-1;j++){
                    Game.ctx.drawImage(
                        Game.spr,
                        this.b[i][j].sx,
                        this.b[i][j].sy,
                        this.fW,
                        this.fH,
                        j*this.fW*VAR.scale,
                        i*this.fH*VAR.scale,
                        this.fW*VAR.scale,
                        this.fH*VAR.scale
                    );  
                        if(this.b[i][j].sub_type != 'board'){  //rysowanie bomb, animacji
                        this.b[i][j].draw();
                    }
                }
        }
    }
};
Board.prototype.getEmptySpace = function(){ //funkcja zwracajaca puste miejsca tam gdzie ma sie pojawic skrzynka
    return this.emptySpaces.length>0 ? this.emptySpaces.shift(): null;
};
Board.prototype.addCrate = function(){ //dodawanie skrzynek
  var pos = this.getEmptySpace();
    if(pos){
        this.b[pos.y][pos.x] = Board.elements.box;
        return pos;
    }
};
Board.prototype.parse = function(arr){ //tworzy tablice typow obiekow na ktorj podstawie bedzie rysowana plansza
    this.emptySpaces =[];
    
    this.b =[];
    for(var i=0;i<arr.length; i++){
        this.b.push([]);
        for(var j=0;j<arr[i].length;j++){
            this.b[i].push(Board.elements[arr[i].charAt(j)==' '? 'floor': arr[i].charAt(j)]);
            
            if(this.b[i][j].type =='empty' && !(i>=1 && i<=3 && j>=1 && j<=3)){ //potrzebne do losowania w puste miejsca skrzynki z wykluczeniem pol respa bohatera 4x4
                this.emptySpaces.push({x:j,y:i});
            }
        }
    }
    this.emptySpaces = VAR.shuffle(this.emptySpaces); //tasowanie pustych pol by powstawiac skrzynki
};
Board.prototype.addBonus = function(){
   // this.b[this.array_Crate[0].y][this.array_Crate[0].x] = Board.elements.bonus;

}