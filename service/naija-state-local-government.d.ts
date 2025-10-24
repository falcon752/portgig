declare module 'naija-state-local-government' {
  interface LGAResult {
    lgas: string[];
    senatorial_districts: string[];
    state: string;
  }
  
  interface NaijaStates {
    states(): string[];
    lgas(state: string): LGAResult;
  }
  
  const NaijaStates: NaijaStates;
  export default NaijaStates;
  export { states, lgas };
}