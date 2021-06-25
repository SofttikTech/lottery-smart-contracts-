# blockchain-lottery-sh
/********************Silver Horizon Lottery system ***********************/

Description:

**A Lotter system build using smart contract, allow players to participate in the lottery using different lottery tickets whichever they want.**

/***********************Features: ***********************************/

1. Start Lottery (startLottery() function)
    This function will only be called by the admin of the lottery smart contract. We will also check that lottery status is closed, if it's not it will throw an error.


2. Buy Ticket (buyTicket(uint256 lotteryId) function)
    This function will allow only players to participate in the lottery by buying their desire tickets. buy ticket function will store players addresss in our participating players array. This function will check some conditions:
    
    i. Allow user to pass lotteryId in the function parameter
    ii. only players can pariticpate
    iii. player input ticket value should be equal to the ticket price
   
   
3. Random (random(uint256 _lotteryId)
    This function will return random number through the ethereum built in function (keccak256). which takes 3 arguments lock.difficulty,block.timestamp, lottery.participatingPlayers.length) to generate random number.


4. Pick Winner and Reset the Lottery (pickWinnerandresetLottery(uint256 lotteryId)) 
    This function will pick the winner through the random number function inside pickwinner function and transfer the winning amount from the contract to the winner. This function will check some conditions:
    
    i. only admin can call this function
    ii. Random Number should be greater than zero
    iii. participating players should be greater than or equal to the length we specified.
    
    After successfully run this function we will reset the lottery in the specific lottery Id.
   
   
5. resetLottery(Lottery storage lottery) function
    this function will reset the lottery and will be an internal function, called in the pickWinnerandresetLottery function.
 
 
/********************getter functions of lottery ticket ***************************/


6, getPlayers(uint256 lotteryId) function
    this function will return the participating players of the  specific lottery
 
 
7. getWinners(uint256 lotteryId) function
    this function will return us the winner list of the specific lottery


8. getStatus(uint256 lotteryId) function
    this function will return the status of the specific lottery


9. getLotteryTicketPrice(uint256 lotteryId) function
    get the specific lottery ticket price
    
    
