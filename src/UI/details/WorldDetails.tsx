/**
 * @File   : WorldDetails.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/15/2019, 2:48:26 PM
 * @Description:
 */
import {h, Component} from 'preact';

import InspectorActor from '../../Actor/InspectorActor';
import {Button, List} from '../components';

export interface IPropTypes {
  actor: InspectorActor;
  worldName: string;
}

export default class WorldDetails extends Component<IPropTypes> {
  public render() {
    const game = this.props.actor.getGame();
    const name = this.props.worldName;

    const {levels} = (game as any)._worldsMeta[name];

    return (
      <div>
        {
          game.world.name.equalsTo(name)
            ? <Button label={'Current World'} />
            : <Button label={'Switch to world'} onButtonClick={() => game.switchWorld(name)} />
        }
        <List label='Levels' list={levels} close={false}></List>
      </div>
    );
  }
}
