import test from 'node:test';
import assert from 'node:assert/strict';
import {calculate} from './nutrition.js';
const data={weight:65,height:170,age:28,sex:'female',activity:1.375,goal:'maintain'};
test('Mifflin-St Jeor and macro energy balance',()=>{const r=calculate(data);assert.equal(r.calories,1941);assert.equal(r.protein,104);assert.ok(Math.abs(r.protein*4+r.fat*9+r.carbs*4-r.calories)<=2);});
test('goal modifiers and male constant',()=>{assert.equal(calculate({...data,goal:'lose'}).calories,1650);assert.equal(calculate({...data,goal:'gain'}).calories,2135);assert.equal(calculate({...data,sex:'male'}).calories,2169);});
test('invalid and unsafe inputs rejected',()=>{for(const change of [{age:17},{weight:NaN},{height:0},{activity:10},{goal:'unknown'},{sex:'unknown'}])assert.throws(()=>calculate({...data,...change}));});
