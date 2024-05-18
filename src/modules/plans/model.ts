export function calculateProratedUpgradeCost(currentPlan:number, newPlan:number, daysRemaining:number){
    const daysInMonth = 30; // Assuming 30 days in a month for simplicity
    const currentPlanPrice = currentPlan;
    const newPlanPrice = newPlan;
  
    if (!currentPlanPrice || !newPlanPrice) {
      throw new Error('Invalid plan specified');
    }
    console.log("newPlanPrice" ,newPlanPrice);
    console.log("currentPlanPrice" ,currentPlanPrice);
    console.log("daysInMonth" ,daysInMonth);

    const dailyRateDifference = (newPlanPrice - currentPlanPrice) / daysInMonth;
    console.log("dailyRateDifference" , dailyRateDifference);
    
    const proratedCost = dailyRateDifference * daysRemaining;
  
    return proratedCost;
}