Character.count =0;
function Character(inheritance){
    Character.count++;
    this.id = 'ch_'+Character.count;
    if(!inheritance){
        Game.toDraw[this.id]=this;
    }
    //
    this.fW = 21;
    this.fH = 24;
    this.mod_x = -2;   //modyfikaory ustawienia gracza
    this.mod_y = -9;
    this.speed = 2;
    this.timer = 200;   //odliczanie czasu trwania bonusu

    //
//    this.frames = [1,0,2,0]; //zapetlanie odpowiednich klatek animacji aby ruch był plynny
    this.current_f = 0;
    
    this.f_max_delay = 2;
    this.change_f_delay =0;
    
}
Character.prototype.rowAndColumn = function(){ //metoda sprawdzajaca kolejny obszar na ktory chce wejsc bohater
    this.row = Math.round(this.y/Game.board.fH);
    this.column = Math.round(this.x/Game.board.fW);
    if(this.state.slice(-2)=='go'){
        if(this.state=='left_go' || this.state=='right_go'){
            this.next_row = this.row;
            this.next_column = this.state == 'left_go'? Math.floor(this.x/Game.board.fW) :Math.ceil(this.x/Game.board.fW);
        }else{
            this.next_column = this.column;
            this.next_row = this.state == 'up_go'? Math.floor(this.y/Game.board.fH) :Math.ceil(this.y/Game.board.fH);
        }
        
        
        if(!(this.row==this.next_row && this.column == this.next_column) && Game.board.b[this.next_row][this.next_column].type !='empty'){ //sprawdzam czy obszar na ktory chce wejsc jest puty i czy nie stoi w miejsc
                this.state = this.state.slice(0,-3);
                this.current_f = 0;  //ustawienie klatki animacji na pierwsza
            
            
            if(this.row != this.next_row){ //wysrodkowanie bohatera gdy nie moze wejsc na nastepne pole
                this.y = this.row*Game.board.fH;
            }else{
                this.x = this.column*Game.board.fW;
            }
        }else{
            if(this.row!=this.next_row){  //wysrodkowanie bohatera gdy moze wejsc na kolejne pole, by nie wchodzil na przeszkody
                this.x = this.column*Game.board.fW;
            }else if(this.column !=this.next_column){
                this.y = this.row*Game.board.fH;
            }
        }
    }else{
        this.next_row = this.row;
        this.next_column = this.column;
    }
    
     if(Game.board.b[this.row][this.column].extra == 'speed'){        //zebranie bonusu
        Game.board.b[this.row][this.column] = Board.elements.floor;
        this.speed+=1;
                
    }
     if(this.speed>2){            //odliczanie czasu trwania bonusu
         this.timer--;
         if(this.timer<0){
             this.speed = 2;
             this.timer = 200;
         }
     }
}
Character.prototype.draw = function(){ //metoda
    if(this.state.slice(-2)=='go'){
    
        if(this.state=='down_go'){
            this.y+=this.speed;
        }else  if(this.state=='right_go'){
            this.x+=this.speed;
        }else  if(this.state=='up_go'){
            this.y-=this.speed;
        }else  if(this.state=='left_go'){
            this.x-=this.speed;
        }
     this.rowAndColumn();
    }else if(this.state.slice(-2)!='go') {this.rowAndColumn();}
    //pomocniczo oznacza gdzie bohater stoi
//    Game.ctx.fillRect(this.column*Game.board.fW*VAR.scale,
//                     this.row*Game.board.fH*VAR.scale,
//                     Game.board.fW*VAR.scale,
//                     Game.board.fH*VAR.scale);
    //pomocniczo oznacza gdzie bohater chce wejsc
//    Game.ctx.fillRect(this.next_column*Game.board.fW*VAR.scale,
//                     this.next_row*Game.board.fH*VAR.scale,
//                     Game.board.fW*VAR.scale,
//                     Game.board.fH*VAR.scale);
    
    if(Game.board.b[this.row][this.column].sub_type== 'bomb' &&Game.board.b[this.row][this.column].bum_type){
        this.setKO();
    }
      
    if(this.states[this.state].flip){ //jezeli chcemy odbic lustrzanie lewo na prawo, zapisujemy stan lewo i scala odbijamy obrazek
        Game.ctx.save(); 
        Game.ctx.scale(-1,1);    
    }
    Game.ctx.drawImage(
        Game.spr,
        this.states[this.state].sx+this.states[this.state].f[this.current_f]*this.fW, //wartosc x poczatku obrazka, zmiennia sie dlatego jest w tablicy
        this.states[this.state].sy, // wartosc y poczatku obrazka stala
        this.fW, //szerokosc obrazka
        this.fH,//wysokosc obrazka
        this.states[this.state].flip ? (-this.fW-this.mod_x-this.x-1)*VAR.scale : (this.x+this.mod_x+1)*VAR.scale, // gdzie wklejamy obrazek w canvas po x
        (this.y+this.mod_y+1)*VAR.scale, // gdzie wklejamy obrazek w canvas po y
        this.fW*VAR.scale, //scalowanie obrazka na szerokosc
        this.fH*VAR.scale  //scalowanie obrazka na wysokosc 
                 //narazie jest 1:1
    );
    if(this.states[this.state].flip){ //jezeli odbijamy lustrzanie obrazek to przywracamy go do pkt poczatkowego, zapisanego przez save
        Game.ctx.restore();
    }
    if(this.change_f_delay < this.f_max_delay){ //sztuczne opoznianie animacji
        this.change_f_delay++;
    }else{
        this.change_f_delay =0;
        
        if(this.state == 'ko' && this.current_f == this.states[this.state].f.length-1){
            this.afterKO();
        }else{
        
        this.current_f =this.current_f+1>= this.states[this.state].f.length ? 0 : this.current_f+1;
        }
    }
};
Character.prototype.setKO = function(){
    this.state = 'ko';
};
Character.prototype.afterKO = function(){
    delete Game.toDraw[this.id];
};

function Hero(){
    Character.call(this); //przywoluje obiekt charakter i dziedzicze go (linia 2)
    this.state = 'down';  //stan bohatera startowy
    this.states = {   //stany ruchu bohatera wg sprite
        'down':{sx:0,sy:0,f:[0]},
        'down_go':{sx:0,sy:0,f:[1,0,2,0]},
        'left':{sx:63,sy:0,f:[0]},
        'left_go':{sx:63,sy:0,f:[1,0,2,0]},
        'up':{sx:0,sy:24,f:[0]},
        'up_go':{sx:0,sy:24,f:[1,0,2,0]},
        'right':{sx:63,sy:0,f:[0],flip:true}, //flip czli odwrocenie lewo na prawo
        'right_go':{sx:63,sy:0,f:[1,0,2,0],flip:true},
        'ko':{sx:0,sy:48,f:[0,1,0,1,2,2,3,4,5]}
    }
    this.x = Game.board.fW;   //x,y ustawia poczatkowe umiejscowienie gracza
    this.y = Game.board.fH;
   // this.timer = 200;
    
    this.rowAndColumn();
}
Hero.prototype = new Character(true); //dziedziczenie metod
Hero.prototype.contructor = Hero; //dziedziczenie metod
Hero.prototype.parent = Character.prototype;


Hero.prototype.updateState = function(){
    this.tmp_state = this.state;
    if(Game.key_37){
        this.tmp_state = 'left_go';
    }else if(Game.key_38){
        this.tmp_state = 'up_go';
    }else if(Game.key_39){
        this.tmp_state = 'right_go';
    }else if(Game.key_40){
        this.tmp_state = 'down_go';
    }else if(this.state.slice(-2)=='go'){ //-2 to dwa ostatnie znaki
        this.tmp_state = this.state.slice(0,this.state.indexOf('_go')); //slice fnkcja obcinajaca
    }
    if(this.tmp_state!=this.state){
        this.current_f = 0;  //ustawienie klatki gdy postac stanie
        this.state = this.tmp_state;
    }
}
Hero.prototype.setKO = function(){
    this.parent.setKO.call(this);
    Game.stop();
}
Hero.prototype.afterKO = function(){
  if(!Game.is_over){
      Game.is_over = true;
      console.log("gameOver");
  }  
};

Hero.prototype.enemyHitTest = function(){
  for(var e in Enemy.all){
      e = Enemy.all[e];
      if((this.row == e.row && e.x+Game.board.fW>this.x && e.x<this.x+Game.board.fW || (this.column == e.column && e.y+Game.board.fH>this.y && e.y<this.y+Game.board.fH )) ){
         return true;
    }  
 }
     return false;
};

Hero.prototype.draw = function(){
          this.parent.draw.call(this);
          if(this.state !='ko' && this.enemyHitTest()){
              this.setKO();
          }
      };      
         
Enemy.all = {
    
};
function Enemy(x,y){
    Character.call(this);
    Enemy.all[this.id] = this;
    this.state = 'down_go';
    this.states = {
        'down':{sx:0,sy:72,f:[0]},
        'down_go':{sx:0,sy:72,f:[1,0,2,0]},
        'up':{sx:63,sy:72,f:[0]},
        'up_go':{sx:63,sy:72,f:[1,0,2,0]},
        //'left':{sx:63,sy:24,f:[0]},         //kurczak
        //'left_go':{sx:63,sy:24,f:[1,0,2,0]},
        'left':{sx:0,sy:144,f:[0]},
        'left_go':{sx:0,sy:144,f:[1,0,2,0,3,0,4,0,5,0]},
        'right':{sx:63,sy:24,f:[0],flip:true},
        'right_go':{sx:63,sy:24,f:[1,0,2,0],flip:true},
//        'ko':{sx:0,sy:96,f:[0,1,1,2,2,3,4,5]}   //kurczak
         'ko':{sx:0,sy:96,f:[0,1,1,2,2,3,4,5]}
    }
    this.name = 'enemy';
    this.x = x;
    this.y = y;
    this.rowAndColumn();
    this.setDirection();
}
Enemy.prototype = new Character(true); //dziedziczenie metod
Enemy.prototype.contructor = Enemy; //dziedziczenie metod
Enemy.prototype.parent = Character.prototype;


Enemy.prototype.setDirection = function(change){                   //jezeli change == true, losuje czy zmienic kierunek ruchu
    this.canGo = this.canGo || [];   //tablica pozwolen przejsc
    this.canGo.length =0;
    this.arrayAllow = [     //tablica pozwolen na zmiane kierunku
        [0,0,0,0,0,0,0,0,1,0,0,0],
        [1,0,0,0,0,0,0,0,0,0,0,0]
    ];
    if(change){
        this.option = VAR.rand(0,this.arrayAllow.length-1);   //wybor ktora z opcji pozwolen
        this.tmp = VAR.rand(0,11);  //dlugosc tablicy
        
        if(this.arrayAllow[this.option][this.tmp]){
            this.setDirectionLogic();
        }
    }else{
        this.setDirectionLogic();
    }
};
Enemy.prototype.setDirectionLogic = function(){
    
    for(var i= this.column-1;i<=this.column+1;i++){
        for(var j = this.row-1;j<=this.row+1;j++){
            if(!(i==this.column && j==this.row)){
                if(i==this.column || j==this.row){
                    if(Game.board.b[j][i].type == 'empty'){
                        this.canGo.push({x:i,y:j});
                    }
                }
             }
         }
    }
    if(this.canGo.length>0){
        this.tmp_pos = this.canGo[VAR.rand(0,this.canGo.length-1)];
        if(this.column<this.tmp_pos.x){
            this.state = 'right_go';
        }else if(this.column >this.tmp_pos.x){
            this.state = 'left_go';
        }else if(this.row < this.tmp_pos.y){
             this.state = 'down_go';
        }else if(this.row > this.tmp_pos.y){
            this.state = 'up_go';
        }
    }else if(this.state.slice(-2)=='go'){
        this.state = this.state.slice(0,-3);  
    }

};
Enemy.prototype.rowAndColumn = function(){
    this.prev_state = this.state;
    this.parent.rowAndColumn.call(this);
    
    if(this.state!=this.prev_state && this.state.slice(-2)!='go' && this.prev_state.slice(-2)=='go'){
        this.setDirection();   
    }else if(this.state==this.prev_state){
           this.setDirection(true);   
    }
};
Enemy.prototype.afterKO = function(){
    this.parent.afterKO.call(this);
    delete Enemy.all[this.id];
    
    var some_enemy = false;
    for(var e in Enemy.all){
        some_enemy = true;
        break;
    }
    if(!some_enemy){
        console.log('success');
    }
};