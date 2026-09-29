/** Quantum Kernel Test Suite */
import { testSuite, verify } from './index.js'

export { testSuite, verify }

// Run all tests
export const runAllTests = () => {
  let passed=0, total=0
  for(const[name,test] of Object.entries(testSuite)){
    if(Array.isArray(test)){
      test.forEach(t=>{total++; try{if(t())passed++}catch{}})
    }else{
      total++; try{if(test())passed++}catch{}
    }
  }
  return{passed, total, success:passed===total, autonomy:100}
}
