/**
 * @File   : Render.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/28/2019, 3:57:30 PM
 * @Description:
 */

import * as Sein from 'seinjs';
import {h, Component, Fragment, options} from 'preact';
import * as SPECTOR from 'spectorjs';

import {Group, Button, Folder, Information, List, WithDetails} from '../../components';
import InspectorActor from '../../../Actor/InspectorActor';
import { getController } from '../../../Controllers';

interface IComponentProps {
  actor: InspectorActor;
}

interface IComponentState {
  isSpectorShow: boolean;
  detailType: 'none' | 'fog' | 'cap' | 'program' | 'shader' | 'buffer' | 'texture';
}

let spector: SPECTOR.Spector;

export default class Render extends Component<
  IComponentProps,
  IComponentState
> {
  public state: IComponentState = {
    isSpectorShow: false,
    detailType: 'none'
  };

  private spectorUI: HTMLElement;

  componentDidMount() {
    if (!spector) {
      spector = new SPECTOR.Spector();
    }

    setTimeout(() => this.forceUpdate(), 200);
  }

  componentWillUnmount() {
    this.hideSpectorUI();
  }

  private triggerClick = () => {
    const { isSpectorShow } = this.state;

    if (isSpectorShow) {
      this.hideSpectorUI();
      this.setState({ isSpectorShow: false });
    } else {
      if (!this.spectorUI) {
        spector.displayUI();
        setTimeout(() => {
          this.spectorUI = document.querySelector('.captureMenuComponent');
          this.spectorUI.parentElement.style.removeProperty('display');
        }, 100);
      } else {
        this.spectorUI.parentElement.style.removeProperty('display');
      }

      this.setState({ isSpectorShow: true });
    }
  };

  private hideSpectorUI() {
    if (this.spectorUI) {
      this.spectorUI.parentElement.style.setProperty('display', 'none');
    }
  }

  public render() {
    const { isSpectorShow } = this.state;
    const label = isSpectorShow ? '隐藏 Spector' : '显示 Spector';
    const {renderer} = this.props.actor.getGame();
    console.log(renderer)

    return (
      <WithDetails
        main={
          <Fragment>
            <Button label={label} onButtonClick={this.triggerClick}></Button>
            {getController('color')('clearColor', false, {}, renderer, () => {this.forceUpdate()})}
            {renderer.fog && <Information label='Fog' value={'Open'} onTrigger={() => this.setState({detailType: 'fog'})} />}
            <Information label='GLCapabilities' value={'Open'} onTrigger={() => this.setState({detailType: 'cap'})} />
            <Information label='Buffers' value={Object.keys(Sein.Buffer.cache._cache).length} onTrigger={() => this.setState({detailType: 'buffer'})} />
            <Information label='Textures' value={Object.keys((Sein.Texture as any).cache._cache).length} onTrigger={() => this.setState({detailType: 'texture'})} />
            <Information label='Programs' value={Object.keys(Sein.Program.cache._cache).length} onTrigger={() => this.setState({detailType: 'program'})} />
            <Information label='Shaders' value={Object.keys((Sein.Shader.cache as any)._cache).length} onTrigger={() => this.setState({detailType: 'shader'})} />
            {
              <Folder label={'Basic'} close={false}>
                {
                  [
                    'width', 'height', 'pixelRatio', 'useInstanced', 'useVao', 'depth', 'stencil', 'antialias',
                    'alpha', 'premultipliedAlpha', 'preserveDrawingBuffer', 'failIfMajorPerformanceCaveat', 'useFramebuffer',
                    'useLogDepth', 'vertexPrecision', 'fragmentPrecision'
                  ].map(key => (
                    <Information label={key} value={renderer[key]} />
                  ))
                }
              </Folder>
            }
          </Fragment>
        }
        details={this.renderDetails()}
      />
    );
  }

  private renderDetails() {
    const {detailType} = this.state;

    if (detailType === 'cap') {
      return (
        <List
          close={false}
          label={'GLCapabilities'}
          list={Sein.GLCapabilities}
        />
      );
    }

    if (detailType === 'fog') {

    }

    if (detailType === 'buffer') {
      const {_cache} = Sein.Buffer.cache;
      return (
        <Fragment>
          {
            Object.keys(_cache).map(key => (
              <Folder label={_cache[key].id} value={`${_cache[key].data.length / 1000}kb`}>
                <Information label='cacheId' value={key} />
                <Information label='target' value={_cache[key].target} />
                <Information label='usage' value={_cache[key].usage} />
              </Folder>
            ))
          }
        </Fragment>
      );
    }

    if (detailType === 'texture') {
      const {_cache} = (Sein.Texture as any).cache;
      return (
        <Fragment>
          {
            Object.keys(_cache).map(key => (
              <Folder label={_cache[key].__cacheId} value={''}>
                {/* <Information label='cacheId' value={key} /> */}
              </Folder>
            ))
          }
        </Fragment>
      );
    }

    if (detailType === 'program') {
      const {_cache} = (Sein.Program as any).cache;
      return (
        <Fragment>
          {
            Object.keys(_cache).map(key => (
              <Folder label={_cache[key].id} value={''}>
                <Information label='cacheId' value={key} />
                <Information label='ignoreError' value={_cache[key].ignoreError} />
              </Folder>
            ))
          }
        </Fragment>
      );
    }

    if (detailType === 'shader') {
      const {_cache} = (Sein.Shader as any).cache;
      return (
        <Fragment>
          {
            Object.keys(_cache).map(key => (
              <Folder label={_cache[key].id} value={''}>
                <Information label='cacheId' value={key} />
              </Folder>
            ))
          }
        </Fragment>
      );
    }

    return null;
  }
}
