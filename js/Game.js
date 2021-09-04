class Game {
  constructor() {
    this.resetButton=createButton("");
    this.resetTitle = createElement("h2");
    this.leaderBoardTitle=createElement("h2");
    this.leader1=createElement("h2");
    this.leader2=createElement("h2");
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
      
    });
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];
    
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("Reset Game");
    this.resetTitle.position(width/2+200,40);
    this.resetTitle.class("resetText");
    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+230,100);
    this.leaderBoardTitle.html("LeaderBoard");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width/3-60,40);
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);
    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,130);

  }

  play() {
    this.handleElements();
    this.handleReset();
    
    Player.getPlayersInfo();

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderBoard();
      var index = 0; //cars array index[]

      // allPlayers = {player1:{name:value, positionX: value,positionY:value},player2:{name:value, positionX: value,positionY:value}}
      for(var plr in allPlayers){
       var x = allPlayers[plr].positionX;
       var y = height - allPlayers[plr].positionY;

       cars[index].position.x = x;
       cars[index].position.y = y;
       if(index+1 === player.index){
        fill("red");
        stroke("black");
        ellipse(x,y,60)
         camera.position.y = cars[index].position.y
       }

    
       index++;  //index= index+1
      }
     
     this.handlePlayerControls();
      drawSprites();
    }
  }

  handlePlayerControls(){
     if(keyIsDown(UP_ARROW)){
       player.positionY+=10
       player.update();
     }
     if(keyIsDown(DOWN_ARROW)){
      player.positionY-=10
      player.update();
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
      player.positionX-=10
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
     player.positionX+=10
     player.update();
   }
  }
  handleReset(){
    this.resetButton.mousePressed(()=>{
    player.updateCount(0);
    this.update(0);
    database.ref("players").remove();
    window.location.reload();
    })
  }
  showLeaderBoard(){
    var leader1,leader2;
    var players = Object.values(allPlayers);

    if((players[0].rank === 0 && players[1].rank === 0) || 
    players[0].rank ===1  ){
       leader1 = players[0].rank +"&emsp;"+ players[0].name + "&emsp;"+ players[0].score ;
       leader2 = players[1].rank +"&emsp;"+  players[1].name +"&emsp;"+  players[1].score ;
    }
    if(players[1].rank ===1){
      leader2 = players[0].rank +"&emsp;"+  players[0].name +"&emsp;"+  players[0].score ;
      leader1 = players[1].rank +"&emsp;"+  players[1].name +"&emsp;"+  players[1].score ;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  
}
