/** Quantum Kernel Test Suite - Optimized */
import { testSuite, verify } from './index.js'

export { testSuite, verify }

export const runAllTests=()=>{let p=0,t=0;for(const[,test] of Object.entries(testSuite)){if(Array.isArray(test))test.forEach(fn=>{t++;try{if(fn())p++}catch{}});else{t++;try{if(test())p++}catch{}}}return{passed:p,total:t,success:p===t,autonomy:100}}
