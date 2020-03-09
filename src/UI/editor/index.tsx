import {h, Component, JSX, ComponentClass} from 'preact';
import * as Sein from 'seinjs';
import 'seinjs-audio';

import {TEditor} from '../../types';
import InspectorActor from '../../Actor/InspectorActor';
import BasicEditor from './BasicEditor';
import ActorCommonEditor from './ActorCommonEditor';
import ComponentCommonEditor from './ComponentCommonEditor';

import AnimatorComponentEditor from './AnimatorEditor';
import RigidBodyComponentEditor from './RigidBodyEditor';
import BoxColliderComponentEditor from './BSPBoxColliderEditor';
import SphereColliderComponentEditor from './SphereColliderEditor';

import PrimitiveComponentEditor from './PrimitiveEditor';

const EDITORS: {[className: string]: TEditor} = {};

export function registerEditor(clz: Sein.TConstructor<Sein.SObject>, editor: TEditor) {
  const name = clz.CLASS_NAME.value;

  if (EDITORS[name]) {
    Sein.Debug.warn(`Panel ${name} is already existed, overwirte...`);
  }

  EDITORS[name] = editor;
}

export function unregisterEditor(clz: Sein.TConstructor<Sein.SObject>) {
  const name = clz.CLASS_NAME.value;

  if (EDITORS[name]) {
    delete EDITORS[name];
  }
}

export function getEditor(obj: Sein.SObject): TEditor {
  if (EDITORS[obj.className.value]) {
    return EDITORS[obj.className.value];
  }

  let editors: {
    name: string;
    componentClass: ComponentClass<{actor: InspectorActor, object: Sein.SObject}>
  }[] = [];

  // if (Sein.isPrimitiveComponent(obj)) {

  // } else 
  if (Sein.isActor(obj)) {
    editors = [{name: 'common', componentClass: ActorCommonEditor}];
  } else if (Sein.isComponent(obj)) {
    editors = [{name: 'common', componentClass: ComponentCommonEditor}];
  } else if (Sein.isResourceManager(obj)) {

  } else if (Sein.isEventManager(obj)) {
    
  }

  return (actor: InspectorActor, object: Sein.SObject) => (
    <BasicEditor actor={actor} object={object} editors={editors} />
  );
}