import React from 'react';
import Reflux from 'reflux';
import createReactClass from 'create-react-class';

import GlobalSelectionStore from 'app/stores/globalSelectionStore';
import getDisplayName from 'app/utils/getDisplayName';
import {GlobalSelection} from 'app/types';

type InjectedGlobalSelectionProps = {
  selection: GlobalSelection;
};

type State = {
  selection: GlobalSelection;
  initialized: boolean;
};

/**
 * Higher order component that uses GlobalSelectionStore and provides the
 * active project
 */
const withGlobalSelection = <P extends InjectedGlobalSelectionProps>(
  WrappedComponent: React.ComponentType<P>
) =>
  createReactClass<
    Omit<P, keyof InjectedGlobalSelectionProps> & Partial<InjectedGlobalSelectionProps>,
    State
  >({
    displayName: `withGlobalSelection(${getDisplayName(WrappedComponent)})`,
    mixins: [Reflux.listenTo(GlobalSelectionStore, 'onUpdate') as any],

    getInitialState() {
      return GlobalSelectionStore.get();
    },

    componentDidMount() {
      this.updateSelection();
    },

    onUpdate() {
      this.updateSelection();
    },

    updateSelection() {
      const {selection, initialized} = GlobalSelectionStore.get();

      if (this.state.selection !== selection || this.state.initialized !== initialized) {
        this.setState({selection, initialized});
      }
    },

    render() {
      const {selection, initialized} = this.state;
      return (
        <WrappedComponent
          selection={selection as GlobalSelection}
          globalSelectionInitialized={initialized}
          {...(this.props as P)}
        />
      );
    },
  });

export default withGlobalSelection;
