interface Plan {
    name: string;
    price: number;
    cycleDays: number; // Assuming all plans are monthly cycles
  }
  
  export const calculateProratedUpgradePrice = (currentPlan: Plan, newPlan: Plan): number => {
    // Assuming subscription started today for simplicity
    const today = new Date();
    const daysInCurrentCycle = currentPlan.cycleDays - (today.getDate() - 1); // Remaining days in current cycle
    console.log("daysInCurrentCycle" , daysInCurrentCycle);
    
    const dailyRateCurrentPlan = currentPlan.price / currentPlan.cycleDays;
    const proratedCostRemainingDays = dailyRateCurrentPlan * daysInCurrentCycle;
    const priceDifference = newPlan.price - currentPlan.price;
    const proratedUpgradePrice = proratedCostRemainingDays + priceDifference;
    return proratedUpgradePrice;
  };
  
  // Example usage
  const basicPlan: Plan = {
    name: 'Basic',
    price: 10,
    cycleDays: 30,
  };
  
  const premiumPlan: Plan = {
    name: 'Premium',
    price: 20,
    cycleDays: 30,
  };
  
  const proratedUpgradePrice = calculateProratedUpgradePrice(basicPlan, premiumPlan);
  console.log("Prorated Upgrade Price:", proratedUpgradePrice);
  