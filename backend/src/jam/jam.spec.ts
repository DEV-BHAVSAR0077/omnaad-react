import { pricing } from './jam.service';
describe('jam pricing',()=>{it('preserves Laravel hourly rate and GST',()=>expect(pricing(2)).toEqual({price:2200,tax:396,total_amount:2596}));});
