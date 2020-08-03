import stateInit from './state';
import epic from './epic';
import reducer from './reducer';
import Shell from './components/Shell';

export default config => ({
    state: stateInit(config),
    epic,
    reducer,
    component: Shell
});
