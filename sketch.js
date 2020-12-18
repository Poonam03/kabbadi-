var player1,player2;
var position1,position2;
var gameState = 0;
var player1Score=0;
var player2Score = 0;
var database;
var palyer1Animation,player2Animation;

function preload(){
  player1Animation = loadAnimation("assests/player1b.png","assests/player1a.png","assests/player1b.png");
  player2Animation = loadAnimation("assests/player2b.png","assests/player2a.png","assests/player2b.png");
}

function setup(){
 canvas = createCanvas(600,600);
  database = firebase.database();
  player1=createSprite(300,250,10,10);
  player1.addAnimation("walking",player1Animation);
 // player1Animation.frameDelay=200;
  player1.scale=0.5,
  player1.setCollider("circle",0,0,60),
  player1.debug=true

  var player1positionRef=database.ref("player1/position");
  player1positionRef.on("value",(data)=>{
    position=data.val();
    player1.x=position.x;
    player1.y=position.y;
  })
  
  player2=createSprite(100,250,10,10);
  player2.addAnimation("running",player2Animation);
  //player2Animation.frameDelay=200;
  player2.scale=0.5,
  player2.setCollider("circle",0,0,60),
  player2.debug=true
  
  var player2positionRef=database.ref("player2/position");
  player2positionRef.on("value",(data)=>{
    position=data.val();
    player2.x=position.x;
    player2.y=position.y;
  })

  gameStateRef=database.ref("gameState");
  gameStateRef.on("value",(data)=>{
    gameState=data.val()
  })

  
  var player1scoreRef=database.ref("player1Score");
  player1scoreRef.on("value",(data1)=>{
    player1Score=data1.val()
  })

  
  var player2scoreRef=database.ref("player2Score");
  player2scoreRef.on("value",(data2)=>{
    player2Score=data2.val()
  })
  
}


function draw(){
  background("white");
  if(gameState===0)
  {
    fill("black");
    text("Press Space to toss",300,300);
    if(keyDown("space"))
    {
      rand=Math.round(random(1,2))
      if(rand===1)
      {
        database.ref('/').update({
          'gameState':1
        })
        alert("RED RIDE")
      }
      else
      {
        database.ref('/').update({
          'gameState':2
        })
        alert("YELLOW RIDE")
      }
      database.ref("player1/position").update({
        'x':150,
        'y':300
      })
      database.ref("player2/position").update({
        'x':450,
        'y':300
      })
    }
  }
  if(gameState===1)
  {
    if(keyDown(LEFT_ARROW))
    {
      writePosition(-5,0);
    }    
    if(keyDown(RIGHT_ARROW))
    {
      writePosition(5,0);
    }
    if(keyDown(UP_ARROW))
    {
      writePosition(0,5);
    }
    if(keyDown(DOWN_ARROW))
    {
      writePosition(0,-5);
    }
    if(player1.x>500)
    {
      database.ref('/').update({
        'player1Score':player1Score-5,
        'player2Score':player2Score+5,
        'gameState':0
      })
      alert("RED WON")
      
    }
    if(player1.isTouching(player2))
    {
      database.ref('/').update({
        'player1Score':player1Score+5,
        'player2Score':player2Score-5,
        'gameState':0
      })
      alert("RED LOST")
    }
  }
  if(gameState===2)
  {
    if(keyDown("l"))
    {
      writePosition2(-5,0);
    }    
    if(keyDown("r"))
    {
      writePosition2(5,0);
    }
    if(keyDown("u"))
    {
      writePosition2(0,5);
    }
    if(keyDown("d"))
    {
      writePosition2(0,-5);
    }
    if(player2.x>500)
    {
      database.ref('/').update({
        'player1Score':player1Score+5,
        'player2Score':player2Score-5,
        'gameState':0
      })
      alert("YELLOW WON")
      
    }
    if(player2.isTouching(player1))
    {
      database.ref('/').update({
        'player1Score':player1Score-5,
        'player2Score':player2Score+5,
        'gameState':0
      })
      alert("YELLOW LOST")
    }
  }
  textSize(15);
  text("RED: "+player1Score,350,150);
  text("YELLOW: "+player1Score,150,150);
  drawLine();
  drawLine1();
  drawLine2();
  drawSprites();  
}
function writePosition(x,y)
{
  database.ref('player1/position').set({
    'x':position.x+x,
    'y':position.y+y
  })
}
function writePosition2(x,y)
{
  database.ref('player2/position').set({
    'x':position.x+x,
    'y':position.y+y
  })
}
function drawLine()
{
  for(var i=0;i<600;i+=20)
  {
    line(300,i,300,i+10)
  }
}
function drawLine1()
{
  for(var i=0;i<600;i+=20)
  {
    stroke("yellow")
    line(100,i,100,i+10)
  }
}
function drawLine2()
{
  for(var i=0;i<600;i+=20)
  {
    stroke("red")
    line(500,i,500,i+10)
  }
}
