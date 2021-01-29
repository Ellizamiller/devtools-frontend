// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import type * as Platform from '../platform/platform.js';
import {ls} from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';

// eslint-disable-next-line rulesdir/es_modules_import
import type * as Input from './input.js';

let loadedInputModule: (typeof Input|undefined);

async function loadInputModule(): Promise<typeof Input> {
  if (!loadedInputModule) {
    // Side-effect import resources in module.json
    await Root.Runtime.Runtime.instance().loadModulePromise('input');
    loadedInputModule = await import('./input.js');
  }
  return loadedInputModule;
}

UI.ViewManager.registerViewExtension({
  location: UI.ViewManager.ViewLocationValues.DRAWER_VIEW,
  id: 'Inputs',
  title: (): Platform.UIString.LocalizedString => ls`Inputs`,
  commandPrompt: (): Platform.UIString.LocalizedString => ls`Show Inputs`,
  persistence: UI.ViewManager.ViewPersistence.CLOSEABLE,
  order: 7,
  async loadView() {
    const Input = await loadInputModule();
    return Input.InputTimeline.InputTimeline.instance();
  },
  experiment: Root.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
});

UI.ActionRegistration.registerActionExtension({
  actionId: 'input.toggle-recording',
  iconClass: UI.ActionRegistration.IconClass.LARGEICON_START_RECORDING,
  toggleable: true,
  toggledIconClass: UI.ActionRegistration.IconClass.LARGEICON_STOP_RECORDING,
  toggleWithRedColor: true,
  async loadActionDelegate() {
    const Input = await loadInputModule();
    return Input.InputTimeline.ActionDelegate.instance();
  },
  category: UI.ActionRegistration.ActionCategory.INPUTS,
  experiment: Root.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
  options: [
    {
      value: true,
      title: (): Platform.UIString.LocalizedString => ls`Start recording`,
    },
    {
      value: false,
      title: (): Platform.UIString.LocalizedString => ls`Stop recording`,
    },
  ],
});

UI.ActionRegistration.registerActionExtension({
  actionId: 'input.start-replaying',
  iconClass: UI.ActionRegistration.IconClass.LARGEICON_PLAY,
  toggleable: false,
  async loadActionDelegate() {
    const Input = await loadInputModule();
    return Input.InputTimeline.ActionDelegate.instance();
  },
  category: UI.ActionRegistration.ActionCategory.INPUTS,
  experiment: Root.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
  options: [
    {
      value: true,
      title: (): Platform.UIString.LocalizedString => ls`Start replaying`,
    },
  ],
});

UI.ActionRegistration.registerActionExtension({
  actionId: 'input.toggle-pause',
  iconClass: UI.ActionRegistration.IconClass.LARGEICON_PAUSE,
  toggleable: true,
  toggledIconClass: UI.ActionRegistration.IconClass.LARGEICON_RESUME,
  async loadActionDelegate() {
    const Input = await loadInputModule();
    return Input.InputTimeline.ActionDelegate.instance();
  },
  category: UI.ActionRegistration.ActionCategory.INPUTS,
  experiment: Root.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
  options: [
    {
      value: true,
      title: (): Platform.UIString.LocalizedString => ls`Pause`,
    },
    {
      value: false,
      title: (): Platform.UIString.LocalizedString => ls`Resume`,
    },
  ],
});