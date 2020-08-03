import * as actions from '../store';
describe('store', () => {
    test('常量', () => {
        expect(actions.RECORD).toBe('@@RECORD');
        expect(actions.CLEAR).toBe('@@CLEAR');
        expect(actions.RELOAD).toBe('@@RELOAD');                   
    });
    test('actionCreate', () => {
        const data = {};
        expect(actions.record()).toEqual({
            type: actions.RECORD
        })        
        expect(actions.clear()).toEqual({
            type: actions.CLEAR
        })    
        expect(actions.reload(data)).toEqual({
            type: actions.RELOAD,
            data
        })        
    })
})