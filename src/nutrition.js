export function calculate({weight,height,age,sex,activity,goal}) {
 if (![weight,height,age,activity].every(Number.isFinite)||weight<30||weight>300||height<120||height>230||age<18||age>85||!['male','female'].includes(sex)||![1.2,1.375,1.55,1.725].includes(activity)||!['lose','maintain','gain'].includes(goal)) throw new Error('Проверьте данные: расчёт для взрослых 18–85 лет.');
 const calories=Math.round((10*weight+6.25*height-5*age+(sex==='male'?5:-161))*activity*({lose:.85,maintain:1,gain:1.1}[goal]));
 const protein=Math.round(weight*1.6),fat=Math.round(calories*.3/9),carbs=Math.round((calories-protein*4-fat*9)/4);return {calories,protein,fat,carbs};
}
