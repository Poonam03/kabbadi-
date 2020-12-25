var player1,player2;
var position1,position2;
var gameState = 0;
var player1Score=0;
var player2Score = 0;
var database;
var palyer1Animation,player2Animation,player1topAnimation;

function preload(){
  redAnimation = loadAnimation("assests/player1b.png","assests/player1a.png","assests/player1b.png");
  yellowAnimation = loadAnimation("assests/player2b.png","assests/player2a.png","assests/player2b.png");
  player1topAnimation =  loadAnimation("assests/player1b.png");
}

function setup(){
 canvas = createCanvas(600,600);
  database = firebase.database();
  player1=createSprite(100,250,10,10);
  player1.addAnimation("walking",redAnimation);
  player1.scale=0.5,
  player1.setCollider("circle",0,0,60),
  player1.debug=true

  var player1positionRef=database.ref("player1/position");
  player1positionRef.on("value",(data)=>{
    position=data.val();
    player1.x=position.x;
    player1.y=position.y;
  })
  
  player2=createSprite(500,250,10,10);
  player2.addAnimation("running",yellowAnimation);
  //player2Animation.frameDelay=200;
  player2.scale=0.5,
  player2.setCollider("circle",0,0,60),
  player2.debug=true
  
  var player2positionRef=database.ref("player2/position");
  player2positionRef.on("value",(data)=>{
    position2=data.val();
    player2.x=position2.x;
    player2.y=position2.y;
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


async function draw(){
  background("white");
  if(gameState===0)
  {
    fill("black");
    textSize(35)
    text("Press Space to toss",100,300);
    if(keyDown("space"))
    {
      rand=Math.round(random(1,2));
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
      await database.ref("player1/position").update({
        'x':150,
        'y':300
      })
      await database.ref("player2/position").update({
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
      await database.ref('/').update({
        'player1Score':player1Score-5,
        'player2Score':player2Score+5,
        'gameState':0
      })
      
    }
    if(player1.isTouching(player2))
    {
      await database.ref('/').update({
        'player1Score':player1Score+5,
        'player2Score':player2Score-5,
        'gameState':0
      })

      player2.addAnimation("walking",player1topAnimation);
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
      writePosition2(0,-5);
    }
    if(keyDown("d"))
    {
      writePosition2(0,5);
    }
    if(player2.x<150)
    {
      await database.ref('/').update({
        'player1Score':player1Score+5,
        'player2Score':player2Score-5,
        'gameState':0
      })
      
    }
    if(player2.isTouching(player1))
    {
      await database.ref('/').update({
        'gameState':0,
        'player1Score':player1Score-5,
        'player2Score':player2Score+5

      })
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
async function writePosition(x,y)
{
  await database.ref('player1/position').set({
    'x':position.x+x,
    'y':position.y+y
  })
}
async function writePosition2(x,y)
{
  await database.ref('player2/position').set({
    'x':position2.x+x,
    'y':position2.y+y
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
